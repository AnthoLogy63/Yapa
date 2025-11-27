import { useNavigate } from "react-router-dom";

function RecetasPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white px-20 py-7 grid grid-cols-3 gap-20">

      <div className="col-span-2 flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 top-0 bg-white py-2 z-10">
          Palabra Buscada
        </h2>

        <div
          className="space-y-6 overflow-y-auto pr-4"
          style={{ maxHeight: "70vh" }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              onClick={() => navigate(`/recetas/${item}`)}
              className="w-full bg-orange-100 rounded-xl shadow p-0 flex gap-0 cursor-pointer 
                         transition transform hover:scale-[1.01] active:scale-[0.98]"
            >
              {/* IMAGEN OCUPA TODO EL LADO IZQUIERDO SIN MÁRGENES */}
              <div className="flex-shrink-0 w-48 h-32 rounded-l-xl overflow-hidden">
                <div className="w-full h-full bg-red-300"></div>
              </div>

              {/* CONTENIDO */}
              <div className="flex flex-col p-4">
                <h3 className="font-bold text-lg">COSTILLAR DORADO</h3>

                <p className="text-gray-700 text-base mt-1 leading-snug">
                  Un jugoso costillar dorado al horno con especias seleccionadas,
                  acompañado de papas rústicas y un toque de hierbas frescas.
                  Ideal para una cena especial, con un aroma que llena toda la casa
                  y una textura suave por dentro pero crocante por fuera.
                </p>

                <div className="flex items-center gap-6 mt-3 text-sm text-gray-700">
                  <span>⏱ 30 minutos</span>
                  <span>👤 2 porciones</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SISTEMA DE FILTRADO */}
      <div className="mt-[3vw] h-fit flex flex-col bg-white">
        <h3 className="text-xl font-semibold mb-4">Sistema de Filtrado</h3>

        <div className="mb-6">
          <p className="font-medium mb-1">Recetas con:</p>
          <input
            type="text"
            placeholder="Introduce Ingredientes"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <div className="mb-6">
          <p className="font-medium mb-1">Recetas sin:</p>
          <input
            type="text"
            placeholder="Introduce Ingredientes"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg">
          Consultar
        </button>
      </div>

    </div>
  );
}

export default RecetasPage;
