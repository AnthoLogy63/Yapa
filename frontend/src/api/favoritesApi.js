import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/favorites/';

export const getFavorites = async (token) => {
  try {
    const res = await axios.get(API_URL, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error obteniendo favoritos:', err);
    throw err;
  }
};

export const addToFavorites = async (recipeId, token) => {
  try {
    const res = await axios.post(API_URL, 
      { recipe_id: recipeId },
      {
        headers: {
          'Authorization': `Token ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Error agregando a favoritos:', err);
    throw err;
  }
};

export const removeFromFavorites = async (favoriteId, token) => {
  try {
    const res = await axios.delete(`${API_URL}${favoriteId}/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error quitando de favoritos:', err);
    throw err;
  }
};
