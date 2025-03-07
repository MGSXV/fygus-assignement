import os
import requests
from .models import ChatContext, Message
from django.conf import settings

class LLMService:
    @staticmethod
    def get_deepseek_response(messages):
        """
        Call the DeepSeek API with the given messages.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            
        Returns:
            The generated text response
        """
        api_key = os.environ.get('DEEPSEEK_API_KEY', '')
        if not api_key:
            return "API key not found. Please set the DEEPSEEK_API_KEY environment variable."
            
        url = "https://api.deepseek.com/v1/chat/completions"
        
        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "temperature": 0.7
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                response_data = response.json()
                return response_data["choices"][0]["message"]["content"]
            else:
                return f"Error from API: {response.status_code} - {response.text}"
        except Exception as e:
            return f"Error getting response from LLM: {str(e)}"