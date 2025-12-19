from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.utils import timezone
from api.models import Pantry, PantryIngredient, Ingredient
from api.serializers import PantrySerializer, PantryIngredientSerializer

VALID_CLASSIFICATIONS = [c[0] for c in Ingredient.CLASSIFICATION_CHOICES]

@extend_schema_view(
    list=extend_schema(
        tags=['Despensa'],
        summary='Listar mis despensas',
        responses={200: PantrySerializer(many=True)}
    ),
    create=extend_schema(
        tags=['Despensa'],
        summary='Crear una nueva despensa',
        examples=[OpenApiExample('Crear despensa', value={'name': 'Principal'}, request_only=True)]
    ),
    retrieve=extend_schema(tags=['Despensa'], summary='Obtener detalle de despensa'),
    update=extend_schema(tags=['Despensa'], summary='Actualizar despensa'),
    destroy=extend_schema(tags=['Despensa'], summary='Eliminar despensa'),
)
class PantryViewSet(viewsets.ModelViewSet):
    serializer_class = PantrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pantry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        tags=['Despensa'],
        summary='Gestionar ingredientes de despensa',
        request=PantryIngredientSerializer,
        responses={200: PantryIngredientSerializer(many=True), 201: PantryIngredientSerializer},
    )
    @action(detail=True, methods=['get', 'post'], url_path='ingredients')
    def ingredients(self, request, pk=None):
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
    list=extend_schema(tags=['Despensa'], summary='Listar todos mis ingredientes', responses={200: PantryIngredientSerializer(many=True)}),
    retrieve=extend_schema(tags=['Despensa'], summary='Obtener detalle de ingrediente'),
    update=extend_schema(tags=['Despensa'], summary='Actualizar ingrediente'),
    destroy=extend_schema(tags=['Despensa'], summary='Eliminar ingrediente'),
)
class PantryIngredientViewSet(viewsets.ModelViewSet):
    serializer_class = PantryIngredientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PantryIngredient.objects.filter(pantry__user=self.request.user)

    def create(self, request, *args, **kwargs):
        ingredient_name = request.data.get('ingredient_name')
        if not ingredient_name:
            return Response({'detail': 'ingredient_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        amount = float(request.data.get('amount', 0))
        unit = request.data.get('unit', 'un')
        date_aggregate = request.data.get('date_aggregate') or timezone.now().date()
        classification = request.data.get('classification', 'Otros')
        if classification not in VALID_CLASSIFICATIONS:
            classification = 'Otros'

        pantry, _ = Pantry.objects.get_or_create(user=request.user, name="Principal")

        ingredient = Ingredient.objects.filter(name__iexact=ingredient_name).first()
        if not ingredient:
            ingredient = Ingredient.objects.create(name=ingredient_name, classification=classification)

        existing_items = PantryIngredient.objects.filter(pantry=pantry, ingredient=ingredient)
        final_amount = amount
        if existing_items.exists():
            for item in existing_items:
                final_amount += float(item.amount)
            existing_items.delete()

        pantry_item = PantryIngredient.objects.create(
            pantry=pantry,
            ingredient=ingredient,
            amount=final_amount,
            unit=unit,
            date_aggregate=date_aggregate
        )

        serializer = self.get_serializer(pantry_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=['Despensa'],
        summary='Eliminar múltiples ingredientes',
        request=OpenApiTypes.OBJECT,
        responses={200: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT},
        examples=[OpenApiExample('Request', value={'ids': [1, 2, 3]}, request_only=True)]
    )
    @action(detail=False, methods=['delete'], url_path='bulk-delete')
    def bulk_delete(self, request):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'detail': 'Se requiere una lista de IDs'}, status=status.HTTP_400_BAD_REQUEST)
        deleted_count = PantryIngredient.objects.filter(id__in=ids, pantry__user=request.user).delete()[0]
        return Response({'deleted_count': deleted_count, 'message': f'{deleted_count} ingredientes eliminados'})

    @action(detail=True, methods=['patch'], url_path='adjust-amount')
    def adjust_amount(self, request, pk=None):
        """
        Aumenta o reduce la cantidad de un ingrediente en la despensa.
        Se espera payload: {"amount_change": 2.5} (positivo o negativo)
        """
        from decimal import Decimal
        pantry_item = self.get_object()
        amount_change = request.data.get('amount_change')
        
        if amount_change is None:
            return Response({'detail': 'Se requiere amount_change'}, status=400)
        
        try:
            # Convert to Decimal for precision with DecimalField
            change = Decimal(str(amount_change))
        except:
             return Response({'detail': 'amount_change debe ser un número válido'}, status=400)

        pantry_item.amount += change
        
        if pantry_item.amount <= 0:
            pantry_item.delete()
            return Response(
                {'detail': 'Ingrediente eliminado', 'deleted': True}, 
                status=200
            )
            
        pantry_item.save()
        serializer = self.get_serializer(pantry_item)
        return Response(serializer.data, status=200)