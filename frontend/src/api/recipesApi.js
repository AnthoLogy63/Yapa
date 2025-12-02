import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/recipes/';

export const getRecomendacionesDelDia = async () => {
  try {
    const res = await axios.get(`${API_URL}recomendaciones-del-dia/`);
    return res.data;
  } catch (err) {
    console.error('Error obteniendo recomendaciones del día:', err);
    throw err;
  }
};

export const getAllRecipes = async () => {
  try {
    const res = await axios.get(API_URL);
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
