from rest_framework import serializers
from api.models import Recipe, StepRecipe, RecipeIngredient, Ingredient
from .category import CategorySerializer
from .ingredient import IngredientSerializer
from .user import UserSerializer
import re
import json


class JSONStringField(serializers.Field):
    """
    Campo personalizado que acepta strings JSON y los convierte a objetos Python.
    Necesario porque FormData envía JSON como strings.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                return json.loads(data)
            except json.JSONDecodeError:
                # Si no es JSON válido, devolver como string para backward compatibility
                return data
        return data
    
    def to_representation(self, value):
        return value


class StepRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepRecipe
        fields = ["id", "description", "photo", "estimated_time"]


class RecipeIngredientInputSerializer(serializers.Serializer):
    """
    Serializer para recibir ingredientes estructurados al crear/editar recetas.
    Permite al usuario especificar la unidad libremente.
    """
    name = serializers.CharField(max_length=150)
    amount = serializers.DecimalField(max_digits=8, decimal_places=2)
    unit = serializers.CharField(max_length=50)


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

    # Campos de escritura para recibir ingredientes y pasos
    # Ahora acepta tanto objetos estructurados como strings para compatibilidad
    ingredients_input = serializers.ListField(
        child=JSONStringField(), write_only=True, required=False
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
            "date_register",
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

        # Crear Ingredientes
        # Ahora soporta tanto objetos estructurados como strings
        for index, ing_data in enumerate(ingredients_data):
            if not ing_data:
                continue
            
            # Caso 1: Datos estructurados (diccionario con name, amount, unit)
            if isinstance(ing_data, dict):
                name = ing_data.get('name', '').strip()
                amount = ing_data.get('amount', 1)
                unit = ing_data.get('unit', '').strip()
                
                if not name:
                    continue
                    
            # Caso 2: String (backward compatibility con regex parsing)
            elif isinstance(ing_data, str):
                ing_text = ing_data.strip()
                if not ing_text:
                    continue
                
                # Regex: "2 tazas de harina" -> amount=2, unit="tazas", name="harina"
                pattern = re.compile(r"^(\d+(?:[.,]\d+)?)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\s+(?:de\s+)?(.+)$", re.IGNORECASE)
                match = pattern.match(ing_text)
                
                if match:
                    amount_str = match.group(1).replace(",", ".")
                    amount = float(amount_str)
                    unit = match.group(2)
                    name = match.group(3).strip()
                else:
                    # Si no matchea el patrón, asumimos que es solo el nombre
                    # El usuario deberá usar formato estructurado para especificar unidad
                    amount = 1
                    unit = "unidad"
                    name = ing_text
            else:
                continue

            # Buscar o crear el ingrediente base
            ingredient, created = Ingredient.objects.get_or_create(
                name__iexact=name,
                defaults={"name": name}
            )
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

    def update(self, instance, validated_data):
        """
        Actualiza una receta existente.
        Preserva is_active=True siempre.
        """
        ingredients_data = validated_data.pop("ingredients_input", None)
        steps_data = validated_data.pop("steps_input", None)
        
        # Asegurar que is_active siempre sea True
        validated_data['is_active'] = True
        
        # Actualizar campos básicos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar Ingredientes si se proporcionan
        if ingredients_data is not None:
            # Eliminar ingredientes anteriores
            instance.recipe_ingredients.all().delete()
            
            # Procesar ingredientes (mismo lógica que en create)
            for index, ing_data in enumerate(ingredients_data):
                if not ing_data:
                    continue
                
                # Caso 1: Datos estructurados (diccionario con name, amount, unit)
                if isinstance(ing_data, dict):
                    name = ing_data.get('name', '').strip()
                    amount = ing_data.get('amount', 1)
                    unit = ing_data.get('unit', '').strip()
                    
                    if not name:
                        continue
                        
                # Caso 2: String (backward compatibility con regex parsing)
                elif isinstance(ing_data, str):
                    ing_text = ing_data.strip()
                    if not ing_text:
                        continue
                    
                    # Regex: "2 tazas de harina" -> amount=2, unit="tazas", name="harina"
                    pattern = re.compile(r"^(\d+(?:[.,]\d+)?)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\s+(?:de\s+)?(.+)$", re.IGNORECASE)
                    match = pattern.match(ing_text)
                    
                    if match:
                        amount_str = match.group(1).replace(",", ".")
                        amount = float(amount_str)
                        unit = match.group(2)
                        name = match.group(3).strip()
                    else:
                        # Si no matchea el patrón, asumimos que es solo el nombre
                        amount = 1
                        unit = "unidad"
                        name = ing_text
                else:
                    continue

                # Buscar o crear ingrediente
                ingredient, created = Ingredient.objects.get_or_create(
                    name__iexact=name,
                    defaults={"name": name}
                )
                if not created:
                    ingredient = Ingredient.objects.get(name__iexact=name)
                
                RecipeIngredient.objects.create(
                    recipe=instance,
                    ingredient=ingredient,
                    amount=amount,
                    unit=unit,
                    order=index + 1
                )

        # Actualizar Pasos si se proporcionan
        if steps_data is not None:
            # Eliminar pasos anteriores
            instance.steps.all().delete()
            
            for index, step_text in enumerate(steps_data):
                if step_text.strip():
                    StepRecipe.objects.create(
                        recipe=instance,
                        description=step_text.strip(),
                        estimated_time=None
                    )

        return instance

    def delete(self, instance):
        """
        Desactiva una receta en lugar de eliminarla completamente.
        """
        instance.is_active = False
        instance.save()
        return instance