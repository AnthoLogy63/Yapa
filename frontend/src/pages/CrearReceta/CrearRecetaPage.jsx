import React from 'react';
import { Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import ConfirmacionSalida from '../../components/modals/ConfirmacionSalida';
import { createRecipe } from '../../api/recipesApi';

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
  const { user, isLogged, token } = useAuth();
  const navigate = useNavigate();

  // -------- MODAL DE CONFIRMACIÓN --------
  const [showExitModal, setShowExitModal] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState(null);

  // -------- IMAGE UPLOAD STATE --------
  const [previewImage, setPreviewImage] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setImageFile(file);
    markAsChanged();
  };

  // ID counter
  const idRef = React.useRef(3);

  // ---------- ESTADOS ----------
  const [titulo, setTitulo] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [comensales, setComensales] = React.useState("");
  const [tiempo, setTiempo] = React.useState("");
  const [dificultad, setDificultad] = React.useState("");
  const [categoria, setCategoria] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // INGREDIENTES
  const [ingredientes, setIngredientes] = React.useState([
    { id: 1, cantidad: '', unidad: '', text: '' },
    { id: 2, cantidad: '', unidad: '', text: '' },
  ]);

  const agregarIngrediente = () => {
    const newId = idRef.current++;
    setIngredientes(prev => [...prev, { id: newId, cantidad: '', unidad: '', text: '' }]);
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

  // -------- DETECCI\u00d3N DE CAMBIOS --------
  const markAsChanged = () => setHasChanges(true);

  // -------- REGISTRAR FUNCI\u00d3N GLOBAL PARA NAVBAR --------
  React.useEffect(() => {
    // Funci\u00f3n que el Navbar puede llamar antes de navegar
    window.checkUnsavedChanges = (navigateFn) => {
      if (hasChanges) {
        // Guardar la funci\u00f3n de navegaci\u00f3n pendiente
        setPendingNavigation(() => navigateFn);
        setShowExitModal(true);
        return false; // Indica que hay cambios no guardados
      }
      return true; // No hay cambios, puede navegar
    };

    // Limpiar al desmontar
    return () => {
      delete window.checkUnsavedChanges;
    };
  }, [hasChanges]);

  // Advertencia al cerrar pesta\u00f1a
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Manejar confirmaci\u00f3n de salida
  const handleConfirmExit = () => {
    setHasChanges(false);
    setShowExitModal(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  // Manejar cancelaci\u00f3n
  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  // Función para guardar la receta
  const handleGuardarReceta = async () => {
    // Validaciones
    if (!titulo.trim()) {
      alert('Por favor ingresa un título para la receta');
      return;
    }
    if (!tiempo || isNaN(parseInt(tiempo))) {
      alert('Por favor ingresa un tiempo de preparación válido en minutos');
      return;
    }
    if (!comensales || isNaN(parseInt(comensales))) {
      alert('Por favor ingresa el número de comensales');
      return;
    }

    if (!isLogged) {
      alert('Debes iniciar sesión para crear una receta');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!token) {
        alert('No se encontró el token de autenticación. Por favor inicia sesión nuevamente.');
        setIsSubmitting(false);
        return;
      }

      const recipeData = {
        title: titulo.trim(),
        description: descripcion.trim(),
        preparation_time: parseInt(tiempo),
        difficulty: dificultad,
        portions: parseInt(comensales),
        category: categoria || null,
        image: imageFile,
        ingredients: ingredientes.map(i => i.text).filter(t => t.trim() !== ''),
        steps: pasos.map(p => p.text).filter(t => t.trim() !== ''),
      };

      const response = await createRecipe(recipeData, token);

      alert('¡Receta creada exitosamente!');
      setHasChanges(false);

      // Redirigir a la página de detalle de la receta o a mis recetas
      navigate(`/recetas/${response.id}`);

    } catch (error) {
      console.error('Error al crear la receta:', error);
      alert('Hubo un error al crear la receta. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
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
              onChange={(e) => { setTitulo(e.target.value); markAsChanged(); }}
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
              value={descripcion}
              onChange={(e) => { setDescripcion(e.target.value); markAsChanged(); }}
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

                  {/* CONTROLES DE MOVER INGREDIENTES */}
                  <div className="flex flex-col text-gray-400">
                    <button onClick={() => moverIngrediente(item.id, -1)}>
                      <ChevronUp size={18} className="hover:text-[#FFAF45] cursor-pointer" />
                    </button>

                    <button onClick={() => moverIngrediente(item.id, 1)}>
                      <ChevronDown size={18} className="hover:text-[#FFAF45] cursor-pointer" />
                    </button>
                  </div>

                  {/* Campo de Ingrediente - MÁS GRANDE */}
                  <InputField
                    placeholder="Ingrediente"
                    value={item.text}
                    onChange={(e) => actualizarIngrediente(item.id, e.target.value)}
                    width="flex-1"
                  />

                  {/* Campo de Cantidad */}
                  <InputField
                    placeholder="Cantidad"
                    value={item.cantidad || ''}
                    onChange={(e) => {
                      const updated = ingredientes.map(i => 
                        i.id === item.id ? {...i, cantidad: e.target.value} : i
                      );
                      setIngredientes(updated);
                      markAsChanged();
                    }}
                    width="w-24"
                  />

                  {/* Campo de Unidad */}
                  <InputField
                    placeholder="Unidad"
                    value={item.unidad || ''}
                    onChange={(e) => {
                      const updated = ingredientes.map(i => 
                        i.id === item.id ? {...i, unidad: e.target.value} : i
                      );
                      setIngredientes(updated);
                      markAsChanged();
                    }}
                    width="w-28"
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
                placeholder="Ej: 120 min"
                width="w-32"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
              />
              <span className="font-semibold text-gray-700 ml-4">Dificultad:</span>
              <select
                value={dificultad}
                onChange={(e) => {
                  setDificultad(e.target.value);
                  markAsChanged();
                }}
                className="px-3 py-2 bg-orange-50/70 border-b-2 border-orange-200 focus:outline-none focus:border-[#FFAF45] rounded-lg"
                style={{ color: dificultad ? '#374151' : '#9ca3af' }}
              >
                <option value="">Seleccionar</option>
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
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

        {/* Botón para guardar receta */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleGuardarReceta}
            disabled={isSubmitting || !isLogged}
            className="px-8 py-3 bg-[#F99F3F] text-white font-semibold rounded-lg shadow-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Receta'}
          </button>
        </div>

      </div>

      {/* Modal de confirmación de salida */}
      {showExitModal && (
        <ConfirmacionSalida
          onClose={handleCancelExit}
          onConfirm={handleConfirmExit}
        />
      )}
    </div>
  );
}

export default CrearRecetaPage;
