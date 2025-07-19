let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
  text = text.split(`|`)
  if (!text || text.length == 1) {
    return conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *🌙 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ✨ 𝗘𝗡𝗖𝗨𝗘𝗦𝗧𝗔 🌙*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🚩 *Ingresa la pregunta y opciones*
*┃*
*┃* *Ejemplo:*
*┃* > *${usedPrefix + command}* ¿DOGE BOT es el mejor bot?|si|no
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)
  }
  if (text.length > 1 && text.length < 3) {
    return m.reply(
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *⚠️ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ⚠️*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* Debes poner mínimo *2* opciones.
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`
    )
  }
  if (text.length > 13) {
    return m.reply(
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *⚠️ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ⚠️*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* Máximo *12* opciones permitidas.
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`
    )
  }

  let array = []
  text.slice(1).forEach(function (i) { array.push(i) })

  await conn.sendPoll(m.chat, text[0], array)
}

handler.tags = ['group']
handler.help = ['encuesta *<pregunta|opciones>*']
handler.command = ['encuesta', 'poll']
handler.group = true

export default handler