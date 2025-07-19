// codigo creado por 
// github.com/Ado-rgb
import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid

  if (
    !msg.message?.extendedTextMessage ||
    !msg.message.extendedTextMessage.contextInfo?.quotedMessage
  ) {
    return conn.sendMessage(
      chatId,
      {
        text: '📛 *Error:* Debes responder a un archivo multimedia (imagen, video, audio, sticker o documento) con una palabra clave para almacenarlo.'
      },
      { quoted: msg }
    )
  }

  const saveKey = args.join(' ').trim().toLowerCase()

  if (!/[a-zA-Z0-9]/.test(saveKey)) {
    return conn.sendMessage(
      chatId,
      {
        text: '⚠️ *Advertencia:* La palabra clave debe contener al menos una letra o número. No se permiten solo símbolos o emojis.'
      },
      { quoted: msg }
    )
  }

  // Verificar o crear el archivo guar.json
  if (!fs.existsSync('./guar.json')) {
    fs.writeFileSync('./guar.json', JSON.stringify({}, null, 2))
  }

  let guarData = JSON.parse(fs.readFileSync('./guar.json', 'utf-8'))

  if (guarData[saveKey]) {
    return conn.sendMessage(
      chatId,
      {
        text: `🚫 *Aviso:* Ya existe un archivo guardado con la palabra clave *"${saveKey}"*. Por favor, utiliza otra diferente.`
      },
      { quoted: msg }
    )
  }

  const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage
  let mediaType, mediaMessage, fileExtension

  if (quotedMsg.imageMessage) {
    mediaType = 'image'
    mediaMessage = quotedMsg.imageMessage
    fileExtension = 'jpg'
  } else if (quotedMsg.videoMessage) {
    mediaType = 'video'
    mediaMessage = quotedMsg.videoMessage
    fileExtension = 'mp4'
  } else if (quotedMsg.audioMessage) {
    mediaType = 'audio'
    mediaMessage = quotedMsg.audioMessage
    fileExtension = 'mp3'
  } else if (quotedMsg.stickerMessage) {
    mediaType = 'sticker'
    mediaMessage = quotedMsg.stickerMessage
    fileExtension = 'webp'
  } else if (quotedMsg.documentMessage) {
    mediaType = 'document'
    mediaMessage = quotedMsg.documentMessage
    fileExtension = mediaMessage.mimetype.split('/')[1] || 'bin'
  } else {
    return conn.sendMessage(
      chatId,
      {
        text: '📎 *Error:* Solo se permite guardar archivos de tipo imagen, video, audio, sticker o documento.'
      },
      { quoted: msg }
    )
  }

  const mediaStream = await downloadContentFromMessage(mediaMessage, mediaType)
  let mediaBuffer = Buffer.alloc(0)
  for await (const chunk of mediaStream) {
    mediaBuffer = Buffer.concat([mediaBuffer, chunk])
  }

  guarData[saveKey] = {
    buffer: mediaBuffer.toString('base64'),
    mimetype: mediaMessage.mimetype,
    extension: fileExtension,
    savedBy: msg.key.participant || msg.key.remoteJid
  }

  fs.writeFileSync('./guar.json', JSON.stringify(guarData, null, 2))

  return conn.sendMessage(
    chatId,
    {
      text: `✅ *Éxito:* El archivo ha sido almacenado correctamente bajo la palabra clave: *"${saveKey}"*.`
    },
    { quoted: msg }
  )
}

handler.command = handler.help = ['guardar', 'guar']
handler.group = false
handler.tags = ['tools']

export default handler