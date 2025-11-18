// ms-auth/src/api/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Imprimimos el error en la consola del servidor para tener un registro
    console.error(`[ERROR] ${new Date().toISOString()}: ${err.message}`);

    // Determinamos el código de estado. Si el error tiene uno, lo usamos. Si no, es un 500.
    const statusCode = err.statusCode || 500;
    
    // Determinamos el mensaje. Usamos el del error si está disponible, si no, uno genérico.
    const errorMessage = err.statusCode ? err.message : 'Ocurrió un error inesperado en el servidor.';

    // Enviamos una respuesta JSON estandarizada al cliente
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            statusCode: statusCode
        }
    });
};

module.exports = errorHandler;