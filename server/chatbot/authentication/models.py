from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, blank=True)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name']
    
    def __str__(self):
        return self.username