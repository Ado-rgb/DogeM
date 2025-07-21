import ws from 'ws' // Import WebSocket module to check ws.OPEN state
import chalk from 'chalk' // For colored console output, useful for debugging

async function handler(m, { conn: stars, usedPrefix }) {
  let connectedSubBots = []
  let mentionedJids = []; // Array to store JIDs for mentions in the final message

  console.log(chalk.blue('--- [COMMAND: .bots] Starting sub-bot check ---'));
  console.log(chalk.blue(`[COMMAND: .bots] Initial count of global.conns entries: ${Object.keys(global.conns).length}`));

  // Add a small delay to allow connection states to settle.
  // This helps mitigate race conditions where a bot might be marked as connected
  // in index.js but its state isn't fully propagated or stable when .bots is called.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

  console.log(chalk.blue(`[COMMAND: .bots] Count of global.conns entries after 1 second delay: ${Object.keys(global.conns).length}`));

  // Iterate over the sub-bots stored in global.conns
  // Using Object.entries to get both the subBotId (key) and the conn object (value)
  for (const [subBotId, conn] of Object.entries(global.conns)) {

    // Validate that the connection object and its 'user' property exist.
    // A 'conn' object without 'conn.user' is usually an incomplete or failed connection.
    if (!conn || !conn.user) {
      console.log(chalk.yellow(`[COMMAND: .bots][DEBUG] Sub-bot ${subBotId}: Connection object or user info not found in global.conns. Skipping.`));
      continue; // Skip to the next iteration if invalid
    }

    // --- CRITICAL CONNECTION STATE CHECKS ---
    // 1. Check WebSocket readyState: ws.OPEN (which is typically 1) means the socket is open and ready.
    const isWsSocketOpen = conn.ws.socket && conn.ws.socket.readyState === ws.OPEN;

    // 2. Check Baileys 'connection' status: 'open' is the most reliable state from Baileys.
    const isBaileysStatusOpen = conn.connection === 'open';

    // Detailed debug logging for each sub-bot being processed
    console.log(chalk.cyan(`[COMMAND: .bots][DEBUG] Processing Sub-bot: ${subBotId} (JID: ${conn.user.jid})`));
    console.log(chalk.cyan(`  - Baileys Connection Status (conn.connection): '${conn.connection}' (Expected: 'open')`));
    console.log(chalk.cyan(`  - WebSocket readyState (conn.ws.socket.readyState): ${conn.ws.socket ? conn.ws.socket.readyState : 'No socket'} (Expected: ${ws.OPEN} - OPEN)`));
    console.log(chalk.cyan(`  - Is WebSocket Open (isWsSocketOpen)? ${isWsSocketOpen}`));
    console.log(chalk.cyan(`  - Is Baileys Status Open (isBaileysStatusOpen)? ${isBaileysStatusOpen}`));

    // If both WebSocket and Baileys connection statuses are 'open', consider it connected
    if (isWsSocketOpen && isBaileysStatusOpen) {
      connectedSubBots.push(conn); // Add the full connection object to our list
      mentionedJids.push(conn.user.jid); // Add the full JID for mentions
      console.log(chalk.green(`  -> Sub-bot ${subBotId} DETECTED AS CONNECTED AND OPERATIONAL.`));
    } else {
      console.log(chalk.red(`  -> Sub-bot ${subBotId} IS NOT CONNECTED (one or both states are not 'open').`));
    }
  }

  // If no sub-bots are connected after checking all entries
  if (connectedSubBots.length === 0) {
    let responseMessage = `*🤖 No hay sub-bots conectados en este momento.*`;
    await stars.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
    console.log(chalk.red('--- [COMMAND: .bots] No connected sub-bots found. ---'));
    return; // Exit the function
  }

  // Generate the message with connected sub-bot information
  let message = connectedSubBots.map((v, index) => {
    // Clean the JID to get only the number for display
    const jidNumber = v.user.jid.replace(/[^0-9]/g, ''); 
    // Get the bot's name, preferring verifiedName, then name, then a default
    const name = v.user.verifiedName || v.user.name || 'Sin Nombre'; 

    return `*${index + 1}.- Sub-Bot*\n*Número:* @${jidNumber}\n*Enlace:* https://wa.me/${jidNumber}\n*Nombre:* ${name}`;
  }).join('\n\n');

  let totalSubBots = connectedSubBots.length;
  let responseMessage = `*📊 Total de Sub-Bots Conectados:* ${totalSubBots}\n\n${message.trim()}`.trim();

  // Send the message, including mentions for the JIDs
  await stars.sendMessage(m.chat, { 
    text: responseMessage, 
    mentions: mentionedJids 
  }, { quoted: m });

  console.log(chalk.green(`--- [COMMAND: .bots] Command executed successfully. Listed ${totalSubBots} sub-bots. ---`));
}

// Command aliases and help info
handler.command = ['listjadibot', 'bots', 'subbots']; 
handler.help = ['bots', 'subbots'];
handler.tags = ['serbot']; // Tag for grouping in help commands

export default handler;
