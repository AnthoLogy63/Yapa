import React from "react";
import YapaLogo from '../../assets/logo.png';

function ConfirmacionSalida({ onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
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

        {/* Mensaje principal */}
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          ¿Seguro que desea salir de su recetario?
        </h2>

        {/* Mensaje secundario */}
        <p className="text-center text-gray-600 mb-8">
          Perderá lo que escribió hasta el momento 😔
        </p>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#F99F3F] text-white rounded-md py-2 px-5 hover:brightness-110 transition text-base font-semibold"
          >
            Salir de Recetario
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#F99F3F] text-white rounded-md py-2 px-5 hover:brightness-110 transition text-base font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmacionSalida;
