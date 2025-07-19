let handler = async (m, { conn }) => {
  let vcard = `BEGIN:VCARD
VERSION:3.0
N:Ado;;;
FN:Ado
ORG:DOGE Bot
TITLE:Creador
item1.TEL;waid=50493732693:+50493732693
item1.X-ABLabel:Creador del DOGE Bot
END:VCARD`;

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: 'Ado - DOGE Bot',
      contacts: [{ vcard }]
    }
  }, { quoted: m });
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;