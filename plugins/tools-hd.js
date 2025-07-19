import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, command }) => {
  conn.hdr = conn.hdr || {}
  if (m.sender in conn.hdr) throw '⏳ Aún hay un proceso pendiente, espera...'

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) throw '🖼️ Envía o responde a una imagen para mejorarla.'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `❌ Formato *${mime}* no compatible. Usa JPG o PNG.`

  conn.hdr[m.sender] = true
  await conn.sendMessage(m.chat, { react: { text: '♻️', key: m.key } })

  let img = await q.download?.()
  let footer = '📸 Imagen mejorada con IA.'
  let error = null

  try {
    const imageUrl = await up(img)
    const api = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`
    const res = await fetch(api)

    if (!res.ok) throw await res.text()

    const buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'hd.jpg', footer, m)
  } catch (e) {
    error = e?.message || e || '❌ Error al procesar la imagen.'
  } finally {
    delete conn.hdr[m.sender]
    if (error) m.reply(String(error))
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = /^(hd|remini)$/i
handler.register = true
export default handler

async function up(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'image.jpg')

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  const url = await res.text()

  if (!url.startsWith('https://')) throw '❌ Falló la subida a Catbox.'
  return url.trim()
}