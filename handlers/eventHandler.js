const {
	EmbedBuilder,
	ActionRowBudiler,
	ButtonBuidler,
	StringSelecMenuBuilder,
} = require("discord.js");
const { readdirSync } = require("node:fs");

module.exports = {
	async loadEvents(client) {
		for (const x of readdirSync(`${process.cwd()}/Eventos`)) {
			for (const y of readdirSync(`${process.cwd()}/Eventos/${x}`).filter(
				(file) => file.endsWith(".js"),
			)) {
				const event = require(`${process.cwd()}/Eventos/${x}/${y}`);
				if (event.once)
					client.once(event.name, (...args) =>
						event.execute(
							...args,
							client,
							EmbedBuilder,
							ActionRowBudiler,
							ButtonBuidler,
							StringSelecMenuBuilder,
						),
					);
				else {
					client.on(event.name, (...args) =>
						event.execute(
							...args,
							client,
							EmbedBuilder,
							ActionRowBudiler,
							ButtonBuidler,
							StringSelecMenuBuilder,
						),
					);
				}
			}
		}
	},
};

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
