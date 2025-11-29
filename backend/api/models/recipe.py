from django.db import models
from django.conf import settings
from .category import Category
from .ingredient import Ingredient


class Recipe(models.Model):
    """
    Receta creada por un usuario.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recipes'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recipes'
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    preparation_time = models.PositiveIntegerField(help_text="Tiempo total en minutos")
    difficulty = models.CharField(max_length=50, blank=True)
    portions = models.PositiveIntegerField(default=1, help_text="Número de personas")
    visualizations = models.PositiveIntegerField(default=0)
    date_register = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class StepRecipe(models.Model):
    """
    Pasos de la receta.
    """
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='steps'
    )
    description = models.TextField()
    photo = models.ImageField(
        upload_to='recipes/steps/',
        null=True,
        blank=True
    )
    estimated_time = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Tiempo estimado de este paso en minutos"
    )

    def __str__(self):
        return f"Paso de {self.recipe.title}"


class RecipeIngredient(models.Model):
    """
    Relación N:M entre Receta e Ingrediente con cantidad y orden.
    """
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='recipe_ingredients'
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='recipe_ingredients'
    )

    amount = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=1)
    is_optional = models.BooleanField(default=False)

    class Meta:
        unique_together = ('ingredient', 'recipe', 'order')
        ordering = ['recipe', 'order']

    def __str__(self):
        return f"{self.amount} {self.unit} de {self.ingredient.name} en {self.recipe.title}"
