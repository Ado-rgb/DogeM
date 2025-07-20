// index.js

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import {createRequire} from 'module'
import path, {join} from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws' // <-- ÚNICA Y PRINCIPAL IMPORTACIÓN DE WS AQUÍ
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch, stat} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import {mongoDB, mongoDBV2} from './lib/mongoDB.js'
import store from './lib/store.js'
const {proto} = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys')
import readline from 'readline'
import NodeCache from 'node-cache'
// const {CONNECTING} = ws // <-- ESTA LÍNEA DEBE SER COMENTADA O ELIMINADA SI ws YA FUE IMPORTADO ARRIBA
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFile = `sessions` // Carpeta de sesión principal
const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile)
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botnumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !existsSync(`./${authFile}/creds.json`)) {
do {
let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
opcion = await question('Seleccione una opción:\n1. Con código QR\n2. Con código de texto de 8 dígitos\n---> ')

if (!/^[1-2]$/.test(opcion)) {
console.log('Por favor, seleccione solo 1 o 2.\n')
}} while (opcion !== '1' && opcion !== '2' || existsSync(`./${authFile}/creds.json`))
}

console.info = () => {}
const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
mobile: MethodMobile,
browser: opcion == '1' ? ['Sumi Sakurasawa', 'Safari', '2.0.0'] : methodCodeQR ? ['Sumi Sakurasawa', 'Safari', '2.0.0'] : ['Ubuntu', 'Chrome', '110.0.5585.95'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: true,
generateHighQualityLinkPreview: true,
getMessage: async (clave) => {
let jid = jidNormalizedUser(clave.remoteJid)
let msg = await store.loadMessage(jid, clave.id)
return msg?.message || ""
},
msgRetryCounterCache,
msgRetryCounterMap,
defaultQueryTimeoutMs: undefined,
version: [2, 3000, 1023223821],
}

global.conn = makeWASocket(connectionOptions);
global.conn.authFile = global.authFile; // Asegúrate de que el bot principal también tenga su authFile configurado

if (!existsSync(`./${authFile}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.yellowBright('Por favor, escriba su número de WhatsApp.\nEjemplo: 51955918117\n')))
phoneNumber = phoneNumber.replace(/\D/g,'')
if (!phoneNumber.startsWith('+')) {
phoneNumber = `+${phoneNumber}`
}
} while (!await isValidPhoneNumber(phoneNumber))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
const PHONENUMBER_MCC = {
  "52": "MX", "54": "AR", "55": "BR", "56": "CL", "57": "CO", "58": "VE",
  "591": "BO", "592": "GY", "593": "EC", "595": "PY", "598": "UY", "51": "PE",
  "506": "CR", "507": "PA", "504": "HN", "505": "NI", "502": "GT", "503": "SV",
  "1": "US"
 }

setTimeout(async () => {
let codigo = await conn.requestPairingCode(addNumber)
codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo
console.log(chalk.yellow('introduce el código de emparejamiento en WhatsApp.'));
console.log(chalk.black(chalk.bgGreen(`Su código de emparejamiento: `)), chalk.black(chalk.white(codigo)))
}, 2000)
}}}
}

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [tmpdir(), 'tmp', 'serbot'], tmp.forEach((filename) => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
    }, 30 * 1000);
  }
}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT);

function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file); // 3 minutes
    return false;
  });
}

function purgeSession() {
let prekey = []
let directorio = readdirSync("./sessions")
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./sessions/${files}`)
})
}

function purgeSessionSB() {
try {
let listaDirectorios = readdirSync('./serbot/');
let SBprekey = []
listaDirectorios.forEach(directorio => {
if (statSync(`./serbot/${directorio}`).isDirectory()) {
let DSBPreKeys = readdirSync(`./serbot/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
SBprekey = [...SBprekey, ...DSBPreKeys]
DSBPreKeys.forEach(fileInDir => {
unlinkSync(`./serbot/${directorio}/${fileInDir}`)
})
}
})
if (SBprekey.length === 0) return; console.log(chalk.cyanBright(`=> No hay archivos por eliminar.`))
} catch (err) {
console.log(chalk.bold.red(`Algo salio mal durante la eliminación, archivos no eliminados`))
}}

function purgeOldFiles() {
const directories = ['./sessions/', './serbot/']
const oneHourAgo = Date.now() - (60 * 60 * 1000)
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
const filePath = path.join(dir, file)
stat(filePath, (err, stats) => {
if (err) throw err;
if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
unlinkSync(filePath, err => {
if (err) throw err
console.log(chalk.bold.green(`Archivo ${file} borrado con éxito`))
})
} else {
console.log(chalk.bold.red(`Archivo ${file} no borrado` + err))
} }) }) }) })
}

// Add global.conns to store sub-bot connections
global.conns = {}

async function connectionUpdate(update, connInstance = global.conn) {
  const {connection, lastDisconnect, isNewLogin} = update;
  if (connInstance === global.conn) { // Only update global.stopped for the main connection
    global.stopped = connection;
  }
  if (isNewLogin) connInstance.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && connInstance?.ws.socket == null) {
    await global.reloadHandler(true, connInstance).catch(console.error); // Pass connInstance
    if (connInstance === global.conn) {
      global.timestamp.connect = new Date;
    }
  }
  if (global.db.data == null) loadDatabase();
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
    console.log(chalk.yellow('Escanea el código QR.'));
 }}
  if (connection == 'open') {
    console.log(chalk.yellow(`Conectado correctamente ${connInstance === global.conn ? 'principal' : 'sub-bot'}.`));
  }
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
if (reason == 405) {
// Asegúrate de que connInstance.authFile es una cadena válida antes de usarla
const authFilePath = (connInstance.authFile && existsSync(connInstance.authFile)) ? path.join(connInstance.authFile, "creds.json") : path.join(global.authFile, "creds.json");
if (existsSync(authFilePath)) {
  await unlinkSync(authFilePath);
}
console.log(chalk.bold.redBright(`Conexión reemplazada, Por favor espere un momento me voy a reiniciar...\nSi aparecen error vuelve a iniciar con : npm start`))
process.send('reset')}
if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
        connInstance.logger.error(`Sesión incorrecta, por favor elimina la carpeta ${connInstance.authFile} y escanea nuevamente.`)
    } else if (reason === DisconnectReason.connectionClosed) {
        connInstance.logger.warn(`Conexión cerrada, reconectando...`)
        await global.reloadHandler(true, connInstance).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
        connInstance.logger.warn(`Conexión perdida con el servidor, reconectando...`)
        await global.reloadHandler(true, connInstance).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
        connInstance.logger.error(`Conexión reemplazada, se ha abierto otra nueva sesión. Por favor, cierra la sesión actual primero.`)
    } else if (reason === DisconnectReason.loggedOut) {
        connInstance.logger.error(`Conexion cerrada, por favor elimina la carpeta ${connInstance.authFile} y escanea nuevamente.`)
    } else if (reason === DisconnectReason.restartRequired) {
        connInstance.logger.info(`Reinicio necesario, reinicie el servidor si presenta algún problema.`)
        await global.reloadHandler(true, connInstance).catch(console.error)
    } else {
        connInstance.logger.warn(`Razón de desconexión desconocida. ${reason || ''}: ${connection || ''}`)
        await global.reloadHandler(true, connInstance).catch(console.error)
    }
}
}

process.on('uncaughtException', console.error)

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn, connInstance = global.conn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = connInstance.chats
    try {
      connInstance.ws.close()
    } catch { }
    connInstance.ev.removeAllListeners()

    const authPath = connInstance.authFile || global.authFile;
    if (!authPath) {
      console.error(chalk.red(`Error: No se pudo determinar la ruta de autenticación para la instancia. Abortando reconexión.`));
      return; // Abort if authPath is still undefined
    }

    const {state: newState, saveState: newSaveState, saveCreds: newSaveCreds} = await useMultiFileAuthState(authPath);
    connInstance = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        mobile: MethodMobile,
        browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
        auth: {
            creds: newState.creds,
            keys: makeCacheableSignalKeyStore(newState.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (clave) => {
            let jid = jidNormalizedUser(clave.remoteJid)
            let msg = await store.loadMessage(jid, clave.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        msgRetryCounterMap,
        defaultQueryTimeoutMs: undefined,
        version: [2, 3000, 1023223821],
    }, {chats: oldChats})

    connInstance.authFile = authPath;

    if (connInstance === global.conn) {
        global.conn = connInstance;
    } else {
        const subBotId = path.basename(authPath);
        global.conns[subBotId] = connInstance;
    }
    isInit = true
  }
  if (!isInit) {
    connInstance.ev.off('messages.upsert', connInstance.handler)
    connInstance.ev.off('connection.update', connInstance.connectionUpdate)
    connInstance.ev.off('creds.update', connInstance.credsUpdate)
  }

  connInstance.handler = handler.handler.bind(connInstance)
  connInstance.connectionUpdate = (update) => connectionUpdate(update, connInstance);
  connInstance.credsUpdate = saveCreds.bind(connInstance, true)

  const currentDateTime = new Date()
  const messageDateTime = new Date(connInstance.ev)
  if (currentDateTime >= messageDateTime) {
    const chats = Object.entries(connInstance.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
  } else {
    const chats = Object.entries(connInstance.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
  }

  connInstance.ev.on('messages.upsert', connInstance.handler)
  connInstance.ev.on('connection.update', connInstance.connectionUpdate)
  connInstance.ev.on('creds.update', connInstance.credsUpdate)
  isInit = false
  return true
};

const pluginFolder = global.__dirname(join(__dirname, './plugins'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  if (!existsSync(pluginFolder)) {
    console.error(chalk.red(`Error: La carpeta de plugins '${pluginFolder}' no existe. Por favor, créala en la raíz de tu bot.`));
    return;
  }
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      console.error(chalk.red(`Error al cargar el plugin '${filename}': ${e.message}`));
      delete global.plugins[filename]
    }
  }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin - '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`new plugin - '${filename}'`);
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
      }
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
async function _quickTest() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127);
        });
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false));
      })]);
  }));
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
  Object.freeze(global.support);
}
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  const a = await clearTmp()
}, 180000)
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await purgeSession()
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await purgeSessionSB()
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await purgeOldFiles()
}, 1000 * 60 * 60);
_quickTest().catch(console.error)

async function isValidPhoneNumber(number) {
try {
number = number.replace(/\s+/g, '')
if (number.startsWith('+521')) {
number = number.replace('+521', '+52');
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52');
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)
} catch (error) {
return false
}}

async function connectSubBot(sessionId) {
  const authFolderPath = `./serbot/${sessionId}`;
  if (!existsSync(authFolderPath)) {
    console.warn(chalk.yellow(`Skipping sub-bot '${sessionId}': Session folder not found.`));
    return null;
  }
  if (!existsSync(path.join(authFolderPath, 'creds.json'))) {
    console.warn(chalk.yellow(`Skipping sub-bot '${sessionId}': creds.json not found.`));
    return null;
  }

  const { state, saveState, saveCreds } = await useMultiFileAuthState(authFolderPath);

  const subConnectionOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    mobile: MethodMobile,
    browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (clave) => {
      let jid = jidNormalizedUser(clave.remoteJid)
      let msg = await store.loadMessage(jid, clave.id)
      return msg?.message || ""
    },
    msgRetryCounterCache,
    msgRetryCounterMap,
    defaultQueryTimeoutMs: undefined,
    version: [2, 3000, 1023223821],
  };

  const subConn = makeWASocket(subConnectionOptions);
  subConn.authFile = authFolderPath;

  subConn.handler = handler.handler.bind(subConn);
  subConn.connectionUpdate = (update) => connectionUpdate(update, subConn);
  subConn.credsUpdate = saveCreds.bind(subConn, true);

  subConn.ev.on('messages.upsert', subConn.handler);
  subConn.ev.on('connection.update', subConn.connectionUpdate);
  subConn.ev.on('creds.update', subConn.credsUpdate);

  console.log(chalk.blue(`Attempting to connect sub-bot: ${sessionId}`));
  return subConn;
}

async function loadSubBots() {
  const serbotDir = './serbot';
  if (!existsSync(serbotDir)) {
    console.log(chalk.yellow('No "serbot" directory found. Skipping sub-bot loading.'));
    return;
  }

  const subBotFolders = readdirSync(serbotDir).filter(item => {
    const itemPath = join(serbotDir, item);
    return statSync(itemPath).isDirectory() && existsSync(join(itemPath, 'creds.json'));
  });

  for (const folder of subBotFolders) {
    console.log(chalk.magenta(`Found sub-bot session: ${folder}`));
    const subConn = await connectSubBot(folder);
    if (subConn) {
      global.conns[folder] = subConn;
      console.log(chalk.green(`Sub-bot '${folder}' added to global.conns.`));
    }
  }
  console.log(chalk.cyan(`Finished loading ${Object.keys(global.conns).length} sub-bots.`));
}

conn.ev.on('connection.update', async (update) => {
  if (update.connection === 'open' && !conn.isSubBotsLoaded) {
    console.log(chalk.bold.green('Main bot connected. Loading sub-bots...'));
    await loadSubBots();
    conn.isSubBotsLoaded = true;
  }
  connectionUpdate(update, global.conn);
});
