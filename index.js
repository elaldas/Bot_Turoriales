const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 3276799 });
require("colors");
require("dotenv").config();
const { loadSlash } = require("./handlers/slashHandler");
const { loadEvents } = require("./handlers/eventHandler");

client.slashCommands = new Collection();

(async () => {
	await client
		.login(process.env.TOKEN)
		.catch((err) => console.error(`» | Error al iniciar el bot => ${err}`.red));
})();

loadEvents(client);
client.on("ready", async () => {
	await loadSlash(client).then(() => {
		console.log("» | Comandos cargados con exito".green);
	});
	//.catch((err) =>
	//    console.error(`» | Error al cargar los comandos => ${err}`));
	console.log(`» | Bot encendido con la cuenta de: ${client.user.tag}`.blue);
});

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
