import React from "react";
import YapaLogo from '../../assets/logo.png';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

function Login({ onClose }) {
  const { login } = useAuth();

  // Configuración del login de Google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtener información del perfil de Google
        const googleUserInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        console.log('Información de Google:', googleUserInfo.data);

        // Envía el access_token al backend
        const data = await loginWithGoogle(tokenResponse.access_token);
        console.log('Usuario logueado en backend:', data);

        // Combinar datos del backend con la info de Google
        const userData = {
          ...data.user,
          name: googleUserInfo.data.name,
          email: googleUserInfo.data.email,
          picture: googleUserInfo.data.picture,
        };

        // Guardamos en el context
        login(userData, data.key);

        // Cerrar modal
        if (onClose) onClose();
      } catch (error) {
        console.error('Error en login backend:', error);
      }
    },
    onError: () => {
      console.log('Login fallido');
    },
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]" // <-- sigue en el top
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <div className="bg-white rounded-2xl w-full p-12 relative shadow-2xl" style={{ maxWidth: '420px' }}>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 font-bold text-xl transition"
        >
          ×
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={YapaLogo}
            alt="YAPA Logo"
            className="h-32 w-auto"
          />
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-center mb-8 text-gray-800">
          INICIAR SESIÓN
        </h2>

        {/* Botón de Google */}
        <button
          onClick={() => googleLogin()}
          className="w-full bg-gray-800 text-white rounded-md py-3 px-5 mb-7 flex items-center justify-center gap-2 hover:bg-gray-700 transition text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continúa con Google
        </button>

        {/* Texto legal */}
        <p className="text-xs text-center text-gray-600 leading-relaxed">
          Al usar YAPA, aceptas las{" "}
          <a href="#" className="text-orange-500 hover:underline font-semibold">
            Condiciones de Servicio
          </a>{" "}
          y la{" "}
          <a href="#" className="text-orange-500 hover:underline font-semibold">
            Política de Privacidad de YAPA
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
