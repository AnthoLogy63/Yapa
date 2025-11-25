import YapaLogo from '../../assets/logo.png';

function Homepage() {
  const primaryColor = "#F99F3F";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-8 pt-0 w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img src={YapaLogo} alt="Logo Yapa" className="w-40 h-auto" />
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <h2 className="text-3xl font-normal text-gray-800 tracking-wider">
          ¿QUÉ COCINO HOY?
        </h2>
        <button 
          className="px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 hover:brightness-110 hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          Ver Recetas
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-12 w-full max-w-xl">
        <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden flex-grow">
          <svg
            className="w-5 h-5 text-gray-500 ml-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
            placeholder="Busca por nombre de la receta o ingredientes"
            className="py-3 pl-2 pr-4 w-full focus:outline-none text-gray-700 placeholder-gray-500 bg-white"
          />
        </div>
        <button 
          className="px-8 py-3 text-white font-semibold rounded-lg shadow-md transition duration-150 hover:brightness-110 hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          Buscar
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-16">
        <h3 className="text-xl font-normal text-gray-700 tracking-wider">
          ¿QUÉ TENGO EN MI REFRI?
        </h3>
        <button 
          className="px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 hover:brightness-110 hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          Consultar
        </button>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          RECOMENDACIONES DEL DÍA:
        </h2>
        <div className="flex justify-between space-x-6">
          <div className="flex flex-col w-1/3 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-3 text-center">
              <p className="text-lg font-bold text-gray-800">COSTILLAR DORADO</p>
              <div className="h-2 w-3/4 mx-auto mt-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            </div>
          </div>

          <div className="flex flex-col w-1/3 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-3 text-center">
              <p className="text-lg font-bold text-gray-800">OCOPA PERUANA</p>
              <div className="h-2 w-3/4 mx-auto mt-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            </div>
          </div>

          <div className="flex flex-col w-1/3 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-3 text-center">
              <p className="text-lg font-bold text-gray-800">AJÍ DE GALLINA</p>
              <div className="h-2 w-3/4 mx-auto mt-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
