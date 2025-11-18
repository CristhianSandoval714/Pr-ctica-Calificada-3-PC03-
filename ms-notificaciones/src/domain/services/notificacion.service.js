// ms-notificaciones/src/domain/services/notificacion.service.js
const { randomUUID } = require('crypto');
const emailProvider = require('../../infrastructure/providers/email.provider');
const { track } = require('../../infrastructure/messaging/message.producer'); // <-- IMPORTAR TRACK

const enviarNotificacion = async (canal, datosNotificacion) => {
    const { destinatario, asunto, cuerpo } = datosNotificacion;

    // --- BLOQUE DE VALIDACIÓN AÑADIDO ---
    if (!destinatario || !asunto || !cuerpo) {
        const error = new Error('Faltan datos requeridos en el cuerpo de la petición: se necesita destinatario, asunto y cuerpo.');
        error.statusCode = 400; // Bad Request
        throw error;
    }
    // ------------------------------------

    let resultadoEnvio;

    switch (canal.toLowerCase()) {
        case 'email':
            resultadoEnvio = await emailProvider.enviarEmail(destinatario, asunto, cuerpo);
            break;
        case 'sms':
            const smsError = new Error(`El canal 'sms' no está implementado.`);
            smsError.statusCode = 501; // Not Implemented
            throw smsError;
        default:
            const channelError = new Error(`El canal '${canal}' no es soportado.`);
            channelError.statusCode = 400; // Bad Request
            throw channelError;
    }

    const log = {
        logId: randomUUID(),
        canal: canal,
        destinatario: destinatario, // Ahora este valor sí existirá
        timestamp: new Date().toISOString(),
        estado: resultadoEnvio.estado
    };

    return log;
};

// Simplificamos: este servicio ahora solo sabe enviar emails basado en el payload
const enviarEmailNotificacion = async (payloadNotificacion) => {
    const { destinatario, asunto, cuerpo, correlationId } = payloadNotificacion;
    const cid = correlationId || randomUUID(); // Asegurar que tenemos un CID

    try {

        track(cid, `Procesando email para: ${destinatario}`);
        // Log con el CID
        console.log(`[MS_Notificaciones Service] - CID: ${correlationId || 'N/A'} - Procesando email para: ${destinatario}`);

        if (!destinatario || !asunto || !cuerpo) {
            const error = new Error('Datos incompletos para enviar email: se necesita destinatario, asunto y cuerpo.');
            error.statusCode = 400; // Bad Request
            throw new Error('Datos incompletos para enviar email');
        }

        const resultadoEnvio = await emailProvider.enviarEmail(destinatario, asunto, cuerpo);
        

        const log = {
            logId: randomUUID(),
            canal: 'email',
            destinatario: destinatario,
            timestamp: new Date().toISOString(),
            estado: resultadoEnvio.estado,
            correlationId: correlationId
        };

        track(cid, `Email simulado enviado a: ${destinatario}`);
        console.log(`[MS_Notificaciones Service] - CID: ${correlationId || 'N/A'} - Email simulado. Log:`, JSON.stringify(log));
        return log;

    } catch (error) {
        track(cid, `Error al enviar email: ${error.message}`, 'ERROR');
        throw error; // El consumidor (en app.js) manejará el nack()
    }
};


module.exports = {
    //enviarNotificacion
    enviarEmailNotificacion
};