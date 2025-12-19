import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/auth/';

export const loginWithGoogle = async (accessToken) => {
  try {
    const res = await axios.post(`${API_URL}google/`, {
      access_token: accessToken
    });
    return res.data;
  } catch (err) {
    console.error('Error logueando con backend:', err);
    throw err;
  }
};
