import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌤️ *Uso correcto:*\n${usedPrefix + command} <ciudad>\n\nEjemplo:\n${usedPrefix + command} Santa Rosa de lima`)

  try {
    let url = `https://api.nekorinn.my.id/info/weather?city=${encodeURIComponent(text)}`
    let res = await fetch(url)
    let data = await res.json()

    if (!data.status) return m.reply('❌ No se encontró la ciudad o hubo un error con la API.')

    let loc = data.result.location
    let cur = data.result.current

    let msg = `🌍 *${loc.name}, ${loc.region} - ${loc.country}*
🕒 *Hora local:* ${loc.localtime}

🌡️ *Temperatura:* ${cur.temp_c}°C (${cur.temp_f}°F)
💧 *Humedad:* ${cur.humidity}%
🌬️ *Viento:* ${cur.wind_kph} km/h ${cur.wind_dir}
☁️ *Condición:* ${cur.condition.text}
🌡️ *Sensación:* ${cur.feelslike_c}°C
`

    await conn.sendMessage(m.chat, {
      text: msg,
      contextInfo: {
        externalAdReply: {
          title: `Clima en ${loc.name}`,
          body: `Condición: ${cur.condition.text}`,
          thumbnailUrl: "https://n.uguu.se/fWGkvhGH.jpg",
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: `https://www.google.com/search?q=clima+${encodeURIComponent(loc.name)}`
        }
      }
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('⚠️ Error al obtener el clima.')
  }
}

handler.help = ['clima <ciudad>']
handler.tags = ['herramientas']
handler.command = /^clima$/i

export default handler