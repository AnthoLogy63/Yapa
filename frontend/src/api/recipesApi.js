import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/recipes/';

export const getRecomendacionesDelDia = async () => {
  try {
    const res = await axios.get(`${API_URL}recomendaciones-del-dia/`);
    return res.data;
  } catch (err) {
    console.error('Error obteniendo recomendaciones del día:', err);
    throw err;
  }
};

export const getAllRecipes = async (search = '', withIngredients = [], withoutIngredients = []) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (withIngredients.length > 0) params.append('with_ingredients', withIngredients.join(','));
    if (withoutIngredients.length > 0) params.append('without_ingredients', withoutIngredients.join(','));

    const res = await axios.get(`${API_URL}?${params.toString()}`);
    return res.data;
  } catch (err) {
    console.error('Error obteniendo recetas:', err);
    throw err;
  }
};

export const getRecipeById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}${id}/`);
    return res.data;
  } catch (err) {
    console.error('Error obteniendo receta:', err);
    throw err;
  }
};

export const createRecipe = async (recipeData, token) => {
  try {
    const formData = new FormData();

    // Agregar campos básicos
    formData.append('title', recipeData.title);
    formData.append('description', recipeData.description || '');
    formData.append('preparation_time', recipeData.preparation_time);
    formData.append('difficulty', recipeData.difficulty || 'Media');
    formData.append('portions', recipeData.portions);

    // Agregar categoría si existe
    if (recipeData.category) {
      formData.append('category', recipeData.category);
    }

    // Agregar imagen si existe
    if (recipeData.image) {
      formData.append('image', recipeData.image);
    }

    // Agregar ingredientes (lista de strings)
    if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
      recipeData.ingredients.forEach(ing => {
        formData.append('ingredients_input', ing);
      });
    }

    // Agregar pasos (lista de strings)
    if (recipeData.steps && Array.isArray(recipeData.steps)) {
      recipeData.steps.forEach(step => {
        formData.append('steps_input', step);
      });
    }

    const res = await axios.post(API_URL, formData, {
      headers: {
        'Authorization': `Token ${token}`,
        // NO establecer Content-Type manualmente - axios lo hace automáticamente con FormData
      },
    });

    return res.data;
  } catch (err) {
    console.error('Error creando receta:', err);
    console.error('Detalles del error:', err.response?.data);
    throw err;
  }
};

export const getUserRecipes = async (token) => {
  try {
    const res = await axios.get(`${API_URL}my-recipes/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error obteniendo recetas del usuario:', err);
    throw err;
  }
};

export const updateRecipe = async (id, recipeData, token) => {
  try {
    const formData = new FormData();

    // Agregar campos básicos
    formData.append('title', recipeData.title);
    formData.append('description', recipeData.description || '');
    formData.append('preparation_time', recipeData.preparation_time);
    formData.append('difficulty', recipeData.difficulty || 'Media');
    formData.append('portions', recipeData.portions);

    // Agregar categoría si existe
    if (recipeData.category) {
      formData.append('category', recipeData.category);
    }

    // Agregar imagen si existe (solo si es un archivo nuevo)
    if (recipeData.image && recipeData.image instanceof File) {
      formData.append('image', recipeData.image);
    }

    // Agregar ingredientes (lista de strings)
    if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
      recipeData.ingredients.forEach(ing => {
        formData.append('ingredients_input', ing);
      });
    }

    // Agregar pasos (lista de strings)
    if (recipeData.steps && Array.isArray(recipeData.steps)) {
      recipeData.steps.forEach(step => {
        formData.append('steps_input', step);
      });
    }

    const res = await axios.put(`${API_URL}${id}/`, formData, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error('Error actualizando receta:', err);
    console.error('Detalles del error:', err.response?.data);
    throw err;
  }
};

export const deleteRecipe = async (id, token) => {
  try {
    console.log('deleteRecipe - ID:', id);
    console.log('deleteRecipe - Token:', token);

    if (!token) {
      throw new Error('Token no disponible. Por favor inicia sesión.');
    }

    const res = await axios.delete(`${API_URL}${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    console.log('deleteRecipe - Respuesta:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error eliminando receta:', err);
    console.error('Detalles del error:', err.response?.data || err.message);
    throw err;
  }
};
