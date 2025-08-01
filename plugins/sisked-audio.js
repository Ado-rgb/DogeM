import Starlights from '@StarlightsTeam/Scraper'
let limit = 200

let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
if (!m.quoted) return conn.reply(m.chat, `🚩 Etiqueta el mensaje que contenga el resultado de .ytplay`, m).then(_ => m.react('✖️'))
if (!m.quoted.text.includes("╭─⭑『 𝖣𝖮𝖦𝖤 𝖬𝗎𝗌𝗂𝖼 』⭑─╮")) return conn.reply(m.chat, `[ 🚩 ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(_ => m.react('✖️'))
let urls = m.quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
if (!urls) return conn.reply(m.chat, `Resultado no Encontrado.`, m).then(_ => m.react('✖️'))
if (urls.length < text) return conn.reply(m.chat, `Resultado no Encontrado.`, m).then(_ => m.react('✖️'))
let user = global.db.data.users[m.sender]
	
await m.react('🕓')
try {
let v = urls[0]
let { title, duration, size, thumbnail, dl_url } = await Starlights.ytmp3v2(v)

if (size.split('MB')[0] >= limit) return conn.reply(m.chat, `El archivo pesa mas de ${limit} MB, se canceló la Descarga.`, m).then(_ => m.react('✖️'))

await conn.sendFile(m.chat, dl_url, title + '.mp3', null, m, false, { mimetype: 'audio/mpeg', asDocument: user.useDocument })
await m.react('✅')
} catch {
try {
let v = urls[0]
let { title, size, quality, thumbnail, dl_url } = await Starlights.ytmp3(v)

if (size.split('MB')[0] >= limit) return m.reply(`El archivo pesa mas de ${limit} MB, se canceló la Descarga.`).then(_ => m.react('✖️'))

await conn.sendFile(m.chat, dl_url, title + '.mp3', null, m, false, { mimetype: 'audio/mpeg', asDocument: user.useDocument })
await m.react('✅')
} catch {
await m.react('✖️')
}}}

handler.customPrefix = /^(Audio|audio)/
handler.command = new RegExp
//handler.limit = 1

export default handler
