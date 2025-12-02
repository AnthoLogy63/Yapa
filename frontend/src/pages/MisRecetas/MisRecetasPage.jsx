import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MisRecetasPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo - reemplazar con datos reales del backend
  const misRecetas = [
    {
      id: 1,
      titulo: "COSTILLAR DORADO",
      descripcion: "El Costillar Dorado son costillas asadas con glaseado dorado, sabor intenso y jugosas, ideales para compartir y disfrutar en cualquier ocasión.",
      tiempo: "30 minutos",
      porciones: 2,
      imagen: null
    },
    {
      id: 2,
      titulo: "COSTILLAR DORADO",
      descripcion: "El Costillar Dorado son costillas asadas con glaseado dorado, sabor intenso y jugosas, ideales para compartir y disfrutar en cualquier ocasión.",
      tiempo: "30 minutos",
      porciones: 2,
      imagen: null
    },
    {
      id: 3,
      titulo: "COSTILLAR DORADO",
      descripcion: "El Costillar Dorado son costillas asadas con glaseado dorado, sabor intenso y jugosas, ideales para compartir y disfrutar en cualquier ocasión.",
      tiempo: "30 minutos",
      porciones: 2,
      imagen: null
    }
  ];

  const handleEdit = (id) => {
    navigate(`/editar-receta/${id}`);
  };

  const handleDelete = (id) => {
    // Implementar lógica de eliminación
    console.log("Eliminar receta:", id);
  };

  const handleBuscar = () => {
    // Implementar lógica de búsqueda
    console.log("Buscar:", searchTerm);
  };

  return (
    <div className="w-full bg-white px-45 py-7">
      {/* Título */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        MIS RECETAS
      </h2>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-3 mb-8 max-w-2xl">
        <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden flex-1">
          <svg className="w-5 h-5 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar entre mis Recetas"
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

      {/* Lista de recetas */}
      <div className="space-y-6 max-w-4xl">
        {misRecetas.map((receta) => (
          <div
            key={receta.id}
            className="w-full bg-[#FFF8E7] rounded-xl shadow-sm flex overflow-hidden transition transform hover:shadow-md"
            style={{ border: '1px solid rgb(200,200,200)' }}
          >
            {/* Imagen */}
            <div className="flex-shrink-0 w-[250px] h-[180px] bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
              {receta.imagen ? (
                <img src={receta.imagen} alt={receta.titulo} className="w-full h-full object-cover" />
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
                  {receta.titulo}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {receta.descripcion}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {receta.tiempo}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {receta.porciones} porciones
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col bg-[#FFF8E7]" style={{ borderLeft: '1px solid #C8C8C8' }}>
              <button
                onClick={() => handleEdit(receta.id)}
                className="flex-1 px-8 py-4 text-gray-800 font-medium hover:bg-orange-50 transition cursor-pointer flex items-center justify-center"
              >
                Editar
              </button>
              <div className="h-px bg-gray-300 mx-4"></div>
              <button
                onClick={() => handleDelete(receta.id)}
                className="flex-1 px-8 py-4 text-gray-800 font-medium hover:bg-orange-50 transition cursor-pointer flex items-center justify-center"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay recetas */}
      {misRecetas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tienes recetas guardadas aún</p>
          <button
            onClick={() => navigate('/crear-receta')}
            className="mt-4 px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:brightness-110 cursor-pointer transition"
            style={{ backgroundColor: '#F99F3F' }}
          >
            Crear tu primera receta
          </button>
        </div>
      )}
    </div>
  );
}

export default MisRecetasPage;