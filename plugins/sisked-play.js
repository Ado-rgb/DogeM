import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn: star, command, args, text, usedPrefix }) => {
  if (!text) return star.reply(m.chat, '🚩 Ingresa el título de un video o canción de YouTube.', m)
  await m.react('🕓')
  try {
    let res = await search(args.join(" "))
    let img = await (await fetch(`${res[0].image}`)).buffer()
    let txt = `
*╭─⭑『 𝖣𝖮𝖦𝖤 𝖬𝗎𝗌𝗂𝖼 』⭑─╮*

🎶 *Titulo:* ${res[0].title}
🕐 *Duración:* ${secondString(res[0].duration.seconds)}
📆 *Publicado:* ${eYear(res[0].ago)}
📺 *Canal:* ${res[0].author.name || 'Desconocido'}
🔗 *Url:* https://youtu.be/${res[0].videoId}

> ☁️ Responde con *Audio* o *Vídeo*
*╰─⭑『 𝖣𝖮𝖦𝖤 𝖬𝗎𝗌𝗂𝖼 』⭑─╯*
`
    await star.sendFile(m.chat, img, 'thumbnail.jpg', txt, m)
    await m.react('✅')
  } catch {
    await m.react('✖️')
  }
}

handler.help = ['ytplay']
handler.tags = ['downloader']
handler.command = ['ytplay']
export default handler

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return search.videos
}

function MilesNumber(number) {
  let exp = /(\d)(?=(\d{3})+(?!\d))/g
  let rep = "$1."
  let arr = number.toString().split(".")
  arr[0] = arr[0].replace(exp, rep)
  return arr[1] ? arr.join(".") : arr[0]
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d == 1 ? ' Día, ' : ' Días, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' Hora, ' : ' Horas, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' Minuto, ' : ' Minutos, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' Segundo' : ' Segundos') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function eYear(txt) {
  if (!txt) return '×'
  const replacements = {
    'month ago': 'hace $ mes',
    'months ago': 'hace $ meses',
    'year ago': 'hace $ año',
    'years ago': 'hace $ años',
    'hour ago': 'hace $ hora',
    'hours ago': 'hace $ horas',
    'minute ago': 'hace $ minuto',
    'minutes ago': 'hace $ minutos',
    'day ago': 'hace $ día',
    'days ago': 'hace $ días'
  }
  for (let key in replacements) {
    if (txt.includes(key)) return replacements[key].replace('$', txt.replace(key, '').trim())
  }
  return txt
}