let handler = async (m, {conn, args, usedPrefix, command}) => {
  let isClose = {
    // Switch Case Like :v
    open: "not_announcement",
    close: "announcement",
    abierto: "not_announcement",
    cerrado: "announcement",
    abrir: "not_announcement",
    cerrar: "announcement",
  }[args[0] || ""];
  if (isClose === undefined)
    throw `

*╭─ ❖ ── ✦ ── ✧ ── ❖ ──┓* 
*┠┉↯ ${usedPrefix + command} abrir*
*┠┉↯ ${usedPrefix + command} cerrar*
*╰─ ❖ ── ✦ ── ✧ ── ❖ ──┛*
`.trim();
  await conn.groupSettingUpdate(m.chat, isClose);
  {
    m.reply("☁️ 𝘎𝘳𝘶𝘱𝘰 𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘥𝘰 𝘊𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦");
  }
};
handler.help = ["group open / close", "grupo abrir / cerrar"];
handler.tags = ["group"];
handler.command = /^(group|grupo)$/i;
handler.admin = true;
handler.botAdmin = true;
export default handler;
