import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `*⚠️ Uso Correcto: ${usedPrefix + command} Estrella dorada*`, m);

  await conn.reply(m.chat, '🦋 Descargando su imagen...', m);

  const res = await googleImage(text);
  const image1 = await res.getRandom();
  const image2 = await res.getRandom();
  const image3 = await res.getRandom();
  const image4 = await res.getRandom();

  const messages = [
    ['Imagen 1', 'Descarga', image1, [[]], [[]], [[]], [[]]],
    ['Imagen 2', 'Descarga', image2, [[]], [[]], [[]], [[]]],
    ['Imagen 3', 'Descarga', image3, [[]], [[]], [[]], [[]]],
    ['Imagen 4', 'Descarga', image4, [[]], [[]], [[]], [[]]],
  ];

  await conn.sendCarousel(m.chat, `🧸 Resultado de ${text}`, '🔎 Imagen - Descargas', null, messages, m);
};

handler.help = ['imagen + texto'];
handler.tags = ['downloader'];
handler.command = ['image', 'imagen'];

export default handler;