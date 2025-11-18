const axios = require('axios');

// --- Parámetros de la Simulación ---
// Simulamos que la usuaria "Ana Torres" quiere una tutoría con la "Dra. Elena Solano"
const ID_ESTUDIANTE = 'e12345';
const ID_TUTOR = 't09876';
const FECHA_HORA_SOLICITADA = '2025-12-01T15:00:00Z'; // Una fecha que sabemos está libre
const DURACION_MINUTOS = 45;
const MATERIA = 'Cálculo Multivariable';

// URLs de nuestros microservicios (el cliente conoce los puntos de entrada)
const URL_AGENDA = `http://localhost:3002/agenda`;
const URL_TUTORIAS = `http://localhost:3000/tutorias`;

// Función para imprimir logs de forma fina
const log = (paso, mensaje, data = '') => {
    console.log(`\n--- PASO ${paso} ---`);
    console.log(`[Cliente Móvil]  ${mensaje}`);
    if (data) {
        console.log('[Cliente Móvil]  Datos recibidos:');
        console.log(JSON.stringify(data, null, 2));
    }
};

const simularFlujoCompleto = async () => {
    console.log(' INICIANDO SIMULACIÓN DE CLIENTE MÓVIL ');
    console.log('============================================');

    try {
        // a. CONSULTA LA DISPONIBILIDAD
        // Nota Arquitectónica: En un sistema con API Gateway, esta llamada iría al Gateway.
        // Por simplicidad, el cliente llama directamente al MS_Agenda.
        log('A', `Consultando disponibilidad del tutor ${ID_TUTOR} para la fecha ${FECHA_HORA_SOLICITADA}...`);
        const urlDisponibilidad = `${URL_AGENDA}/tutores/${ID_TUTOR}/disponibilidad?fechaHora=${FECHA_HORA_SOLICITADA}`;
        const resDisponibilidad = await axios.get(urlDisponibilidad);

        if (!resDisponibilidad.data.disponible) {
            log('A', 'El tutor no está disponible. Simulación terminada.');
            return;
        }
        log('A', '¡Horario disponible! Procediendo a solicitar la tutoría.', resDisponibilidad.data);

        // b. SOLICITA LA TUTORÍA
        log('B', 'Enviando solicitud para crear la tutoría al orquestador (MS_Tutorias)...');
        const payloadTutoria = {
            idEstudiante: ID_ESTUDIANTE,
            idTutor: ID_TUTOR,
            fechaSolicitada: FECHA_HORA_SOLICITADA,
            duracionMinutos: DURACION_MINUTOS,
            materia: MATERIA
        };
        const resTutoria = await axios.post(URL_TUTORIAS, payloadTutoria);

        // c. RECIBE CONFIRMACIÓN
        log('C', '¡Solicitud procesada con éxito! Tutoría confirmada por el sistema.', resTutoria.data);

    } catch (error) {
        console.error('\n ¡Ocurrió un error durante la simulación! ');
        if (error.response) {
            console.error(`[Cliente Móvil] El servidor respondió con estado ${error.response.status}:`);
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('[Cliente Móvil] No se pudo conectar con el servidor:', error.message);
        }
    } finally {
        console.log('\n============================================');
        console.log(' SIMULACIÓN FINALIZADA ');
    }
};

simularFlujoCompleto();