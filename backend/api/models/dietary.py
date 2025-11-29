from django.db import models
from django.conf import settings
from .ingredient import Ingredient


class DietaryRestriction(models.Model):
    """
    Restricciones alimentarias de un usuario por ingrediente.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dietary_restrictions'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='dietary_restrictions'
    )

    type_restriction = models.CharField(max_length=100)  # alergia, intolerancia, etc.
    note = models.TextField(blank=True)
    date_register = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'ingredient', 'type_restriction')

    def __str__(self):
        return f"{self.type_restriction} a {self.ingredient.name} - {self.user.username}"