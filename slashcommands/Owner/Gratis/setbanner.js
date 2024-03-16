const { EmbedBuilder } = require("discord.js")
const fetch = require("node-fetch")

module.exports = {
	name: "setbanner",
	description: "Ponga un banner a su bot",
	options: [
	{
		name: "banner",
		description: "Selecciona la imagen",
		type: 11,
		required: true
	}
	],

	async execute(client, interaction){

		const owner = "991412175203733584";
		if(interaction.user.id !== owner){
			return interaction.reply({ content: "No tienes los permisos requeridos, para usar este comando" })
		}

		const banner = interaction.options.getAttachment("banner")
		const response = await fetch(banner.url)
		const buffer = await response.buffer()
		const base64 = buffer.toString("base64")
		const imageData = `data:${banner.contentType};base64,${base64}`

		const patchResponse = await fetch("https://discord.com/api/v10/users/@me", {
			method: "PATCH",
			headers: {
				Authorization: `Bot ${client.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ banner: imageData }),
		})

		await interaction.reply({ content: "El banner ha sido cambiado con exito" })
	}
}

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
