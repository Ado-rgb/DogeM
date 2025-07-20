import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `*${xia} Por favor, ingresa una expresión matemática para resolver.*`, m)
  try {
    conn.sendPresenceUpdate('composing', m.chat) // Writing
    const url = `https://api.nekorinn.my.id/ai/aimath?text=${encodeURIComponent(text)}`
    let res = await fetch(url)
    let json = await res.json()
    if (json.status && json.result) {
      await m.reply(`${json.result}`)
    } else {
      await m.reply(`*✖️ No se pudo resolver la expresión.*`)
    }
  } catch (e) {
    console.error(e)
    await m.reply(`*✖️ Ocurrió un error al procesar tu solicitud.*`)
  }
}

handler.help = ['aimath']
handler.tags = ['ia']
handler.command = ['aimath', 'mathai', 'iamath']

export default handler