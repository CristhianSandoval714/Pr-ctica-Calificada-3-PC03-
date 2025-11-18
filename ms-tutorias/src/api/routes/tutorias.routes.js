// ms-tutorias/src/api/routes/tutorias.routes.js

const express = require('express');
const router = express.Router();
const tutoriasController = require('../controllers/tutorias.controller');
const verifyTokenMiddleware = require('../middlewares/jwt.middleware.js'); // <-- 1. Importar el middleware

// 2. Añadir el middleware a la ruta que queremos proteger.
// Se ejecutará DESPUÉS de recibir la petición y ANTES de que llegue al controlador.
router.post('/', verifyTokenMiddleware, tutoriasController.postSolicitud);

module.exports = router;