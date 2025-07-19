import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

const handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const watermark = '\n\n> *_SOFI - BOT_*';

    const q = m.quoted ? m.quoted : m || m.text || m.sender;
    const c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;

    const repliedText = m.quoted && m.quoted.text ? m.quoted.text.trim() : '';
    let messageText = (repliedText ? `${repliedText}\n` : '') + (text || '');

    if (!m.quoted && !m.isMedia && !messageText.includes(watermark)) {
      messageText += watermark;
    }

    const msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c } },
        { quoted: m, userJid: conn.user.id }
      ),
      messageText,
      conn.user.jid,
      { mentions: users }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const watermark = '\n\n> *_SOFI BOT_*';

    if (isMedia) {
      const mediax = await quoted.download?.();
      const options = { mentions: users, quoted: m };

      if (quoted.mtype === 'imageMessage') {
        conn.sendMessage(m.chat, { image: mediax, caption: (text || '') + watermark, ...options });
      } else if (quoted.mtype === 'videoMessage') {
        conn.sendMessage(m.chat, { video: mediax, caption: text || '', mimetype: 'video/mp4', ...options });
      }
    } else {
      if (quoted.mtype === 'audioMessage') {
        conn.sendMessage(m.chat, { audio: quoted.download ? await quoted.download() : null, caption: '', mimetype: 'audio/mpeg', fileName: `Hidetag.mp3`, ...options });
      } else if (quoted.mtype === 'stickerMessage') {
        conn.sendMessage(m.chat, { sticker: quoted.download ? await quoted.download() : null, ...options });
      } else {
        const more = String.fromCharCode(8206);
        const masss = more.repeat(850) + watermark;

        await conn.relayMessage(
          m.chat,
          {
            extendedTextMessage: {
              text: `${masss}`,
              contextInfo: {
                mentionedJid: users,
                externalAdReply: {
                  thumbnail: img,
                  sourceUrl: canal
                }
              }
            }
          },
          {}
        );
      }
    }
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;

handler.group = true;
handler.admin = true;

export default handler;
