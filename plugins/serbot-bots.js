import ws from 'ws'

async function handler(m, { conn: stars, usedPrefix }) {
  let connectedSubBots = []

  // Iterar solo sobre los sub-bots en global.conns
  // Object.values() nos da un array con todos los objetos de conexión de los sub-bots
  Object.values(global.conns).forEach((conn) => {
    // Validar que la conexión exista, que el usuario esté definido
    // y que el socket de WebSocket no esté en estado 'CLOSED' (cerrado)
    if (conn && conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      connectedSubBots.push(conn); // Añadir directamente el objeto de conexión
    }
  });

  // Si no hay sub-bots conectados, enviar un mensaje específico
  if (connectedSubBots.length === 0) {
    let responseMessage = `*No hay sub-bots conectados en este momento.*`;
    await stars.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
    return; // Salir de la función
  }

  // Generar el mensaje con la información de los sub-bots
  let message = connectedSubBots.map((v, index) => {
    const jid = v.user.jid.replace(/[^0-9]/g, ''); // Limpiar el JID para el número
    const name = v.user.name || v.user.verifiedName || '-'; // Obtener el nombre del usuario

    return `*${index + 1}.- Sub-Bot*\n*Número:* @${jid}\n*Link:* https://wa.me/${jid}\n*Nombre:* ${name}`;
  }).join('\n\n');

  let totalSubBots = connectedSubBots.length;
  let responseMessage = `*Total de Sub-Bots Conectados* : ${totalSubBots}\n\n${message.trim()}`.trim();

  await stars.sendMessage(m.chat, { text: responseMessage, mentions: stars.parseMention(responseMessage) }, { quoted: m });
}

handler.command = ['listjadibot', 'bots'];
handler.help = ['bots'];
handler.tags = ['serbot'];
export default handler;
