from rest_framework import serializers
from .models import ChatContext, Message
from django.db.models import Count

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = ['created_at']

class ChatContextListSerializer(serializers.ModelSerializer):
    message_count = serializers.IntegerField(read_only=True)
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatContext
        fields = ['id', 'title', 'created_at', 'updated_at', 'message_count', 'last_message']
        read_only_fields = ['created_at', 'updated_at', 'message_count', 'last_message']
    
    def get_last_message(self, obj):
        try:
            last_message = obj.messages.order_by('-created_at').first()
            if last_message:
                return {
                    'content': last_message.content[:100],
                    'role': last_message.role,
                    'created_at': last_message.created_at
                }
        except Exception:
            pass
        return None

class ChatContextDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatContext
        fields = ['id', 'title', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['created_at', 'updated_at']