from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

from rest_framework.routers import DefaultRouter
from api.views import RecipeViewSet


def home(request):
    return HttpResponse("<h1>Backend funcionando 👌</h1>")


router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
]
