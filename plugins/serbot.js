import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys'
import crypto from 'crypto'
import fs from 'fs'
import pino from 'pino'
import NodeCache from 'node-cache'
import { makeWASocket } from '../lib/simple.js'

if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn: _conn, args }) => {
  const parent = args[0] === 'plz' ? _conn : global.conn

  async function serbot() {
    const tmpFolder = './Sessions/TEMP'
    if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder, { recursive: true })

    const authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8)
    const authPath = `${tmpFolder}/${authFolderB}`
    fs.mkdirSync(authPath, { recursive: true })

    if (args[0]) {
      try {
        const credsData = JSON.parse(Buffer.from(args[0], 'base64').toString('utf-8'))
        fs.writeFileSync(`${authPath}/creds.json`, JSON.stringify(credsData, null, '\t'))
      } catch {
        await parent.reply(m.chat, '*Error: Credenciales inválidas*', m)
        return
      }
    }

    const { state, saveCreds } = await useMultiFileAuthState(authPath)
    const msgRetryCounterCache = new NodeCache()
    const { version } = await fetchLatestBaileysVersion()

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
      version,
    }

    const conn = makeWASocket(connectionOptions)

    let isConnected = false

    conn.ev.on('connection.update', async (update) => {
      const { connection } = update

      if (connection === 'open') {
        isConnected = true
        // Mover la carpeta de temp a Sessions/Sockets
        try {
          const finalPath = `./Sessions/Sockets/${authFolderB}`
          fs.renameSync(authPath, finalPath)
        } catch {}

        global.conns.push(conn)
        await parent.reply(
          m.chat,
          '➪ *Conectado exitosamente con WhatsApp*\n\n*Nota:* Esto es temporal\nSi el Bot principal se reinicia o se desactiva, todos los sub bots también lo harán',
          m,
        )
      }

      // Aquí la magia del código de 8 dígitos para nuevos registros (no registrados)
      if (!state.creds.registered && connection === 'open') {
        try {
          const pairingCode = await conn.requestPairingCode()
          const formattedCode = pairingCode.match(/.{1,4}/g).join('-')

          let txt = `➪ *Código para convertirte en SubBot*\n\n`
          txt += `┌─── ✩ *Instrucciones* ✩ ───\n`
          txt += `│ 1. En WhatsApp toca *Menú* (los 3 puntos)\n`
          txt += `│ 2. Selecciona *Dispositivos vinculados*\n`
          txt += `│ 3. Elige *Vincular un dispositivo*\n`
          txt += `│ 4. Ingresa este código:\n`
          txt += `│\n│    *${formattedCode}*\n`
          txt += `└─────────────────────\n\n`
          txt += `*Nota:* Solo funciona en el número que solicitó el código.`

          await parent.reply(m.chat, txt, m)
        } catch (e) {
          // si falla el requestPairingCode, no pasa nada, solo ig
        }
      }

      if (connection === 'close' && !isConnected) {
        try {
          fs.rmSync(authPath, { recursive: true, force: true })
        } catch {}
      }
    })
  }

  serbot()
}

handler.help = ['code']
handler.tags = ['subbots']
handler.command = ['code']
export default handler