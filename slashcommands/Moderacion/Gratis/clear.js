const { EmbedBuilder } = require("discord.js");//Requerimos los paquetes

module.exports = {
	name: "clear",//Nombre del comando
	description: "Borra cierta cantidad de mensajes",//Descripción del comando
	options: [
	{
		name: "cantidad",
		description: "Escribe la cantidad de mensajes",
		type: 10,
		require: true,
		maxValue: 100,
		minValue: 1
	},
	{
		name: "usuario",
		description: "Menciona al usuario, que deberia borrar sus mensajes",
		type: 6,
		require: false
	},
	{
		name: "canal",
		description: "Menciona el canal para borrar mensajes",
		type: 7,
		channelTypes: [0],
		require: false
	}
	],

	async execute(client, interaction){

		const cantidad = interaction.options.getNumber("cantidad")
		const usuario = interaction.options.getUser("usuario")
		const canal = interaction.options.getChannel("canal") || interaction.channel;

		if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: "❌ No tienes suficientes permisos"})

			const mensajes = await interaction.channel.messages.fetch()

		if(usuario){
			let i = 0;
			const filtered = [];
			(await mensajes).filter((m) => {
				if(m.author.id === usuario.id && cantidad > i){
					filtered.push(m)
					i++;
				}
			})

			await canal.bulkDelete(filtered, true).then(messages => {
				interaction.reply({ content: `✅ Se han borrado ${messages.size}, mensajes del usuario ${usuario}` })
			})
		} else {
			await canal.bulkDelete(cantidad, true).then(messages => {
				interaction.reply({ content: `✅ se han borrado ${messages.size}, del canal ${canal}` })
			})
		}
	}
}

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/