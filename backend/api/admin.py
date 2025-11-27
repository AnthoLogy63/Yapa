from django.contrib import admin
from .models import (
    Category,
    Ingredient,
    Recipe,
    StepRecipe,
    RecipeIngredient,
    Pantry,
    PantryIngredient,
    DietaryRestriction,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'classification', 'type_restriction')
    search_fields = ('name', 'classification', 'type_restriction')


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'user',
        'category',
        'preparation_time',
        'difficulty',
        'portions',
        'is_active',
    )
    list_filter = ('category', 'difficulty', 'is_active')
    search_fields = ('title', 'description')
    autocomplete_fields = ('user', 'category')


@admin.register(StepRecipe)
class StepRecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipe', 'estimated_time')
    list_filter = ('recipe',)


@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipe', 'ingredient', 'amount', 'unit', 'order', 'is_optional')
    list_filter = ('recipe', 'ingredient')


@admin.register(Pantry)
class PantryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'date_register', 'date_update')
    list_filter = ('user',)
    search_fields = ('name',)


@admin.register(PantryIngredient)
class PantryIngredientAdmin(admin.ModelAdmin):
    list_display = ('id', 'pantry', 'ingredient', 'amount', 'unit', 'date_aggregate', 'date_expiration')
    list_filter = ('pantry', 'ingredient')


@admin.register(DietaryRestriction)
class DietaryRestrictionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'ingredient', 'type_restriction', 'date_register')
    list_filter = ('type_restriction', 'user')
