from django.db import models
from django.conf import settings
from .ingredient import Ingredient

class Pantry(models.Model):
    """
    Despensa/refrigerador del usuario.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pantries'
    )
    name = models.CharField(
        max_length=100,
        default='Principal',
        help_text="Nombre lógico: refri, almacén, congelador, etc."
    )
    date_register = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class PantryIngredient(models.Model):
    """
    Ingrediente dentro de una despensa concreta.
    """
    pantry = models.ForeignKey(
        Pantry,
        on_delete=models.CASCADE,
        related_name='items'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='pantry_items'
    )

    amount = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=50)
    date_aggregate = models.DateField(help_text="Fecha de ingreso a la despensa")
    date_expiration = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('pantry', 'ingredient', 'date_aggregate')

    def __str__(self):
        return f"{self.ingredient.name} en {self.pantry.name}"
