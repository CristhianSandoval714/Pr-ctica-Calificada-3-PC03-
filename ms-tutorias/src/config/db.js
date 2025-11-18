// ms-tutorias/src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5434, // Puerto para desarrollo local sin Docker
    user: process.env.DB_USER || 'user_tutorias',
    password: process.env.DB_PASSWORD || 'password_tutorias',
    database: process.env.DB_NAME || 'db_tutorias',
});

 pool.connect((err, client, release) => {
     if (err) {
         console.error('[ms-tutorias] Error al conectar con PostgreSQL:', err.stack);
     } else {
         console.log('[ms-tutorias] Conexión exitosa a PostgreSQL');
         release();
     }
 });

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};