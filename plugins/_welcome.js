import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  let userId = m.messageStubParameters?.[0] || ''
  let userTag = `@${userId.split('@')[0]}`
  let pp = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://qu.ax/jYQH.jpg')
  let img = await (await fetch(pp)).buffer()
  let chat = global.db.data.chats[m.chat]
  let groupName = groupMetadata.subject || 'este grupo'
  let groupDesc = groupMetadata.desc || 'sin descripción'

  if (chat.bienvenida) {
    if (m.messageStubType == 27) {
      // Entrada
      if (chat.sWelcome) {
        let welcome = chat.sWelcome
          .replace('@user', userTag)
          .replace('@group', groupName)
          .replace('@desc', groupDesc)
        await conn.sendAi(m.chat, botname, textbot, welcome, img, img, canal)
      } else {
        let bienvenida = `
*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *🌟 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ⚡ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 🌟* *┃*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 👋 *¡Qué onda* ${userTag} *!* *┃*
*┃* 🏠 *Bienvenid@ al grupo:* *${groupName}* *┃*
*┃* 📜 *Descripción:* *┃*
*┃* > ${groupDesc} *┃*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🎉 *Pásala chido, no seas gach@* 🎉 *┃*
*╰━━━━━━━━━━━━━━━━━━━━━━╯*
        `.trim()
        await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal)
      }
    }

    if (m.messageStubType == 28 || m.messageStubType == 32) {
      // Salida o expulsión
      if (chat.sBye) {
        let bye = chat.sBye
          .replace('@user', userTag)
          .replace('@group', groupName)
          .replace('@desc', groupDesc)
        await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal)
      } else {
        let despedida = `
*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *🌙 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ⚡ 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 🌙* *┃*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 👋 *Nos vemos* ${userTag} *!* *┃*
*┃* 🚪 *Saliste de* *${groupName}* *┃*
*┃* > ❌ *Ya no te extrañaremos, va* :v *┃*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 💔 *Bye y cuídate, no la riegues* 💔 *┃*
*╰━━━━━━━━━━━━━━━━━━━━━━╯*
        `.trim()
        await conn.sendAi(m.chat, botname, textbot, despedida, img, img, canal)
      }
    }
  }
}
