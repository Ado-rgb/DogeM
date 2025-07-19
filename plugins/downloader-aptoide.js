import Scraper from "@SumiFX/Scraper"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
┃╹★ 🍬 *Poné el nombre de la app que querés bajar* 🍬
┃╹★
┃╹★ 📝 *Ejemplo:*
┃╹★ > *${usedPrefix + command}* WhatsApp
`)

  try {
    let { name, packname, update, size, thumbnail, dl_url } = await Scraper.aptoide(text)

    if (size.includes('GB') || parseFloat(size.replace(' MB', '')) > 300)
      return await m.reply('┃╹★ ⚠️ *La app pesa más de 300 MB, cancelé la descarga pa que no te pete el celu* ⚠️')

    let message = `
┃╹★ 🍭 *Info de la app:*          
┃╹★ ────────────────
┃╹★ 📌 *Nombre:* ${name}
┃╹★ 🆔 *Packname:* ${packname}
┃╹★ ⚖️ *Tamaño:* ${size}
┃╹★ ⏰ *Actualizado:* ${update}
`

    await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', message, m)
    await conn.sendMessage(
      m.chat,
      {
        document: { url: dl_url },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${name}.apk`,
      },
      { quoted: m }
    )
  } catch {
    await m.reply('┃╹★ ❌ *No encontré la app, prueba con otro nombre o revisa la ortografía* ❌')
  }
}

handler.help = ['apk <búsqueda>']
handler.tags = ['downloader']
handler.command = ['aptoide', 'apk']
//handler.limit = 5
export default handler
