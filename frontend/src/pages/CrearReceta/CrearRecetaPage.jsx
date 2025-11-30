import React from 'react';
import { Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const InputField = ({ placeholder, value, onChange, width = 'full', type = 'text', className = '' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`
      p-3 bg-orange-50/70 border-b-2 border-orange-200 focus:outline-none
      focus:border-[#FFAF45] rounded-lg placeholder:text-gray-400
      ${width === 'full' ? 'w-full' : width} ${className}
    `}
  />
);

function CrearRecetaPage() {
  const { user, isLogged } = useAuth();

  // -------- IMAGE UPLOAD STATE --------
  const [previewImage, setPreviewImage] = React.useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  // ID counter
  const idRef = React.useRef(3);

  // ---------- ESTADOS ----------
  const [titulo, setTitulo] = React.useState("");
  const [comensales, setComensales] = React.useState("");
  const [tiempo, setTiempo] = React.useState("");

  // INGREDIENTES
  const [ingredientes, setIngredientes] = React.useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
  ]);

  const agregarIngrediente = () => {
    const newId = idRef.current++;
    setIngredientes(prev => [...prev, { id: newId, text: '' }]);
  };

  const eliminarIngrediente = (id) => {
    setIngredientes(prev => prev.filter(item => item.id !== id));
  };

  const actualizarIngrediente = (id, newText) => {
    setIngredientes(prev => prev.map(item => item.id === id ? { ...item, text: newText } : item));
  };

  // 🔥 FUNCIONALIDAD QUE PEDISTE: MOVER INGREDIENTES 🔥
  const moverIngrediente = (id, direction) => {
    setIngredientes(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      const newIndex = idx + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return arr;
    });
  };

  // PASOS
  const [pasos, setPasos] = React.useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
  ]);

  const agregarPaso = () => {
    const newId = idRef.current++;
    setPasos(prev => [...prev, { id: newId, text: '' }]);
  };

  const eliminarPaso = (id) => {
    setPasos(prev => prev.filter(p => p.id !== id));
  };

  const actualizarPaso = (id, newText) => {
    setPasos(prev => prev.map(p => p.id === id ? { ...p, text: newText } : p));
  };

  const moverPaso = (id, direction) => {
    setPasos(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const newIndex = idx + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return arr;
    });
  };

  const userAvatar =
    user?.picture ||
    user?.avatar ||
    (user?.name || user?.email
      ? `https://ui-avatars.com/api/?name=${user.name || user.email}&background=F99F3F&color=fff`
      : "https://ui-avatars.com/api/?name=User&background=F99F3F&color=fff"
    );

  return (
    <div className="min-h-[80%] bg-white p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_3.2fr] gap-8 mb-10">

          {/* ---------- IMAGE UPLOAD BOX ---------- */}
          <div className="space-y-6 min-h-[280px] relative">

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUploadInput"
            />

            <label
              htmlFor="imageUploadInput"
              className="bg-orange-50/70 h-70 flex items-center justify-center text-2xl 
                font-semibold text-orange-800 border-2 border-dashed border-orange-300 
                rounded-lg cursor-pointer hover:border-[#FFAF45] overflow-hidden"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                "Agregar Imagen"
              )}
            </label>
          </div>

          {/* ---------- RIGHT SIDE ---------- */}
          <div className="space-y-6">
            <InputField
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="text-2xl font-bold"
            />

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={userAvatar} alt={user?.name || "Autor"} className="object-cover w-full h-full" />
              </div>
              <span className="text-gray-700 font-medium">
                {isLogged ? (user?.name || user?.email) : "Usuario Invitado"}
              </span>
            </div>

            <textarea
              placeholder="Descripción"
              rows="3"
              className="w-full p-3 bg-orange-50/70 border-b-2 border-orange-200 
              focus:outline-none focus:border-[#FFAF45] rounded-lg resize-none 
              placeholder:text-gray-400"
            ></textarea>
          </div>
        </div>

        {/* INGREDIENTES */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_3.2fr] gap-8">

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Ingredientes</h2>

            <div className="flex items-center justify-between pr-6">
              <label className="text-gray-700 font-medium">N° Comensales:</label>
              <InputField
                type="text"
                width="w-32"
                placeholder="Ej: 2 personas"
                value={comensales}
                onChange={(e) => setComensales(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {ingredientes.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">

                  {/* 🔥 CONTROLES DE MOVER INGREDIENTES 🔥 */}
                  <div className="flex flex-col text-gray-400">
                    <button onClick={() => moverIngrediente(item.id, -1)}>
                      <ChevronUp size={18} className="hover:text-[#FFAF45] cursor-pointer" />
                    </button>

                    <button onClick={() => moverIngrediente(item.id, 1)}>
                      <ChevronDown size={18} className="hover:text-[#FFAF45] cursor-pointer" />
                    </button>
                  </div>

                  <InputField
                    placeholder="Ingrediente"
                    value={item.text}
                    onChange={(e) => actualizarIngrediente(item.id, e.target.value)}
                  />

                  <button
                    onClick={() => eliminarIngrediente(item.id)}
                    className="p-2"
                    aria-label={`Eliminar ingrediente`}
                  >
                    <Trash2 size={20} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                  </button>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={agregarIngrediente}
                  className="flex items-center text-gray-700 hover:text-[#FFAF45] hover:font-bold cursor-pointer"
                >
                  <Plus size={18} className="mr-1" /> Ingrediente
                </button>
              </div>
            </div>
          </div>

          {/* PROCEDIMIENTO */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Procedimiento</h2>

            <div className="flex items-center gap-4 pr-6">
              <label className="text-gray-700 font-medium">Tiempo:</label>
              <InputField
                placeholder="Ej: 1h 30min"
                width="w-32"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {pasos.map((p) => (
                <div key={p.id} className="flex items-start space-x-2">

                  <div className="flex flex-col text-gray-400 mt-2">
                    <button
                      onClick={() => moverPaso(p.id, -1)}
                      className="p-1"
                      aria-label="Mover paso arriba"
                    >
                      <ChevronUp size={18} className="hover:text-[#FFAF45] cursor-pointer" />
                    </button>
                    <button
                      onClick={() => moverPaso(p.id, 1)}
                      className="p-1"
                      aria-label="Mover paso abajo"
                    >
                      <ChevronDown size={18} className="hover:text-[#FFAF45] cursor-pointer" />
                    </button>
                  </div>

                  <textarea
                    placeholder="Descripción"
                    rows="2"
                    value={p.text}
                    onChange={(e) => actualizarPaso(p.id, e.target.value)}
                    className="flex-grow p-3 bg-orange-50/70 border-b-2 border-orange-200 
                    focus:outline-none focus:border-[#FFAF45] rounded-lg resize-none 
                    placeholder:text-gray-400"
                  ></textarea>

                  <button
                    onClick={() => eliminarPaso(p.id)}
                    className="p-2 mt-2"
                    aria-label="Eliminar paso"
                  >
                    <Trash2 size={20} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                  </button>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={agregarPaso}
                  className="flex items-center text-gray-700 hover:text-[#FFAF45] hover:font-bold cursor-pointer"
                >
                  <Plus size={18} className="mr-1" /> Agregar Paso
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CrearRecetaPage;
