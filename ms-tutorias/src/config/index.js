// ms-tutorias/src/config/index.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000, // Puerto del servicio de tutorías
    usuariosServiceUrl: process.env.MS_USUARIOS_URL, // URL del servicio de usuarios
    agendaServiceUrl: process.env.MS_AGENDA_URL, // URL del servicio de agenda
    notificacionesServiceUrl: process.env.MS_NOTIFICACIONES_URL, // URL del servicio de notificaciones
    jwtSecret: process.env.JWT_SECRET, // Secreto para JWT
    rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672' // URL de conexión a RabbitMQ 
};