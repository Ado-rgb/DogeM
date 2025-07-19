import Scraper from "@SumiFX/Scraper"

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return m.reply('⭐ Ingresa el nombre de la imágen que estas buscando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 𝑺𝑰𝑺𝑲𝑬𝑫-𝑩𝑶𝑻 Icons`)
try {
let { dl_url } = await Scraper.pinterest(text)
await conn.sendFile(m.chat, dl_url, 'thumbnail.jpg', null, m)
} catch {
}}
handler.help = ['pinterest <búsqueda>']
handler.tags = ['img']
handler.command = ['pinterest'] 
//handler.limit = 1
export default handler
