import React from 'react';

function ConfirmarEliminar({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m0-10a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          ¿Quieres eliminar tu receta?
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          Esta acción no se puede deshacer. Tu receta desaparecerá de la plataforma.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer font-medium"
          >
            No
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer font-medium"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarEliminar;
