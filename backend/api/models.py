from django.db import models
from django.conf import settings


class Category(models.Model):
    """
    Equivale a Category del MER.
    Ejemplos: Frutas, Verduras, Carnes, Lácteos, Cereales y granos, Aves, Pescados y mariscos.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=200, blank=True)  # puedes cambiar luego a ImageField

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    """
    Equivale a Ingredient del MER.
    """
    name = models.CharField(max_length=150, unique=True)
    classification = models.CharField(max_length=100, blank=True)  # ej: fruta, verdura, lácteo
    type_restriction = models.CharField(
        max_length=100,
        blank=True,
        help_text="Tipo de restricción asociada al ingrediente (alergia, intolerancia, etc.)"
    )
    note = models.TextField(blank=True)
    date_register = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    """
    Equivale a Recipe del MER.
    """
    # FK id_User  -> usamos el usuario de Django
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recipes'
    )

    # FK id_Category
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recipes'
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    # tiempos en minutos
    preparation_time = models.PositiveIntegerField(help_text="Tiempo en minutos")

    # podrías usar choices, por ahora lo dejamos libre
    difficulty = models.CharField(max_length=50, blank=True)

    portions = models.PositiveIntegerField(default=1, help_text="Número de porciones/personas")
    visualizations = models.PositiveIntegerField(default=0)

    date_register = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class StepRecipe(models.Model):
    """
    Equivale a Step_Recipe del MER.
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
        help_text="Tiempo estimado para este paso (minutos)"
    )

    def __str__(self):
        return f"Paso de {self.recipe.title}"


class RecipeIngredient(models.Model):
    """
    Equivale a Recipe_Ingredient del MER.
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
    unit = models.CharField(max_length=50)  # ej: gramos, ml, cucharadas
    order = models.PositiveIntegerField(default=1)
    is_optional = models.BooleanField(default=False)

    class Meta:
        unique_together = ('ingredient', 'recipe', 'order')
        ordering = ['recipe', 'order']

    def __str__(self):
        return f"{self.amount} {self.unit} de {self.ingredient.name} en {self.recipe.title}"


class Pantry(models.Model):
    """
    Equivale a Pantry del MER.
    Un usuario puede tener varias pantries (refrigerador, almacén, etc.).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pantries'
    )
    name = models.CharField(max_length=100, default='Principal', help_text="Nombre lógico: refri, almacén, etc.")
    date_register = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class PantryIngredient(models.Model):
    """
    Equivale a Pantry_Ingredient del MER.
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

    date_aggregate = models.DateField(help_text="Fecha en que se agregó a la despensa")
    date_expiration = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('pantry', 'ingredient', 'date_aggregate')

    def __str__(self):
        return f"{self.ingredient.name} en {self.pantry.name}"


class DietaryRestriction(models.Model):
    """
    Equivale a Dietary_restriction del MER.
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

    type_restriction = models.CharField(max_length=100)  # ej: alergia, intolerancia, preferencia
    note = models.TextField(blank=True)
    date_register = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'ingredient', 'type_restriction')

    def __str__(self):
        return f"{self.type_restriction} a {self.ingredient.name} - {self.user.username}"
