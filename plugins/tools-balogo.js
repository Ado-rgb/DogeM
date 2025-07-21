let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (args.length < 2) return m.reply(`*Por favor ingresa el comando más el texto uno y dos.*\n> *\`Ejemplo:\`* ${usedPrefix + command} Ado cat`);
  await conn.sendMessage(m.chat, {
    image: {
      url: 'https://api.nekorinn.my.id/maker/ba-logo?textL=' + encodeURIComponent(args[0]) + '&textR=' + encodeURIComponent(args.slice(1).join(' '))
    }
  }, { quoted: m });
};

handler.help = ['balogo'];
handler.command = ['balogo'];
handler.tags = ['logo']

export default handler;