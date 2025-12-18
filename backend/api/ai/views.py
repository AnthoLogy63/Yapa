from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .services import get_gemini_response


@extend_schema(
    tags=['IA'],
    summary='Chat con IA',
    description='Envía un mensaje al chatbot de IA y recibe una respuesta generada por Gemini.',
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
                'response': {
                    'type': 'string',
                    'description': 'Respuesta generada por la IA'
                }
            }
        },
        400: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    examples=[
        OpenApiExample(
            'Ejemplo de mensaje',
            value={'message': '¿Qué recetas me recomiendas con pollo?'},
            request_only=True,
        ),
        OpenApiExample(
            'Ejemplo de respuesta',
            value={'response': 'Te recomiendo probar pollo a la parrilla con hierbas...'},
            response_only=True,
        )
    ]
)
class ChatView(APIView):
    """
    Vista para manejar las peticiones del chatbot de IA.
    POST /api/ai/chat/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Procesa un mensaje del usuario y devuelve la respuesta de Gemini.
        """
        message = request.data.get('message', '').strip()
        
        if not message:
            return Response(
                {'error': 'El mensaje no puede estar vacío'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Obtener respuesta de Gemini
            ai_response = get_gemini_response(message)
            
            return Response({
                'response': ai_response
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': f'Error al procesar la solicitud: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
