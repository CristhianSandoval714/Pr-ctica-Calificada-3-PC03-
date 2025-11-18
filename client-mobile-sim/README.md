te ejecutado todos los microservicios
y en la terminal de este cliente ejecuta
node index.js solicitar \
--username "ana.torres" \
--password "password_ana" \
--idTutor "t09876" \
--fecha "2025-12-10T11:00:00Z" \
--materia "Cálculo Multivariable"



# Elaboración de Pruebas de Ejecución 
# 1. Flujo exitoso
node index.js solicitar \
--username "ana.torres" \
--password "password_ana" \
--idTutor "t09876" \
--fecha "2025-12-10T11:00:00Z" \
--materia "Cálculo Multivariable"

# 2. Contraseña Incorrecta 
node index.js solicitar \
--username "ana.torres" \
--password "password_INCORRECTA" \
--idTutor "t09876" \
--fecha "2025-12-10T12:00:00Z" \
--materia "Cálculo Multivariable"

# 3. Un tutor solicita
node index.js solicitar \
--username "elena.solano" \
--password "password_elena" \
--idTutor "t09876" \
--fecha "2025-12-10T13:00:00Z" \
--materia "Cálculo Multivariable"

# 4. Conflicto de Horario
# (Correr este comando por SEGUNDA vez)
node index.js solicitar \
--username "ana.torres" \
--password "password_ana" \
--idTutor "t09876" \
--fecha "2025-12-10T11:00:00Z" \
--materia "Cálculo Multivariable"

# 5. Falla Logica - usuario inexistente
node index.js solicitar \
--username "ana.torres" \
--password "password_ana" \
--idTutor "t-inventado" \
--fecha "2025-12-10T14:00:00Z" \
--materia "Cálculo Multivariable"

# 6. Prueba de Resilencia - Asincronia
node index.js solicitar \
--username "ana.torres" \
--password "password_ana" \
--idTutor "t09876" \
--fecha "2025-12-10T15:00:00Z" \
--materia "Cálculo Multivariable"