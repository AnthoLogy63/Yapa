import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getFavorites, removeFromFavorites } from "../../api/favoritesApi";

function FavoritosPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [filteredFavoritos, setFilteredFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (token) {
          const data = await getFavorites(token);
          console.log("Favoritos cargados:", data);
          setFavoritos(data);
          setFilteredFavoritos(data);
        }
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavoritos(favoritos);
    } else {
      const filtered = favoritos.filter(fav =>
        fav.recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavoritos(filtered);
    }
  }, [searchTerm, favoritos]);

  const handleRemove = async (favoriteId) => {
    try {
      await removeFromFavorites(favoriteId, token);
      setFavoritos(prev => prev.filter(f => f.id !== favoriteId));
      setFilteredFavoritos(prev => prev.filter(f => f.id !== favoriteId));
    } catch (error) {
      console.error("Error quitando de favoritos:", error);
      alert("Error al quitar de favoritos");
    }
  };

  const handleBuscar = () => {
    console.log("Buscar:", searchTerm);
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/recetas/${recipeId}`);
  };

  return (
    <div className="w-full bg-white px-45 py-7">
      {/* Título */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        MIS FAVORITOS
      </h2>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-3 mb-8 max-w-2xl">
        <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden flex-1">
          <svg className="w-5 h-5 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar entre mis Favoritos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 pl-2 pr-4 w-full focus:outline-none text-gray-700 placeholder-gray-500 bg-white"
          />
        </div>

        <button
          onClick={handleBuscar}
          className="px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:brightness-110 cursor-pointer transition"
          style={{ backgroundColor: '#F99F3F' }}
        >
          Buscar
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Cargando favoritos...</p>
        </div>
      )}

      {/* Lista de favoritos */}
      {!loading && filteredFavoritos.length > 0 && (
        <div className="space-y-6 max-w-4xl">
          {filteredFavoritos.map((fav) => (
            <div
              key={fav.id}
              className="w-full bg-[#FFF8E7] rounded-xl shadow-sm flex overflow-hidden transition transform hover:shadow-md cursor-pointer"
              style={{ border: '1px solid #F99F3F' }}
              onClick={() => handleViewRecipe(fav.recipe.id)}
            >
              {/* Imagen */}
              <div className="flex-shrink-0 w-[250px] h-[180px] bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                {fav.recipe.image ? (
                  <img src={fav.recipe.image} alt={fav.recipe.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {fav.recipe.title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {fav.recipe.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {fav.recipe.preparation_time} min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {fav.recipe.portions} porciones
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="flex flex-col justify-center bg-[#FFF8E7] relative w-[180px]">
                {/* Separador vertical */}
                <div className="absolute left-0 top-8 bottom-8 w-px bg-[#F99F3F]"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(fav.id);
                  }}
                  className="w-full h-full px-4 text-gray-800 font-medium hover:bg-red-100 transition cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <span>Quitar de</span>
                  <span>Favoritos</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay favoritos */}
      {!loading && favoritos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tienes recetas favoritas aún</p>
          <button
            onClick={() => navigate('/recetas')}
            className="mt-4 px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:brightness-110 cursor-pointer transition"
            style={{ backgroundColor: '#F99F3F' }}
          >
            Explorar recetas
          </button>
        </div>
      )}
    </div>
  );
}

export default FavoritosPage;