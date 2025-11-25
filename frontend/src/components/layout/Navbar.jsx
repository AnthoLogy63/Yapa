function Navbar() {
  return (
    <div className="flex items-center min-h-20 justify-between px-10 bg-white shadow-md w-full mx-auto">
      
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden w-100">
          <svg
            className="w-5 h-5 text-gray-500 ml-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Palabra Buscada"
            className="py-2 pl-2 pr-4 w-full focus:outline-none text-gray-700 placeholder-gray-500 bg-white"
          />
        </div>
        
        <button 
          className="px-6 py-2 text-white font-semibold rounded-lg transition duration-150 shadow-md cursor-pointer hover:brightness-110"
          style={{ backgroundColor: '#F99F3F' }}
        >
          Buscar
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          className="px-4 py-2 font-semibold border rounded-lg transition duration-150 shadow-sm cursor-pointer"
          style={{ color: '#F99F3F', borderColor: '#F99F3F' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(249, 159, 63, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Iniciar Sesión
        </button>
        
        <button 
          className="flex items-center px-4 py-2 text-white font-semibold rounded-lg transition duration-150 shadow-md cursor-pointer hover:brightness-110"
          style={{ backgroundColor: '#F99F3F' }}
        >
          <span className="text-xl mr-1">+</span>
          Crear una Receta
        </button>
      </div>
    </div>
  );
}

export default Navbar;
