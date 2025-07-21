import ws from 'ws'
import chalk from 'chalk'

async function handler(m, { conn: stars, usedPrefix }) {
  let connectedSubBots = []
  let mentionedJids = []; // Array para almacenar los JIDs para las menciones

  console.log(chalk.blue('--- Iniciando verificación de sub-bots para el comando .bots ---'));
  console.log(chalk.blue(`Número de entradas iniciales en global.conns: ${Object.keys(global.conns).length}`));

  // Añadir una pequeña demora para permitir que los estados de conexión se asienten
  // Esto es un intento de solucionar posibles problemas de "race condition"
  await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo

  console.log(chalk.blue(`Número de entradas en global.conns después de 1 segundo: ${Object.keys(global.conns).length}`));

  // Iterar sobre los sub-bots en global.conns
  // Usamos Object.entries para obtener tanto el ID como el objeto de conexión
  for (const [subBotId, conn] of Object.entries(global.conns)) {
    
    // Validar que la conexión exista y que el usuario esté definido
    if (!conn || !conn.user) {
      console.log(chalk.yellow(`[DEBUG] Sub-bot ${subBotId}: Objeto de conexión o usuario no encontrado en global.conns. Saltando.`));
      continue; // Saltar a la siguiente iteración
    }

    // Validar el estado del WebSocket
    // ws.OPEN (1) significa que el socket está conectado y listo
    const isWsSocketOpen = conn.ws.socket && conn.ws.socket.readyState === ws.OPEN;
    
    // Validar el estado de conexión de Baileys
    // conn.connection === 'open' es el estado más fiable de Baileys
    const isBaileysStatusOpen = conn.connection === 'open';

    console.log(chalk.cyan(`[DEBUG] Procesando Sub-bot: ${subBotId} (JID: ${conn.user.jid})`));
    console.log(chalk.cyan(`  - Estado Baileys (conn.connection): '${conn.connection}' (Esperado: 'open')`));
    console.log(chalk.cyan(`  - Estado WebSocket (conn.ws.socket.readyState): ${conn.ws.socket ? conn.ws.socket.readyState : 'No hay socket'} (Esperado: ${ws.OPEN} - OPEN)`));
    console.log(chalk.cyan(`  - ¿WebSocket Abierto (isWsSocketOpen)? ${isWsSocketOpen}`));
    console.log(chalk.cyan(`  - ¿Baileys Abierto (isBaileysStatusOpen)? ${isBaileysStatusOpen}`));

    if (isWsSocketOpen && isBaileysStatusOpen) {
      connectedSubBots.push(conn); // Añadir el objeto de conexión
      mentionedJids.push(conn.user.jid); // Añadir el JID completo para las menciones
      console.log(chalk.green(`  -> Sub-bot ${subBotId} DETECTADO COMO CONECTADO Y FUNCIONAL.`));
    } else {
      console.log(chalk.red(`  -> Sub-bot ${subBotId} NO ESTÁ CONECTADO (uno o ambos estados no son 'open').`));
    }
  }

  // Si no hay sub-bots conectados, enviar un mensaje específico
  if (connectedSubBots.length === 0) {
    let responseMessage = `*🤖 No hay sub-bots conectados en este momento.*`;
    await stars.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
    console.log(chalk.red('--- No se encontraron sub-bots conectados. ---'));
    return; // Salir de la función
  }

  // Generar el mensaje con la información de los sub-bots
  let message = connectedSubBots.map((v, index) => {
    // Limpiar el JID para obtener solo el número
    const jidNumber = v.user.jid.replace(/[^0-9]/g, ''); 
    const name = v.user.name || v.user.verifiedName || 'Sin Nombre'; // Obtener el nombre o un valor predeterminado

    return `*${index + 1}.- Sub-Bot*\n*Número:* @${jidNumber}\n*Enlace:* https://wa.me/${jidNumber}\n*Nombre:* ${name}`;
  }).join('\n\n');

  let totalSubBots = connectedSubBots.length;
  let responseMessage = `*📊 Total de Sub-Bots Conectados:* ${totalSubBots}\n\n${message.trim()}`.trim();

  // Enviar el mensaje, incluyendo las menciones
  await stars.sendMessage(m.chat, { 
    text: responseMessage, 
    mentions: mentionedJids 
  }, { quoted: m });

  console.log(chalk.green(`--- Comando .bots ejecutado con éxito. Se listaron ${totalSubBots} sub-bots. ---`));
}

handler.command = ['listjadibot', 'bots', 'subbots']; 
handler.help = ['bots', 'subbots'];
handler.tags = ['serbot'];
export default handler;
