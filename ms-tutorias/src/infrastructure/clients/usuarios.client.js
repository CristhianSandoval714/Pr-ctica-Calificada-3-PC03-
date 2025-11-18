// ms-tutorias/src/infrastructure/clients/usuarios.client.js
const axios = require('axios');
const { usuariosServiceUrl } = require('../../config');

const getUsuario = async (tipo, id, correlationId) => {
    // Construimos la URL
    const url = `${usuariosServiceUrl}/${tipo}/${id}`;

    // --- LOGS DE DEPURACIÓN ---
    console.log(`[SUPER-DEBUG] Iniciando llamada a getUsuario con Correlation-ID: ${correlationId}`);
    console.log(`[SUPER-DEBUG] URL de destino: ${url}`);
    console.log(`[SUPER-DEBUG] Tipo: ${tipo}, ID: ${id}`);
    // --- FIN LOGS DE DEPURACIÓN ---

    try {
        const response = await axios.get(url, {
            headers: { 'X-Correlation-ID': correlationId }
        });
        console.log(`[SUPER-DEBUG] Éxito en la llamada a ${url}. Status: ${response.status}`);
        return response.data;
    } catch (error) {
        // --- LOGS DE ERROR DETALLADOS ---
        console.error(`[SUPER-DEBUG] FALLO en la llamada a ${url}.`);
        if (error.response) {
            // Este bloque se ejecuta si el servidor SÍ respondió, pero con un error (4xx, 5xx)
            console.error(`[SUPER-DEBUG] El servidor respondió con Status: ${error.response.status}`);
            console.error(`[SUPER-DEBUG] Data del error:`, JSON.stringify(error.response.data));
            if (error.response.status === 404) {
                return null;
            }
        } else if (error.request) {
            // Este bloque se ejecuta si la petición se hizo pero NUNCA se recibió respuesta (error de red)
            console.error('[SUPER-DEBUG] La petición fue enviada pero no se recibió respuesta. Error de red (timeout, DNS, etc).');
        } else {
            // Este bloque se ejecuta si hubo un error al configurar la petición antes de enviarla
            console.error('[SUPER-DEBUG] Error fatal al configurar la petición axios:', error.message);
        }
        console.error('[SUPER-DEBUG] Objeto de error completo de Axios:', error.code, error.message);
        // --- FIN LOGS DE ERROR DETALLADOS ---
        throw error;
    }
};

module.exports = { getUsuario };