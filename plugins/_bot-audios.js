let handler = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  try {
    let text = m.text.toLowerCase();
    
    if (chat.audios){
    switch (text) {

        case 'tarado':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/CoOd.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'teamo':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://cdn.russellxz.click/4a69e7be.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;
        
        case 'tka':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/jakw.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'hey':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/AaBt.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'freefire':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/Dwqp.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'feriado':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/mFCT.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'aguanta':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/Qmz.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'nadie te pregunto':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/MrGg.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'niconico':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/YdVq.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'no chupala':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/iCRk.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'no me hables':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/xxtz.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'no me hagas usar esto':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/bzDa.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'omg':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/PfuN.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'contexto':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/YBzh.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'pero esto':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/javz.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'pikachu':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/wbAf.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'pokemon':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/kWLh.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'verdad que te engañe':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/yTid.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'vivan los novios':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/vHX.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;
        
        case 'una pregunta':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/NHOM.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'hermoso negro':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/ExSQ.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break; 

        case 'buen dia grupo':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/GoKq.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'calla fan de bts':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/oqNf.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'cambiate a movistar':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/RxJC.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'corte corte':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/hRuU.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'el toxico':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/WzBd.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'elmo sabe donde vives':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/YsLt.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'en caso de una investigación':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/Syg.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'no estes tite':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/VrjA.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'las reglas del grupo':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/fwek.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'me anda buscando anonymous':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/MWJz.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'motivacion':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/MXnK.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'muchachos escucharon':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/dRVb.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'nico nico':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/OUyB.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'no rompas mas':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/ZkAp.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'potasio':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/vPoj.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'que tal grupo':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/lirF.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'se estan riendo de mi':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/XBXo.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'su nivel de pendejo':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/SUHo.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'tal vez':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/QMjH.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'te gusta el pepino':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/ddrn.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'tengo los calzones':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/pzRp.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'bien pensado woody':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/nvxb.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'entrada':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/UpAC.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'esto va a ser epico papus':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/Tabl.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'fino señores':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/hapR.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'me voy':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/iOky.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'homero chino':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/ebe.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'jesucristo':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/AWdx.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'laoracion':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/GeeA.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;

        case 'me pica los cocos':
            conn.sendPresenceUpdate('recording', m.chat);
            await conn.sendFile(m.chat, 'https://qu.ax/UrNl.mp3', `${text}.mp3`, null, m, true, { type: 'audioMessage' });
            break;
        
        default:        
    }
    } else {
       
    }
  } catch (err) {
    console.error(err);
    m.reply('Ocurrió un error al enviar el audio.');
  }
};

handler.customPrefix = /^(tarado|teamo|tka|hey|freefire|feriado|aguanta|nadie te pregunto|niconico|no chupala|no me hables|no me hagas usar esto|omg|contexto|pero esto|pikachu|pokemon|verdad que te engañe|vivan los novios|una pregunta|hermoso negro|buen dia grupo|calla fan de bts|cambiate a movistar|corte corte|el toxico|elmo sabe donde vives|en caso de una investigacion|no estes tite|las reglas del grupo|me anda buscando anonymous|motivacion|muchachos escucharon|nico nico|no rompas mas|potasio|que tal grupo|se estan riendo de mi|su nivel de pendejo|tal vez|te gusta el pepino|tengo los calzones|entrada|bien pensado woody|esto va a ser epico papus|fino señores|me voy|homero chino|jesucristo|laoracion|me pican los cocos)$/i;
handler.command = new RegExp;

export default handler;
