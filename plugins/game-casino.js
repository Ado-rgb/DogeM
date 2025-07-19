import db from '../lib/database.js'

let buatall = 1
let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
    let user = global.db.data.users[m.sender]
    let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
    let randomkamu = `${Math.floor(Math.random() * 55)}`.trim()
    let Aku = (randomaku * 1)
    let Kamu = (randomkamu * 1)
    let count = args[0]
    let who = m.fromMe ? conn.user.jid : m.sender
    let username = conn.getName(who)

    let tiempoEspera = 15

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *💚 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 💚 𝗔𝗣𝗢𝗦𝗧𝗔𝗥*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🍀 Ya iniciaste una apuesta recientemente
*┃* ⏱ Espera *${tiempoRestante}* para volver a apostar
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)
        return
    }

    cooldowns[m.sender] = Date.now()

    count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].limit / buatall) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
    count = Math.max(1, count)

    if (args.length < 1) return conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *💚 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 💚 𝗔𝗣𝗢𝗦𝗧𝗔𝗥*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🍀 Ingresa la cantidad de *🍬 Dulces* a apostar contra *DOGE BOT*
*┃*
*┃* Ejemplo:
*┃* > *${usedPrefix + command}* 100
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)

    if (user.limit >= count * 1) {
        user.limit -= count * 1
        if (Aku > Kamu) {
            conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *💚 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 💚 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🍀 Veamos los números:
*┃* ➤ 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧: ${Aku}
*┃* ➤ ${username}: ${Kamu}
*┃*
*┃* ❌ ${username}, perdiste ${formatNumber(count)} 🍬 Dulces
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)
        } else if (Aku < Kamu) {
            user.limit += count * 2
            conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *💚 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 💚 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🍀 Veamos los números:
*┃* ➤ 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧: ${Aku}
*┃* ➤ ${username}: ${Kamu}
*┃*
*┃* ✅ ${username}, ganaste ${formatNumber(count * 2)} 🍬 Dulces
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)
        } else {
            user.limit += count * 1
            conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *💚 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 💚 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* 🍀 Veamos los números:
*┃* ➤ 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧: ${Aku}
*┃* ➤ ${username}: ${Kamu}
*┃*
*┃* ➖ ${username}, recuperaste ${formatNumber(count * 1)} 🍬 Dulces
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)
        }
    } else conn.reply(m.chat, 
`*╭━━━━━━━━━━━━━━━━━━━━━━╮*
*┃* *💚 𝗗𝗢𝗚𝗘 𝗕𝗢𝗧 💚 𝗔𝗣𝗢𝗦𝗧𝗔𝗥*
*┃━━━━━━━━━━━━━━━━━━━━━━┃*
*┃* ❌ No tienes ${formatNumber(count)} 🍬 Dulces para apostar
*╰━━━━━━━━━━━━━━━━━━━━━━╯*`, m, rcanal)

}

handler.help = ['apostar *<cantidad>*']
handler.tags = ['game']
handler.command = /^(apostar|casino)$/i
handler.fail = null

export default handler

function segundosAHMS(segundos) {
  let segundosRestantes = segundos % 60
  return `${segundosRestantes} segundos`
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}