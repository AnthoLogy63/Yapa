import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecetasPage() {
  const navigate = useNavigate();

  const [ingCon, setIngCon] = useState("");
  const [listCon, setListCon] = useState([]);

  const [ingSin, setIngSin] = useState("");
  const [listSin, setListSin] = useState([]);

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
          Palabra Buscada
        </h2>

        <div
          className="space-y-6 overflow-y-auto pr-4 pt-1 pl-2 mr-8 "
          style={{ maxHeight: "70vh" }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              onClick={() => navigate(`/recetas/${item}`)}
              className="w-full bg-[rgba(255,223,88,0.1)] border-[1px] border-[rgb(200,200,200)] rounded-xl shadow p-0 flex gap-0 cursor-pointer 
              transition transform hover:scale-[1.01] active:scale-[0.98]"


            >
              <div className="flex-shrink-0 w-[35%] max-w-70 rounded-l-xl overflow-hidden">
                <div className="w-full h-full bg-red-300"></div>
              </div>

              <div className="flex flex-col p-4">
                <h3 className="font-bold text-lg">COSTILLAR DORADO</h3>

                <p className="text-gray-700 text-base mt-1 leading-snug min-h-22">
                  Un jugoso costillar dorado al horno con especias seleccionadas,
                  acompañado de papas rústicas y un toque de hierbas frescas.
                  Ideal para una cena especial, con un aroma que llena toda la casa
                  y una textura suave por dentro pero crocante por fuera.
                </p>

                <div className="flex items-center gap-6 mt-3 text-lg text-gray-700">
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
