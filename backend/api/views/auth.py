from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from api.models import UserProfile
from api.serializers import UserSerializer, UserProfileSerializer


class GoogleLogin(SocialLoginView):
    """
    Vista para login con Google OAuth.
    Mantiene la implementación existente que ya funciona.
    """
    adapter_class = GoogleOAuth2Adapter


@extend_schema(
    tags=['Autenticación'],
    summary='Obtener información del usuario actual',
    description='Devuelve la información completa del usuario autenticado, incluyendo su perfil con foto de Google OAuth.',
    responses={
        200: UserSerializer,
        401: OpenApiTypes.OBJECT,
    }
)
class CurrentUserView(APIView):
    """
    Vista para obtener información del usuario actual.
    GET /api/auth/user/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        tags=['Autenticación'],
        summary='Listar perfiles',
        description='Lista los perfiles de usuario. Solo devuelve el perfil del usuario autenticado.',
    ),
    retrieve=extend_schema(
        tags=['Autenticación'],
        summary='Obtener perfil por ID',
        description='Obtiene un perfil específico por su ID.',
    ),
    update=extend_schema(
        tags=['Autenticación'],
        summary='Actualizar perfil',
        description='Actualiza el perfil del usuario autenticado. Permite modificar biografía, teléfono, fecha de nacimiento, etc.',
        examples=[
            OpenApiExample(
                'Actualizar biografía',
                value={
                    'bio': 'Amante de la cocina peruana',
                    'phone': '+51999999999',
                    'date_of_birth': '1990-01-15'
                },
                request_only=True,
            )
        ]
    ),
    partial_update=extend_schema(
        tags=['Autenticación'],
        summary='Actualizar parcialmente el perfil',
        description='Actualiza parcialmente el perfil del usuario autenticado.',
    ),
)
class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el perfil del usuario.
    Solo permite ver y editar el perfil del usuario autenticado.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo devuelve el perfil del usuario autenticado
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        # Obtiene o crea el perfil del usuario autenticado
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    @extend_schema(
        tags=['Autenticación'],
        summary='Obtener mi perfil',
        description='Endpoint personalizado para obtener el perfil del usuario actual.',
        responses={200: UserProfileSerializer}
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Endpoint personalizado para obtener el perfil del usuario actual.
        GET /api/profile/me/
        """
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Actualizar el perfil del usuario actual.
        PUT/PATCH /api/profile/{id}/
        """
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
