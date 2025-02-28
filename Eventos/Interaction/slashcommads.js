const CustomCommand = require("../../Schemas/custom_commands/CustomCommand");

module.exports = {
	name: "interactionCreate",

	/**
	 * @param {import('discord.js').Interaction} interaction
	 * @param {import('discord.js').Client} client
	 */
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			const cmd = client.slashCommands.get(interaction.commandName);
			if (!cmd) {
				await interaction.deferReply();
				const data = await CustomCommand.findOne({
					guildId: interaction.guildId,
					commandName: interaction.commandName,
				});

				if (!data)
					return interaction.followUp({ content: "Este comando no existe" });

				interaction.followUp(data.content);
				return;
			}

			const args = [];
			for (const option of interaction.options.data) {
				if (option.type === 1) {
					if (option.name) args.push(option.name);
					for (const x of option.options) {
						if (x.value) args.push(x.value);
					}
				} else if (option.value) args.push(option.value);
			}
			cmd.execute(client, interaction, args);
		}
	},
};

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
