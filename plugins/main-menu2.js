let handler = async (m, { conn }) => {
let img = 'https://i.ibb.co/4jft6vs/file.jpg' 
let texto = `*_M E N Ú - A U D I O S_* 🗣️
「 *.on audios* 」  

1. _Takataka_.
2. _Tarado_.
3. _TKA_.
4. _Hey_.
5. _Freefire_.
6. _Feriado_.
7. _Aguanta_.
8. _Nadie te pregunto_.
9. _Niconico_.
10. _No chupala_.
11. _No me hables_.
12. _No me hagas usar esto_.
13. _OMG_.
14. _Contexto_.
15. _Pero esto_.
16. _Pikachu_.
17. _Pokemon_.
18. _Verdad que te engañe_.
19. _Vivan los novios_.
20. _Una pregunta_.
21. _Hermoso negro_.
22. _Buen dia grupo_.
23. _Calla fan de BTS_.
24. _Cambiate a movistar_.
25. _Corte corte_.
26. _El toxico_.
27. _Elmo sabe donde vives_.
28. _En caso de una investigacion_.
29. _No estes tite_.
30. _Las reglas del grupo_.
31. _Me anda buscando anonymous_.
32. _Motivacion_.
33. _Muchachos escucharon_.
34. _Nico nico_.
35. _No rompas mas_.
36. _Potasio_.
37. _Que tal grupo_.
38. _Se estan riendo de mi_.
39. _Su nivel de pendejo_.
40. _Tal vez_.
41. _Te gusta el pepino_.
42. _Tengo los calzones_.
43. _Entrada_.
44. _Bien pensado woody_.
45. _Esto va a ser epico papus_.
46. _Fino señores_.
47. _Me voy_.
48. _Homero chino_.
49. _Jesucristo_.
50. _Laoracion_.
51. _Me pican los cocos_.
52. _Teamo_.

𝙽𝚘 𝚎𝚜 𝚗𝚎𝚌𝚎𝚜𝚊𝚛𝚒𝚘 𝚞𝚝𝚒𝚕𝚒𝚣𝚊𝚛 𝚙𝚛𝚎𝚏𝚒𝚓𝚘𝚜「 *./#* 」 
 `

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
await conn.sendFile(m.chat, img, 'img.jpg', texto, m, null, fkontak)
}
handler.help = ['menu2']
handler.tags = ['main', 'audio'] 
handler.command = ['menu2', 'menuaudios'] 
export default handler
