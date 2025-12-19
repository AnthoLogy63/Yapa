from rest_framework import serializers
from api.models import Pantry, PantryIngredient, Ingredient
from .ingredient import IngredientSerializer


class PantryIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_name = serializers.CharField(write_only=True)

    class Meta:
        model = PantryIngredient
        fields = [
            "id",
            "ingredient",
            "ingredient_name",
            "amount",
            "unit",
            "date_aggregate",
            "date_expiration",
        ]

    def create(self, validated_data):
        ingredient_name = validated_data.pop('ingredient_name')
        
        # Buscar o crear ingrediente por nombre (case insensitive)
        ingredient, created = Ingredient.objects.get_or_create(
            name__iexact=ingredient_name,
            defaults={'name': ingredient_name}
        )
        
        pantry_ingredient = PantryIngredient.objects.create(
            ingredient=ingredient,
            **validated_data
        )
        return pantry_ingredient


class PantrySerializer(serializers.ModelSerializer):
    items = PantryIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Pantry
        fields = [
            "id",
            "name",
            "date_register",
            "date_update",
            "items",
        ]
