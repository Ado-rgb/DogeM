let handler = async (m, { conn }) => {
  try {
    switch (m.text.toLowerCase()) {
      case 'hola':
        conn.sendPresenceUpdate('recording', m.chat);
        await conn.sendFile(m.chat, 'https://qu.ax/HPeS.mp3', 'hola.mp3', null, m, true, { type: 'audioMessage' });
        break;
      
      default:
        break;
    }
  } catch (err) {
    console.error(err);
    m.reply('Ocurrió un error al enviar el audio.');
  }
};

handler.customPrefix = /^(hola)/i;
handler.command = new RegExp();

export default handler;
