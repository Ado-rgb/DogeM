let WAMessageStubType = (await import(global.baileys)).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

export async function before(m, { conn, participants }) {
  if (!m.messageStubType || !m.isGroup) return

  let usuario = `@${m.sender.split('@')[0]}`
  let fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard:
          `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))
  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `𝗅𝖾𝗍 𝖺𝗄𝗂 𝖽𝖾𝗅 𝗋𝖾𝗉𝗈 𝖼𝗈𝗇 𝖺𝖽𝗆𝗂𝗇𝗌\n*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')

  if (chat.detect && m.messageStubType == 2) {
    const chatId = m.isGroup ? m.chat : m.sender
    const uniqid = chatId.split('@')[0]
    const sessionPath = './session/'
    const files = await fs.readdir(sessionPath)
    let filesDeleted = 0
    for (const file of files) {
      if (file.includes(uniqid)) {
        await fs.unlink(path.join(sessionPath, file))
        filesDeleted++
        console.log(`⚠️ Eliminando session (PreKey) que causan undefined en el chat`)
      }
    }
  } else if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(
      m.chat,
      {
        text: `✏️ 𝗡𝗢𝗠𝗕𝗥𝗘 𝗖𝗔𝗠𝗕𝗜𝗔𝗗𝗢\n${usuario} cambió el nombre a:\n\n> *${m.messageStubParameters[0]}*`,
        mentions: [m.sender, ...groupAdmins.map(v => v.id)]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(
      m.chat,
      { text: `🖼️ 𝗙𝗢𝗧𝗢 𝗖𝗔𝗠𝗕𝗜𝗔𝗗𝗔\n${usuario} actualizó la foto del grupo.`, mentions: [m.sender] },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 24) {
    await this.sendMessage(
      m.chat,
      {
        text: `📝 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢́𝗡 𝗡𝗨𝗘𝗩𝗔\n${usuario} editó la descripción:\n\n${m.messageStubParameters[0]}`,
        mentions: [m.sender]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(
      m.chat,
      {
        text: `⚙️ 𝗣𝗘𝗥𝗠𝗜𝗦𝗢𝗦\nAhora *${m.messageStubParameters[0] == 'on' ? 'solo los admins' : 'todos'}* pueden editar la info del grupo.`,
        mentions: [m.sender]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(
      m.chat,
      {
        text: `🔒 𝗠𝗢𝗗𝗢 𝗗𝗘 𝗖𝗛𝗔𝗧\nGrupo *${m.messageStubParameters[0] == 'on' ? 'CERRADO' : 'ABIERTO'}*\n${m.messageStubParameters[0] == 'on' ? 'Solo admins pueden escribir' : 'Todos pueden escribir'}.`,
        mentions: [m.sender]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(
      m.chat,
      {
        text: `👑 𝗔𝗗𝗠𝗜𝗡 𝗢𝗧𝗢𝗥𝗚𝗔𝗗𝗢\n@${m.messageStubParameters[0].split('@')[0]} ahora es admin\nOtorgado por ${usuario}.`,
        mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(
      m.chat,
      {
        text: `❌ 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗧𝗜𝗥𝗔𝗗𝗢\n@${m.messageStubParameters[0].split('@')[0]} ya no es admin.\nQuitado por ${usuario}.`,
        mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 72) {
    await this.sendMessage(
      m.chat,
      {
        text: `⏱️ 𝗗𝗨𝗥𝗔𝗖𝗜𝗢𝗡 𝗗𝗘 𝗠𝗘𝗡𝗦𝗔𝗝𝗘𝗦\n${usuario} cambió la duración a *@${m.messageStubParameters[0]}*.`,
        mentions: [m.sender]
      },
      { quoted: fkontak }
    )
  } else if (chat.detect && m.messageStubType == 123) {
    await this.sendMessage(
      m.chat,
      { text: `⏹️ 𝗠𝗘𝗡𝗦𝗔𝗝𝗘𝗦 𝗧𝗘𝗠𝗣𝗢𝗥𝗔𝗟𝗘𝗦\n${usuario} desactivó los mensajes temporales.`, mentions: [m.sender] },
      { quoted: fkontak }
    )
  } else {
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType]
    })
  }
          }
