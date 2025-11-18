const axios = require('axios');
const { notificacionesServiceUrl } = require('../../config');

const enviarEmail = async (payload) => {
    const url = `${notificacionesServiceUrl}/email`;
    const response = await axios.post(url, payload);
    return response.data;
};

// La función ahora acepta correlationId como parámetro
const getUsuario = async (tipo, id, correlationId) => {
    try {
        const url = `${usuariosServiceUrl}/${tipo}/${id}`;
        // Se añade el header a la petición de axios
        const response = await axios.get(url, {
            headers: { 'X-Correlation-ID': correlationId }
        });
        return response.data;
    } catch (error) {
        // Manejo básico del error, puedes personalizarlo según tus necesidades
        throw error;
    }
}

module.exports = { enviarEmail,getUsuario };