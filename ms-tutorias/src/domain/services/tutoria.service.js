
const tutoriaRepository = require('../../infrastructure/repositories/tutoria.repository');
const usuariosClient = require('../../infrastructure/clients/usuarios.client');
const agendaClient = require('../../infrastructure/clients/agenda.client');
const { publishToQueue, publishTrackingEvent } = require('../../infrastructure/messaging/message.producer');

// Helper de tracking
const track = (cid, message, status = 'INFO') => {
    publishTrackingEvent({
        service: 'MS_Tutorias',
        message,
        cid,
        timestamp: new Date(),
        status
    });
};

const solicitarTutoria = async (datosSolicitud, correlationId) => {
    const { idEstudiante, idTutor, fechaSolicitada, duracionMinutos, materia } = datosSolicitud;

    let nuevaTutoria;

    try {
        // ===================================================
        // 1. Validación de existencia de usuarios
        // ===================================================
        track(correlationId, 'Validando usuarios...');
        const [estudiante, tutor] = await Promise.all([
            usuariosClient.getUsuario('estudiantes', idEstudiante, correlationId),
            usuariosClient.getUsuario('tutores', idTutor, correlationId)
        ]);

        if (!estudiante) throw { statusCode: 404, message: 'Estudiante no encontrado' };
        if (!tutor) throw { statusCode: 404, message: 'Tutor no encontrado' };

        track(correlationId, 'Usuarios validados exitosamente.');

        // ===================================================
        // 2. Verificar disponibilidad de agenda
        // ===================================================
        track(correlationId, 'Verificando disponibilidad de agenda...');
        const disponible = await agendaClient.verificarDisponibilidad(idTutor, fechaSolicitada, correlationId);

        if (!disponible) throw { statusCode: 409, message: 'Horario no disponible' };

        track(correlationId, 'Agenda disponible.');

        // ===================================================
        // 3. Crear tutoría en estado PENDIENTE
        // ===================================================
        track(correlationId, 'Creando tutoría en estado PENDIENTE...');
        const tutoriaPendiente = {
            idEstudiante,
            idTutor,
            fecha: new Date(fechaSolicitada),
            materia,
            estado: 'PENDIENTE'
        };

        nuevaTutoria = await tutoriaRepository.save(tutoriaPendiente);

        track(correlationId, `Tutoría PENDIENTE creada (ID: ${nuevaTutoria.idtutoria}).`);

        // ===================================================
        // 4. Bloquear horario en ms-agenda (Saga Step 1)
        // ===================================================
        track(correlationId, 'Bloqueando horario en agenda...');

        const bloqueoPayload = {
            fechaInicio: fechaSolicitada,
            duracionMinutos,
            idEstudiante
        };

        await agendaClient.bloquearAgenda(idTutor, bloqueoPayload, correlationId);

        track(correlationId, 'Bloqueo de agenda exitoso.');

        // ===================================================
        // 5. Publicar notificación en RabbitMQ (Saga Step 2)
        // ===================================================
        track(correlationId, 'Publicando evento de notificación...');

        const payloadNotificacion = {
            destinatario: estudiante.email,
            asunto: `Tutoría de ${materia} confirmada`,
            cuerpo: `Hola ${estudiante.nombrecompleto || estudiante.nombreCompleto}, tu tutoría con ${tutor.nombrecompleto || tutor.nombreCompleto} ha sido confirmada.`,
            correlationId
        };

        publishToQueue('notificaciones_email_queue', payloadNotificacion);

        track(correlationId, 'Evento de notificación enviado.');

        // ===================================================
        // 6. Confirmar tutoría
        // ===================================================
        track(correlationId, 'Actualizando tutoría a CONFIRMADA...');

        const tutoriaConfirmadaPayload = {
            idTutoria: nuevaTutoria.idtutoria,
            estado: 'CONFIRMADA',
            error: null
        };

        const tutoriaConfirmada = await tutoriaRepository.save(tutoriaConfirmadaPayload);

        track(correlationId, 'Tutoría CONFIRMADA correctamente.');

        return tutoriaConfirmada;

    } catch (error) {
        console.error(`[MS_Tutorias] CID: ${correlationId} - ERROR: ${error.message}`);
        track(correlationId, `ERROR: ${error.message}`, 'ERROR');

        // ==========================================================
        // COMPENSACIÓN Misión 3 - Paso obligatorio en la rúbrica
        // Revertir el bloqueo en ms-agenda
        // ==========================================================
        track(correlationId, 'Compensación: cancelando bloqueo de agenda...', 'ERROR');

        try {
            await agendaClient.cancelarBloqueo(
                idTutor,
                {
                    fechaInicio: fechaSolicitada,
                    duracionMinutos
                },
                correlationId
            );

            track(correlationId, 'Bloqueo de agenda revertido.', 'ERROR');

        } catch (cancelError) {
            track(
                correlationId,
                `ERROR CRÍTICO al intentar revertir el bloqueo en agenda: ${cancelError.message}`,
                'ERROR'
            );
        }

        // ==========================================================
        // COMPENSACIÓN Secundaria – Marcar tutoría como FALLIDA
        // ==========================================================
        if (nuevaTutoria && nuevaTutoria.idtutoria) {
            track(correlationId, 'Marcando tutoría como FALLIDA...', 'ERROR');

            try {
                await tutoriaRepository.save({
                    idTutoria: nuevaTutoria.idtutoria,
                    estado: 'FALLIDA',
                    error: error.message
                });

                track(correlationId, 'Tutoría marcada como FALLIDA.', 'ERROR');

            } catch (compError) {
                track(
                    correlationId,
                    `ERROR CRÍTICO guardando tutoría FALLIDA: ${compError.message}`,
                    'ERROR'
                );
            }
        }

        throw {
            statusCode: error.statusCode || 500,
            message: `No se pudo completar la solicitud: ${error.message}`
        };
    }
};

module.exports = { solicitarTutoria };
