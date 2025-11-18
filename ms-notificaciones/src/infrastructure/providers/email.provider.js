// ms-notificaciones/src/infrastructure/providers/email.provider.js

const enviarEmail = async (destinatario, asunto, cuerpo) => {
    console.log('--------------------------------------------------');
    console.log(`[EMAIL PROVIDER SIMULATOR]`);
    console.log(` Enviando email a: ${destinatario}`);
    console.log(`   Asunto: ${asunto}`);
    console.log(`   Cuerpo: "${cuerpo}"`);
    console.log('--------------------------------------------------');

    // En un caso real, aquí iría el código para llamar a la API del proveedor.
    // Simulamos que el proveedor nos responde que el envío fue exitoso.
    return { estado: 'ENTREGADO_A_PROVEEDOR_SIMULADO' };
};

module.exports = {
    enviarEmail
};