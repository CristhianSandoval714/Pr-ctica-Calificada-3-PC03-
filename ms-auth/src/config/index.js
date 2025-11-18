// ms-auth/src/config/index.js
require('dotenv').config();

const config = {
    port: process.env.PORT || 4000,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
};

// Verificación de seguridad al arrancar
if (!config.jwt.secret) {
    throw new Error('FATAL ERROR: JWT_SECRET no está definida en las variables de entorno.');
}

module.exports = config;