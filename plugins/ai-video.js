import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `⚠️ *Uso:* ${usedPrefix + command} [texto del video]`, m);

  try {
    let wait = await conn.sendMessage(m.chat, { text: '⏳ *Generando tu video...*' }, { quoted: m });
    let url = `https://api.nekorinn.my.id/ai-vid/videogpt?text=${encodeURIComponent(text)}`;

    let res = await fetch(url);
    if (!res.ok) throw `Error: ${res.statusText}`;
    let buffer = await res.buffer();

    await conn.sendMessage(m.chat, { video: buffer, caption: `🎬 *Aquí está tu video:* ${text}` }, { quoted: m });
    await conn.sendMessage(m.chat, { delete: wait.key }); // Borra el mensaje de espera
  } catch (e) {
    conn.reply(m.chat, `❌ Error generando video\n${e}`, m);
  }
};

handler.help = ['videoai <texto>'];
handler.tags = ['ia'];
handler.command = /^videoai$/i;

export default handler;