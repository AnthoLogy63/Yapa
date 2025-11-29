from rest_framework import serializers
from api.models import DietaryRestriction, Ingredient


class DietaryRestrictionSerializer(serializers.ModelSerializer):
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())

    class Meta:
        model = DietaryRestriction
        fields = [
            "id",
            "ingredient",
            "type_restriction",
            "note",
            "date_register",
        ]
