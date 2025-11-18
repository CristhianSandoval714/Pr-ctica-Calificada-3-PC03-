// ms-agenda/src/domain/services/agenda.service.js
const agendaRepository = require('../../infrastructure/repositories/agenda.repository');

// La función 'verificarDisponibilidad' no cambia y se queda como está.
const verificarDisponibilidad = async (idTutor, fechaHoraSolicitada) => {
    const fechaSolicitada = new Date(fechaHoraSolicitada);
    const bloqueosDelTutor = await agendaRepository.findBloqueosByTutor(idTutor);

    const hayConflicto = bloqueosDelTutor.some(bloqueo => {
        const inicioBloqueo = bloqueo.fechaInicio;
        const finBloqueo = new Date(inicioBloqueo.getTime() + bloqueo.duracionMinutos * 60000);

        // La fecha solicitada cae dentro de un bloqueo existente
        return fechaSolicitada >= inicioBloqueo && fechaSolicitada < finBloqueo;
    });

    return { disponible: !hayConflicto };
};

const crearBloqueo = async (idTutor, datosDelBody) => {
    // Para mayor claridad, renombramos el parámetro de 'datosBloqueo' a 'datosDelBody'
    const { fechaInicio, duracionMinutos, idEstudiante } = datosDelBody;

    // 1. Validamos que los datos necesarios llegaron en el body.
    if (!fechaInicio || !duracionMinutos || !idEstudiante) {
        const error = new Error('Faltan datos requeridos en el cuerpo de la petición: se necesita fechaInicio, duracionMinutos y idEstudiante.');
        error.statusCode = 400; // Bad Request
        throw error;
    }

    // 2. Re-validar disponibilidad para evitar race conditions
    const { disponible } = await verificarDisponibilidad(idTutor, fechaInicio);
    if (!disponible) {
        const error = new Error('El horario solicitado ya no está disponible.');
        error.statusCode = 409; // 409 Conflict
        throw error;
    }

    // 3. Construimos el objeto a guardar de forma explícita.
    // ESTE ES EL CAMBIO CLAVE. Evitamos el 'spread operator' que puede ser ambiguo
    // y en su lugar, mapeamos cada campo directamente.
    const datosParaGuardar = {
        idTutor: idTutor,
        fechaInicio: new Date(fechaInicio),
        duracionMinutos: duracionMinutos,
        idEstudiante: idEstudiante
    };

    const nuevoBloqueo = await agendaRepository.saveBloqueo(datosParaGuardar);
    return nuevoBloqueo;
};
// ===================================

module.exports = {
    verificarDisponibilidad,
    crearBloqueo
};