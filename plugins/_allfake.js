import fetch from 'node-fetch'

export async function before(m, { conn }) {
//let img = await (await fetch(`https://tinyurl.com/2c5hk765`)).buffer()
let img = catalogo

global.fake = {
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363328554424977@newsletter",
        serverMessageId: 100,
        newsletterName: 'Doge Bot Channel 🐕'
    }
}

global.adReply = {
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363328554424977@newsletter",
        serverMessageId: 100,
        newsletterName: 'Doge Bot Channel 🐕'
    }
}

global.rcanal = {
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363328554424977@newsletter",
        serverMessageId: 100,
        newsletterName: 'Doge Bot Channel 🐕'
    }
}
}