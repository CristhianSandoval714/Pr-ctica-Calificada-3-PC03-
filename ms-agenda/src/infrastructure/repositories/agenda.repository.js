// ms-agenda/src/infrastructure/repositories/agenda.repository.js
// const { randomUUID } = require('crypto'); // Para generar IDs únicos

// // --- Base de Datos Simulada (en memoria) ---
// const bloqueosDB = [
//     {
//         idBloqueo: 'blk-preexistente-123',
//         idTutor: 't54321', // Dr. Carlos Rojas
//         fechaInicio: new Date('2025-10-22T10:00:00.000Z'),
//         duracionMinutos: 60,
//         idEstudiante: 'e12345'
//     }
// ];
// // ---------------------------------------------

// const findBloqueosByTutor = async (idTutor) => {
//     return bloqueosDB.filter(b => b.idTutor === idTutor);
// };

// const saveBloqueo = async (datosBloqueo) => {
//     const nuevoBloqueo = {
//         idBloqueo: randomUUID(),
//         ...datosBloqueo
//     };
//     bloqueosDB.push(nuevoBloqueo);
//     return nuevoBloqueo;
// };

// module.exports = {
//     findBloqueosByTutor,
//     saveBloqueo
// };

// ms-agenda/src/infrastructure/repositories/agenda.repository.js
const db = require('../../config/db');

const findBloqueosByTutor = async (idTutor) => {
    // Seleccionamos también idBloqueo por si acaso
    const queryText = 'SELECT idBloqueo, idTutor, fechaInicio, duracionMinutos, idEstudiante FROM bloqueos WHERE idTutor = $1 ORDER BY fechaInicio ASC';
    try {
        const res = await db.query(queryText, [idTutor]);
        return res.rows; // Retorna un array de bloqueos
    } catch (err) {
        console.error('Error ejecutando query findBloqueosByTutor:', err.stack);
        throw err;
    }
};

const saveBloqueo = async (datosBloqueo) => {
    const { idTutor, fechaInicio, duracionMinutos, idEstudiante } = datosBloqueo;
    // Quitamos idBloqueo porque lo genera la BD
    const queryText = 'INSERT INTO bloqueos(idTutor, fechaInicio, duracionMinutos, idEstudiante) VALUES($1, $2, $3, $4) RETURNING *'; // RETURNING * devuelve la fila insertada
    try {
        const res = await db.query(queryText, [idTutor, fechaInicio, duracionMinutos, idEstudiante]);
        return res.rows[0]; // Retorna el bloqueo recién creado con su ID
    } catch (err) {
        console.error('Error ejecutando query saveBloqueo:', err.stack);
        throw err;
    }
};

module.exports = {
    findBloqueosByTutor,
    saveBloqueo
};