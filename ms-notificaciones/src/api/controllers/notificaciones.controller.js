// ms-notificaciones/src/api/controllers/notificaciones.controller.js
const notificacionService = require('../../domain/services/notificacion.service');

const postNotificacion = async (req, res, next) => {
    try {
        const { canal } = req.params;
        const datosNotificacion = req.body;

        const logResultado = await notificacionService.enviarNotificacion(canal, datosNotificacion);

        res.status(202).json(logResultado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    postNotificacion
};