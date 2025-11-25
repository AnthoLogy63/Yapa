import React from "react";

function Login({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg w-96 p-6 relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        {/* Contenido del login */}
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Usuario"
          className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none"
        />
        <button
          className="w-full bg-orange-500 text-white rounded-md py-2 hover:bg-orange-600 transition"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;
