from rest_framework import serializers
from api.models import Pantry, PantryIngredient
from .ingredient import IngredientSerializer


class PantryIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = PantryIngredient
        fields = [
            "id",
            "ingredient",
            "amount",
            "unit",
            "date_aggregate",
            "date_expiration",
        ]


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
