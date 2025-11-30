import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ title, ingredients, onAdd, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");

  const handleAdd = () => {
    if (newIngredient.trim()) {
      onAdd(newIngredient.trim());
      setNewIngredient("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewIngredient("");
    }
  };

  return (
    <div className="bg-[#FAFAFA] border border-gray-400 rounded-lg p-4 flex flex-col h-full min-h-[250px]">
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
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-500"
              placeholder="Nombre..."
            />
            <button
              onClick={handleAdd}
              className="text-green-600 hover:text-green-700 cursor-pointer"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => setIsAdding(false)}
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
    </div>
  );
};

function MiRefriPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
