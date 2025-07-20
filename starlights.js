// index.js

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import {createRequire} from 'module'
import path, {join} from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws' // <-- ¡SOLO ESTA IMPORTACIÓN DE WS DEBE ESTAR AQUÍ!
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch, stat} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import pino from 'pino'
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
// Removida: const {CONNECTING} = ws // <-- NO DEBE ESTAR AQUÍ, ws ya está importado
// Removida: import { setupMaster, fork } from 'cluster' // <-- ESTO CAUSA ERROR, ELIMÍNALO
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
// Solo pedir opción si no hay credenciales y no se especificó método por argv
if (!methodCodeQR && !methodCode && !existsSync(path.join(global.authFile, 'creds.json'))) {
  do {
    let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
    opcion = await question('Seleccione una opción:\n1. Con código QR\n2. Con código de texto de 8 dígitos\n---> ')

    if (!/^[1-2]$/.test(opcion)) {
      console.log('Por favor, seleccione solo 1 o 2.\n')
    }
  } while (opcion !== '1' && opcion !== '2')
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

// Generar código de emparejamiento solo si no hay credenciales y la opción es 2
if (opcion === '2' || methodCode) {
  if (!conn.authState.creds.registered) {
    let addNumber;
    if (!!phoneNumber) {
      addNumber = phoneNumber.replace(/[^0-9]/g, '');
    } else {
      do {
        phoneNumber = await question(chalk.bgBlack(chalk.bold.yellowBright('Por favor, escriba su número de WhatsApp.\nEjemplo: 51955918117\n')));
        phoneNumber = phoneNumber.replace(/\D/g,'');
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = `+${phoneNumber}`;
        }
      } while (!await isValidPhoneNumber(phoneNumber));
      rl.close(); // Cerrar readline una vez que se obtiene el número
      addNumber = phoneNumber.replace(/\D/g, '');
    }

    // Pequeño retardo para asegurar que la conexión se inicie antes de pedir el código
    setTimeout(async () => {
      try {
        let codigo = await conn.requestPairingCode(addNumber);
        codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo;
        console.log(chalk.yellow('Introduce el código de emparejamiento en WhatsApp.'));
        console.log(chalk.black(chalk.bgGreen(`Su código de emparejamiento: `)), chalk.black(chalk.white(codigo)));
      } catch (e) {
        console.error(chalk.red(`Error al solicitar código de emparejamiento: ${e.message}`));
        console.log(chalk.red('Volviendo a solicitar número.'));
        // Si hay un error, el bucle do-while para el número se encargará de volver a pedirlo
      }
    }, 2000);
  }
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
let directorio = existsSync("./sessions") ? readdirSync("./sessions") : [];
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
try { unlinkSync(`./sessions/${files}`) } catch (e) { console.error(`Error deleting pre-key file: ${e.message}`); }
})
}

function purgeSessionSB() {
try {
let listaDirectorios = existsSync('./serbot/') ? readdirSync('./serbot/') : [];
let SBprekey = []
listaDirectorios.forEach(directorio => {
if (statSync(`./serbot/${directorio}`).isDirectory()) {
let DSBPreKeys = readdirSync(`./serbot/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
SBprekey = [...SBprekey, ...DSBPreKeys]
DSBPreKeys.forEach(fileInDir => {
try { unlinkSync(`./serbot/${directorio}/${fileInDir}`) } catch (e) { console.error(`Error deleting sub-bot pre-key file: ${e.message}`); }
})
}
})
if (SBprekey.length === 0) return; console.log(chalk.cyanBright(`=> No hay archivos por eliminar.`))
} catch (err) {
console.log(chalk.bold.red(`Algo salio mal durante la eliminación de pre-keys de sub-bots, archivos no eliminados`))
}}

function purgeOldFiles() {
const directories = ['./sessions/', './serbot/']
const oneHourAgo = Date.now() - (60 * 60 * 1000)
directories.forEach(dir => {
  if (!existsSync(dir)) return; // Skip if directory doesn't exist
  readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    try {
      const stats = statSync(filePath);
      if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
        unlinkSync(filePath);
        console.log(chalk.bold.green(`Archivo ${file} borrado con éxito`));
      } else {
        // console.log(chalk.bold.red(`Archivo ${file} no borrado (no es antiguo o es creds.json)`)); // Esto puede ser muy ruidoso
      }
    } catch (err) {
      console.error(chalk.bold.red(`Error procesando archivo ${filePath}: ${err.message}`));
    }
  });
});
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
