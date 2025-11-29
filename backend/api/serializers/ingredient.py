from rest_framework import serializers
from api.models import Ingredient


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = [
            "id",
            "name",
            "classification",
            "type_restriction",
            "note",
            "date_register",
        ]
