from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .services import get_gemini_response_with_intent


@extend_schema(
    tags=['IA'],
    summary='Chat con IA con detección de intents',
    description='Envía un mensaje al chatbot de IA y recibe una respuesta estructurada con intent y datos para ejecutar acciones.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'message': {
                    'type': 'string',
                    'description': 'Mensaje del usuario para el chatbot'
                }
            },
            'required': ['message']
        }
    },
    responses={
        200: {
            'type': 'object',
            'properties': {
                'intent': {
                    'type': 'string',
                    'description': 'Tipo de acción: OPEN_RECIPE, ADD_PANTRY_ITEM, ADD_FAVORITE, SEARCH_RECIPES, CHAT'
                },
                'data': {
                    'type': 'object',
                    'description': 'Datos específicos del intent'
                },
                'message': {
                    'type': 'string',
                    'description': 'Mensaje amigable para el usuario'
                }
            }
        },
        400: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    examples=[
        OpenApiExample(
            'Ejemplo de mensaje',
            value={'message': 'Abre la receta 5'},
            request_only=True,
        ),
        OpenApiExample(
            'Ejemplo de respuesta con intent',
            value={
                'intent': 'OPEN_RECIPE',
                'data': {'recipe_id': 5},
                'message': 'Abriendo la receta número 5...'
            },
            response_only=True,
        )
    ]
)
class ChatView(APIView):
    """
    Vista para manejar las peticiones del chatbot de IA con detección de intents.
    POST /api/ai/chat/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Procesa un mensaje del usuario y devuelve una respuesta estructurada con intent.
        """
        message = request.data.get('message', '').strip()
        
        if not message:
            return Response(
                {'error': 'El mensaje no puede estar vacío'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Obtener contexto del usuario
            user_context = {
                'user_id': request.user.id,
                'username': request.user.username
            }
            
            # Obtener respuesta con intent de Gemini
            intent_response = get_gemini_response_with_intent(message, user_context)
            
            return Response(intent_response, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': f'Error al procesar la solicitud: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
