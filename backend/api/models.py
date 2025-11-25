from django.db import models

# Create your models here.

from django.db import models

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    imagen = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return self.nombre
