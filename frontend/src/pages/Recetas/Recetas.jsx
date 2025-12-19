import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllRecipes } from "../../api/recipesApi";
import Trie from "../../utils/Trie";
import { useAuth } from "../../context/AuthContext";
import { getPantryIngredients } from "../../api/pantryApi";

function RecetasPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");
  const { token, isLogged } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ingCon, setIngCon] = useState("");
  const [listCon, setListCon] = useState([]);

  // ... rest of state ...
  const [ingSin, setIngSin] = useState("");
  const [listSin, setListSin] = useState([]);

  const [showDificultad, setShowDificultad] = useState(false);
  const [showTiempo, setShowTiempo] = useState(false);
  const [showPorciones, setShowPorciones] = useState(false);

  const [selectedDificultad, setSelectedDificultad] = useState("");
  const [selectedTiempo, setSelectedTiempo] = useState("");
  const [selectedPorciones, setSelectedPorciones] = useState("");

  // Autocomplete State
  const [suggestionCon, setSuggestionCon] = useState("");
  const [suggestionSin, setSuggestionSin] = useState("");
  const ingredientsTrieRef = useRef(new Trie());

  // ... useEffects ...

  // Handler for "Consultar" button
  const handleConsultarRefri = async () => {
    if (!isLogged || !token) {
      alert("Debes iniciar sesión para consultar tu refri.");
      return;
    }

    try {
      const pantryItems = await getPantryIngredients(token);
      if (pantryItems && Array.isArray(pantryItems)) {
        const ingredientNames = pantryItems.map(item => item.ingredient.name);
        // Avoid duplicates and add to listCon
        const uniqueNames = [...new Set([...listCon, ...ingredientNames])];
        setListCon(uniqueNames);
      }
    } catch (error) {
      console.error("Error consultando el refri:", error);
    }
  };

  // ... existing handlers ...

  // Load Ingredients for Trie (Once)
  useEffect(() => {
    const fetchAllForAutocomplete = async () => {
      try {
        const allData = await getAllRecipes(); // Fetch ALL without filters
        ingredientsTrieRef.current = new Trie();

        allData.forEach(recipe => {
          // Handle 'ingredients' (list of strings - legacy or simple)
          if (Array.isArray(recipe.ingredients)) {
            recipe.ingredients.forEach(ing => {
              if (typeof ing === 'string') ingredientsTrieRef.current.insert(ing);
            });
          }
          // Handle 'recipe_ingredients' (nested objects - standard)
          if (Array.isArray(recipe.recipe_ingredients)) {
            recipe.recipe_ingredients.forEach(ri => {
              if (ri.ingredient && ri.ingredient.name) {
                ingredientsTrieRef.current.insert(ri.ingredient.name);
              }
            });
          }
        });
      } catch (err) {
        console.error("Error loading ingredients for autocomplete:", err);
      }
    };
    fetchAllForAutocomplete();
  }, []);

  // Parse 'with_ingredients' query param on load
  useEffect(() => {
    const withIngParam = searchParams.get("with_ingredients");
    if (withIngParam) {
      const ingredients = withIngParam.split(",");
      setListCon(prev => {
        const unique = [...new Set([...prev, ...ingredients])];
        return unique;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getAllRecipes(
          searchTerm,
          listCon,
          listSin,
          selectedDificultad,
          selectedTiempo,
          selectedPorciones
        );
        setRecipes(data);
        if (searchTerm) {
          console.log("Busqueda exitosa");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchTerm, listCon, listSin, selectedDificultad, selectedTiempo, selectedPorciones]);

  const handleIngConChange = (e) => {
    const val = e.target.value;
    setIngCon(val);

    if (val.length > 0) {
      const found = ingredientsTrieRef.current.search(val);
      if (found && found.toLowerCase().startsWith(val.toLowerCase()) && found.toLowerCase() !== val.toLowerCase()) {
        setSuggestionCon(found);
      } else {
        setSuggestionCon("");
      }
    } else {
      setSuggestionCon("");
    }
  };

  const handleIngConKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestionCon) {
      e.preventDefault();
      setIngCon(suggestionCon);
      setSuggestionCon("");
    }
    if (e.key === 'Enter') {
      agregarCon();
    }
  };

  const agregarCon = () => {
    if (ingCon.trim() === "") return;
    setListCon([...listCon, ingCon.trim()]);
    setIngCon("");
    setSuggestionCon("");
  };

  const eliminarCon = (item) => {
    setListCon(listCon.filter((i) => i !== item));
  };

  const handleIngSinChange = (e) => {
    const val = e.target.value;
    setIngSin(val);

    if (val.length > 0) {
      const found = ingredientsTrieRef.current.search(val);
      if (found && found.toLowerCase().startsWith(val.toLowerCase()) && found.toLowerCase() !== val.toLowerCase()) {
        setSuggestionSin(found);
      } else {
        setSuggestionSin("");
      }
    } else {
      setSuggestionSin("");
    }
  };

  const handleIngSinKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestionSin) {
      e.preventDefault();
      setIngSin(suggestionSin);
      setSuggestionSin("");
    }
    if (e.key === 'Enter') {
      agregarSin();
    }
  };

  const agregarSin = () => {
    if (ingSin.trim() === "") return;
    setListSin([...listSin, ingSin.trim()]);
    setIngSin("");
    setSuggestionSin("");
  };

  const eliminarSin = (item) => {
    setListSin(listSin.filter((i) => i !== item));
  };

  return (
    <div className="w-full bg-white px-20 py-7 grid grid-cols-3 gap-8 pr-30">

      <div className="col-span-2 flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 top-0 bg-white py-2 pl-2 z-10">
          {searchTerm ? `Resultados para: "${searchTerm}"` : "Todas las Recetas"}
        </h2>

        <div
          className="space-y-6 overflow-y-auto pr-4 pt-1 pl-2 mr-8 "
          style={{ maxHeight: "70vh" }}
        >
          {loading ? (
            <p className="text-gray-500">Cargando recetas...</p>
          ) : recipes.length === 0 ? (
            <p className="text-gray-500">No se encontraron recetas.</p>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recetas/${recipe.id}`)}
                className="w-full bg-[rgba(255,223,88,0.1)] border-[1px] border-[rgb(200,200,200)] rounded-xl shadow p-0 flex gap-0 cursor-pointer 
                transition transform hover:scale-[1.01] active:scale-[0.98] h-52"
              >
                <div className="flex-shrink-0 w-[35%] max-w-70 rounded-l-xl overflow-hidden">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                      <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-col p-4 w-full">
                  <h3 className="font-bold text-lg uppercase">{recipe.title}</h3>

                  <p className="text-gray-700 text-base mt-1 leading-snug min-h-22 line-clamp-4">
                    {recipe.description}
                  </p>

                  <div className="flex items-center gap-6 mt-3 text-lg text-gray-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{recipe.preparation_time} minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{recipe.portions} porciones</span>
                    </div>

                    {/* DIFICULTAD CON BARRAS */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-end gap-0.5 h-5">
                        <div className={`w-1 ${recipe.difficulty === 'Fácil' || recipe.difficulty === 'Media' || recipe.difficulty === 'Difícil'
                          ? 'bg-gray-700 h-2'
                          : 'bg-gray-300 h-2'
                          }`}></div>

                        <div className={`w-1 ${recipe.difficulty === 'Media' || recipe.difficulty === 'Difícil'
                          ? 'bg-gray-700 h-3.5'
                          : 'bg-gray-300 h-3.5'
                          }`}></div>

                        <div className={`w-1 ${recipe.difficulty === 'Difícil'
                          ? 'bg-gray-700 h-5'
                          : 'bg-gray-300 h-5'
                          }`}></div>
                      </div>
                      <span>{recipe.difficulty || 'Media'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SISTEMA DE FILTRADO */}
      <div className="mt-[3vw] h-fit flex flex-col bg-white">
        <h3 className="text-xl font-semibold mb-4">Sistema de Filtrado</h3>

        {/* RECETAS CON */}
        <div className="mb-6">
          <p className="font-medium mb-1">Recetas con:</p>

          <div className="flex items-center gap-3">
            <div className="relative w-full">
              {/* Ghost Input */}
              <input
                type="text"
                value={suggestionCon && ingCon ? ingCon + suggestionCon.slice(ingCon.length) : ""}
                readOnly
                className="absolute top-0 left-0 w-full border border-transparent rounded-md px-3 py-2 text-gray-400 pointer-events-none bg-transparent"
                style={{ zIndex: 0 }}
              />
              {/* Real Input */}
              <input
                type="text"
                value={ingCon}
                onChange={handleIngConChange}
                onKeyDown={handleIngConKeyDown}
                placeholder="Introduce Ingredientes"
                className="relative z-10 border border-gray-1000 rounded-md px-3 py-2 w-full text-gray-700/70 bg-transparent focus:outline-none"
              />
            </div>

            <button
              onClick={agregarCon}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
            >
              Agregar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {listCon.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm">
                <span className="text-sm">{item}</span>

                <button
                  onClick={() => eliminarCon(item)}
                  className="text-black text-base leading-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RECETAS SIN */}
        <div className="mb-6">
          <p className="font-medium mb-1">Recetas sin:</p>

          <div className="flex items-center gap-3">
            <div className="relative w-full">
              {/* Ghost Input */}
              <input
                type="text"
                value={suggestionSin && ingSin ? ingSin + suggestionSin.slice(ingSin.length) : ""}
                readOnly
                className="absolute top-0 left-0 w-full border border-transparent rounded-md px-3 py-2 text-gray-400 pointer-events-none bg-transparent"
                style={{ zIndex: 0 }}
              />
              {/* Real Input */}
              <input
                type="text"
                value={ingSin}
                onChange={handleIngSinChange}
                onKeyDown={handleIngSinKeyDown}
                placeholder="Introduce Ingredientes"
                className="relative z-10 border border-gray-1000 rounded-md px-3 py-2 w-full text-gray-700/70 bg-transparent focus:outline-none"
              />
            </div>

            {/* BOTÓN NEGRO COMO ANTES */}
            <button
              onClick={agregarSin}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
            >
              Agregar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {listSin.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm">
                <span className="text-sm">{item}</span>

                {/* ICONO ✕ */}
                <button
                  onClick={() => eliminarSin(item)}
                  className="text-black text-base leading-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FILTROS CON DROPDOWNS */}
        <div className="mb-6">
          <h4 className="font-medium text-lg mb-3">Filtros adicionales:</h4>

          <div className="flex gap-2">

            {/* DIFICULTAD */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDificultad(!showDificultad);
                  setShowTiempo(false);
                  setShowPorciones(false);
                }}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:border-[#F99F3F] cursor-pointer flex items-center gap-2 min-w-[120px]"
              >
                <div className="flex items-end gap-0.5 h-3.5">
                  <div className="w-0.5 bg-gray-700 h-1.5"></div>
                  <div className="w-0.5 bg-gray-700 h-2.5"></div>
                  <div className="w-0.5 bg-gray-700 h-3.5"></div>
                </div>
                <span className="truncate">{selectedDificultad || "Dificultad"}</span>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDificultad && (
                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full">
                  <div
                    onClick={() => {
                      setSelectedDificultad("");
                      setShowDificultad(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer text-gray-400"
                  >
                    Todas
                  </div>
                  <div
                    onClick={() => {
                      setSelectedDificultad("Fácil");
                      setShowDificultad(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Fácil
                  </div>
                  <div
                    onClick={() => {
                      setSelectedDificultad("Media");
                      setShowDificultad(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Media
                  </div>
                  <div
                    onClick={() => {
                      setSelectedDificultad("Difícil");
                      setShowDificultad(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Difícil
                  </div>
                </div>
              )}
            </div>

            {/* TIEMPO */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTiempo(!showTiempo);
                  setShowDificultad(false);
                  setShowPorciones(false);
                }}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:border-[#F99F3F] cursor-pointer flex items-center gap-2 min-w-[140px]"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{selectedTiempo ? selectedTiempo.replace("0-30", "≤ 30 min").replace("30-60", "30-60 min").replace("60-120", "1-2 h").replace("120+", "> 2 h") : "Preparación"}</span>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showTiempo && (
                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 whitespace-nowrap">
                  <div
                    onClick={() => {
                      setSelectedTiempo("");
                      setShowTiempo(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer text-gray-400"
                  >
                    Cualquiera
                  </div>
                  <div
                    onClick={() => {
                      setSelectedTiempo("0-30");
                      setShowTiempo(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Hasta 30 min
                  </div>
                  <div
                    onClick={() => {
                      setSelectedTiempo("30-60");
                      setShowTiempo(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    30 min - 1 h
                  </div>
                  <div
                    onClick={() => {
                      setSelectedTiempo("60-120");
                      setShowTiempo(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    1 - 2 horas
                  </div>
                  <div
                    onClick={() => {
                      setSelectedTiempo("120+");
                      setShowTiempo(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Más de 2 h
                  </div>
                </div>
              )}
            </div>

            {/* PORCIONES */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPorciones(!showPorciones);
                  setShowDificultad(false);
                  setShowTiempo(false);
                }}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:border-[#F99F3F] cursor-pointer flex items-center gap-2 min-w-[120px]"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{selectedPorciones || "Porciones"}</span>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPorciones && (
                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div
                    onClick={() => {
                      setSelectedPorciones("");
                      setShowPorciones(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer text-gray-400"
                  >
                    Todas
                  </div>
                  <div
                    onClick={() => {
                      setSelectedPorciones("1");
                      setShowPorciones(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    1 porción
                  </div>
                  <div
                    onClick={() => {
                      setSelectedPorciones("2");
                      setShowPorciones(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    2 porciones
                  </div>
                  <div
                    onClick={() => {
                      setSelectedPorciones("3");
                      setShowPorciones(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    3 porciones
                  </div>
                  <div
                    onClick={() => {
                      setSelectedPorciones("4");
                      setShowPorciones(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    4 porciones
                  </div>
                  <div
                    onClick={() => {
                      setSelectedPorciones("5+");
                      setShowPorciones(false);
                    }}
                    className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    5+ porciones
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 pr-[20%]">
          <span className="text-[#93630A] text-base font-medium leading-tight">
            Consulta las recetas según lo que tienes en tu refri
          </span>
          <button
            onClick={handleConsultarRefri}
            className="flex items-center justify-center px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:brightness-110 cursor-pointer"
            style={{ backgroundColor: "#F99F3F" }}
          >
            Consultar
          </button>
        </div>
      </div>

    </div>
  );
}

export default RecetasPage;
