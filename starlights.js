process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch, stat } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import P from 'pino';
import pino from 'pino';
import Pino from 'pino';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js';
const { proto } = (await import('@whiskeysockets/baileys')).default;
import pkg from 'google-libphonenumber';
const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys');
import readline from 'readline';
import NodeCache from 'node-cache';
const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
import fs from 'fs'; // Importar 'fs' explícitamente

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '');

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this);
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
    }
  }, 1 * 1000));
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

global.authFile = `sessions`;
const { state, saveState, saveCreds } = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache();
const { version } = await fetchLatestBaileysVersion();
let phoneNumber = global.botnumber;

const methodCodeQR = process.argv.includes("qr");
const methodCode = !!phoneNumber || process.argv.includes("code");
const MethodMobile = process.argv.includes("mobile");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

let opcion;
if (methodCodeQR) {
  opcion = '1';
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${authFile}/creds.json`)) {
  do {
    let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》';
    opcion = await question('Seleccione una opción:\n1. Con código QR\n2. Con código de texto de 8 dígitos\n---> ');

    if (!/^[1-2]$/.test(opcion)) {
      console.log('Por favor, seleccione solo 1 o 2.\n');
    }
  } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${authFile}/creds.json`));
}

console.info = () => { };
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
    let jid = jidNormalizedUser(clave.remoteJid);
    let msg = await store.loadMessage(jid, clave.id);
    return msg?.message || "";
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined,
  version: [2, 3000, 1023223821],
};

global.conn = makeWASocket(connectionOptions);

if (!fs.existsSync(`./${authFile}/creds.json`)) {
  if (opcion === '2' || methodCode) {
    opcion = '2';
    if (!conn.authState.creds.registered) {
      let addNumber;
      if (!!phoneNumber) {
        addNumber = phoneNumber.replace(/[^0-9]/g, '');
      } else {
        do {
          phoneNumber = await question(chalk.bgBlack(chalk.bold.yellowBright('Por favor, escriba su número de WhatsApp.\nEjemplo: 51955918117\n')));
          phoneNumber = phoneNumber.replace(/\D/g, '');
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`;
          }
        } while (!await isValidPhoneNumber(phoneNumber));
        rl.close();
        addNumber = phoneNumber.replace(/\D/g, '');
        const PHONENUMBER_MCC = {
          "52": "MX", "54": "AR", "55": "BR", "56": "CL", "57": "CO", "58": "VE",
          "591": "BO", "592": "GY", "593": "EC", "595": "PY", "598": "UY", "51": "PE",
          "506": "CR", "507": "PA", "504": "HN", "505": "NI", "502": "GT", "503": "SV",
          "1": "US"
        };

        setTimeout(async () => {
          let codigo = await conn.requestPairingCode(addNumber);
          codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo;
          console.log(chalk.yellow('Introduce el código de emparejamiento en WhatsApp.'));
          console.log(chalk.black(chalk.bgGreen(`Su código de emparejamiento: `)), chalk.black(chalk.white(codigo)));
        }, 2000);
      }
    }
  }
}

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp'] && (global.support || {}).find) {
        const tmpPaths = [tmpdir(), 'tmp', 'serbot'];
        tmpPaths.forEach((tmpPath) => spawn('find', [tmpPath, '-amin', '3', '-type', 'f', '-delete']));
      }
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
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) { // 3 minutos
      unlinkSync(file);
      return true;
    }
    return false;
  });
}

function purgeSession() {
  let prekey = [];
  let directorio = readdirSync("./sessions");
  let filesFolderPreKeys = directorio.filter(file => {
    return file.startsWith('pre-key-');
  });
  prekey = [...prekey, ...filesFolderPreKeys];
  filesFolderPreKeys.forEach(files => {
    unlinkSync(`./sessions/${files}`);
  });
}

function purgeSessionSB() {
  try {
    let listaDirectorios = readdirSync('./serbot/');
    let SBprekey = [];
    listaDirectorios.forEach(directorio => {
      if (statSync(`./serbot/${directorio}`).isDirectory()) {
        let DSBPreKeys = readdirSync(`./serbot/${directorio}`).filter(fileInDir => {
          return fileInDir.startsWith('pre-key-');
        });
        SBprekey = [...SBprekey, ...DSBPreKeys];
        DSBPreKeys.forEach(fileInDir => {
          unlinkSync(`./serbot/${directorio}/${fileInDir}`);
        });
      }
    });
    if (SBprekey.length === 0) return; console.log(chalk.cyanBright(`=> No hay archivos pre-key por eliminar en los sub-bots.`));
  } catch (err) {
    console.log(chalk.bold.red(`Algo salió mal durante la eliminación de pre-keys de sub-bots, archivos no eliminados.`), err);
  }
}

function purgeOldFiles() {
  const directories = ['./sessions/', './serbot/'];
  const oneHourAgo = Date.now() - (60 * 60 * 1000); // Una hora atrás
  directories.forEach(dir => {
    if (!existsSync(dir)) return; // Asegura que el directorio existe antes de leer
    readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      stat(filePath, (err, stats) => {
        if (err) {
          console.error(chalk.red(`Error al obtener estadísticas del archivo ${filePath}:`), err);
          return;
        }
        if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
          unlinkSync(filePath);
          console.log(chalk.bold.green(`Archivo ${file} borrado con éxito de ${dir}`));
        } else {
          // Demasiado verboso para cada archivo no borrado.
          // console.log(chalk.bold.red(`Archivo ${file} no borrado de ${dir}.`));
        }
      });
    });
  });
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    console.warn(chalk.yellow(`Conexión principal cerrada con código ${code}, intentando reconectar...`));
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }
  if (global.db.data == null) loadDatabase();
  if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {
      console.log(chalk.yellow('Escanea el código QR del bot principal.'));
    }
  }
  if (connection == 'open') {
    console.log(chalk.yellow('Bot principal conectado correctamente.'));
  }
  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
  if (reason == 405) {
    await fs.unlinkSync("./sessions/" + "creds.json");
    console.log(chalk.bold.redBright(`Conexión principal reemplazada, por favor espere un momento, me voy a reiniciar...\nSi aparece un error, vuelve a iniciar con: npm start`));
    process.send('reset');
  }
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      conn.logger.error(`Sesión principal incorrecta, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
    } else if (reason === DisconnectReason.connectionClosed) {
      conn.logger.warn(`Conexión principal cerrada, reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionLost) {
      conn.logger.warn(`Conexión principal perdida con el servidor, reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionReplaced) {
      conn.logger.error(`Conexión principal reemplazada, se ha abierto otra nueva sesión. Por favor, cierra la sesión actual primero.`);
    } else if (reason === DisconnectReason.loggedOut) {
      conn.logger.error(`Conexión principal cerrada, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
    } else if (reason === DisconnectReason.restartRequired) {
      conn.logger.info(`Reinicio del bot principal necesario, reinicie el servidor si presenta algún problema.`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.timedOut) {
      conn.logger.warn(`Tiempo de conexión del bot principal agotado, reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    } else {
      conn.logger.warn(`Razón de desconexión desconocida del bot principal. ${reason || ''}: ${connection || ''}`);
      await global.reloadHandler(true).catch(console.error);
    }
  }
}

process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js'); // Importar el manejador principal
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler;
  } catch (e) {
    console.error(`Error al recargar el manejador:`, e);
  }

  if (restatConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch (e) {
      console.error(`Error al cerrar la conexión principal existente:`, e);
    }
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, { chats: oldChats });
    isInit = true;
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  conn.handler = handler.handler.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);
  isInit = false;

  // Re-adjuntar manejadores para sub-bots también en caso de reloadHandler
  for (const subBotId in global.conns) {
    const subConn = global.conns[subBotId];
    if (subConn && subConn.ev) {
      // Remover oyentes antiguos para evitar duplicados
      if (subConn.handler) subConn.ev.off('messages.upsert', subConn.handler);
      // Adjuntar el manejador (puedes decidir si es el mismo 'handler' o uno específico para sub-bots)
      subConn.handler = handler.handler.bind(subConn); // Usar el mismo manejador para simplicidad
      subConn.ev.on('messages.upsert', subConn.handler);
      console.log(chalk.magenta(`Manejador re-adjuntado para el sub-bot: ${subBotId}`));
    }
  }

  return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(`Error al cargar el plugin '${filename}':`, e);
      delete global.plugins[filename];
    }
  }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) console.log(chalk.blue(`Plugin actualizado - '${filename}'`));
      else {
        console.warn(chalk.yellow(`Plugin eliminado - '${filename}'`));
        return delete global.plugins[filename];
      }
    } else console.log(chalk.green(`Nuevo plugin - '${filename}'`));
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) console.error(chalk.red(`Error de sintaxis al cargar '${filename}':\n${format(err)}`));
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        console.error(chalk.red(`Error al requerir el plugin '${filename}':\n${format(e)}`));
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);

// --- Gestión de Sub-bots ---
global.conns = {}; // Objeto para almacenar las conexiones de los sub-bots

async function startSubBots() {
  const serbotDir = './serbot';
  if (!existsSync(serbotDir)) {
    console.warn(chalk.yellow(`El directorio '${serbotDir}' no existe. No hay sub-bots para iniciar.`));
    return;
  }

  const subBotIds = readdirSync(serbotDir).filter(f => statSync(join(serbotDir, f)).isDirectory());

  console.log(chalk.blue(`Intentando iniciar ${subBotIds.length} sub-bots...`));

  for (const subBotId of subBotIds) {
    const subBotAuthFile = join(serbotDir, subBotId);
    try {
      // Usamos useMultiFileAuthState para cada sub-bot para sus credenciales independientes
      const { state, saveCreds: saveSubCreds } = await useMultiFileAuthState(subBotAuthFile);

      const subConnOptions = {
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Los sub-bots normalmente no necesitan QR en la terminal
        mobile: MethodMobile,
        browser: ['Sub-Bot', 'Chrome', '110.0.5585.95'], // Navegador personalizable para sub-bots
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (clave) => {
          let jid = jidNormalizedUser(clave.remoteJid);
          let msg = await store.loadMessage(jid, clave.id);
          return msg?.message || "";
        },
        msgRetryCounterCache,
        msgRetryCounterMap,
        defaultQueryTimeoutMs: undefined,
        version: [2, 3000, 1023223821],
      };

      const subConn = makeWASocket(subConnOptions);

      // Manejador de actualización de conexión del sub-bot
      subConn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin } = update;
        const subBotName = `Sub-Bot [${subBotId}]`;

        // LÓGICA CLAVE PARA AÑADIR/QUITAR SUB-BOT DE GLOBAL.CONNS
        if (isNewLogin) {
          console.log(chalk.green(`${subBotName}: Sesión iniciada correctamente. Estableciendo en global.conns.`));
          global.conns[subBotId] = subConn; // <<-- AÑADE LA CONEXIÓN DEL SUB-BOT A GLOBAL.CONNS
          // Una vez conectado, adjuntamos el manejador
          subConn.handler = handler.handler.bind(subConn); // Usamos el mismo manejador principal
          subConn.ev.on('messages.upsert', subConn.handler);
          console.log(chalk.green(`${subBotName}: Manejador de mensajes adjuntado.`));
        }

        const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
        if (code && code !== DisconnectReason.loggedOut && subConn?.ws.socket == null) {
          console.warn(chalk.yellow(`${subBotName}: Conexión cerrada con código ${code}, intentando reconectar...`));
          // Podrías añadir un mecanismo de reintento o reinicio aquí para sub-bots si es necesario
          // Asegurarse de re-adjuntar manejador si se desvincula por un error de conexión
          if (subConn.handler) {
            subConn.ev.off('messages.upsert', subConn.handler); // Asegurarse de no duplicar
            subConn.ev.on('messages.upsert', subConn.handler);
          }
        }

        if (connection === 'open') {
          console.log(chalk.green(`${subBotName}: Conectado y listo para operar.`));
          global.conns[subBotId] = subConn; // <<-- RE-ASEGURA QUE ESTÉ EN GLOBAL.CONNS SI SE RECONECTA
          // Si ya no es newLogin pero la conexión se abre, re-adjuntar el manejador
          if (!subConn.handler) {
            subConn.handler = handler.handler.bind(subConn);
            subConn.ev.on('messages.upsert', subConn.handler);
            console.log(chalk.green(`${subBotName}: Manejador de mensajes re-adjuntado tras reconexión.`));
          }
        } else if (connection === 'close') {
          const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
          console.error(chalk.red(`${subBotName}: Conexión cerrada. Razón: ${reason || 'Desconocida'}`));
          delete global.conns[subBotId]; // <<-- ELIMINA DE GLOBAL.CONNS SI LA CONEXIÓN SE CIERRA
          // Remover el manejador de eventos al cerrar la conexión
          if (subConn.handler) {
            subConn.ev.off('messages.upsert', subConn.handler);
            delete subConn.handler; // Limpiar la referencia
          }
          if (reason === DisconnectReason.loggedOut) {
            console.error(chalk.red(`${subBotName}: Sesión cerrada (logged out). Por favor, elimina la carpeta '${subBotAuthFile}' y vuelve a autenticar.`));
            // Opcional: Eliminar creds.json para este bot específico aquí
            // if (existsSync(join(subBotAuthFile, 'creds.json'))) unlinkSync(join(subBotAuthFile, 'creds.json'));
          }
        }
      });

      // Manejador de actualización de credenciales del sub-bot
      subConn.ev.on('creds.update', saveSubCreds);

      console.log(chalk.cyan(`Intentando conectar sub-bot: ${subBotId}`));

    } catch (e) {
      console.error(chalk.red(`Fallo al iniciar el sub-bot ${subBotId}:`), e);
    }
  }
}
// --- Fin Gestión de Sub-bots ---

await global.reloadHandler(); // Inicializar el manejador del bot principal
startSubBots().catch(console.error); // Iniciar los sub-bots después de que el bot principal esté inicializado

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
  const s = global.support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find };
  Object.freeze(global.support);
}
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  const a = await clearTmp();
}, 180000); // Cada 3 minutos
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSession();
}, 1000 * 60 * 60); // Cada hora
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSessionSB();
}, 1000 * 60 * 60); // Cada hora
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeOldFiles();
}, 1000 * 60 * 60); // Cada hora
_quickTest().catch(console.error);

async function isValidPhoneNumber
