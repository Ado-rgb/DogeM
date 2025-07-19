import Scraper from "@SumiFX/Scraper"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`
━━━〔 𝗠𝗲𝗱𝗶𝗮𝗳𝗶𝗿𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 〕━━━
⚡ Ingresa el enlace del archivo de Mediafire junto al comando
📝 *Ejemplo:*
> *${usedPrefix + command}* https://www.mediafire.com/file/433hbpsc95unywu/Oshi_no_Ko_01.mp4/file?dkey=jpivv6z5osa&r=1587
`)

  if (!args[0].match(/mediafire/gi))
    return m.reply('┃╹★ ❌ El enlace debe ser de un archivo de Mediafire.')

  try {
    let { title, ext, aploud, size, dl_url } = await Scraper.mediafire(args[0])

    if (size.includes('GB') || parseFloat(size.replace(' MB', '')) > 300)
      return await m.reply('┃╹★ ⚠️ El archivo pesa más de 300 MB, cancelé la descarga para evitar broncas.')

    let info = `
*╭━━━〔 𝖨𝖭𝖥𝖮 〕━━━╮*
┃╹★ ⭐ Nombre: ${title}
┃╹★ 🪴 Subido: ${aploud}
┃╹★ 📚 Tipo: ${ext}
┃╹★ ⚖ Tamaño: ${size}
*╰━━━━━━━━━━━━━━━━━╯*
`

    await m.reply(info)
    await conn.sendFile(m.chat, dl_url, title, null, m, null, {
      mimetype: ext,
      asDocument: true,
    })
  } catch {
    await m.reply('┃╹★ ❌ No encontré el archivo, revisa el enlace o inténtalo con otro.')
  }
}

handler.help = ['mediafire <url mf>']
handler.tags = ['downloader']
handler.command = ['mediafire', 'mdfire', 'mf']
handler.limit = 8

export default handler
