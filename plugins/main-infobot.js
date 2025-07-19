let handler = async (m, { conn, isRowner }) => {
  let _muptime
  let totalreg = Object.keys(global.db.data.users).length
  let totalchats = Object.keys(global.db.data.chats).length
  let pp = 'https://o.uguu.se/FtBtfHiL.jpg'
  
  if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
      process.once('message', resolve)
      setTimeout(resolve, 1000)
    }) * 1000
  }
  let muptime = clockString(_muptime)
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))

  let fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  let hora = new Date().toLocaleTimeString('es-ES', { hour12: false })

  let txt = `*╭━━━〔 𝖨𝖭𝖥𝖮 𝖡𝖮𝖳 〕━━━╮*\n`
  txt += `┃ *Hola* 👋 *${m.pushName}*\n`
  txt += `┃ 📅 *${fecha}*\n`
  txt += `┃ ⏰ *Hora »* ${hora}\n`
  txt += `┃ 🕜 *Uptime »* ${muptime}\n`
  txt += `┃ 👤 *Chats Privados »* ${chats.length - groupsIn.length}\n`
  txt += `┃ 📚 *Grupos Unidos »* ${groupsIn.length}\n`
  txt += `┃ 💬 *Total de Chats »* ${chats.length}\n`
  txt += `┃ 🐢 *Usuarios Registrados »* ${totalreg}\n`
  txt += `┃ 😺 *Grupos Registrados »* ${totalchats}\n`
  txt += `┃ 🏳️ *Creador »* Ado\n`
  txt += `*╰━━━━━━━━━━━━━━━━━━━━╯*`

  await conn.sendFile(m.chat, pp, 'thumbnail.jpg', txt, m)
}

handler.help = ['status']
handler.tags = ['main']
handler.command = /^(info|estado|status|estate|state|stado|stats)$/i
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}