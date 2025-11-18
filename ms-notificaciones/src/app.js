// ms-notificaciones/src/app.js
const express = require('express');
const config = require('./config');
const notificacionesRouter = require('./api/routes/notificaciones.routes');
const errorHandler = require('./api/middlewares/errorHandler'); // Reutilizamos el mismo middleware
const correlationIdMiddleware = require('./api/middlewares/correlationId.middleware.js');
const amqp = require('amqplib'); 
const notificacionService = require('./domain/services/notificacion.service'); //  Importar el servicio de notificaciones
const messageProducer = require('./infrastructure/messaging/message.producer'); // <-- IMPORTAR PRODUCTOR

const PORT = process.env.PORT || 3003;

const app = express();
app.use(express.json());
app.use(correlationIdMiddleware); // Middleware para manejar el Correlation ID
app.use('/notificaciones', notificacionesRouter);

// Mantenemos la API (quizás para futuras rutas /status)
// const notificacionesRouter = require('./api/routes/notificaciones.routes');
// app.use('/notificaciones', notificacionesRouter); // <-- Comentamos esto, ya no recibimos POSTs
app.use(errorHandler);

// --- Lógica del Consumidor de RabbitMQ ---
const startConsumer = async () => {
    let connection;
    try {
        connection = await amqp.connect(config.rabbitmqUrl);
        const channel = await connection.createChannel();

        const queueName = 'notificaciones_email_queue';
        await channel.assertQueue(queueName, { durable: true });

        // prefetch(1) asegura que el worker solo tome 1 mensaje a la vez.
        // No tomará el siguiente hasta que haga 'ack' (acuse) del actual.
        channel.prefetch(1); 

        console.log(`[MS_Notificaciones] Esperando mensajes en la cola: ${queueName}`);

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                let payload;
                try {
                    // 1. Parsear el mensaje
                    payload = JSON.parse(msg.content.toString());
                    console.log(`[MS_Notificaciones] Mensaje recibido de RabbitMQ:`, JSON.stringify(payload));

                    // 2. Procesar el mensaje usando nuestro servicio
                    await notificacionService.enviarEmailNotificacion(payload);

                    // 3. Confirmar (ack) que el mensaje fue procesado exitosamente
                    channel.ack(msg);
                    console.log(`[MS_Notificaciones] Mensaje procesado y confirmado (ack).`);

                } catch (error) {
                    console.error(`[MS_Notificaciones] Error al procesar mensaje: ${error.message}`, payload);
                    // 4. Rechazar (nack) el mensaje. false = no volver a encolar (o true si quieres reintentar)
                    // Podríamos moverlo a una cola de "dead-letter" (DLQ) en un futuro.
                    channel.nack(msg, false, false);
                    console.log(`[MS_Notificaciones] Mensaje rechazado (nack).`);
                }
            }
        }, {
            noAck: false // Importante: Requerimos confirmación manual (ack/nack)
        });

    } catch (error) {
        console.error('[MS_Notificaciones] Error al conectar/consumir de RabbitMQ:', error.message);
        setTimeout(startConsumer, 5000); // Reintentar conexión en 5 segundos
    }
};

// app.listen(PORT, () => {
//     console.log(`MS_Notificaciones escuchando en el puerto ${PORT}`);
// });

// Iniciar el servidor y el consumidor de RabbitMQ
app.listen(config.port, () => {
    console.log(`MS_Notificaciones (API) escuchando en el puerto ${config.port}`);
    startConsumer();
    messageProducer.connect(); // <-- INICIAR CONEXIÓN DEL PRODUCTOR
});