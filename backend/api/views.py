from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Recipe
from api.serializers import RecipeSerializer
import random
from rest_framework.decorators import api_view
from rest_framework import status
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView


class RecipeViewSet(viewsets.ModelViewSet):
    """
    CRUD de recetas + endpoint de recomendaciones.
    """
    queryset = Recipe.objects.filter(is_active=True)
    serializer_class = RecipeSerializer

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


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter