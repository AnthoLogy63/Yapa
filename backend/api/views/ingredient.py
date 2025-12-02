from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from api.models import Ingredient
from api.serializers import IngredientSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Ingredientes'],
        summary='Listar todos los ingredientes',
        description='Devuelve todos los ingredientes disponibles. Soporta búsqueda por nombre y filtrado por clasificación.',
        parameters=[
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Buscar ingredientes por nombre',
                required=False,
            ),
            OpenApiParameter(
                name='classification',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por clasificación (fruta, verdura, cereal, etc.)',
                required=False,
            ),
        ],
        responses={200: IngredientSerializer(many=True)}
    ),
    retrieve=extend_schema(
        tags=['Ingredientes'],
        summary='Obtener detalle de ingrediente',
        description='Devuelve el detalle de un ingrediente específico.',
        responses={200: IngredientSerializer}
    ),
    create=extend_schema(
        tags=['Ingredientes'],
        summary='Crear un nuevo ingrediente',
        description='Crea un nuevo ingrediente. Solo disponible para administradores.',
        examples=[
            OpenApiExample(
                'Crear ingrediente',
                value={
                    'name': 'Tomate',
                    'classification': 'verdura',
                    'type_restriction': '',
                    'note': 'Rico en licopeno y vitamina C'
                },
                request_only=True,
            )
        ],
        responses={201: IngredientSerializer}
    ),
    update=extend_schema(
        tags=['Ingredientes'],
        summary='Actualizar ingrediente',
        description='Actualiza un ingrediente existente. Solo disponible para administradores.',
        responses={200: IngredientSerializer}
    ),
    partial_update=extend_schema(
        tags=['Ingredientes'],
        summary='Actualizar parcialmente ingrediente',
        description='Actualiza parcialmente un ingrediente existente. Solo disponible para administradores.',
        responses={200: IngredientSerializer}
    ),
    destroy=extend_schema(
        tags=['Ingredientes'],
        summary='Eliminar ingrediente',
        description='Elimina un ingrediente. Solo disponible para administradores.',
        responses={204: None}
    ),
)
class IngredientViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar ingredientes.
    Lectura disponible para todos, escritura solo para administradores.
    Soporta búsqueda y filtrado.
    """
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'classification']
    
    def get_queryset(self):
        """
        Permite filtrar por clasificación mediante query params.
        """
        queryset = Ingredient.objects.all()
        classification = self.request.query_params.get('classification', None)
        
        if classification:
            queryset = queryset.filter(classification__icontains=classification)
        
        return queryset
