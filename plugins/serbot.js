import {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys'
import crypto from 'crypto'
import fs from 'fs'
import pino from 'pino'
import readline from 'readline'
import NodeCache from 'node-cache'
import { makeWASocket } from '../lib/simple.js'

if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn: _conn, args, usedPrefix, command }) => {
  const parent = args[0] === 'plz' ? _conn : await global.conn

  async function serbot() {
    const basePath = './serbot'
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true })

    const authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8)
    const authPath = `${basePath}/${authFolderB}`
    if (!fs.existsSync(authPath)) fs.mkdirSync(authPath, { recursive: true })

    if (args[0]) {
      const credsDecoded = Buffer.from(args[0], 'base64').toString('utf-8')
      fs.writeFileSync(`${authPath}/creds.json`, JSON.stringify(JSON.parse(credsDecoded), null, '\t'))
    }

    const { state, saveState, saveCreds } = await useMultiFileAuthState(authPath)
    const msgRetryCounterCache = new NodeCache()
    const msgRetryCounterMap = () => {}
    const { version } = await fetchLatestBaileysVersion()

    const phoneNumber = m.sender.split('@')[0]
    const methodCode = !!phoneNumber

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache,
      msgRetryCounterMap,
      version,
    }

    let conn = makeWASocket(connectionOptions)
    conn.isInit = false
    let isInit = true

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    function sleep(ms) {
      return new Promise((res) => setTimeout(res, ms))
    }

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin } = update

      if (isNewLogin) conn.isInit = true

      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode

      if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        let i = global.conns.indexOf(conn)
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)

        if (code !== DisconnectReason.connectionClosed) {
          parent.sendMessage(m.chat, { text: 'Conexión perdida..' }, { quoted: m })
        }
      }

      if (connection === 'open') {
        conn.isInit = true
        global.conns.push(conn)
        await parent.reply(
          m.chat,
          args[0]
            ? 'Conectado con éxito'
            : 'Conectado exitosamente con WhatsApp\n\n*Nota:* Esto es temporal\nSi el Bot principal se reinicia o se desactiva, todos los sub bots también lo harán',
          m
        )
        await sleep(5000)
        if (args[0]) return

        await parent.reply(conn.user.jid, `La siguiente vez que se conecte envía el siguiente mensaje para iniciar sesión sin utilizar otro código`, m)

        await parent.sendMessage(
          conn.user.jid,
          { text: usedPrefix + command + ' ' + Buffer.from(fs.readFileSync(`${authPath}/creds.json`), 'utf-8').toString('base64') },
          { quoted: m }
        )
      }
    }

    if (methodCode && !conn.authState.creds.registered) {
      if (!phoneNumber) process.exit(0)
      let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '')
      if (cleanedNumber.length < 8 || cleanedNumber.length > 15) {
        console.error('Número inválido:', cleanedNumber)
        process.exit(0)
      }

      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(cleanedNumber)
        codeBot = codeBot?.match(/.{1,4}/g)?.join('-') || codeBot
        let txt = ' –  *S E R B O T  -  S U B B O T*\n\n'
        txt += '┌  ✩  *Usa este Código para convertirte en un Sub Bot*\n'
        txt += '│  ✩  Pasos\n'
        txt += '│  ✩  *1* : Haga click en los 3 puntos\n'
        txt += '│  ✩  *2* : Toque dispositivos vinculados\n'
        txt += '│  ✩  *3* : Selecciona *Vincular con el número de teléfono*\n'
        txt += '└  ✩  *4* : Escriba el Código\n\n'
        txt += '*Nota:* Este Código solo funciona en el número que lo solicitó'
        await parent.reply(m.chat, txt, m)
        await parent.reply(m.chat, codeBot, m)
        rl.close()
      }, 3000)
    }

    conn.connectionUpdate = connectionUpdate
    conn.ev.on('connection.update', connectionUpdate)

    setInterval(async () => {
      if (!conn.user) {
        try {
          conn.ws.close()
        } catch {}
        conn.ev.removeAllListeners()
        let i = global.conns.indexOf(conn)
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000)
  }

  serbot()
}

handler.help = ['code']
handler.tags = ['serbot']
handler.command = ['code', 'codebotraro']
handler.rowner = false

export default handler