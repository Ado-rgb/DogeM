import ytSearch from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('📍 Escribe el nombre de un video o pega el link de YouTube')

  try {
    // Buscar si es nombre
    let url = text
    if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
      let search = await ytSearch(text)
      if (!search?.videos?.length) return m.reply('❌ No se encontraron resultados')
      url = search.videos[0].url
    }

await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

    // Llamar a la API
    const apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    console.log('🔗 URL usada para API:', apiUrl)

    const res = await fetch(apiUrl)
    const json = await res.json()

    console.log('🧾 Respuesta de la API:', json)

    if (!json.status || !json.result?.download) {
      throw new Error('La API no devolvió un resultado válido')
    }

    let { title, thumbnail, download } = json.result

    // Enviar miniatura con detalles
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `🎬 *${title}*\n📥 Descargando video...`
    }, { quoted: m })

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: download },
      caption: `🎬 *${title}*`,
      mimetype: 'video/mp4'
    }, { quoted: m })

  } catch (e) {
    console.log('❌ Error al descargar el video:', e)
    m.reply('❌ Error al descargar el video')
  }
}

handler.help = ['ytmp4', 'play2'].map(v => v + ' < link>')
handler.tags = ['downloader']
handler.command = ['ytmp4', 'play2']

export default handler
