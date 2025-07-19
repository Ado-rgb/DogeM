let handler = async (m, { isPrems, conn }) => {
let time = global.db.data.users[m.sender].lastcofre + 0 // 36000000 10 Horas //86400000 24 Horas
if (new Date - global.db.data.users[m.sender].lastcofre < 0) throw `[❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚂𝚃𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴\𝚗𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - new Date())}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚁`

let img = 'https://i.ibb.co/4jft6vs/file.jpg' 
let texto = `> 𝙁𝙍𝙀𝙀 𝙁𝙄𝙍𝙀 𝙑𝙀𝙍𝙎𝙐𝙎

★ 𝙍𝙀𝙂𝙇𝘼𝙎 𝙂𝙀𝙉𝙀𝙍𝘼𝙇𝙀𝙎 ★
 
🚩 *𝘙𝘦𝘨𝘭𝘢𝘴𝘭𝘪𝘥𝘦𝘳𝘦𝘴.*  
🏴 *𝘙𝘦𝘨𝘭𝘢𝘴𝘭𝘪𝘥𝘦𝘳𝘦𝘴2.*

▸▸ 𝙇𝙄𝙎𝙏𝘼 𝙑𝙀𝙍𝙎𝙐𝙎 ⚔ ◂◂

𝑺𝑰𝑮𝑵𝑰𝑭𝑰𝑪𝑨𝑫𝑶𝑺: 𝘏𝘏:𝘔𝘔 🏁

*𝘏𝘖𝘙𝘈:𝘔𝘐𝘕𝘜𝘛𝘖𝘚*
𝘊𝘗 (𝘊𝘖𝘋𝘐𝘎𝘖 𝘋𝘌 𝘗𝘈𝘐𝘚) 𝘗𝘈𝘙𝘈 𝘓𝘈 𝘏𝘖𝘙𝘈 (𝘔𝘟,𝘊𝘖 𝘠 𝘈𝘙
 
𝘊𝘙 (𝐂𝐎𝐋𝐎𝐑 𝐃𝐄 𝐑𝐎𝐏𝐀)
𝘌𝘫𝘦𝘮𝘱𝘭𝘰: .4𝘷𝘴4 26:30 𝘔𝘟
𝘌𝘫𝘦𝘮𝘱𝘭𝘰: .12𝘷𝘴12 21:50 𝘕𝘌𝘎𝘙𝘖

ᒪIՏTᗩ ᑕOᗰᗩᑎᗪOՏ
➺.4𝘷𝘴4 𝘏𝘏:𝘔𝘔 𝘊𝘗
➺.6𝘷𝘴6 𝘏𝘏:𝘔𝘔 𝘊𝘗
➺.𝘴𝘤𝘳𝘪𝘮 𝘏𝘏:𝘔𝘔 𝘊𝘗
➺.𝘪𝘯𝘵𝘦𝘳𝘯𝘢4 𝘏𝘏:𝘔𝘔 𝘊𝘗
➺.12𝘷𝘴12 𝘏𝘏:𝘔𝘔 𝘊𝘙
➺.16𝘷𝘴16 𝘏𝘏:𝘔𝘔 𝘊𝘙
➺.20𝘷𝘴20 𝘏𝘏:𝘔𝘔 𝘊𝘙
➺.24𝘷𝘴24 𝘏𝘏:𝘔𝘔 𝘊𝘙
➺.𝘊𝘶𝘢𝘥𝘳𝘪𝘭𝘢𝘵𝘦𝘳𝘰 𝘏𝘏:𝘔𝘔 𝘊𝘙 

 *𝘊𝘰𝘯𝘵𝘢𝘤𝘵:* .𝘰𝘸𝘯𝘦𝘳👤
`

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
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
await conn.sendFile(m.chat, img, 'img.jpg', texto, fkontak)
global.db.data.users[m.sender].lastcofre = new Date * 1
}
handler.help = ['menuff']
handler.tags = ['freefire' ,'main'] 
handler.command = ['menuff', 'menufreefire'] 
export default handler

