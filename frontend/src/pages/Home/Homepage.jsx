import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import YapaLogo from '../../assets/logo.png';
import { getRecomendacionesDelDia, getAllRecipes } from '../../api/recipesApi';
import Trie from '../../utils/Trie';

function Homepage() {
  const primaryColor = "#F99F3F";
  const navigate = useNavigate();
  const [recomendaciones, setRecomendaciones] = useState([]);

  // Search & Autocomplete State
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const trieRef = useRef(new Trie());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch recomendaciones
        const recsData = await getRecomendacionesDelDia();
        setRecomendaciones(recsData);

        // 2. Fetch ALL recipes for autocomplete
        const allRecipes = await getAllRecipes();

        // 3. Sort by date_register ASC (Oldest first) to respect priority rule
        // Assuming date_register is ISO string. String comparison works for ISO.
        allRecipes.sort((a, b) => (a.date_register > b.date_register ? 1 : -1));

        // 4. Build Trie
        allRecipes.forEach(recipe => {
          if (recipe.title) {
            trieRef.current.insert(recipe.title);
          }
        });

      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val.length > 0) {
      const found = trieRef.current.search(val);
      // Only show suggestion if it starts with the input (case insensitive check just in case)
      if (found && found.toLowerCase().startsWith(val.toLowerCase()) && found.toLowerCase() !== val.toLowerCase()) {
        setSuggestion(found);
      } else {
        setSuggestion("");
      }
    } else {
      setSuggestion("");
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault();
      setSearchTerm(suggestion);
      setSuggestion("");
    }
    if (e.key === 'Enter') {
      handleVerRecetas();
    }
  };

  const handleVerRecetas = () => {
    // Navigate with search term if present
    if (searchTerm.trim()) {
      navigate(`/recetas?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/recetas");
    }
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
            onClick={() => navigate("/recetas")}
          >
            Ver Recetas
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4 w-full max-w-xl">
          <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden flex-grow bg-white">
            <svg
              className="w-5 h-5 text-gray-500 ml-3 z-10"
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

            <div className="relative w-full">
              {/* Ghost Text Input (Background) */}
              <input
                type="text"
                value={suggestion}
                readOnly
                className="absolute top-0 left-0 w-full py-1.5 pl-2 pr-4 focus:outline-none text-gray-400 bg-transparent pointer-events-none"
                style={{ zIndex: 0 }}
              />

              {/* Actual Input (Foreground) */}
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Busca por nombre de la receta o ingredientes"
                className="relative z-10 w-full py-1.5 pl-2 pr-4 focus:outline-none text-gray-700 placeholder-gray-500 bg-transparent"
              />
            </div>
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
