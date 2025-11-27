import { useNavigate } from "react-router-dom";
import YapaLogo from '../../assets/logo.png';

function Homepage() {
  const primaryColor = "#F99F3F";
  const navigate = useNavigate();

  const handleVerRecetas = () => {
    navigate("/recetas");
  };

  const handleConsultar = () => {
    navigate("/refri");
  };

  return (
    <div className="relative">

      <div className="absolute top-[0.5vw] left-[8vw] z-50">

        <div className="w-48 h-48 bg-orange-300 rounded-md shadow-md absolute top-0 left-0 -z-10"></div>

        <div
          className="w-48 h-48 bg-yellow-200 rounded-md shadow-lg relative"
          style={{ transform: "rotate(-5deg)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-gray-700 font-semibold text-center leading-snug">
              Buenos días, este<br />
              día es tuyo, no<br />
              permitas que nadie<br />
              te lo arruine
            </p>
          </div>

          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl">
            🍅
          </div>
        </div>
</div>




      <div className="flex flex-col items-center bg-white p-8 pt-0 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img src={YapaLogo} alt="Logo Yapa" className="w-[20vw] h-auto" />
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-3xl font-normal text-gray-800 tracking-wider">
            ¿QUÉ COCINO HOY?
          </h2>
          <button 
            className="px-6 py-1.5 text-white font-semibold rounded-lg shadow-md transition duration-150 hover:brightness-110 hover:shadow-lg cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            onClick={handleVerRecetas}
          >
            Ver Recetas
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4 w-full max-w-xl">
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
              className="py-1.5 pl-2 pr-4 w-full focus:outline-none text-gray-700 placeholder-gray-500 bg-white"
            />
          </div>
          <button 
            className="px-8 py-1.5 text-white font-semibold rounded-lg shadow-md transition duration-150 hover:brightness-110 hover:shadow-lg cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            onClick={handleVerRecetas} 
          >
            Buscar
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-10">
          <h3 className="text-xl font-normal tracking-wider text-red-700">
            ¿QUÉ TENGO EN MI REFRI?
          </h3>
          <button 
            className="px-6 py-1.5 text-white font-semibold rounded-lg shadow-md transition duration-150 hover:brightness-110 hover:shadow-lg cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            onClick={handleConsultar}
          >
            Consultar
          </button>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            RECOMENDACIONES DEL DÍA:
          </h2>
          <div className="flex justify-between space-x-8">
            <div className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative">
              <div className="h-[13vw] relative" style={{ backgroundColor: '#ff9a2e15' }}>
                <div
                  className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(249, 159, 63, 0.6)' }}
                >
                  <p className="text-black font-bold text-sm">COSTILLAR DORADO</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative">
              <div className="h-[13vw] relative" style={{ backgroundColor: '#ff9a2e15' }}>
                <div
                  className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(249, 159, 63, 0.6)' }}
                >
                  <p className="text-black font-bold text-sm">OCOPA PERUANA</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative">
              <div className="h-[13vw] relative" style={{ backgroundColor: '#ff9a2e15' }}>
                <div
                  className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(249, 159, 63, 0.6)' }}
                >
                  <p className="text-black font-bold text-sm">AJÍ DE GALLINA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Homepage;
