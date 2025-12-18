import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPantries, getPantryIngredients, addPantryIngredient, searchIngredients } from "../../api/pantryApi";

// Import background images
import VerdurasBg from './Alimentos/Verduras.jpg';
import FrutasBg from './Alimentos/Frutas.jpg';
import GranosBg from './Alimentos/Granos.jpg';
import LacteosBg from './Alimentos/Lacteos.jpg';
import ProteinasBg from './Alimentos/Proteinas.jpg';
import CondimentosBg from './Alimentos/Condimentos.jpg';
import BebidasBg from './Alimentos/Bebidas.jpg';
import CerealesBg from './Alimentos/Cereales.jpg';

// Map category names to background images
const categoryImages = {
  "Verduras": VerdurasBg,
  "Frutas": FrutasBg,
  "Granos y legumbres": GranosBg,
  "Lácteos": LacteosBg,
  "Proteínas animales": ProteinasBg,
  "Condimentos y salsas": CondimentosBg,
  "Bebidas": BebidasBg,
  "Cereales y Masas": CerealesBg
};

const CategoryCard = ({ title, ingredients, onAdd, onRemove, backgroundImage }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    cantidad: "",
    unidad: "",
    nombre: ""
  });

  const handleAdd = () => {
    const { cantidad, unidad, nombre } = newIngredient;
    if (nombre.trim()) {
      const ingredientText = `${nombre} ${cantidad} ${unidad}`.trim();
      onAdd(ingredientText);
      setNewIngredient({ cantidad: "", unidad: "", nombre: "" });
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewIngredient({ cantidad: "", unidad: "", nombre: "" });
    }
  };

  return (
    <div
      className="relative border border-gray-400 rounded-lg overflow-hidden flex flex-col h-full min-h-[250px]"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#FAFAFA'
      }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-white/70"></div>

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col h-full">
        <h3 className="text-xl font-normal text-black mb-4">{title}</h3>

        <div className="flex-1 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {ingredients.map((ing, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-400 rounded px-2 py-1 text-sm"
              >
                <span className="truncate mr-1" title={ing}>{ing}</span>
                <button
                  onClick={() => onRemove(index)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none cursor-pointer"
                >
                  <span className="text-xs font-bold">x</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          {isAdding ? (
            <div className="flex items-center w-full gap-2">
              <input
                type="text"
                value={newIngredient.nombre}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, nombre: e.target.value }))}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-28 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-500"
                placeholder="Nombre..."
              />
              <input
                type="text"
                value={newIngredient.cantidad}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, cantidad: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="w-18 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-500"
                placeholder="Cant."
              />
              <input
                type="text"
                value={newIngredient.unidad}
                onChange={(e) => setNewIngredient(prev => ({ ...prev, unidad: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="w-22 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-500"
                placeholder="Unidad"
              />
              <button
                onClick={handleAdd}
                className="text-green-600 hover:text-green-700 cursor-pointer"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewIngredient({ cantidad: "", unidad: "", nombre: "" });
                }}
                className="text-red-500 hover:text-red-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="text-gray-600 hover:text-orange-500 flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer"
            >
              + Ingrediente
            </button>
          )}
        </div>
      </div> {/* End Content Wrapper */}
    </div>
  );
};

function MiRefriPage() {
  const navigate = useNavigate();
  const { token, isLogged } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [pantryId, setPantryId] = useState(null);

  const [categories, setCategories] = useState({
    "Verduras": [],
    "Frutas": [],
    "Granos y legumbres": [],
    "Lácteos": [],
    "Proteínas animales": [],
    "Condimentos y salsas": [],
    "Bebidas": [],
    "Cereales y Masas": []
  });

  const loadPantryData = () => {
    if (isLogged && token) {
      getPantries(token).then(pantries => {
        if (pantries && pantries.length > 0) {
          const pid = pantries[0].id;
          setPantryId(pid);
          return getPantryIngredients(pid, token);
        }
        return [];
      }).then(ingredients => {
        if (!ingredients) return;

        const freshCats = {
          "Verduras": [],
          "Frutas": [],
          "Granos y legumbres": [],
          "Lácteos": [],
          "Proteínas animales": [],
          "Condimentos y salsas": [],
          "Bebidas": [],
          "Cereales y Masas": []
        };

        ingredients.forEach(item => {
          const name = item.ingredient.name;
          const amount = parseFloat(item.amount);
          const unit = item.unit;
          const str = `${name} ${amount} ${unit}`.trim();

          // Match classification to keys
          const classification = item.ingredient.classification;

          if (classification && freshCats[classification]) {
            freshCats[classification].push(str);
          } else {
            // Fallback loose matching
            const lower = (classification || "").toLowerCase();
            if (lower.includes("verdura")) freshCats["Verduras"].push(str);
            else if (lower.includes("fruta")) freshCats["Frutas"].push(str);
            else if (lower.includes("grano") || lower.includes("legumbre")) freshCats["Granos y legumbres"].push(str);
            else if (lower.includes("lacteo") || lower.includes("lácteo")) freshCats["Lácteos"].push(str);
            else if (lower.includes("proteína") || lower.includes("proteina") || lower.includes("carne")) freshCats["Proteínas animales"].push(str);
            else if (lower.includes("condimento") || lower.includes("salsa")) freshCats["Condimentos y salsas"].push(str);
            else if (lower.includes("bebida")) freshCats["Bebidas"].push(str);
            else if (lower.includes("cereal") || lower.includes("masa")) freshCats["Cereales y Masas"].push(str);
          }
        });
        setCategories(freshCats);
      }).catch(err => console.error("Error loading pantry:", err));
    }
  };

  useEffect(() => {
    loadPantryData();
  }, [token, isLogged]);

  const handleAddIngredient = (category, ingredient) => {
    setCategories(prev => ({
      ...prev,
      [category]: [...prev[category], ingredient]
    }));
  };

  const handleRemoveIngredient = (category, indexToRemove) => {
    setCategories(prev => ({
      ...prev,
      [category]: prev[category].filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="w-full bg-white px-20 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-normal text-gray-700 mb-6">MI Refri</h1>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-10 max-w-2xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm"
              placeholder="Buscar Ingrediente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#F99F3F] text-white px-6 py-2 rounded-md font-medium hover:bg-orange-500 transition-colors cursor-pointer">
            Buscar
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(categories).map(([categoryName, ingredients]) => (
            <CategoryCard
              key={categoryName}
              title={categoryName}
              ingredients={ingredients}
              backgroundImage={categoryImages[categoryName]}
              onAdd={(ing) => handleAddIngredient(categoryName, ing)}
              onRemove={(index) => handleRemoveIngredient(categoryName, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MiRefriPage;
