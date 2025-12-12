import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../api/recipesApi";

function RecetasDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!recipe) {
    return <div className="w-full h-screen flex items-center justify-center">Receta no encontrada</div>;
  }

  const authorName = recipe.user
    ? `${recipe.user.first_name} ${recipe.user.last_name}`.trim() || recipe.user.username
    : "Anónimo";

  const authorAvatar = recipe.user?.profile?.profile_picture ||
    `https://ui-avatars.com/api/?name=${authorName}&background=F99F3F&color=fff`;

  return (
    <div className="w-full bg-white px-20 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Imagen y Título Principal */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Imagen */}
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-300 flex items-center justify-center">
                <span className="text-4xl text-white opacity-50">Sin Imagen</span>
              </div>
            )}
          </div>

          {/* Info Principal */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4 uppercase">
                {recipe.title}
              </h1>

              {/* Autor */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-700 font-medium">{authorName}</span>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {recipe.description}
              </p>

              {/* Botón Imprimir */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="w-full h-1 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300 rounded-full mb-8"></div>

        {/* Ingredientes y Procedimiento */}
        <div className="grid grid-cols-2 gap-12">

          {/* Ingredientes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredientes</h2>

            {/* Info de porciones */}
            <div className="flex items-center gap-2 mb-6 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{recipe.portions} porciones</span>
            </div>

            {/* Lista de ingredientes */}
            <ul className="space-y-0 divide-y divide-gray-200">
              {recipe.recipe_ingredients && recipe.recipe_ingredients.map((ri) => (
                <li key={ri.id} className="text-gray-700 py-3">
                  • {ri.amount % 1 === 0 ? Math.floor(ri.amount) : ri.amount} {ri.unit} de {ri.ingredient.name}
                  {ri.is_optional && <span className="text-gray-400 text-sm ml-2">(Opcional)</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Procedimiento */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Procedimiento</h2>

            {/* Info de tiempo */}
            <div className="flex items-center gap-2 mb-6 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{recipe.preparation_time} min</span>
            </div>

            <div className="space-y-6">
              {recipe.steps && recipe.steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: '#F99F3F' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex flex-col pt-1">
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                    {step.photo && (
                      <img src={step.photo} alt={`Paso ${index + 1}`} className="mt-2 rounded-lg w-full max-w-md object-cover h-48" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones inferiores */}
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition cursor-pointer ${isSaved
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-gray-400 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isSaved ? 'Guardado' : 'Guardar'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-400 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>

      </div>
    </div>
  );
}

export default RecetasDetailPage;