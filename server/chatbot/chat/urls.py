# chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatContextViewSet

router = DefaultRouter()
router.register(r'contexts', ChatContextViewSet, basename='chat-context')

urlpatterns = [
    path('', include(router.urls)),
]