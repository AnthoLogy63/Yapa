from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para el perfil del usuario"""
    
    class Meta:
        model = UserProfile
        fields = ['id', 'profile_picture', 'bio', 'phone', 'date_of_birth', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer para el usuario con perfil anidado"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id', 'username', 'email']
