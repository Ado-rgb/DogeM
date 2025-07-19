import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  if (!text) {
    return m.reply(
`*╭━💚〔 BÚSQUEDA GOOGLE 〕💚━╮*
┃ 🔍 Escribe qué quieres buscar
┃ 🌿 Ejemplo: *.google memes divertidos*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
    );
  }

  const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status) {
      return m.reply(
`*╭━❌〔 ERROR 〕❌━╮*
┃ ⚠️ No se pudo realizar la búsqueda
*╰━━━━━━━━━━━━╯*`
      );
    }

    let replyMessage = `*╭━✅〔 RESULTADOS 〕✅━╮*\n`;
    result.data.slice(0, 5).forEach((item, i) => {
      replyMessage += `┃ *${i + 1}. ${item.title}*\n`;
      replyMessage += `┃ 🌱 ${item.description}\n`;
      replyMessage += `┃ 🔗 ${item.url}\n`;
      if (i !== 4) replyMessage += `┃─────────────────────\n`;
    });
    replyMessage += `*╰━━━━━━━━━━━━━━━━━━━━━╯*`;

    await m.react('✅');
    m.reply(replyMessage);

  } catch (error) {
    console.error('Error en la API Google:', error);
    m.reply(
`*╭━❌〔 ERROR 〕❌━╮*
┃ ⚠️ Ocurrió un error al obtener resultados
*╰━━━━━━━━━━━━╯*`
    );
  }
};

handler.command = ['google'];
handler.tags = ['search', 'tools'];
handler.help = ['google <texto>'];

export default handler;