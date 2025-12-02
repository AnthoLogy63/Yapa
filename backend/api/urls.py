from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    RecipeViewSet,
    FavoriteRecipeViewSet,
    PantryViewSet,
    PantryIngredientViewSet,
    UserProfileViewSet,
    CurrentUserView,
    CategoryViewSet,
    IngredientViewSet,
)

# Router para ViewSets
router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'favorites', FavoriteRecipeViewSet, basename='favorite')
router.register(r'pantry', PantryViewSet, basename='pantry')
router.register(r'pantry-ingredients', PantryIngredientViewSet, basename='pantry-ingredient')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'categorias', CategoryViewSet, basename='categoria')
router.register(r'ingredientes', IngredientViewSet, basename='ingrediente')

urlpatterns = [
    # Rutas del router
    path('', include(router.urls)),
    
    # Ruta personalizada para usuario actual
    path('auth/user/', CurrentUserView.as_view(), name='current-user'),
]
