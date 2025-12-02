from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    """
    Perfil extendido del usuario para almacenar información adicional
    como foto de perfil de Google OAuth, biografía, etc.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    profile_picture = models.URLField(
        max_length=500,
        blank=True,
        help_text="URL de la foto de perfil (Google OAuth)"
    )
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profile'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"Profile of {self.user.username}"
