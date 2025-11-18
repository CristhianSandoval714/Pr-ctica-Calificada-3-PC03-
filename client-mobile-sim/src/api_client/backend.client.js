// client-mobile-sim/src/api_client/backend.client.js
const axios = require('axios');
const { apiBaseUrl, authServiceUrl } = require('../config'); // <-- Importar la nueva URL

// --- NUEVA FUNCIÓN DE LOGIN ---
const login = async (username, password) => {
    const url = `${authServiceUrl}/token`;
    console.log(`[CLIENT] ---> Autenticando usuario "${username}" en ${url}`);
    try {
        const response = await axios.post(url, { username, password });
        return response.data.access_token;
    } catch (error) {
        console.error(`[CLIENT] <--- Fallo en la autenticación: ${error.response?.data?.error?.message || error.message}`);
        throw new Error('No se pudo obtener el token de acceso.');
    }
};

// --- FUNCIÓN MODIFICADA ---
// Ahora acepta el token y el correlationId para los headers
const solicitarTutoria = async (payload, token, correlationId) => {
    const url = `${apiBaseUrl}/tutorias`;
    console.log(`[CLIENT] ---> POST ${url} | Correlation-ID: ${correlationId}`);
    
    const response = await axios.post(url, payload, {
        headers: {
            'Authorization': `Bearer ${token}`, // <-- Header de seguridad
            'X-Correlation-ID': correlationId
        }
    });
    return response.data;
};

module.exports = { login, solicitarTutoria };