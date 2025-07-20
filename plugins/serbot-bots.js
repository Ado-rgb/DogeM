import ws from 'ws' // Ya lo tienes, solo para asegurarnos

async function handler(m, { conn: stars, usedPrefix }) {
  let uniqueUsers = new Map()

  // Iterar sobre las propiedades del objeto global.conns
  // Object.values() nos da un array con todos los objetos de conexión de los sub-bots
  Object.values(global.conns).forEach((conn) => {
    // Validar que la conexión exista, que el usuario esté definido (es decir, que haya iniciado sesión)
    // y que el socket de WebSocket no esté en estado 'CLOSED' (cerrado)
    if (conn && conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  // Añadir también el bot principal si está conectado
  if (stars.user && stars.ws.socket && stars.ws.socket.readyState !== ws.CLOSED) {
    uniqueUsers.set(stars.user.jid, stars)
  }

  let users = [...uniqueUsers.values()] // Convertir el Map a un array de conexiones activas

  let message = users.map((v, index) => {
    const jid = v.user.jid.replace(/[^0-9]/g, ''); // Limpiar el JID para el número
    const name = v.user.name || v.user.verifiedName || '-'; // Obtener el nombre del usuario
    return `*${index + 1}.-* @${jid}\n*Link:* https://wa.me/${jid}\n*Nombre:* ${name}`;
  }).join('\n\n');

  let replyMessage = message.length === 0 ? 'No hay bots conectados.' : message;
  let totalUsers = users.length;
  let responseMessage = `*Total de Bots* : ${totalUsers}\n\n${replyMessage.trim()}`.trim();

  await stars.sendMessage(m.chat, { text: responseMessage, mentions: stars.parseMention(responseMessage) }, { quoted: m });
}

handler.command = ['listjadibot', 'bots'];
handler.help = ['bots'];
handler.tags = ['serbot'];
export default handler;
