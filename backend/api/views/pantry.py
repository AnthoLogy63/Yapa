from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from api.models import Pantry, PantryIngredient, Ingredient
from api.serializers import PantrySerializer, PantryIngredientSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Despensa'],
        summary='Listar mis despensas',
        description='Devuelve todas las despensas del usuario autenticado.',
        responses={200: PantrySerializer(many=True)}
    ),
    create=extend_schema(
        tags=['Despensa'],
        summary='Crear una nueva despensa',
        description='Crea una nueva despensa para el usuario autenticado.',
        examples=[
            OpenApiExample(
                'Crear despensa',
                value={
                    'name': 'Refrigerador Principal',
                },
                request_only=True,
            )
        ]
    ),
    retrieve=extend_schema(
        tags=['Despensa'],
        summary='Obtener detalle de despensa',
        description='Devuelve el detalle de una despensa específica.',
    ),
    update=extend_schema(
        tags=['Despensa'],
        summary='Actualizar despensa',
        description='Actualiza una despensa existente.',
    ),
    destroy=extend_schema(
        tags=['Despensa'],
        summary='Eliminar despensa',
        description='Elimina una despensa y todos sus ingredientes.',
    ),
)
class PantryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar despensas del usuario.
    Requiere autenticación.
    """
    serializer_class = PantrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Solo devuelve las despensas del usuario autenticado"""
        return Pantry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Asignar el usuario autenticado como dueño de la despensa"""
        serializer.save(user=self.request.user)

    @extend_schema(
        tags=['Despensa'],
        summary='Gestionar ingredientes de despensa',
        description='GET: Lista ingredientes de la despensa. POST: Agrega un ingrediente a la despensa.',
        request=PantryIngredientSerializer,
        responses={
            200: PantryIngredientSerializer(many=True),
            201: PantryIngredientSerializer,
        },
        examples=[
            OpenApiExample(
                'Agregar ingrediente',
                value={
                    'ingredient_id': 1,
                    'amount': 2.5,
                    'unit': 'kg',
                    'date_aggregate': '2024-01-01',
                    'date_expiration': '2024-02-01'
                },
                request_only=True,
            )
        ]
    )
    @action(detail=True, methods=['get', 'post'], url_path='ingredients')
    def ingredients(self, request, pk=None):
        """
        GET /api/pantry/{id}/ingredients/
        Listar ingredientes de una despensa.
        
        POST /api/pantry/{id}/ingredients/
        Agregar un ingrediente a la despensa.
        Body: {"ingredient_id": 1, "amount": 2.5, "unit": "kg", "date_aggregate": "2024-01-01"}
        """
        pantry = self.get_object()
        
        if request.method == 'GET':
            ingredients = PantryIngredient.objects.filter(pantry=pantry)
            serializer = PantryIngredientSerializer(ingredients, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            data = request.data.copy()
            data['pantry'] = pantry.id
            serializer = PantryIngredientSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema_view(
    list=extend_schema(
        tags=['Despensa'],
        summary='Listar todos mis ingredientes',
        description='Devuelve todos los ingredientes de todas las despensas del usuario autenticado.',
        responses={200: PantryIngredientSerializer(many=True)}
    ),
    retrieve=extend_schema(
        tags=['Despensa'],
        summary='Obtener detalle de ingrediente',
        description='Devuelve el detalle de un ingrediente específico de la despensa.',
    ),
    update=extend_schema(
        tags=['Despensa'],
        summary='Actualizar ingrediente',
        description='Actualiza la cantidad o fecha de un ingrediente en la despensa.',
    ),
    destroy=extend_schema(
        tags=['Despensa'],
        summary='Eliminar ingrediente',
        description='Elimina un ingrediente de la despensa.',
    ),
)
class PantryIngredientViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar ingredientes individuales de la despensa.
    Requiere autenticación.
    """
    serializer_class = PantryIngredientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Solo devuelve ingredientes de despensas del usuario autenticado"""
        return PantryIngredient.objects.filter(pantry__user=self.request.user)

    @extend_schema(
        tags=['Despensa'],
        summary='Eliminar múltiples ingredientes',
        description='Elimina varios ingredientes de la despensa en una sola operación.',
        request=OpenApiTypes.OBJECT,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Request',
                value={'ids': [1, 2, 3]},
                request_only=True,
            ),
            OpenApiExample(
                'Respuesta exitosa',
                value={
                    'deleted_count': 3,
                    'message': '3 ingredientes eliminados'
                },
                response_only=True,
            )
        ]
    )
    @action(detail=False, methods=['delete'], url_path='bulk-delete')
    def bulk_delete(self, request):
        """
        DELETE /api/pantry-ingredients/bulk-delete/
        Eliminar múltiples ingredientes.
        Body: {"ids": [1, 2, 3]}
        """
        ids = request.data.get('ids', [])
        
        if not ids:
            return Response(
                {'detail': 'Se requiere una lista de IDs'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        deleted_count = PantryIngredient.objects.filter(
            id__in=ids,
            pantry__user=request.user
        ).delete()[0]
        
        return Response({
            'deleted_count': deleted_count,
            'message': f'{deleted_count} ingredientes eliminados'
        })
