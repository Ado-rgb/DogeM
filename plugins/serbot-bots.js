import ws from 'ws'

async function handler(m, { conn: stars, usedPrefix }) {
  let connectedSubBots = []
  let mentionedJids = []; // Array para almacenar los JIDs para las menciones

  // Iterar sobre los sub-bots en global.conns
  Object.values(global.conns).forEach((conn) => {
    // Validar que la conexión exista, que el usuario esté definido
    // y que el socket de WebSocket no esté en estado 'CLOSED' (cerrado)
    // y que el estado de conexión sea 'open'
    if (conn && conn.user && conn.ws.socket && conn.ws.socket.readyState === ws.OPEN && conn.connection === 'open') {
      connectedSubBots.push(conn); // Añadir el objeto de conexión
      // Asegurarse de que el JID esté en formato completo (número@s.whatsapp.net) para las menciones
      mentionedJids.push(conn.user.jid); 
    }
  });

  // Si no hay sub-bots conectados, enviar un mensaje específico
  if (connectedSubBots.length === 0) {
    let responseMessage = `*🤖 No hay sub-bots conectados en este momento.*`;
    await stars.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
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
}

handler.command = ['listjadibot', 'bots', 'subbots']; // Añadí 'subbots' como alias
handler.help = ['bots', 'subbots'];
handler.tags = ['serbot'];
export default handler;
