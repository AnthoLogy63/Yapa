import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/ai/';

/**
 * Envía un mensaje al chatbot de IA
 * @param {string} message - Mensaje del usuario
 * @returns {Promise} Respuesta del servidor con la respuesta de la IA
 */
export const sendMessage = async (message) => {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.post(`${API_URL}chat/`,
            { message },
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.data;
    } catch (err) {
        console.error('Error enviando mensaje al chatbot:', err);
        throw err;
    }
};
