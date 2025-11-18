// client-mobile-sim/src/scenarios/solicitarTutoria.js
const { v4: uuidv4 } = require('uuid');
const backendClient = require('../api_client/backend.client');

/**
 * Ejecuta el escenario completo de solicitud de tutoría.
 * @param {object} data - Datos de la solicitud.
 * @param {string} data.username - Nombre de usuario.
 * @param {string} data.password - Contraseña.
 * @param {string} data.idTutor - ID del tutor.
 * @param {string} data.fecha - Fecha solicitada (ISO 8601).
 * @param {string} data.materia - Materia de la tutoría.
 * @param {number} data.duracion - Duración en minutos.
 * @returns {object} El resultado de la tutoría confirmada.
 * @throws {Error} Si la autenticación o la solicitud fallan.
 */
const solicitar = async (data) => {
    const correlationId = uuidv4();
    console.log(`[ESCENARIO] Iniciando con CID: ${correlationId}`);

    const { username, password, idTutor, fecha, materia, duracion } = data;

    // --- PASO 1: AUTENTICACIÓN ---
    console.log(`[ESCENARIO] Autenticando a ${username}...`);
    const accessToken = await backendClient.login(username, password);
    console.log(`[ESCENARIO] Autenticación exitosa.`);

    // --- PASO 2: ACCIÓN PROTEGIDA ---
    const payload = {
        idTutor,
        fechaSolicitada: fecha,
        duracionMinutos: parseInt(duracion),
        materia
    };

    console.log(`[ESCENARIO] Solicitando tutoría...`);
    const resultado = await backendClient.solicitarTutoria(payload, accessToken, correlationId);

    console.log(`[ESCENARIO] Solicitud exitosa.`);
    return resultado;

    // Los errores se capturarán en el endpoint del servidor web
};

module.exports = { solicitar };