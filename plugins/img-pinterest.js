import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(
    `*╭━💚〔 BUSCADOR PINTEREST 〕💚━╮*\n` +
    `┃ ⚠️ Escribe qué quieres buscar\n` +
    `┃ 🌿 Ejemplo: *${usedPrefix + command} Twice*\n` +
    `*╰━━━━━━━━━━━━━━━━━━━━╯*`
  );

  try {
    const url = `https://delirius-apiofc.vercel.app/search/pinterest?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.status || !data.results || data.results.length === 0)
      return m.reply('*╭━❌〔 ERROR 〕❌━╮*\n┃ No encontré imágenes para esa búsqueda.\n*╰━━━━━━━━━━━━╯*');

    // Limitar a máximo 10 imágenes para no spamear
    let images = data.results.slice(0, 10);

    // Enviar las imágenes como mensaje con media
    for (let img of images) {
      await conn.sendMessage(m.chat, { image: { url: img }, caption: `🌿 Resultado de: *${text}*` }, { quoted: m });
    }

  } catch (e) {
    console.error('Error en búsqueda Pinterest:', e);
    m.reply('*╭━❌〔 ERROR 〕❌━╮*\n┃ Ocurrió un error al buscar en Pinterest.\n*╰━━━━━━━━━━━━╯*');
  }
};

handler.help = ['pinterest <texto>'];
handler.tags = ['search'];
handler.command = /^(pinterest|pin)$/i;
handler.register = true;
export default handler;