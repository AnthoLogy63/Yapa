from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from api.models import Recipe
from api.serializers import RecipeSerializer
import random


@extend_schema_view(
    list=extend_schema(
        tags=['Recetas'],
        summary='Listar todas las recetas',
        description='Devuelve una lista de todas las recetas activas disponibles en la plataforma.',
        parameters=[
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Buscar recetas por título o descripción',
                required=False,
            ),
        ]
    ),
    create=extend_schema(
        tags=['Recetas'],
        summary='Crear una nueva receta',
        description='Crea una nueva receta. Requiere autenticación. El usuario autenticado será asignado como creador.',
        examples=[
            OpenApiExample(
                'Crear receta de Ceviche',
                value={
                    'title': 'Ceviche Peruano',
                    'description': 'Delicioso ceviche tradicional peruano',
                    'preparation_time': 30,
                    'difficulty': 'Media',
                    'portions': 4,
                    'category': 1
                },
                request_only=True,
            )
        ]
    ),
    retrieve=extend_schema(
        tags=['Recetas'],
        summary='Obtener detalle de receta',
        description='Devuelve el detalle completo de una receta específica, incluyendo pasos e ingredientes.',
    ),
    update=extend_schema(
        tags=['Recetas'],
        summary='Actualizar receta',
        description='Actualiza una receta existente. Solo el creador puede actualizar.',
    ),
    partial_update=extend_schema(
        tags=['Recetas'],
        summary='Actualizar parcialmente una receta',
        description='Actualiza parcialmente una receta existente.',
    ),
    destroy=extend_schema(
        tags=['Recetas'],
        summary='Eliminar receta',
        description='Elimina una receta. Solo el creador puede eliminar.',
    ),
)
class RecipeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar recetas.
    Permite CRUD completo de recetas.
    """
    queryset = Recipe.objects.filter(is_active=True)
    serializer_class = RecipeSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    def get_permissions(self):
        """
        Permisos personalizados:
        - list, retrieve, recommendations: público
        - create, update, destroy: autenticado
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return []

    def perform_create(self, serializer):
        """Asignar el usuario autenticado como creador de la receta y activarla por defecto"""
        serializer.save(user=self.request.user, is_active=True)
    
    @extend_schema(
        tags=['Recetas'],
        summary='Obtener recomendaciones de recetas',
        description='Devuelve hasta 3 recetas aleatorias activas para mostrar como recomendaciones.',
        responses={200: RecipeSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='recommendations')
    def recommendations(self, request):
        """
        GET /api/recipes/recommendations/
        Devuelve hasta 3 recetas aleatorias activas.
        """
        qs = self.get_queryset()
        count = qs.count()

        if count == 0:
            return Response([])

        # Número de recetas a devolver (máx 3, pero si hay menos, devuelve las que haya)
        n = min(3, count)

        # Tomamos n IDs aleatorios
        ids = random.sample(list(qs.values_list('id', flat=True)), n)

        recs = qs.filter(id__in=ids)
        serializer = self.get_serializer(recs, many=True)
        return Response(serializer.data)

    @extend_schema(
        tags=['Recetas'],
        summary='Obtener recomendaciones del día',
        description='Devuelve 3 recetas aleatorias activas para la sección de recomendaciones del día en la página principal.',
        responses={200: RecipeSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='recomendaciones-del-dia')
    def recomendaciones_del_dia(self, request):
        """
        GET /api/recipes/recomendaciones-del-dia/
        Devuelve hasta 3 recetas aleatorias activas para recomendaciones del día.
        """
        qs = self.get_queryset()
        count = qs.count()

        if count == 0:
            return Response([])

        # Número de recetas a devolver (máx 3, pero si hay menos, devuelve las que haya)
        n = min(3, count)

        # Tomamos n IDs aleatorios
        ids = random.sample(list(qs.values_list('id', flat=True)), n)

        recs = qs.filter(id__in=ids)
        serializer = self.get_serializer(recs, many=True)
        return Response(serializer.data)

    @extend_schema(
        tags=['Recetas'],
        summary='Obtener mis recetas',
        description='Devuelve todas las recetas creadas por el usuario autenticado.',
        responses={200: RecipeSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='my-recipes', permission_classes=[IsAuthenticated])
    def my_recipes(self, request):
        """
        GET /api/recipes/my-recipes/
        Devuelve las recetas creadas por el usuario autenticado.
        """
        recipes = Recipe.objects.filter(user=request.user, is_active=True)
        serializer = self.get_serializer(recipes, many=True)
        return Response(serializer.data)

    @extend_schema(
        tags=['Recetas'],
        summary='Incrementar visualizaciones',
        description='Incrementa el contador de visualizaciones de una receta en 1.',
        request=None,
        responses={
            200: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Respuesta exitosa',
                value={'visualizations': 151},
                response_only=True,
            )
        ]
    )
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """
        POST /api/recipes/{id}/increment_views/
        Incrementa el contador de visualizaciones de una receta.
        """
        recipe = self.get_object()
        recipe.visualizations += 1
        recipe.save()
        return Response({'visualizations': recipe.visualizations})
