const CustomCommand = require("../../../Schemas/custom_commands/CustomCommand");
const { buildCommand } = require("../../../utils/functions");

module.exports = {
	name: "add-customcommand",
	description: "Añade un comando personalizado al servidor",
	options: [
		{
			name: "nombre",
			description: "Nombre del comando personalizado",
			type: 3,
			required: true,
		},
		{
			name: "descripcion",
			description: "Descripción del comando personalizado",
			type: 3,
			required: true,
		},
		{
			name: "respuesta",
			description: "Respuesta del comando personalizado",
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
		/** @type {string} */
		const description = interaction.options.getString("descripcion");
		/** @type {string} */
		const response = interaction.options.getString("respuesta");

		if (client.slashCommands.some((x) => x.name === name))
			return interaction.followUp({
				content: "Este ya es un comando del bot",
			});

		const data = await CustomCommand.findOne({
			guildId: interaction.guildId,
			commandName: name,
		});

		if (data)
			return interaction.followUp({ content: "Este comando ya existe" });

		const slashID = await buildCommand(
			interaction.guild.id,
			name.toLowerCase(),
			description,
			client,
			response,
		);

		const newData = new CustomCommand({
			guildId: interaction.guildId,
			commandName: name.toLowerCase(),
			commandId: slashID,
			content: response,
		});
		await newData.save();

		interaction.followUp(`Nuevo comando creado, nombre: **${name}**`);
	},
};
