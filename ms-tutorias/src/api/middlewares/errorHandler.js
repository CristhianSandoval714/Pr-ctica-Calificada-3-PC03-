// src/api/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    //console.error(`[ERROR] ${new Date().toISOString()}: ${err.message}`);
    console.error(`[ERROR] ${new Date().toISOString()}:`, err);

    const statusCode = err.statusCode || 500;
    //const errorMessage = err.statusCode ? err.message : 'Ocurrió un error inesperado en el servidor.';

    // Si el error no tiene un mensaje, proporcionamos uno genérico.
    const errorMessage = err.message || 'Ocurrió un error inesperado en el servidor.';

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            statusCode: statusCode
        }
    });
};

module.exports = errorHandler;