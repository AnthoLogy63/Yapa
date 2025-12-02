from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount
from api.models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Señal para crear automáticamente un UserProfile cuando se crea un usuario.
    """
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Señal para guardar el perfil cuando se guarda el usuario.
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()


@receiver(post_save, sender=SocialAccount)
def save_google_profile_picture(sender, instance, created, **kwargs):
    """
    Señal para guardar automáticamente la foto de perfil de Google OAuth.
    Se ejecuta cuando un usuario inicia sesión con Google.
    """
    if instance.provider == 'google':
        extra_data = instance.extra_data
        picture_url = extra_data.get('picture', '')
        
        # Obtener o crear el perfil del usuario
        profile, _ = UserProfile.objects.get_or_create(user=instance.user)
        
        # Solo actualizar si hay una URL de foto y el perfil no tiene una
        if picture_url and not profile.profile_picture:
            profile.profile_picture = picture_url
            profile.save()
