/**
 * Build a custom command
 * @param {string} guildID - Guild ID (not name)
 * @param {string} commandName - The name of the command
 * @param {string} commandDescription - The description of the command
 * @param {import('discord.js').Client} client - The modified client
 * @param {string} response - The response of the command
 * @returns {Promise<string>}
 */
async function buildCommand(
	guildID,
	commandName,
	commandDescription,
	client,
	response,
) {
	try {
		const object = {
			name: commandName,
			description: commandDescription,
			type: 1,
			aplication: (_, int) => {
				int.reply(response);
			},
		};
		const guild = client.guilds.cache.get(guildID);
		await guild.commands.create(object);
		const slashData = await guild.commands.cache;
		const slashID = slashData.find((x) => x.name === commandName).id;
		console.log(
			`🤖 | Comandos de barra cargados para el servidor con la ID: ${guildID} y el nombre: ${guild.name}`
				.blue,
		);
		console.log(`🤖 | ID del comando de barra: ${slashID}`.green);
		return slashID;
	} catch (e) {
		throw new Error(
			`Ha ocurrido un error al intentar invocar la función buildCommand(): ${e}`,
		);
	}
}

/**
 * Destroy a custom command
 * @param {string} guildID  - Guild ID (not name)
 * @param {string} commandID - Command ID (not name)
 * @param {import('discord.js').Client} client - The modified client
 */
async function destroyCommand(guildID, commandID, client) {
	try {
		await client.guilds.cache.get(guildID).commands.delete(commandID);
		console.log(
			`🤖 | Comando de barra ${commandID} eliminado para el servidor con la ID ${guildID}`
				.yellow,
		);
	} catch (e) {
		throw new Error(
			`Ha ocurrido un error al intentar invocar la función destroyCommand(): ${e}`,
		);
	}
}

module.exports = {
	buildCommand,
	destroyCommand,
};
