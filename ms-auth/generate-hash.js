// ms-auth/generate-hash.js

const bcrypt = require('bcryptjs');

// Las contraseñas en texto plano que queremos hashear
const plainPasswords = ['password_ana', 'password_elena'];
const saltRounds = 10; // Factor de coste para el hasheo

console.log('Generando hashes de contraseña...');
console.log('---------------------------------');

plainPasswords.forEach(password => {
    // Usamos la versión síncrona para un script simple
    try {
        const hash = bcrypt.hashSync(password, saltRounds);
        console.log(`\nContraseña en texto plano: ${password}`);
        console.log(`Hash generado: ${hash}`);
    } catch (err) {
        console.error('Error al generar el hash para:', password, err);
    }
});