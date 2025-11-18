// ms-auth/src/api/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/token', authController.postToken);

// ESTA LÍNEA ES CRUCIAL. Si falta, authRouter será un objeto vacío.
module.exports = router;