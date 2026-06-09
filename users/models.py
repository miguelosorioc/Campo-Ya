from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):

    ROL_CHOICES = [
        ('cliente', 'Cliente'),
        ('granjero', 'Granjero'),
    ]

    user    = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    rol     = models.CharField(max_length=10, choices=ROL_CHOICES, default='cliente')
    bio     = models.TextField(blank=True)
    ciudad  = models.CharField(max_length=100, blank=True)
    avatar  = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} ({self.rol})'

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)