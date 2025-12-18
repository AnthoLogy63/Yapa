import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

// Pantries
export const getPantries = async (token) => {
    try {
        const res = await axios.get(`${API_URL}pantry/`, {
            headers: { Authorization: `Token ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error fetching pantries:', err);
        throw err;
    }
};

// Ingredients
export const searchIngredients = async (query, token) => {
    try {
        const res = await axios.get(`${API_URL}ingredientes/?search=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Token ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error searching ingredients:', err);
        throw err;
    }
};

export const createIngredient = async (data, token) => {
    try {
        const res = await axios.post(`${API_URL}ingredientes/`, data, {
            headers: { Authorization: `Token ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error creating ingredient:', err);
        throw err;
    }
}


// Pantry Ingredients
export const getPantryIngredients = async (pantryId, token) => {
    try {
        const res = await axios.get(`${API_URL}pantry/${pantryId}/ingredients/`, {
            headers: { Authorization: `Token ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error fetching pantry ingredients:', err);
        throw err;
    }
};

export const addPantryIngredient = async (pantryId, data, token) => {
    try {
        const res = await axios.post(`${API_URL}pantry/${pantryId}/ingredients/`, data, {
            headers: { Authorization: `Token ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error adding pantry ingredient:', err);
        throw err;
    }
};
