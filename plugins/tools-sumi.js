import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
if (!text) return conn.reply(m.chat, '*𝘌𝘴𝘤𝘳𝘪𝘣𝘦 𝘶𝘯 𝘛𝘦𝘹𝘵𝘰 𝘱𝘢𝘳𝘢 𝘩𝘢𝘣𝘭𝘢𝘳 𝘤𝘰𝘯 𝘚𝘪𝘴𝘬𝘦𝘥*', m);

try {
let msg = await conn.sendMessage(m.chat, {text: '*𝘚𝘪𝘴𝘬𝘦𝘥 𝘦𝘴𝘵𝘢́ 𝘦𝘴𝘤𝘳𝘪𝘣𝘪𝘦𝘯𝘥𝘰...*'});

let userid = conn.getName(m.sender) || 'default';
let apiurl = `https://api.guruapi.tech/ai/gpt4?username=${userid}&query=hii${encodeURIComponent(text)}`;
let result = await fetch(apiurl);
let response = await result.json();

await conn.relayMessage(m.chat, { protocolMessage: { key: msg.key, type: 14, editedMessage: { conversation: response.msg }}}, {});
} catch {}}

handler.help = ["Ia"]
handler.tags = ["search"]
handler.command = ["chatgpt", "ia", "gpt"];

export default handler
