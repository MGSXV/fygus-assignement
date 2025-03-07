import json
import asyncio
import requests
import os
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from .models import ChatContext, Message
from authentication.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_context_id = self.scope['url_route']['kwargs'].get('chat_id')
        self.is_new_chat = self.chat_context_id == 'new'
        
        # If it's a new chat, we'll create a context later
        if self.is_new_chat:
            self.room_group_name = f'chat_new_{self.scope["user"].id}'
        else:
            self.room_group_name = f'chat_{self.chat_context_id}'
        
        # Check authentication
        is_authenticated = await self.authenticate()
        if not is_authenticated:
            await self.close(code=4001)  # Unauthorized
            return
        
        # If it's an existing chat, verify access
        if not self.is_new_chat:
            can_access = await self.can_access_chat()
            if not can_access:
                await self.close(code=4003)  # Forbidden
                return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # If joining an existing chat, send the chat title
        if not self.is_new_chat:
            chat_context = await self.get_chat_context()
            await self.send(text_data=json.dumps({
                'type': 'chat_info',
                'chat_id': self.chat_context_id,
                'title': chat_context.title
            }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type', 'message')
        
        # Handle creating a new chat
        if message_type == 'create_chat' and self.is_new_chat:
            title = text_data_json.get('title', 'New Chat')
            chat_context = await self.create_chat_context(title)
            self.chat_context_id = str(chat_context.id)
            self.is_new_chat = False
            
            # Change room group for the new chat
            old_room_group_name = self.room_group_name
            self.room_group_name = f'chat_{self.chat_context_id}'
            
            # Leave old room group
            await self.channel_layer.group_discard(
                old_room_group_name,
                self.channel_name
            )
            
            # Join new room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            # Send confirmation to client
            await self.send(text_data=json.dumps({
                'type': 'chat_created',
                'chat_id': self.chat_context_id,
                'title': title
            }))
            return
            
        # Handle normal messages
        if message_type == 'message':
            message_content = text_data_json.get('message', '')
            
            # For new chats, create a context first with a default title
            if self.is_new_chat:
                chat_context = await self.create_chat_context(f"Chat {message_content[:20]}...")
                self.chat_context_id = str(chat_context.id)
                self.is_new_chat = False
                
                # Change room group for the new chat
                old_room_group_name = self.room_group_name
                self.room_group_name = f'chat_{self.chat_context_id}'
                
                # Leave old room group
                await self.channel_layer.group_discard(
                    old_room_group_name,
                    self.channel_name
                )
                
                # Join new room group
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                
                # Notify the client about the new chat
                await self.send(text_data=json.dumps({
                    'type': 'chat_created',
                    'chat_id': self.chat_context_id,
                    'title': chat_context.title
                }))
            
            # Save user message to database
            message = await self.save_message('user', message_content)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'role': 'user',
                    'message_id': message.id
                }
            )
            
            # Get chat history and send to LLM
            history = await self.get_chat_history()
            
            # Send message to LLM API and get response
            response = await self.get_llm_response(history)
            
            # Save assistant message to database
            assistant_message = await self.save_message('assistant', response)
            
            # Send response back to the WebSocket group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': response,
                    'role': 'assistant',
                    'message_id': assistant_message.id
                }
            )
    
    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        role = event['role']
        message_id = event['message_id']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': message,
            'role': role,
            'message_id': message_id
        }))
    
    @database_sync_to_async
    def authenticate(self):
        """Authenticate using JWT from query params"""
        query_string = self.scope.get('query_string', b'').decode()
        params = dict(item.split('=') for item in query_string.split('&') if '=' in item)
        token = params.get('token', '')
        
        if not token:
            headers = dict(self.scope.get('headers', []))
            auth_header = headers.get(b'authorization', b'').decode()
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        if not token:
            return False
            
        try:
            # Verify the JWT token
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=["HS256"]
            )
            user_id = payload.get('user_id')
            
            # Get the user
            self.scope['user'] = User.objects.get(id=user_id)
            return True
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return False
    
    @database_sync_to_async
    def can_access_chat(self):
        """Check if the user can access this chat context"""
        try:
            chat_context = ChatContext.objects.get(id=self.chat_context_id)
            return chat_context.user == self.scope['user']
        except ChatContext.DoesNotExist:
            return False
    
    @database_sync_to_async
    def create_chat_context(self, title):
        """Create a new chat context"""
        chat_context = ChatContext.objects.create(
            user=self.scope['user'],
            title=title
        )
        return chat_context
    
    @database_sync_to_async
    def get_chat_context(self):
        """Get the chat context"""
        return ChatContext.objects.get(id=self.chat_context_id)
    
    @database_sync_to_async
    def save_message(self, role, content):
        """Save a message to the database"""
        chat_context = ChatContext.objects.get(id=self.chat_context_id)
        message = Message.objects.create(
            chat_context=chat_context,
            role=role,
            content=content
        )
        return message
    
    @database_sync_to_async
    def get_chat_history(self):
        """Get the chat history for this context"""
        chat_context = ChatContext.objects.get(id=self.chat_context_id)
        messages = Message.objects.filter(chat_context=chat_context).order_by('created_at')
        return [{"role": msg.role, "content": msg.content} for msg in messages]
    
    async def get_llm_response(self, messages):
        """Get a response from the LLM API"""
        try:
            api_key = os.environ.get('DEEPSEEK_API_KEY', '')
            if not api_key:
                return "API key not found. Please set the DEEPSEEK_API_KEY environment variable."
                
            url = "https://api.deepseek.com/v1/chat/completions"
            
            # Prepare the payload
            payload = {
                "model": "deepseek-chat",
                "messages": messages,
                "temperature": 0.7
            }
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            # Using run_in_executor to make a synchronous request in async context
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(url, json=payload, headers=headers)
            )
            
            if response.status_code == 200:
                response_data = response.json()
                return response_data["choices"][0]["message"]["content"]
            else:
                return f"Error from API: {response.status_code} - {response.text}"
                
        except Exception as e:
            return f"Error getting response from LLM: {str(e)}"