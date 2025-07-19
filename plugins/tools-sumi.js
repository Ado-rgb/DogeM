import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} haz un código JS que sume dos números`);
  }

  try {
    await m.react('🕒');

    const apiURL = `https://apiadonix.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);

    // Verifica que la respuesta sea JSON
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const textError = await res.text();
      await m.react('❌');
      return m.reply(`❌ La API devolvió un error:\n\n${textError}`);
    }

    const data = await res.json();

    if (!data || data.status !== 200) {
      await m.react('❌');
      return m.reply('❌ No se pudo procesar la respuesta de Adonix IA.');
    }

    if (data.imagen_generada) {
      await conn.sendMessage(m.chat, {
        image: { url: data.imagen_generada },
        caption: `🖼️ *${data.ia}*\n\n📌 _${data.pregunta}_\n${data.respuesta || ''}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    if (data.video) {
      await conn.sendMessage(m.chat, {
        video: { url: data.video },
        caption: `🎬 *${data.ia}*\n\n📌 _${data.pregunta}_\n${data.respuesta || ''}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    if (data.respuesta) {
      const respuestaFinal = `🌵 *${data.ia}*\n\n${data.respuesta}`;
      await m.reply(respuestaFinal);
      await m.react('✅');
      return;
    }

    await m.react('❌');
    return m.reply('❌ No se pudo procesar la respuesta de Adonix IA.');

  } catch (e) {
    console.error('[ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error al usar Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['ia'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ia', 'adonixia'];
handler.register = true;

export default handler;