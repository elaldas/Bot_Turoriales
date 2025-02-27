const CustomCommand = require("../../../Schemas/custom_commands/CustomCommand");
const { destroyCommand } = require("../../../utils/functions");

module.exports = {
	name: "delete-customcommand",
	description: "Elimina un comando personalizado del servidor",
	options: [
		{
			name: "nombre",
			description: "Nombre del comando personalizado",
			type: 3,
			required: true,
		},
	],
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		await interaction.deferReply();
		/** @type {string} */
		const name = interaction.options.getString("nombre");

		const data = await CustomCommand.findOneAndDelete({
			guildId: interaction.guildId,
			commandName: name.toLowerCase(),
		});
		if (!data) {
			return interaction.followUp({
				content: `No se ha encontrado el comando personalizado \`${name}\``,
			});
		}

		await destroyCommand(interaction.guildId, data.commandId, client);

		interaction.followUp(
			`Comando eliminado con el siguiente nombre: **${name}**`,
		);
	},
};
