import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPantryIngredients, addPantryIngredient, deletePantryIngredient, adjustPantryIngredient } from "../../api/pantryApi";

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
  "Cereales y Masas": CerealesBg,
  "Otros": CondimentosBg // Fallback
};

// Ingredientes más comunes por categoría (Perú)
const COMMON_INGREDIENTS = {
  "Verduras": ["Lechuga", "Tomate", "Zanahoria", "Pepino", "Espinaca", "Brócoli", "Apio", "Cebolla", "Ajo", "Pimiento", "Repollo", "Calabacín", "Berenjena"],
  "Frutas": ["Manzana", "Plátano", "Naranja", "Fresa", "Pera", "Mango", "Uva", "Piña", "Kiwi", "Papaya", "Mandarina", "Melón", "Sandía", "Cereza", "Durazno"],
  "Granos y legumbres": ["Arroz", "Lenteja", "Frijol", "Garbanzos", "Quinoa", "Maíz", "Trigo", "Cebada", "Soja"],
  "Lácteos": ["Leche", "Queso fresco", "Yogur", "Mantequilla", "Crema"],
  "Proteínas animales": ["Pollo", "Carne de res", "Pescado", "Huevo", "Cerdo", "Pavo"],
  "Condimentos y salsas": ["Sal", "Pimienta", "Aceite", "Vinagre", "Ají", "Salsa de soja", "Orégano", "Comino"],
  "Bebidas": ["Agua", "Jugo", "Café", "Té", "Chicha morada", "Inca Kola"],
  "Cereales y Masas": ["Pan", "Pasta", "Harina", "Tortilla", "Galletas"],
  "Otros": [] // Permitirá texto libre
};

// Unidades por ingrediente individual
const DEFAULT_UNITS = {
  "Lechuga": "un",
  "Tomate": "un",
  "Zanahoria": "kg",
  "Pepino": "un",
  "Espinaca": "kg",
  "Brócoli": "kg",
  "Apio": "un",
  "Cebolla": "kg",
  "Ajo": "g",
  "Pimiento": "un",
  "Repollo": "un",
  "Calabacín": "un",
  "Berenjena": "un",

  "Manzana": "un",
  "Plátano": "kg",
  "Naranja": "un",
  "Fresa": "kg",
  "Pera": "un",
  "Mango": "un",
  "Uva": "kg",
  "Piña": "un",
  "Kiwi": "un",
  "Papaya": "un",
  "Mandarina": "un",
  "Melón": "un",
  "Sandía": "un",
  "Cereza": "un",
  "Durazno": "un",

  "Arroz": "kg",
  "Lenteja": "kg",
  "Frijol": "kg",
  "Garbanzos": "kg",
  "Quinoa": "kg",
  "Maíz": "kg",
  "Trigo": "kg",
  "Cebada": "kg",
  "Soja": "kg",

  "Leche": "l",
  "Queso fresco": "kg",
  "Yogur": "l",
  "Mantequilla": "kg",
  "Crema": "kg",

  "Pollo": "kg",
  "Carne de res": "kg",
  "Pescado": "kg",
  "Huevo": "un",
  "Cerdo": "kg",
  "Pavo": "kg",

  "Sal": "g",
  "Pimienta": "g",
  "Aceite": "l",
  "Vinagre": "l",
  "Ají": "g",
  "Salsa de soja": "ml",
  "Orégano": "g",
  "Comino": "g",

  "Agua": "l",
  "Jugo": "l",
  "Café": "g",
  "Té": "g",
  "Chicha morada": "l",
  "Inca Kola": "l",

  "Pan": "un",
  "Pasta": "kg",
  "Harina": "kg",
  "Tortilla": "un",
  "Galletas": "un",

  "Otros": "un"
};

const CategoryCard = ({ title, ingredients, onRemove, backgroundImage, onAdd, onAdjust }) => {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [amount, setAmount] = useState("1");

  const isOtros = title === "Otros";

  const handleAdd = () => {
    if (!selectedIngredient && !isOtros) return;
    onAdd(selectedIngredient, amount, title);
    setSelectedIngredient("");
    setAmount("1");
  };

  return (
    <div
      className="relative border border-gray-400 rounded-lg overflow-hidden flex flex-col h-full min-h-[300px] shadow-sm hover:shadow-md transition-shadow"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#FAFAFA'
      }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]"></div>

      <div className="relative z-10 p-4 flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-wide">{title}</h3>

        <div className="flex-1 flex flex-col gap-2">
          {ingredients.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Vacío</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between bg-white border border-gray-300 rounded-full pl-2 pr-3 py-1 text-sm shadow-sm"
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAdjust(ing.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer text-sm font-bold transition-colors"
                      title="Disminuir"
                    >-</button>

                    <span className="max-w-[120px] truncate mx-2 font-medium text-gray-700" title={ing.text}>
                      {ing.text}
                    </span>

                    <button
                      onClick={() => onAdjust(ing.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 cursor-pointer text-sm font-bold transition-colors"
                      title="Aumentar"
                    >+</button>
                  </div>

                  <button
                    onClick={() => onRemove(ing.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer"
                    title="Eliminar"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 items-end flex-wrap">
          {isOtros ? (
            <input
              type="text"
              placeholder="Nombre del ingrediente"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
            />
          ) : (
            <select
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
            >
              <option value="">Selecciona ingrediente</option>
              {COMMON_INGREDIENTS[title].map((ing) => (
                <option key={ing} value={ing}>{ing}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            min="1"
            step="1"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg text-white font-medium shadow-md hover:brightness-110 transition-all cursor-pointer"
            style={{ backgroundColor: '#F99F3F' }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};


function MiRefriPage() {
  const { token, isLogged } = useAuth();

  const [categories, setCategories] = useState({
    "Verduras": [],
    "Frutas": [],
    "Granos y legumbres": [],
    "Lácteos": [],
    "Proteínas animales": [],
    "Condimentos y salsas": [],
    "Bebidas": [],
    "Cereales y Masas": [],
    "Otros": []
  });

  const loadPantryData = () => {
    if (isLogged && token) {
      getPantryIngredients(token)
        .then((ingredients) => {
          if (!ingredients) return;

          const freshCats = {
            "Verduras": [],
            "Frutas": [],
            "Granos y legumbres": [],
            "Lácteos": [],
            "Proteínas animales": [],
            "Condimentos y salsas": [],
            "Bebidas": [],
            "Cereales y Masas": [],
            "Otros": []
          };

          ingredients.forEach((item) => {
            const name = item.ingredient.name;
            const amountVal = parseFloat(item.amount);
            const displayAmount = Number.isInteger(amountVal) ? amountVal : amountVal.toFixed(2);
            const unitVal = item.unit;
            const text = `${name}: ${displayAmount} ${unitVal}`.trim();

            const ingredientObj = {
              id: item.id,
              ingredientId: item.ingredient.id,
              name,
              amount: amountVal,
              unit: unitVal,
              text,
              classification: item.ingredient.classification
            };

            const classification = item.ingredient.classification;
            if (classification && freshCats[classification]) {
              freshCats[classification].push(ingredientObj);
            } else {
              freshCats["Otros"].push(ingredientObj);
            }
          });

          setCategories(freshCats);
        })
        .catch((err) => console.error("Error loading pantry:", err));
    }
  };

  useEffect(() => {
    loadPantryData();
  }, [token, isLogged]);

  const handleAddIngredient = async (name, amount, category) => {
    if (!token || !name) return;

    try {
      const unit = DEFAULT_UNITS[name] || "un";
      const payload = {
        ingredient_name: name,
        amount: amount || 1,
        unit: unit,
        date_aggregate: new Date().toISOString().split('T')[0],
        classification: category
      };
      await addPantryIngredient(payload, token);
      loadPantryData();
    } catch (error) {
      console.error("Error adding ingredient:", error);
      alert("Error al agregar ingrediente.");
    }
  };

  const handleRemoveIngredient = async (idToRemove) => {
    if (!token) return;
    try {
      await deletePantryIngredient(idToRemove, token);
      loadPantryData();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert("Error al eliminar ingrediente");
    }
  };

  const handleAdjustIngredient = async (id, amountChange) => {
    if (!token) return;
    try {
      await adjustPantryIngredient(id, amountChange, token);
      loadPantryData();
    } catch (err) {
      console.error(err);
      alert('No se pudo ajustar la cantidad');
    }
  };

  return (
    <div className="w-full bg-white px-8 py-10 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light text-gray-800 mb-8 border-b pb-4">Mi Refri</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([categoryName, ingredients]) => (
            <CategoryCard
              key={categoryName}
              title={categoryName}
              ingredients={ingredients}
              backgroundImage={categoryImages[categoryName]}
              onRemove={handleRemoveIngredient}
              onAdd={handleAddIngredient}
              onAdjust={handleAdjustIngredient}
            />

          ))}
        </div>
      </div>
    </div>
  );
}

export default MiRefriPage;
