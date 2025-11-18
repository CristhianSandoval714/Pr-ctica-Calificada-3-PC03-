// En cada microservicio: src/api/middlewares/correlationId.middleware.js
const { randomUUID } = require('crypto');

const correlationIdMiddleware = (req, res, next) => {
    const correlationId = req.header('X-Correlation-ID') || randomUUID();
    req.correlationId = correlationId; // Lo adjuntamos al objeto request
    res.setHeader('X-Correlation-ID', correlationId); // Lo devolvemos en la respuesta
    next();
};

module.exports = correlationIdMiddleware;