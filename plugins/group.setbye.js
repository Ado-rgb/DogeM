let handler = async (m, { conn, text, isROwner, isOwner }) => {

    if (text) {
        global.db.data.chats[m.chat].sBye = text
        conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *📗 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ⚡ 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢́𝗡 🌙*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* ✅ *La despedida del grupo ha sido configurada con éxito.*
*┃*
*┃* Ahora cada miembro que salga verá tu mensaje personalizado.
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, 
        m)  

    } else {
        conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *🌙 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 ✨ 𝗦𝗘𝗧 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 🌙*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 📝 *Escribe el mensaje de despedida para este grupo.*
*┃*
*┃* *Opcional puedes usar:*
*┃* ⚡ @user → Mención al usuario
*┃*
*┃* *Recuerda que la @ es opcional.*
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, 
        m)
    }
}

handler.help = ['setbye @user + texto']
handler.tags = ['group']
handler.command = ['setbye', 'despedida'] 
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler