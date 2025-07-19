let handler = async (m, { conn, args, usedPrefix, command }) => {
  let isClose = {
    open: "not_announcement",
    close: "announcement",
    abierto: "not_announcement",
    cerrado: "announcement",
    abrir: "not_announcement",
    cerrar: "announcement",
  }[args[0] || ""];

  if (isClose === undefined) {
    throw `Usa:\n> ${usedPrefix + command} abrir\n> ${usedPrefix + command} cerrar`;
  }

  await conn.groupSettingUpdate(m.chat, isClose);
  m.reply("✅ Grupo configurado correctamente");
};

handler.help = ["group open / close", "grupo abrir / cerrar"];
handler.tags = ["group"];
handler.command = /^(group|grupo)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;