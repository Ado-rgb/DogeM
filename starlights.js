process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws'; // Importar 'ws' como módulo
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch, stat } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk'; // Asegúrate de que 'chalk' esté instalado (npm install chalk)
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import P from 'pino'; // Ya importado, solo para claridad
import pino from 'pino'; // Ya importado, solo para claridad
import Pino from 'pino'; // Ya importado, solo para claridad
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'; // Asegúrate de que estos módulos existen si los usas
import store from './lib/store.js'; // Asegúrate de que este módulo existe
const { proto } = (await import('@whiskeysockets/baileys')).default;
import pkg from 'google-libphonenumber';
const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys');
import readline from 'readline';
import NodeCache from 'node-cache';
const { CONNECTING } = ws; // Obtener CONNECTING del import * as ws
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
import fs from 'fs'; // Importar 'fs' explícitamente

// Extender prototipos y serializar mensajes
protoType();
serialize();

// Definiciones de rutas globales
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

// Configuración de API (si la usas)
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '');

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

// Parsing de argumentos de línea de comandos
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

// Configuración de la base de datos (LowDB)
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

// Configuración de autenticación de Baileys
global.authFile = `sessions`;
const { state, saveState, saveCreds } = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => { }; // Esto podría ser un problema si MessageRetryMap no está definido o es un objeto
const msgRetryCounterCache = new NodeCache();
const { version } = await fetchLatestBaileysVersion();
let phoneNumber = global.botnumber; // Asegúrate de que global.botnumber esté definido en config.js o similar

// Métodos de autenticación
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
    // let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'; // Esta variable no se usa
    opcion = await question('Seleccione una opción:\n1. Con código QR\n2. Con código de texto de 8 dígitos\n---> ');

    if (!/^[1-2]$/.test(opcion)) {
      console.log('Por favor, seleccione solo 1 o 2.\n');
    }
  } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${authFile}/creds.json`));
}

// Silenciar logs de consola de pino (para evitar spam)
console.info = () => { };

// Opciones de conexión para el bot principal
const connectionOptions = {
  logger: pino({ level: 'silent' }), // Nivel de log silencioso para producción
  printQRInTerminal: opcion == '1' || methodCodeQR, // Imprimir QR solo si se elige opción 1 o methodCodeQR
  mobile: MethodMobile,
  browser: opcion == '1' || methodCodeQR ? ['Sumi Sakurasawa', 'Safari', '2.0.0'] : ['Ubuntu', 'Chrome', '110.0.5585.95'],
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
  msgRetryCounterMap, // Asegúrate de que MessageRetryMap sea un objeto válido
  defaultQueryTimeoutMs: undefined,
  version: [2, 3000, 1023223821], // Versión de Baileys, considera actualizar si hay problemas
};

global.conn = makeWASocket(connectionOptions);

// Lógica para código de emparejamiento (opción 2)
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
        // const PHONENUMBER_MCC = { ... }; // Este objeto no se usa aquí

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
conn.well = false; // Esta variable no parece ser utilizada en el resto del código

// Intervalos de mantenimiento (escritura de DB, limpieza de temporales, etc.)
if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp'] && (global.support || {}).find) {
        const tmpPaths = [tmpdir(), 'tmp', 'serbot'];
        tmpPaths.forEach((tmpPath) => spawn('find', [tmpPath, '-amin', '3', '-type', 'f', '-delete']));
      }
    }, 30 * 1000); // Cada 30 segundos
  }
}

// Inicio del servidor (si opts['server'] está activado)
if (opts['server']) (await import('./server.js')).default(global.conn, PORT);

// Funciones de limpieza de archivos
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
    if (SBprekey.length === 0) {
        console.log(chalk.cyanBright(`=> No hay archivos pre-key por eliminar en los sub-bots.`));
        return;
    }
    console.log(chalk.cyanBright(`=> Archivos pre-key eliminados de ${SBprekey.length} sub-bots.`)); // Mensaje más útil
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
        // Borrar solo archivos, no directorios, y que no sean 'creds.json'
        if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
          try {
            unlinkSync(filePath);
            console.log(chalk.bold.green(`Archivo ${file} borrado con éxito de ${dir}`));
          } catch (deleteErr) {
            console.error(chalk.red(`Error al borrar el archivo ${filePath}:`), deleteErr);
          }
        }
      });
    });
  });
}

// Manejador de actualización de conexión para el BOT PRINCIPAL
async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection; // Almacena el estado de conexión globalmente
  if (isNewLogin) conn.isInit = true; // Marca como inicializado tras nuevo login

  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

  // Manejo de desconexiones
  if (connection === 'close') {
    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    console.log(chalk.red(`[BOT PRINCIPAL] Conexión cerrada. Razón: ${reason || 'Desconocida'} | Código: ${code || 'N/A'}`));

    if (reason === DisconnectReason.badSession) {
      conn.logger.error(`[BOT PRINCIPAL] Sesión incorrecta, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
      // Considera un `process.exit(1)` aquí para forzar el reinicio si no se soluciona solo
    } else if (reason === DisconnectReason.connectionClosed) {
      conn.logger.warn(`[BOT PRINCIPAL] Conexión cerrada manualmente/remotamente, reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionLost) {
      conn.logger.warn(`[BOT PRINCIPAL] Conexión perdida con el servidor, reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionReplaced) {
      conn.logger.error(`[BOT PRINCIPAL] Conexión reemplazada (otra sesión abierta). Reiniciando...`);
      // Forzar eliminación de creds para un nuevo inicio
      if (fs.existsSync(`./${global.authFile}/creds.json`)) {
        fs.unlinkSync(`./${global.authFile}/creds.json`);
      }
      process.send('reset'); // Enviar señal de reinicio si se usa PM2
    } else if (reason === DisconnectReason.loggedOut) {
      conn.logger.error(`[BOT PRINCIPAL] Sesión cerrada (logged out). Por favor, elimina la carpeta ${global.authFile} y escanea nuevamente.`);
      // Puedes añadir un `process.exit(0)` aquí si quieres que el bot se detenga
      // y requiera intervención manual para volver a iniciar sesión.
    } else if (reason === DisconnectReason.restartRequired) {
      conn.logger.info(`[BOT PRINCIPAL] Reinicio necesario. Reiniciando manejador...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.timedOut) {
      conn.logger.warn(`[BOT PRINCIPAL] Tiempo de conexión agotado, reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    } else {
      conn.logger.warn(`[BOT PRINCIPAL] Razón de desconexión desconocida: ${reason || 'N/A'}. Reconectando...`);
      await global.reloadHandler(true).catch(console.error);
    }
  } else if (connection === 'open') {
    console.log(chalk.green('✅ [BOT PRINCIPAL] Conectado correctamente.'));
    global.timestamp.connect = new Date(); // Actualiza el timestamp de conexión
  }

  // Carga de base de datos si es nula (seguridad)
  if (global.db.data == null) loadDatabase();

  // Manejo de QR si aplica
  if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {
      console.log(chalk.yellow('Escanea el código QR del bot principal.'));
    }
  }
}

// Captura de excepciones no controladas
process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js'); // Importar el manejador principal

global.reloadHandler = async function (restatConn) {
  console.log(chalk.yellow('[RELOAD HANDLER] Recargando manejadores...'));
  try {
    // Intenta importar una nueva versión del manejador para refrescarlo
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(err => {
      console.error(chalk.red(`[RELOAD HANDLER] Error al importar nuevo manejador: ${err}`));
      return null;
    });
    if (Handler && Object.keys(Handler || {}).length) {
      handler = Handler;
      console.log(chalk.green('[RELOAD HANDLER] Manejador principal actualizado.'));
    } else {
      console.warn(chalk.yellow('[RELOAD HANDLER] No se pudo actualizar el manejador. Usando la versión existente.'));
    }
  } catch (e) {
    console.error(chalk.red(`[RELOAD HANDLER] Error general al recargar el manejador: ${e}`));
  }

  // Reiniciar la conexión principal si se solicita
  if (restatConn) {
    console.log(chalk.blue('[RELOAD HANDLER] Reiniciando conexión principal...'));
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close(); // Cierra el WebSocket existente
    } catch (e) {
      console.error(chalk.red(`[RELOAD HANDLER] Error al cerrar el WebSocket principal: ${e}`));
    }
    global.conn.ev.removeAllListeners(); // Elimina todos los listeners antiguos
    global.conn = makeWASocket(connectionOptions, { chats: oldChats }); // Crea una nueva instancia de conexión
    isInit = true;
    console.log(chalk.green('[RELOAD HANDLER] Nueva conexión principal creada.'));
  }

  // Desvincular manejadores antiguos si no es la primera inicialización
  if (!isInit) {
    global.conn.ev.off('messages.upsert', global.conn.handler);
    global.conn.ev.off('connection.update', global.conn.connectionUpdate);
    global.conn.ev.off('creds.update', global.conn.credsUpdate);
    console.log(chalk.yellow('[RELOAD HANDLER] Manejadores antiguos del bot principal desvinculados.'));
  }

  // Vincular nuevos manejadores al bot principal
  global.conn.handler = handler.handler.bind(global.conn);
  global.conn.connectionUpdate = connectionUpdate.bind(global.conn);
  global.conn.credsUpdate = saveCreds.bind(global.conn); // Usa saveCreds directamente

  global.conn.ev.on('messages.upsert', global.conn.handler);
  global.conn.ev.on('connection.update', global.conn.connectionUpdate);
  global.conn.ev.on('creds.update', global.conn.credsUpdate);
  isInit = false;
  console.log(chalk.green('[RELOAD HANDLER] Manejadores del bot principal vinculados.'));

  // Re-adjuntar manejadores para sub-bots también en caso de reloadHandler
  console.log(chalk.magenta('[RELOAD HANDLER] Re-adjuntando manejadores a los sub-bots existentes...'));
  for (const subBotId in global.conns) {
    const subConn = global.conns[subBotId];
    if (subConn && subConn.ev) {
      // Remover oyentes antiguos para evitar duplicados
      if (subConn.handler) subConn.ev.off('messages.upsert', subConn.handler);
      // Adjuntar el manejador (usamos el mismo manejador principal para simplicidad)
      subConn.handler = handler.handler.bind(subConn);
      subConn.ev.on('messages.upsert', subConn.handler);
      console.log(chalk.magenta(`[RELOAD HANDLER] Manejador re-adjuntado para el sub-bot: ${subBotId}`));
    } else {
        console.warn(chalk.yellow(`[RELOAD HANDLER] Sub-bot ${subBotId} no tiene objeto 'conn' o 'ev' válido. Saltando.`));
    }
  }
  console.log(chalk.magenta('[RELOAD HANDLER] Finalizado re-adjuntar manejadores a sub-bots.'));

  return true;
};

// Carga de plugins
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
  console.log(chalk.blue('[PLUGINS] Cargando plugins...'));
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
      console.log(chalk.green(`[PLUGINS] Cargado: ${filename}`));
    } catch (e) {
      console.error(chalk.red(`[PLUGINS] Error al cargar el plugin '${filename}':`), e);
      delete global.plugins[filename];
    }
  }
  console.log(chalk.blue(`[PLUGINS] ${Object.keys(global.plugins).length} plugins cargados.`));
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

// Recarga de plugins en tiempo real
global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) console.log(chalk.blue(`[WATCH] Plugin actualizado - '${filename}'`));
      else {
        console.warn(chalk.yellow(`[WATCH] Plugin eliminado - '${filename}'`));
        return delete global.plugins[filename];
      }
    } else console.log(chalk.green(`[WATCH] Nuevo plugin - '${filename}'`));
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) console.error(chalk.red(`[WATCH] Error de sintaxis al cargar '${filename}':\n${format(err)}`));
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`)); // Forzar recarga
        global.plugins[filename] = module.default || module;
      } catch (e) {
        console.error(chalk.red(`[WATCH] Error al requerir el plugin '${filename}':\n${format(e)}`));
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload); // Evitar que global.reload sea modificado
watch(pluginFolder, global.reload); // Observar cambios en la carpeta de plugins

// --- Gestión de Sub-bots ---
global.conns = {}; // Objeto global para almacenar las conexiones de los sub-bots

// Nueva función para iniciar o reiniciar un sub-bot específico
async function initSubBot(subBotId) {
  const serbotDir = './serbot';
  const subBotAuthFile = join(serbotDir, subBotId);

  // Asegurarse de que el directorio del sub-bot existe
  if (!existsSync(subBotAuthFile)) {
    console.error(chalk.red(`[SUB-BOT-INIT] Directorio de sesión no encontrado para ${subBotId}: ${subBotAuthFile}`));
    return;
  }

  console.log(chalk.blue(`[SUB-BOT-INIT] Intentando iniciar/reiniciar sub-bot: ${subBotId}`));

  try {
    // Si la conexión ya existe, la cerramos limpiamente para un reinicio
    if (global.conns[subBotId] && global.conns[subBotId].ws && global.conns[subBotId].ws.close) {
      console.log(chalk.yellow(`[SUB-BOT-INIT] Cerrando conexión existente para ${subBotId} antes de reiniciar...`));
      global.conns[subBotId].ev.removeAllListeners(); // Limpiar listeners antiguos
      await global.conns[subBotId].ws.close();
      delete global.conns[subBotId]; // Eliminar de global.conns temporalmente
    }

    const { state, saveCreds: saveSubCreds } = await useMultiFileAuthState(subBotAuthFile);

    const subConnOptions = {
      logger: pino({ level: 'info' }), // <<--- CAMBIADO A 'info' PARA DEPURACIÓN. CAMBIAR A 'silent' EN PRODUCCIÓN.
      printQRInTerminal: false,
      mobile: MethodMobile,
      browser: [`Sub-Bot ${subBotId}`, 'Chrome', '110.0.5585.95'],
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
      version: [2, 3000, 1023223821], // Considera actualizar Baileys y esta versión si el problema persiste
    };

    const subConn = makeWASocket(subConnOptions);

    // --- MANEJADOR DE ACTUALIZACIÓN DE CONEXIÓN PARA CADA SUB-BOT ---
    subConn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, isNewLogin } = update;
      const subBotName = `Sub-Bot [${subBotId}]`;

      console.log(chalk.magenta(`[DEBUG-SUBBOT] ${subBotName} - Connection Update Received:`));
      console.log(chalk.magenta(`  - Status: '${connection}'`));
      console.log(chalk.magenta(`  - lastDisconnect error: ${JSON.stringify(lastDisconnect?.error?.message || lastDisconnect?.error || 'N/A')}`));
      console.log(chalk.magenta(`  - isNewLogin: ${isNewLogin}`));
      console.log(chalk.magenta(`  - WebSocket readyState: ${subConn.ws.socket ? subConn.ws.socket.readyState : 'No socket object'}`));

      // Añadir la conexión a global.conns inmediatamente si se recibe una actualización de estado
      // Esto es redundante pero asegura que siempre esté ahí.
      global.conns[subBotId] = subConn;

      if (isNewLogin) {
        console.log(chalk.green(`${subBotName}: Sesión iniciada correctamente. Estableciendo en global.conns.`));
        // Adjuntar el manejador de mensajes si es un nuevo login
        if (!subConn.handler) { // Evitar duplicar el manejador
          subConn.handler = handler.handler.bind(subConn);
          subConn.ev.on('messages.upsert', subConn.handler);
          console.log(chalk.green(`${subBotName}: Manejador de mensajes adjuntado.`));
        }
      }

      if (connection === 'open') {
        console.log(chalk.green(`✅ ${subBotName}: Conectado y listo para operar.`));
        global.conns[subBotId] = subConn; // Confirma que está en global.conns
        if (!subConn.handler) { // Re-adjuntar manejador si por alguna razón no lo tiene
          subConn.handler = handler.handler.bind(subConn);
          subConn.ev.on('messages.upsert', subConn.handler);
          console.log(chalk.green(`${subBotName}: Manejador de mensajes re-adjuntado tras reconexión.`));
        }
      } else if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.error(chalk.red(`${subBotName}: Conexión cerrada. Razón: ${reason || 'Desconocida'}.`));

        // Eliminar el sub-bot de global.conns si la conexión se cierra
        delete global.conns[subBotId];
        console.log(chalk.red(`${subBotName}: Eliminado de global.conns.`));

        // Remover el manejador de eventos y la referencia para liberar recursos
        if (subConn.handler) {
          subConn.ev.off('messages.upsert', subConn.handler);
          delete subConn.handler;
        }

        if (reason === DisconnectReason.loggedOut) {
          console.error(chalk.red(`${subBotName}: Sesión cerrada (logged out). Por favor, elimina la carpeta '${subBotAuthFile}' y vuelve a autenticar.`));
          // Podrías añadir un `rmSync(subBotAuthFile, { recursive: true, force: true });` aquí
          // ¡Úsalo con extrema precaución, ya que borrará la sesión permanentemente!
        } else {
          // Para otras razones de desconexión, intentamos un reinicio con un pequeño retardo
          console.warn(chalk.yellow(`${subBotName}: Se desconectó (${reason}). Intentando reiniciar en 5 segundos...`));
          setTimeout(() => initSubBot(subBotId), 5000);
        }
      }
    });

    // Manejador de actualización de credenciales del sub-bot
    subConn.ev.on('creds.update', saveSubCreds);

  } catch (e) {
    console.error(chalk.red(`[SUB-BOT-INIT] Fallo crítico al iniciar el sub-bot ${subBotId}:`), e);
    // Si falla el inicio, intentar de nuevo después de un retardo
    console.warn(chalk.yellow(`[SUB-BOT-INIT] Reintentando iniciar ${subBotId} en 10 segundos debido a un error...`));
    setTimeout(() => initSubBot(subBotId), 10000);
  }
}

// Función principal para iniciar todos los sub-bots
async function startSubBots() {
  const serbotDir = './serbot';
  if (!existsSync(serbotDir)) {
    console.warn(chalk.yellow(`[SUB-BOTS] El directorio '${serbotDir}' no existe. No hay sub-bots para iniciar.`));
    return;
  }

  const subBotIds = readdirSync(serbotDir).filter(f => statSync(join(serbotDir, f)).isDirectory());

  if (subBotIds.length === 0) {
      console.log(chalk.blue(`[SUB-BOTS] No se encontraron directorios de sub-bots en '${serbotDir}'.`));
      return;
  }

  console.log(chalk.blue(`[SUB-BOTS] Iniciando proceso de carga para ${subBotIds.length} sub-bots...`));

  for (const subBotId of subBotIds) {
    // Usamos la nueva función initSubBot para iniciar cada uno
    await initSubBot(subBotId);
  }
}
// --- Fin Gestión de Sub-bots ---

// Iniciar el manejador del bot principal y luego los sub-bots
await global.reloadHandler();
startSubBots().catch(console.error); // Ejecuta la función para iniciar los sub-bots

// --- Funciones de soporte y limpieza ---
async function _quickTest() {
  console.log(chalk.gray('[TOOLS] Ejecutando pruebas de herramientas (ffmpeg, convert, etc.)...'));
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
  global.support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find };
  Object.freeze(global.support);
  console.log(chalk.gray('[TOOLS] Pruebas de herramientas completadas.'));
}
// Intervalos de ejecución de limpieza y pruebas
setInterval(async () => {
  if (global.stopped === 'close' || !global.conn || !global.conn.user) return; // Usar global.conn
  const a = await clearTmp();
  // console.log(chalk.gray(`[CLEANUP] Tmp cleaned: ${a.filter(Boolean).length} files.`)); // Mensaje más detallado
}, 180000); // Cada 3 minutos

setInterval(async () => {
  if (global.stopped === 'close' || !global.conn || !global.conn.user) return;
  await purgeSession();
  await purgeSessionSB();
  await purgeOldFiles();
}, 1000 * 60 * 60); // Cada hora

_quickTest().catch(console.error); // Ejecuta las pruebas al inicio

async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '');
    // Si el número empieza con '+521' o '+52 1', quitar el '1'
    if (number.startsWith('+521')) {
      number = number.replace('+521', '+52'); // Cambiar +521 a +52
    } else if (number.startsWith('+52') && number[4] === '1') {
      number = number.replace('+52 1', '+52'); // Cambiar +52 1 a +52
    }
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (error) {
    return false;
  }
}
