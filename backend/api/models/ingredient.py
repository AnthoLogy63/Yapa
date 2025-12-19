from django.db import models


class Ingredient(models.Model):
    """
    Ingrediente general: arroz, pollo, leche, etc.
    """
    CLASSIFICATION_CHOICES = [
        ('Verduras', 'Verduras'),
        ('Frutas', 'Frutas'),
        ('Granos y legumbres', 'Granos y legumbres'),
        ('Lácteos', 'Lácteos'),
        ('Proteínas animales', 'Proteínas animales'),
        ('Condimentos y salsas', 'Condimentos y salsas'),
        ('Bebidas', 'Bebidas'),
        ('Cereales y Masas', 'Cereales y Masas'),
        ('Otros', 'Otros'),
    ]

    name = models.CharField(max_length=150, unique=True)
    classification = models.CharField(
        max_length=100, 
        choices=CLASSIFICATION_CHOICES,
        default='Otros',
        blank=True
    )
    type_restriction = models.CharField(
        max_length=100,
        blank=True,
        help_text="Tipo de restricción asociada al ingrediente (alergia, intolerancia, etc.)"
    )
    note = models.TextField(blank=True)
    date_register = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ingredient'
        verbose_name = 'Ingrediente'
        verbose_name_plural = 'Ingredientes'
        ordering = ['name']

    def __str__(self):
        return self.name