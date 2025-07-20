import ws from 'ws'

async function handler(m, { conn: stars, usedPrefix }) {
  let connectedBots = []

  // 1. Añadir el bot principal a la lista si está activo
  if (stars.user && stars.ws.socket && stars.ws.socket.readyState !== ws.CLOSED) {
    connectedBots.push({
      type: 'main', // Identificador para el bot principal
      conn: stars // La conexión del bot principal
    });
  }

  // 2. Iterar sobre los sub-bots en global.conns
  // Object.values() nos da un array con todos los objetos de conexión de los sub-bots
  Object.values(global.conns).forEach((conn) => {
    if (conn && conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      connectedBots.push({
        type: 'sub', // Identificador para los sub-bots
        conn: conn // La conexión del sub-bot
      });
    }
  });

  let message = connectedBots.map((item, index) => {
    const v = item.conn; // Obtenemos el objeto de conexión
    const jid = v.user.jid.replace(/[^0-9]/g, ''); // Limpiar el JID para el número
    const name = v.user.name || v.user.verifiedName || '-'; // Obtener el nombre del usuario
    const botType = item.type === 'main' ? 'Principal' : 'Sub-Bot'; // Definir el tipo de bot

    return `*${index + 1}.- ${botType}*\n*Número:* @${jid}\n*Link:* https://wa.me/${jid}\n*Nombre:* ${name}`;
  }).join('\n\n');

  let replyMessage = message.length === 0 ? 'No hay bots conectados.' : message;
  let totalUsers = connectedBots.length;
  let responseMessage = `*Total de Bots Conectados* : ${totalUsers}\n\n${replyMessage.trim()}`.trim();

  await stars.sendMessage(m.chat, { text: responseMessage, mentions: stars.parseMention(responseMessage) }, { quoted: m });
}

handler.command = ['listjadibot', 'bots'];
handler.help = ['bots'];
handler.tags = ['serbot'];
export default handler;
