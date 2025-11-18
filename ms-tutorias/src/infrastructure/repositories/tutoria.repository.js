// const { randomUUID } = require('crypto');
// const tutoriasDB = [];

// const save = async (tutoria) => {
//     // Si la tutoría ya existe, la actualiza. Si no, la crea.
//     const index = tutoriasDB.findIndex(t => t.idTutoria === tutoria.idTutoria);
//     if (index !== -1) {
//         tutoriasDB[index] = tutoria;
//     } else {
//         tutoria.idTutoria = randomUUID();
//         tutoriasDB.push(tutoria);
//     }
//     return tutoria;
// };

// module.exports = { save };

// ms-tutorias/src/infrastructure/repositories/tutoria.repository.js
const db = require('../../config/db');

const save = async (tutoria) => {
    // Imprimimos el objeto recibido para depuración
    console.log('[TutoriaRepository] save() recibió:', JSON.stringify(tutoria));

    // Desestructuramos los campos del objeto tutoria
    const { idTutoria, idEstudiante, idTutor, fecha, materia, estado, error } = tutoria;

    if (idTutoria) {
        // --- Lógica de UPDATE ---
        console.log(`[TutoriaRepository] Ejecutando UPDATE para idTutoria: ${idTutoria}`);
        // Construimos los campos a actualizar dinámicamente para más flexibilidad (opcional pero robusto)
        const fields = [];
        const values = [];
        let paramIndex = 1;

        // Solo añadimos campos que realmente vienen en el objeto 'tutoria' para actualizar
        if (idEstudiante !== undefined) { fields.push(`idEstudiante = $${paramIndex++}`); values.push(idEstudiante); }
        if (idTutor !== undefined) { fields.push(`idTutor = $${paramIndex++}`); values.push(idTutor); }
        if (fecha !== undefined) { fields.push(`fecha = $${paramIndex++}`); values.push(fecha); }
        if (materia !== undefined) { fields.push(`materia = $${paramIndex++}`); values.push(materia); }
        if (estado !== undefined) { fields.push(`estado = $${paramIndex++}`); values.push(estado); }
        // Manejamos el error explícitamente (puede ser null)
        fields.push(`error = $${paramIndex++}`); values.push(error === undefined ? null : error);

        // Añadimos el idTutoria para la cláusula WHERE al final
        values.push(idTutoria);

        if (fields.length === 0) {
             console.warn(`[TutoriaRepository] UPDATE llamado para ${idTutoria} sin campos para actualizar.`);
             return tutoria; // Nada que actualizar, retornamos el objeto tal cual
        }

        const queryText = `
            UPDATE tutorias
            SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP
            WHERE idTutoria = $${paramIndex}
            RETURNING *`;

        console.log(`[TutoriaRepository] UPDATE Query: ${queryText}`);
        console.log(`[TutoriaRepository] UPDATE Values: ${JSON.stringify(values)}`);

        try {
            const res = await db.query(queryText, values);
            if (res.rows.length === 0) {
                throw new Error(`UPDATE fallido: No se encontró tutoría con id ${idTutoria}`);
            }
            console.log('[TutoriaRepository] UPDATE exitoso:', JSON.stringify(res.rows[0]));
            return res.rows[0];
        } catch (err) {
            console.error('[TutoriaRepository] Error ejecutando query UPDATE tutoria:', err.stack);
            console.error('[TutoriaRepository] UPDATE Query que falló:', queryText);
            console.error('[TutoriaRepository] UPDATE Values que fallaron:', JSON.stringify(values));
            throw err; // Re-lanzar el error para manejo superior
        }

    } else {
        // --- Lógica de INSERT ---
        console.log('[TutoriaRepository] Ejecutando INSERT');
        const queryText = `
            INSERT INTO tutorias(idEstudiante, idTutor, fecha, materia, estado, error)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        const insertValues = [idEstudiante, idTutor, fecha, materia, estado || 'PENDIENTE', error || null];

        console.log(`[TutoriaRepository] INSERT Query: ${queryText}`);
        console.log(`[TutoriaRepository] INSERT Values: ${JSON.stringify(insertValues)}`);

        try {
            // Validación adicional para evitar insertar con idEstudiante nulo
             if (idEstudiante == null) {
                console.error('[TutoriaRepository] ¡ERROR PREVIO AL INSERT! idEstudiante es null o undefined.');
                throw new Error('idEstudiante no puede ser null para un nuevo registro de tutoría.');
             }
            const res = await db.query(queryText, insertValues);
             console.log('[TutoriaRepository] INSERT exitoso:', JSON.stringify(res.rows[0]));
            return res.rows[0];
        } catch (err) { // Manejo de errores en INSERT
            console.error('[TutoriaRepository] Error ejecutando query INSERT tutoria:', err.stack);
            console.error('[TutoriaRepository] INSERT Query que falló:', queryText);
            console.error('[TutoriaRepository] INSERT Values que fallaron:', JSON.stringify(insertValues));
            throw err;
        }
    }
};

module.exports = { save };