import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import YapaLogo from '../../assets/logo.png';
import { getRecomendacionesDelDia } from '../../api/recipesApi';

// Array de frases inspiradoras
const FRASES_DEL_DIA = [
  "Cocinar es una forma de decir te quiero sin palabras.",
  "En cada receta hay un poco de amor.",
  "La mejor comida es la que se hace con cariño.",
  "Donde hay comida casera, hay hogar.",
  "Hoy cocinas más que alimentos: cocinas momentos.",
  "El secreto de una buena receta siempre es el amor.",
  "Cocinar para otros es un acto de generosidad.",
  "La cocina es el corazón de la casa.",
  "Con paciencia y sazón, todo sale mejor.",
  "No es solo comida, es cuidado.",
  "Una mamá en la cocina crea recuerdos eternos.",
  "Cada plato tiene su historia.",
  "Cocinar también es una forma de abrazar.",
  "El mejor ingrediente siempre es el amor.",
  "Cocinar calma, une y alegra.",
  "Hoy tu comida alimenta cuerpo y alma.",
  "La magia comienza cuando prendes la cocina.",
  "No hay receta perfecta, solo hecha con cariño.",
  "Cocinar es transformar ingredientes en felicidad.",
  "En la cocina se mezclan sabores y emociones.",
  "Una comida casera siempre sabe mejor.",
  "Cocinar es un arte que nace del corazón.",
  "La paciencia es el mejor condimento.",
  "Cada plato es una muestra de cuidado.",
  "Cocinar es pensar en los demás.",
  "En cada olla hay dedicación.",
  "La cocina también es un lugar de amor.",
  "Cocinar es crear momentos que se recuerdan.",
  "No importa el menú, importa la intención.",
  "Cocinar es un gesto diario de amor.",
  "Una madre cocina con el corazón.",
  "La mejor receta es la que une a la familia.",
  "Cocinar es una forma de agradecer.",
  "Donde hay comida hecha en casa, hay calor humano.",
  "Cocinar también es cuidarte a ti.",
  "Cada plato cuenta una historia de hogar.",
  "Cocinar es regalar tiempo.",
  "El amor se nota en el sabor.",
  "Cocinar es una muestra silenciosa de amor.",
  "La cocina guarda los mejores recuerdos.",
  "Un plato hecho con cariño siempre reconforta.",
  "Cocinar es crear bienestar.",
  "En la cocina se siembra amor todos los días.",
  "Cocinar es un acto de paciencia y dedicación.",
  "El hogar se siente en la comida.",
  "Cocinar es pensar en quienes amas.",
  "Cada receta es una oportunidad de dar amor.",
  "La comida hecha en casa tiene alma.",
  "Hoy, como siempre, cocina con amor ❤️"
];

// Función para obtener una frase aleatoria
const obtenerFraseAleatoria = () => {
  const indiceAleatorio = Math.floor(Math.random() * FRASES_DEL_DIA.length);
  return FRASES_DEL_DIA[indiceAleatorio];
};

function Homepage() {
  const primaryColor = "#F99F3F";
  const navigate = useNavigate();
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [fraseDelDia, setFraseDelDia] = useState(() => obtenerFraseAleatoria());

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      try {
        const data = await getRecomendacionesDelDia();
        setRecomendaciones(data);
      } catch (error) {
        console.error('Error cargando recomendaciones:', error);
      }
    };

    fetchRecomendaciones();
  }, []);

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
            <p className="text-gray-700 font-semibold text-center leading-snug text-sm">
              {fraseDelDia}
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
            {recomendaciones.length > 0 ? (
              recomendaciones.map((receta) => (
                <div
                  key={receta.id}
                  className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative"
                  onClick={() => navigate(`/recetas/${receta.id}`)}
                >
                  <div className="h-[13vw] relative bg-gray-100">
                    {receta.image ? (
                      <img
                        src={receta.image}
                        alt={receta.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                        <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div
                      className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(249, 159, 63, 0.9)' }}
                    >
                      <p className="text-white font-bold text-sm shadow-sm">{receta.title.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative">
                  <div className="h-[13vw] relative" style={{ backgroundColor: '#ff9a2e15' }}>
                    <div
                      className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(249, 159, 63, 0.6)' }}
                    >
                      <p className="text-black font-bold text-sm">CARGANDO...</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative">
                  <div className="h-[13vw] relative" style={{ backgroundColor: '#ff9a2e15' }}>
                    <div
                      className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(249, 159, 63, 0.6)' }}
                    >
                      <p className="text-black font-bold text-sm">CARGANDO...</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-100 shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition cursor-pointer relative">
                  <div className="h-[13vw] relative" style={{ backgroundColor: '#ff9a2e15' }}>
                    <div
                      className="absolute bottom-[5%] left-[5%] px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(249, 159, 63, 0.6)' }}
                    >
                      <p className="text-black font-bold text-sm">CARGANDO...</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Homepage;
