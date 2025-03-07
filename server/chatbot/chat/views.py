from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .models import ChatContext, Message
from .serializers import ChatContextListSerializer, ChatContextDetailSerializer, MessageSerializer

class ChatContextViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatContextListSerializer
        return ChatContextDetailSerializer
    
    def get_queryset(self):
        if self.action == 'list':
            return ChatContext.objects.filter(
                user=self.request.user
            ).annotate(
                message_count=Count('messages')
            ).order_by('-updated_at')
        return ChatContext.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages for a specific chat context"""
        chat_context = self.get_object()
        messages = Message.objects.filter(chat_context=chat_context)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rename(self, request, pk=None):
        """Rename a chat context"""
        chat_context = self.get_object()
        new_title = request.data.get('title')
        
        if not new_title:
            return Response(
                {"error": "Title is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        chat_context.title = new_title
        chat_context.save()
        
        return Response({"status": "Chat context renamed successfully"})
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """Add a message to a specific chat context"""
        chat_context = self.get_object()
        serializer = MessageSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(chat_context=chat_context)
            
            # Update the chat context's updated_at time
            chat_context.save()  # This will update the 'updated_at' field
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)