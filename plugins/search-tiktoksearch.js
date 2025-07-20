import baileys from '@whiskeysockets/baileys'
import axios from 'axios'

const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = baileys

const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '🍭Ingresa ch *<txt>*', m)

  try {
    const { data } = await axios.get(`https://api.hts-team.koyeb.app/starlight/tiktoksearch?text=${text}`)
    let results = data.tiktoks

    // Barajar resultados
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[results[i], results[j]] = [results[j], results[i]]
    }

    const selected = results.splice(0, 5)
    const cards = []

    async function createVideoMessage(url) {
      const { videoMessage } = await generateWAMessageContent(
        { video: { url } },
        { upload: conn.waUploadToServer }
      )
      return videoMessage
    }

    for (const item of selected) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: item.author }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: item.title,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(item.nowm)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: []
        })
      })
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: `🚩 Resultado de : ${text}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: 'Tiktok - Search' }),
            header: proto.Message.InteractiveMessage.Header.fromObject({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch {
    await m.react('✖️')
  }
}

handler.command = ['tiktoksearch']
handler.tags = ['search']
handler.help = ['tiktoksearch']

export default handler