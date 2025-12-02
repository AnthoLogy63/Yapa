from django.db import models
from django.conf import settings
from .recipe import Recipe


class FavoriteRecipe(models.Model):
    """
    Recetas favoritas del usuario.
    Relación Many-to-Many entre Usuario y Receta.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'favorite_recipe'
        verbose_name = 'Favorite Recipe'
        verbose_name_plural = 'Favorite Recipes'
        unique_together = ('user', 'recipe')
        ordering = ['-date_added']

    def __str__(self):
        return f"{self.user.username} - {self.recipe.title}"
