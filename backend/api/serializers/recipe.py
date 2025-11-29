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
    image = serializers.SerializerMethodField()


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
            "image",
        ]

    def get_image(self, obj):
        request = self.context.get("request")

        # 1) si la receta tiene imagen propia, usamos esa
        if obj.image and hasattr(obj.image, "url"):
            url = obj.image.url
        else:
            # 2) si no, usamos la foto del primer paso (StepRecipe)
            first_step = obj.steps.order_by("id").first()
            if first_step and first_step.photo and hasattr(first_step.photo, "url"):
                url = first_step.photo.url
            else:
                return None

        # Devolvemos URL absoluta para que el front pueda consumirla
        if request is not None:
            return request.build_absolute_uri(url)

        return url