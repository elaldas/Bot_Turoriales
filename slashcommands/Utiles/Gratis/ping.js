const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "ping",
	description: "Comando de ping!!",

	async execute(_, interaction) {
		const ping = Date.now() - interaction.createdTimestamp;

		const embed = new EmbedBuilder()
			.setColor("Red")
			.setDescription(`Ping => ${ping}`);

		interaction.reply({ embeds: [embed] });
	},
};

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
