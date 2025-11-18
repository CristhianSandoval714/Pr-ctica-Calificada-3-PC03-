// client-mobile-sim/index.js
require('dotenv').config(); // Cargar .env
const express = require('express');
const path = require('path');
const { solicitar } = require('./src/scenarios/solicitarTutoria');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de API para recibir la solicitud del formulario
app.post('/api/solicitar', async (req, res) => {
    console.log(`[API] Recibida solicitud POST en /api/solicitar`);
    try {
        // req.body contiene los datos del formulario (username, password, idTutor, etc.)
        const resultado = await solicitar(req.body);
        // Éxito
        res.status(201).json(resultado);
    } catch (error) {
        // Manejar errores
        console.error(`[API] Error en /api/solicitar: ${error.message}`);
        // Si el error viene de Axios (falla del backend), tendrá un 'response'
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.error || 'Error del backend' });
        } else {
            // Error interno del cliente (ej. fallo de login)
            res.status(500).json({ error: { message: error.message } });
        }
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Cliente Simulador Interactivo corriendo en http://localhost:${PORT}`);
});