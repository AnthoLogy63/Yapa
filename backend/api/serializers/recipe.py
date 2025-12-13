from rest_framework import serializers
from api.models import Recipe, StepRecipe, RecipeIngredient, Ingredient
from .category import CategorySerializer
from .ingredient import IngredientSerializer
from .user import UserSerializer
import re


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
    user = UserSerializer(read_only=True)
    
    # Eliminamos image = serializers.SerializerMethodField() para permitir escritura
    # La lógica de visualización se mueve a to_representation

    # Campos de escritura para recibir listas de strings
    ingredients_input = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    steps_input = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

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
            "user",
            "image",
            "ingredients_input",
            "steps_input",
        ]

    def to_representation(self, instance):
        """
        Sobrescribimos para mantener la lógica de la imagen:
        1) Si tiene imagen propia, usarla.
        2) Si no, usar la del primer paso.
        """
        representation = super().to_representation(instance)
        request = self.context.get("request")

        image_url = None
        if instance.image and hasattr(instance.image, "url"):
            image_url = instance.image.url
        else:
            # Fallback: foto del primer paso
            first_step = instance.steps.order_by("id").first()
            if first_step and first_step.photo and hasattr(first_step.photo, "url"):
                image_url = first_step.photo.url
        
        # Construir URL absoluta si es necesario y posible
        if image_url and request:
            image_url = request.build_absolute_uri(image_url)
        
        representation["image"] = image_url
        return representation

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients_input", [])
        steps_data = validated_data.pop("steps_input", [])
        
        # Asignar el usuario actual
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user

        recipe = Recipe.objects.create(**validated_data)

        # Crear Pasos
        for index, step_text in enumerate(steps_data):
            if step_text.strip():
                StepRecipe.objects.create(
                    recipe=recipe,
                    description=step_text.strip(),
                    estimated_time=None  # Podría mejorarse en el futuro
                )

        # Crear Ingredientes (Parsing)
        # Regex simple: "2 tazas de harina" -> amount=2, unit="tazas", name="harina"
        # Regex: (cantidad) (unidad) (de?) (nombre)
        pattern = re.compile(r"^(\d+(?:[.,]\d+)?)\s+([a-zA-Z]+)\s+(?:de\s+)?(.+)$", re.IGNORECASE)

        for index, ing_text in enumerate(ingredients_data):
            ing_text = ing_text.strip()
            if not ing_text:
                continue

            match = pattern.match(ing_text)
            if match:
                amount_str = match.group(1).replace(",", ".")
                amount = float(amount_str)
                unit = match.group(2)
                name = match.group(3).strip()
            else:
                # Fallback si no matchea el formato
                amount = 1
                unit = "unidad"
                name = ing_text

            # Buscar o crear el ingrediente base
            # Usamos iexact para evitar duplicados por mayúsculas/minúsculas
            ingredient, created = Ingredient.objects.get_or_create(
                name__iexact=name,
                defaults={"name": name}
            )
            # Si ya existía pero con otro casing, usamos el objeto retornado
            if not created:
                ingredient = Ingredient.objects.get(name__iexact=name)
            
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                amount=amount,
                unit=unit,
                order=index + 1
            )

        return recipe