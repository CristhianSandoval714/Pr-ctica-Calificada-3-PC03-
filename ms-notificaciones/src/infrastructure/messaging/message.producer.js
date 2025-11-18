// ms-agenda/src/infrastructure/messaging/message.producer.js
const amqp = require('amqplib');
const { rabbitmqUrl } = require('../../config');

let channel = null;
const EXCHANGE_NAME = 'tracking_events_exchange';

const connect = async () => {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: true });
        console.log('[MS_Agenda] Conectado a RabbitMQ y exchange de tracking asegurado.');
    } catch (error) {
        console.error('[MS_Agenda] Error al conectar con RabbitMQ:', error.message);
        setTimeout(connect, 5000);
    }
};

// (copia aquí las funciones 'publishTrackingEvent' y 'track'
//  del message.producer.js de ms-usuarios, cambiando el 
//  nombre del servicio en track() a 'MS_Agenda')

const publishTrackingEvent = async (payload) => {
    if (!channel) { return; }
    try {
        const messageBuffer = Buffer.from(JSON.stringify(payload));
        channel.publish(EXCHANGE_NAME, '', messageBuffer);
    } catch (error) {
        console.error(`[MS_Agenda] Error al publicar evento de tracking:`, error.message);
    }
};

const MS_Notificaciones = (cid, message, status = 'INFO') => {
    publishTrackingEvent({
        service: 'MS_Agenda', // <-- CAMBIO AQUÍ
        message,
        cid,
        timestamp: new Date(),
        status
    });
};

module.exports = {
    connect,
    MS_Notificaciones
};