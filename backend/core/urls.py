from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from api.views import GoogleLogin
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def home(request):
    return HttpResponse("<h1>Backend funcionando</h1>")

urlpatterns = [
    path('', home),  
    path('admin/', admin.site.urls), 
    
    # API URLs (incluye todos los endpoints de la app)
    path('api/', include('api.urls')),
    
    # Autenticación
    path("api-auth/", include("rest_framework.urls")),  
    path("dj-rest-auth/", include("dj_rest_auth.urls")),  
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")), 
    path('accounts/', include('allauth.urls')),  # URLs de allauth (login/logout)
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),

    path('admin/', admin.site.urls),

    # Archivo OpenAPI 3.0
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)