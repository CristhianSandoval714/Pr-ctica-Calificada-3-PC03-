// client-mobile-sim/index.js
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const solicitarTutoriaScenario = require('./src/scenarios/solicitarTutoria');

yargs(hideBin(process.argv))
    .command(
        'solicitar',
        'Ejecuta el escenario de solicitud de tutoría de forma segura',
        (yargs) => {
            return yargs
                // --- PARÁMETROS ACTUALIZADOS ---
                .option('username', { describe: 'Nombre de usuario para login', type: 'string', demandOption: true })
                .option('password', { describe: 'Contraseña para login', type: 'string', demandOption: true })
                .option('idTutor', { describe: 'ID del tutor', type: 'string', demandOption: true })
                .option('fecha', { describe: 'Fecha solicitada (ISO 8601)', type: 'string', demandOption: true })
                .option('materia', { describe: 'Materia de la tutoría', type: 'string', demandOption: true })
                .option('duracion', { describe: 'Duración en minutos', type: 'number', default: 60 });
        },
        (argv) => {
            solicitarTutoriaScenario.run(argv);
        }
    )
    .demandCommand(1, 'Debes especificar un comando.')
    .help()
    .argv;