// ms-agenda/src/config/index.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3002,
    rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
    // Las config de BD ya se leen desde db.js
};