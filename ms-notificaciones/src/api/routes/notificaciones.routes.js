const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificaciones.controller');

// Ruta dinámica que captura el canal (ej: /email, /sms)
router.post('/:canal', notificacionesController.postNotificacion);

module.exports = router;