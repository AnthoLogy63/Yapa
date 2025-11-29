from rest_framework import serializers
from api.models import Recipe, StepRecipe, RecipeIngredient
from .category import CategorySerializer
from .ingredient import IngredientSerializer


class StepRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepRecipe
        fields = ["id", "description", "photo", "estimated_time"]


class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = RecipeIngredient
        fields = ["id", "ingredient", "amount", "unit", "order", "is_optional"]


class RecipeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    steps = StepRecipeSerializer(many=True, read_only=True)
    recipe_ingredients = RecipeIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id",
            "title",
            "description",
            "preparation_time",
            "difficulty",
            "portions",
            "visualizations",
            "is_active",
            "category",
            "steps",
            "recipe_ingredients",
        ]
