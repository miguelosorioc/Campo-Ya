from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    rol      = serializers.ChoiceField(choices=['cliente', 'granjero'])

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'rol']

    def create(self, validated_data):
        rol  = validated_data.pop('rol')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        user.profile.rol = rol
        user.profile.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email    = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model  = Profile
        fields = ['username', 'email', 'rol', 'bio', 'ciudad', 'avatar', 'whatsapp']