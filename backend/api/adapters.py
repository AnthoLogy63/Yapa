from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialApp
from django.conf import settings


class GoogleAdapter(DefaultSocialAccountAdapter):
    """
    Adapter personalizado que obtiene las credenciales de Google desde settings.py
    en lugar de la base de datos.
    """
    
    def get_app(self, request, provider, client_id=None):
        """
        Retorna una SocialApp con las credenciales desde settings.py
        """
        if provider == 'google':
            google_config = settings.SOCIALACCOUNT_PROVIDERS.get('google', {}).get('APP', {})
            
            # Crear una instancia de SocialApp sin guardarla en la base de datos
            app = SocialApp(
                provider=provider,
                name='Google',
                client_id=google_config.get('client_id'),
                secret=google_config.get('secret'),
                key=google_config.get('key', ''),
            )
            # No guardamos en la base de datos, solo retornamos la instancia
            return app
        
        # Para otros providers, usar el comportamiento por defecto
        return super().get_app(request, provider, client_id)
