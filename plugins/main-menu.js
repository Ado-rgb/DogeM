import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': 'ℹ️ Información',
  'search': '🔍 Búsquedas',
  'game': '🎮 Juegos',
  'serbot': '🤖 Sub Bots',
  'rpg': '🌌 RPG',
  'rg': '🗂 Registro',
  'sticker': '🏞 Stickers',
  'ia': '🔰 IA',
  'img': '📸 Imágenes',
  'group': '👥 Grupos',
  'logo': '🎨 Logos',
  'nable': '📴 On / Off',
  'downloader': '📥 Descargas',
  'tools': '🛠 Herramientas',
  'fun': '🎲 Diversión',
  'nsfw': '🔞 NSFW',
  'owner': '😺 Creador',
  'audio': '🔉 Audios',
  'advanced': '💠 Avanzado',
  'freefire': '📌 Free Fire',
  'anime': '🌸 Anime',
}

const defaultMenu = {
before: `
*╭━━━〔 𝖨𝖭𝖥𝖮 〕━━━╮*
┃ *Hola* 👋 *%name*
┃ *Soy* DOGE 🔥 
┃ » *%bottype*
┃ 📅 *%week*, %date
┃ ⏰ *Hora »* %time
┃ ⚡ *Nivel »* %level | ⭐ *XP »* %totalexp
┃ 🍬 *Dulces »* %limit
*╰━━━━━━━━━━━━━━━━━━━━╯*

%readmore

*ᴍᴇɴᴜ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs*
`.trimStart(),
header: '\n*╭─〔 %category 〕─╮*',
body: '┇ ➤ %cmd',
footer: '*╰─────────────╯*',
after: '\n\n*┗ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖠𝖽𝗈 ┛*'
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // Detectar si es bot principal o sub-bot
    let isPrincipal = (conn.user?.id || '').split(':')[0].replace(/\D/g, '') === '50494547493'
    let botType = isPrincipal ? '🔰 Bot Principal' : '👾 Sub Bot'

    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(() => ({}))) || {}
    let { exp, limit, level } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })

    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag

    let before = conn.menu?.before || defaultMenu.before
    let header = conn.menu?.header || defaultMenu.header
    let body = conn.menu?.body || defaultMenu.body
    let footer = conn.menu?.footer || defaultMenu.footer
    let after = conn.menu?.after || defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : _p + help).trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%', p: _p, uptime: muptime,
      taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
      name, week, date, time, level, limit, totalexp: exp,
      readmore: readMore,
      bottype: botType
    }

    let text = _text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, name) => '' + replace[name])

    let pp = './Menu.jpg'
    await conn.sendFile(m.chat, pp, 'menu.jpg', text.trim(), m, null)

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú', 'comandos', 'allmenu', 'menucompleto', 'funciones']
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}