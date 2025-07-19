let WAMessageStubType = (await import(global.baileys)).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

export async function before(m, { conn, participants }) {
  if (!m.messageStubType || !m.isGroup) return
  
  let usuario = `@${m.sender.split`@`[0]}`
  let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
  
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))
  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')

  // ╭━━━〔 𝖢𝖠𝖬𝖡𝖨𝖮𝖲 𝖤𝖭 𝖤𝖫 𝖦𝖱𝖴𝖯𝖮 〕━━━╮
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
        console.log(`⚠️ Eliminación session (PreKey) que provocan el undefined en el chat`)
      }
    }
  } else if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(m.chat, { text: `╭─〔 ✏️ 𝐍𝐎𝐌𝐁𝐑𝐄 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐎 〕─╮\n${usuario} cambió el nombre a:\n\n> *${m.messageStubParameters[0]}*\n╰─────────────╯`, mentions: [m.sender, ...groupAdmins.map(v => v.id)] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(m.chat, { text: `╭─〔 🖼️ 𝐅𝐎𝐓𝐎 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐀 〕─╮\n${usuario} actualizó la foto del grupo.\n╰─────────────╯`, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 24) {
    await this.sendMessage(m.chat, { text: `╭─〔 📝 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐍𝐔𝐄𝐕𝐀 〕─╮\n${usuario} editó la descripción:\n\n${m.messageStubParameters[0]}\n╰─────────────╯`, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(m.chat, { text: `╭─〔 ⚙️ 𝐏𝐄𝐑𝐌𝐈𝐒𝐎𝐒 〕─╮\nAhora *${m.messageStubParameters[0] == 'on' ? 'solo los admins' : 'todos'}* pueden editar la info del grupo.\n╰─────────────╯`, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(m.chat, { text: `╭─〔 🔒 𝐌𝐎𝐃𝐎 𝐃𝐄 𝐂𝐇𝐀𝐓 〕─╮\nGrupo *${m.messageStubParameters[0] == 'on' ? 'CERRADO' : 'ABIERTO'}*.\n${m.messageStubParameters[0] == 'on' ? 'Solo admins pueden escribir' : 'Todos pueden escribir'}.\n╰─────────────╯`, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(m.chat, { text: `╭─〔 👑 𝐀𝐃𝐌𝐈𝐍 𝐎𝐓𝐎𝐑𝐆𝐀𝐃𝐎 〕─╮\n@${m.messageStubParameters[0].split`@`[0]} ahora es admin\nOtorgado por ${usuario}.\n╰─────────────╯`, mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(m.chat, { text: `╭─〔 ❌ 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐓𝐈𝐑𝐀𝐃𝐎 〕─╮\n@${m.messageStubParameters[0].split`@`[0]} ya no es admin.\nQuitado por ${usuario}.\n╰─────────────╯`, mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 72) {
    await this.sendMessage(m.chat, { text: `╭─〔 ⏱️ 𝐃𝐔𝐑𝐀𝐂𝐈𝐎𝐍 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 〕─╮\n${usuario} cambió la duración a *@${m.messageStubParameters[0]}*.\n╰─────────────╯`, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 123) {
    await this.sendMessage(m.chat, { text: `╭─〔 ⏹️ 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒 〕─╮\n${usuario} desactivó los mensajes temporales.\n╰─────────────╯`, mentions: [m.sender] }, { quoted: fkontak })
  } else {
    console.log({ messageStubType: m.messageStubType, messageStubParameters: m.messageStubParameters, type: WAMessageStubType[m.messageStubType] })
  }
                                                                         }
