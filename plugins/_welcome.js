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
*╭┈┈≫* *「 𝐃𝐎𝐆𝐄 𝐁𝐎𝐓 ⚡ 」≪┈┈╮*
*┊*
*┊* 👋 *Bienvenid@* ${userTag}*
*┊* 🏠 *Al grupo:* ${groupName}
*┊* 📋 *Descripción:*
*┊*> ${groupDesc}
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
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
*╭┈┈≫* *「 𝐃𝐎𝐆𝐄 𝐁𝐎𝐓 ⚡ 」≪┈┈╮*
*┊*
*┊* 👋 *Adiós* ${userTag}
*┊* 🚪 *Saliste del grupo* ${groupName}
*┊*> ❌ *Jamás te quisimos aquí :V*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
        `.trim()
        await conn.sendAi(m.chat, botname, textbot, despedida, img, img, canal)
      }
    }
  }
}
