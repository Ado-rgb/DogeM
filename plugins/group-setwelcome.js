let handler = async (m, { conn, text, isROwner, isOwner }) => {
    let fkontak = { 
        "key": { 
            "participants": "0@s.whatsapp.net", 
            "remoteJid": "status@broadcast", 
            "fromMe": false, 
            "id": "Halo" 
        }, 
        "message": { 
            "contactMessage": { 
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
            }
        }, 
        "participant": "0@s.whatsapp.net"
    }

    if (text) {
        global.db.data.chats[m.chat].sWelcome = text
        conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *🌙 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ⚡ 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢́𝗡 🌙*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* ✅ *La bienvenida del grupo ha sido configurada con éxito.*
*┃*
*┃* > Ahora cada nuevo miembro verá tu mensaje personalizado.
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, 
        fkontak, m)

    } else {
        conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *🌙 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ✨ 𝗦𝗘𝗧 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗔 🌙*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 📝 *Escribe el mensaje de bienvenida para este grupo.*
*┃*
*┃* *Opcional puedes usar las siguientes etiquetas:* 
*┃* ⚡ @user → Mención al usuario
*┃* ⚡ @group → Nombre del grupo
*┃* ⚡ @desc → Descripción del grupo
*┃*
*┃* *Recuerda que las @ son opcionales.*
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, 
        m)
    }
}

handler.help = ['setwelcome @user + texto']
handler.tags = ['group']
handler.command = ['setwelcome', 'bienvenida'] 
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler