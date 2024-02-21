const { EmbedBuilder } = require("discord.js");//Requerimos los paquetes

module.exports = {
	name: "setimagen",//Nombre del comando
	description: "Ponga una imagen animada",//Descripción del comando
	options: [
	{
		name: "imagen",
		description: "Selecciona la imagen",
		type: 11,
		require: true
	}],

	async execute(client, interaction){

		const avatar = interaction.options.getAttachment("imagen")

		await client.user.setAvatar(avatar.url).catch(async err => {
		})

		interaction.reply({ content: "La imagen ha sido cargada con exito" })
	}
}

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
