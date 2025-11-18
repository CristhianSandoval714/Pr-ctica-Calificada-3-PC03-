// ms-agenda/src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433, // Puerto para desarrollo local sin Docker
    user: process.env.DB_USER || 'user_agenda',
    password: process.env.DB_PASSWORD || 'password_agenda',
    database: process.env.DB_NAME || 'db_agenda',
});

pool.connect((err, client, release) => {
     if (err) {
         console.error('[ms-agenda] Error al conectar con PostgreSQL:', err.stack);
     } else {
         console.log('[ms-agenda] Conexión exitosa a PostgreSQL');
         release();
     }
 });

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};