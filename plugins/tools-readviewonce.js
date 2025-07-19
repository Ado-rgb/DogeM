import { downloadContentFromMessage } from "@whiskeysockets/baileys";

let handler = async (m, { conn }) => {
  try {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return m.reply("❌ *Error:* Debes responder a una imagen, video o nota de voz para reenviarla.");

    // Función para desenredar mensajes efímeros o view once
    const unwrap = msg => {
      let node = msg;
      while (
        node?.viewOnceMessage?.message ||
        node?.viewOnceMessageV2?.message ||
        node?.viewOnceMessageV2Extension?.message ||
        node?.ephemeralMessage?.message
      ) {
        node =
          node.viewOnceMessage?.message ||
          node.viewOnceMessageV2?.message ||
          node.viewOnceMessageV2Extension?.message ||
          node.ephemeralMessage?.message;
      }
      return node;
    };

    const inner = unwrap(quoted);

    let mediaType, mediaMsg;
    if (inner.imageMessage) {
      mediaType = "image";
      mediaMsg = inner.imageMessage;
    } else if (inner.videoMessage) {
      mediaType = "video";
      mediaMsg = inner.videoMessage;
    } else if (inner.audioMessage || inner.voiceMessage || inner.pttMessage) {
      mediaType = "audio";
      mediaMsg = inner.audioMessage || inner.voiceMessage || inner.pttMessage;
    } else return m.reply("❌ *Error:* El mensaje citado no contiene un archivo compatible.");

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const stream = await downloadContentFromMessage(mediaMsg, mediaType);
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const credit = "> *🍁 DOGE BOT*";
    const opts = { mimetype: mediaMsg.mimetype };

    if (mediaType === "image") {
      opts.image = buffer;
      opts.caption = credit;
    } else if (mediaType === "video") {
      opts.video = buffer;
      opts.caption = credit;
    } else {
      opts.audio = buffer;
      opts.ptt = mediaMsg.ptt ?? true;
      if (mediaMsg.seconds) opts.seconds = mediaMsg.seconds;
    }

    await conn.sendMessage(m.chat, opts, { quoted: m });

    if (mediaType === "audio") await conn.sendMessage(m.chat, { text: credit }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("❌ Error en comando ver:", err);
    m.reply("❌ *Error:* Hubo un problema al procesar el archivo.");
  }
};

handler.help = ["ver"];
handler.tags = ["tools"];
handler.command = ["ver"];

export default handler;