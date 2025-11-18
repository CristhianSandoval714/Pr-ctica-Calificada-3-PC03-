// ms-notificaciones/src/config/index.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3003,
    rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
};