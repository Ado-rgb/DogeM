let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Sofi 👸🏻;;\nFN:Sofi 👸🏻\nORG:Sofi 👸🏻\nTITLE:\nitem1.TEL;waid=50765609370:50765609370\nitem1.X-ABLabel:Sofi 👸🏻\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Sofi 👸🏻\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'おDanịel.xyz⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler
