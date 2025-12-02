from rest_framework import serializers
from api.models import FavoriteRecipe
from .recipe import RecipeSerializer


class FavoriteRecipeSerializer(serializers.ModelSerializer):
    """Serializer para recetas favoritas"""
    recipe = RecipeSerializer(read_only=True)
    recipe_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = FavoriteRecipe
        fields = ['id', 'recipe', 'recipe_id', 'date_added']
        read_only_fields = ['id', 'date_added']

    def create(self, validated_data):
        # El usuario se obtiene del contexto (request.user)
        user = self.context['request'].user
        recipe_id = validated_data.pop('recipe_id')
        
        from api.models import Recipe
        recipe = Recipe.objects.get(id=recipe_id)
        
        favorite, created = FavoriteRecipe.objects.get_or_create(
            user=user,
            recipe=recipe
        )
        return favorite


class FavoriteRecipeListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar favoritos"""
    recipe = RecipeSerializer(read_only=True)
    
    class Meta:
        model = FavoriteRecipe
        fields = ['id', 'recipe', 'date_added']
