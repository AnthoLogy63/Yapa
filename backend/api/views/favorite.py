from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from api.models import FavoriteRecipe, Recipe
from api.serializers import FavoriteRecipeSerializer, FavoriteRecipeListSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Favoritos'],
        summary='Listar mis recetas favoritas',
        description='Devuelve todas las recetas marcadas como favoritas por el usuario autenticado.',
        responses={200: FavoriteRecipeListSerializer(many=True)}
    ),
    create=extend_schema(
        tags=['Favoritos'],
        summary='Agregar receta a favoritos',
        description='Agrega una receta a la lista de favoritos del usuario autenticado.',
        request=FavoriteRecipeSerializer,
        responses={
            201: FavoriteRecipeListSerializer,
            400: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Agregar a favoritos',
                value={'recipe_id': 1},
                request_only=True,
            ),
            OpenApiExample(
                'Respuesta exitosa',
                value={
                    'id': 1,
                    'recipe': {
                        'id': 1,
                        'title': 'Ceviche Peruano',
                        'image': 'http://localhost:8000/media/uploads/images/ceviche.jpg'
                    },
                    'date_added': '2024-01-01T00:00:00Z'
                },
                response_only=True,
            )
        ]
    ),
    destroy=extend_schema(
        tags=['Favoritos'],
        summary='Quitar receta de favoritos',
        description='Elimina una receta de la lista de favoritos del usuario.',
        responses={
            204: None,
            404: OpenApiTypes.OBJECT,
        }
    ),
)
class FavoriteRecipeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar recetas favoritas del usuario.
    Requiere autenticación.
    """
    serializer_class = FavoriteRecipeListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Solo devuelve los favoritos del usuario autenticado"""
        return FavoriteRecipe.objects.filter(user=self.request.user).select_related('recipe')

    def get_serializer_class(self):
        """Usa diferentes serializers para diferentes acciones"""
        if self.action == 'create':
            return FavoriteRecipeSerializer
        return FavoriteRecipeListSerializer

    def create(self, request, *args, **kwargs):
        """
        POST /api/favorites/
        Agregar una receta a favoritos.
        Body: {"recipe_id": 1}
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Verificar si ya existe
        recipe_id = serializer.validated_data.get('recipe_id')
        existing = FavoriteRecipe.objects.filter(
            user=request.user,
            recipe_id=recipe_id
        ).first()
        
        if existing:
            return Response(
                {'detail': 'Esta receta ya está en tus favoritos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        # Devolver con el serializer completo
        favorite = FavoriteRecipe.objects.get(id=serializer.data['id'])
        response_serializer = FavoriteRecipeListSerializer(favorite)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @extend_schema(
        tags=['Favoritos'],
        summary='Agregar/Quitar de favoritos (toggle)',
        description='Agrega o quita una receta de favoritos en una sola llamada. Si la receta ya está en favoritos, la quita. Si no está, la agrega.',
        request=OpenApiTypes.OBJECT,
        responses={
            200: OpenApiTypes.OBJECT,
            201: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Request',
                value={'recipe_id': 1},
                request_only=True,
            ),
            OpenApiExample(
                'Agregado a favoritos',
                value={
                    'is_favorite': True,
                    'message': 'Receta agregada a favoritos'
                },
                response_only=True,
            ),
            OpenApiExample(
                'Quitado de favoritos',
                value={
                    'is_favorite': False,
                    'message': 'Receta quitada de favoritos'
                },
                response_only=True,
            )
        ]
    )
    @action(detail=False, methods=['post'], url_path='toggle')
    def toggle(self, request):
        """
        POST /api/favorites/toggle/
        Agregar o quitar una receta de favoritos en una sola llamada.
        Body: {"recipe_id": 1}
        Returns: {"is_favorite": true/false, "message": "..."}
        """
        recipe_id = request.data.get('recipe_id')
        
        if not recipe_id:
            return Response(
                {'detail': 'recipe_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response(
                {'detail': 'Receta no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        favorite = FavoriteRecipe.objects.filter(
            user=request.user,
            recipe=recipe
        ).first()
        
        if favorite:
            # Ya existe, eliminar
            favorite.delete()
            return Response({
                'is_favorite': False,
                'message': 'Receta quitada de favoritos'
            })
        else:
            # No existe, crear
            favorite = FavoriteRecipe.objects.create(
                user=request.user,
                recipe=recipe
            )
            return Response({
                'is_favorite': True,
                'message': 'Receta agregada a favoritos'
            }, status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=['Favoritos'],
        summary='Verificar si una receta es favorita',
        description='Verifica si una receta específica está en la lista de favoritos del usuario.',
        parameters=[
            OpenApiParameter(
                name='recipe_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID de la receta a verificar',
                required=True,
            ),
        ],
        responses={
            200: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Es favorita',
                value={'is_favorite': True},
                response_only=True,
            ),
            OpenApiExample(
                'No es favorita',
                value={'is_favorite': False},
                response_only=True,
            )
        ]
    )
    @action(detail=False, methods=['get'], url_path='check/(?P<recipe_id>[^/.]+)')
    def check(self, request, recipe_id=None):
        """
        GET /api/favorites/check/{recipe_id}/
        Verificar si una receta está en favoritos.
        Returns: {"is_favorite": true/false}
        """
        is_favorite = FavoriteRecipe.objects.filter(
            user=request.user,
            recipe_id=recipe_id
        ).exists()
        
        return Response({'is_favorite': is_favorite})
