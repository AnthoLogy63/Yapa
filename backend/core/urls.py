from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from api.views import GoogleLogin
from rest_framework.routers import DefaultRouter

# TEMPORAL
from api.views import RecipeViewSet  # <-- agregamos RecipeViewSet

def home(request):
    return HttpResponse("<h1>Backend funcionando</h1>")

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('', home),  
    path('admin/', admin.site.urls), 
    path('api/', include(router.urls)), 
    path("api-auth/", include("rest_framework.urls")),  
    path("dj-rest-auth/", include("dj_rest_auth.urls")),  
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")), 
    path('accounts/', include('allauth.urls')),  # URLs de allauth (login/logout)
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    
]
