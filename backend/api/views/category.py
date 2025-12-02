from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from api.models import Category
from api.serializers import CategorySerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Categorías'],
        summary='Listar todas las categorías',
        description='Devuelve todas las categorías disponibles para clasificar recetas e ingredientes.',
        responses={200: CategorySerializer(many=True)}
    ),
    retrieve=extend_schema(
        tags=['Categorías'],
        summary='Obtener detalle de categoría',
        description='Devuelve el detalle de una categoría específica.',
        responses={200: CategorySerializer}
    ),
    create=extend_schema(
        tags=['Categorías'],
        summary='Crear una nueva categoría',
        description='Crea una nueva categoría. Solo disponible para administradores.',
        examples=[
            OpenApiExample(
                'Crear categoría',
                value={
                    'name': 'Frutas',
                    'description': 'Frutas frescas y secas',
                    'icon': '🍎'
                },
                request_only=True,
            )
        ],
        responses={201: CategorySerializer}
    ),
    update=extend_schema(
        tags=['Categorías'],
        summary='Actualizar categoría',
        description='Actualiza una categoría existente. Solo disponible para administradores.',
        responses={200: CategorySerializer}
    ),
    partial_update=extend_schema(
        tags=['Categorías'],
        summary='Actualizar parcialmente categoría',
        description='Actualiza parcialmente una categoría existente. Solo disponible para administradores.',
        responses={200: CategorySerializer}
    ),
    destroy=extend_schema(
        tags=['Categorías'],
        summary='Eliminar categoría',
        description='Elimina una categoría. Solo disponible para administradores.',
        responses={204: None}
    ),
)
class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar categorías de recetas e ingredientes.
    Lectura disponible para todos, escritura solo para administradores.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
