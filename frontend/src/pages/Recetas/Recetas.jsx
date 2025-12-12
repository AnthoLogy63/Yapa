import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllRecipes } from "../../api/recipesApi";

function RecetasPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ingCon, setIngCon] = useState("");
  const [listCon, setListCon] = useState([]);

  const [ingSin, setIngSin] = useState("");
  const [listSin, setListSin] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getAllRecipes(searchTerm);
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
  }, [searchTerm]);

  const agregarCon = () => {
    if (ingCon.trim() === "") return;
    setListCon([...listCon, ingCon.trim()]);
    setIngCon("");
  };

  const eliminarCon = (item) => {
    setListCon(listCon.filter((i) => i !== item));
  };

  const agregarSin = () => {
    if (ingSin.trim() === "") return;
    setListSin([...listSin, ingSin.trim()]);
    setIngSin("");
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
                transition transform hover:scale-[1.01] active:scale-[0.98]"
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

                  <p className="text-gray-700 text-base mt-1 leading-snug min-h-22 line-clamp-3">
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
            <input
              type="text"
              value={ingCon}
              onChange={(e) => setIngCon(e.target.value)}
              placeholder="Introduce Ingredientes"
              className="border border-gray-1000 rounded-md px-3 py-2 w-full text-gray-700/70"

            />

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
            <input
              type="text"
              value={ingSin}
              onChange={(e) => setIngSin(e.target.value)}
              placeholder="Introduce Ingredientes"
              className="border border-gray-1000 rounded-md px-3 py-2 w-full text-gray-700/70"

            />

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

        <div className="flex items-center gap-3 mt-2 pr-[20%]">
          <span className="text-[#93630A] text-base font-medium leading-tight">
            Consulta las recetas según lo que tienes en tu refri
          </span>
          <button
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
