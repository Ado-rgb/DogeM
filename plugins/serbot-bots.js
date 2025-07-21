import chalk from 'chalk';
import fs from 'fs'; // Asegúrate de que fs esté importado para leer bots.json
import path from 'path';

const handler = async (m, { conn, command, isOwner }) => {
    // Si no es el propietario, no tiene acceso
    if (!isOwner) {
        return m.reply('Solo el propietario puede usar este comando.');
    }

    const subBotId = m.text.split(' ')[1]; // Extraer el ID si se proporciona

    if (subBotId) {
        // Lógica para manejar comandos específicos para un sub-bot, si los quieres añadir en el futuro
        // Por ahora, solo lista el estado general
        return m.reply(`Función para manejar sub-bot específico '${subBotId}' aún no implementada.`);
    }

    let response = '';
    const connectedSubBotsFile = './bots.json'; // Ruta al archivo bots.json
    let knownSubBots = [];

    // Cargar IDs de sub-bots conocidos desde bots.json
    if (fs.existsSync(connectedSubBotsFile)) {
        try {
            knownSubBots = JSON.parse(fs.readFileSync(connectedSubBotsFile, 'utf8'));
            if (!Array.isArray(knownSubBots)) {
                console.error(chalk.red('[.bots] bots.json no es un array válido.'));
                knownSubBots = [];
            }
        } catch (e) {
            console.error(chalk.red(`[.bots] Error al leer bots.json: ${e}`));
            knownSubBots = [];
        }
    }

    // Obtener los IDs de los sub-bots de la carpeta serbot
    const serbotDir = './serbot';
    let subBotDirs = [];
    if (fs.existsSync(serbotDir)) {
        subBotDirs = fs.readdirSync(serbotDir).filter(f => fs.statSync(path.join(serbotDir, f)).isDirectory());
    }

    // Combinar IDs conocidos y IDs de directorio para tener una lista completa de sub-bots a verificar
    const allSubBotIds = [...new Set([...knownSubBots, ...subBotDirs])]; // Combina y elimina duplicados

    if (allSubBotIds.length === 0) {
        response = `*🤖 No hay sub-bots configurados o conectados en este momento.*`;
    } else {
        response += `*🤖 Estado de Sub-bots:*\n\n`;
        let connectedCount = 0;
        let disconnectedCount = 0;
        let unknownCount = 0;

        for (const id of allSubBotIds) {
            const subConn = global.conns[id];
            const hasCreds = fs.existsSync(path.join(serbotDir, id, 'creds.json'));

            response += `*ID:* \`${id}\`\n`;
            response += `  - *Sesión Existente:* ${hasCreds ? '✅ Sí' : '❌ No'}\n`;

            if (subConn) {
                const connectionStatus = subConn.connection; // 'open', 'close', 'connecting'
                const wsReadyState = subConn.ws?.socket?.readyState; // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED

                // Información detallada para depuración (solo en consola)
                console.log(chalk.magenta(`[COMMAND: .bots][DEBUG] Procesando Sub-bot: ${id}`));
                console.log(chalk.magenta(`  - Baileys Connection Status (conn.connection): '${connectionStatus}' (Expected: 'open')`));
                console.log(chalk.magenta(`  - WebSocket readyState (conn.ws.socket.readyState): ${wsReadyState} (Expected: 1 - OPEN)`));

                if (connectionStatus === 'open' && wsReadyState === 1) {
                    response += `  - *Estado:* ${chalk.green('✅ Conectado')}\n`;
                    connectedCount++;
                } else if (connectionStatus === 'connecting' || wsReadyState === 0) {
                    response += `  - *Estado:* ${chalk.yellow('🟡 Conectando...')}\n`;
                    unknownCount++;
                } else if (connectionStatus === 'close' || wsReadyState === 2 || wsReadyState === 3) {
                    response += `  - *Estado:* ${chalk.red('❌ Desconectado')}\n`;
                    disconnectedCount++;
                } else {
                    response += `  - *Estado:* ${chalk.gray('❓ Desconocido/Problema')}\n`;
                    unknownCount++;
                }
            } else {
                response += `  - *Estado:* ${chalk.gray('❓ No cargado en memoria')}\n`;
                if (hasCreds) {
                    response += `    _Puede que necesite un reinicio para cargar._\n`;
                }
                unknownCount++;
            }
            response += '\n'; // Espacio entre cada bot
        }

        response += `*Resumen:*\n`;
        response += `  - ✅ Conectados: ${connectedCount}\n`;
        response += `  - ❌ Desconectados: ${disconnectedCount}\n`;
        response += `  - ❓ Pendientes/Desconocidos: ${unknownCount}\n`;
    }

    m.reply(response);
};

handler.help = ['bots'];
handler.tags = ['owner'];
handler.command = ['bots', 'subbots'];
export default handler;
