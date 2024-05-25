const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");//Requerimos los paquetes
const  TicketSetup = require("../../../Schemas/Configuraciones/Tickets/TicketsSetup")

module.exports = {
	name: "setup-ticket",//Nombre del comando
	description: "Configura un sistema de ticket en tu servidor",//Descripción del comando
	options:[
	{
		name: "on",
		description: "Habilita el sistema de ticket donde se habriran los tickets",
		type: 1,
		options: [
		{
			name: "categoria",
			description: "Menciona una categoria",
			type: 7,
			channelTypes: [4],
			required: true
		},
		{
			name: "rol",
			description: "Mencione un rol para manejar los ticket",
			type: 8,
			required: true
		},
		{
			name: "descripcion",
			description: "Descripcion que se enviara en el embed",
			type: 3,
			minLength: 1,
			maxLength: 1000,
			required: true
		},
		{
			name: "canal",
			description: "Mencione un canal donde se enviara el embed",
			type: 7,
			channelTypes: [0],
			required: false
		},
		{
			name: "titulo",
			description: "Titulo del embed",
			type: 3,
			minLength: 1,
			maxLength: 100,
			required: false
		},
		{
			name: "color_embed",
			description: "Color del embed",
			type: 3,
			required: false,
			choices: [
			{ name: "Rojo", value: "Red" },
			{ name: "Blanco", value: "White" },
			{ name: "Azul", value: "Blue" },
			{ name: "Color aleatorio", value: "Random" }]
		},
		{
			name: "imagen",
			description: "Imagen del embed",
			type: 3,
			required: false
		},
		{
			name: "thumbnail",
			description: "Thumbnail del embed",
			type: 3,
			required: false
		},
		{
			name: "nombre_boton",
			description: "Nombre del boton del ticket",
			type: 3,
			minLength: 1,
			maxLength: 20,
			required: false
		},
		{
			name: "color_boton",
			description: "Color del boton del ticket",
			type: 3,
			required: false,
			choices: [
			{ name: "Rojo", value: `${ButtonStyle.Danger}` },
			{ name: "Gris", value: `${ButtonStyle.Secondary}` },
			{ name: "Azul", value: `${ButtonStyle.Primary}` },
			{ name: "Verde", value: `${ButtonStyle.Success}` }]
		},
		{
			name: "emoji_boton",
			description: "Emoji del boton del ticket",
			type: 3,
			required: false
		}]
	},
	{
		name: "edit",
		description: "Edita el sistema de tickets",
		type: 1,
		options:[
		{
			name: "rol",
			description: "Rol que manejara el sistema de tickets",
			type: 8,
			required: true
		},
		{
			name: "categoria",
			description: "Mencione una categoria donde se habriran los tickets",
			type: 7,
			channelTypes: [4],
			required: true
		}]
	},
	{
		name: "off",
		description: "Deshabilita el sistema de tickets",
		type: 1
	}],

	async execute(client, interaction){

		const action = interaction.options.getSubcommand()

		const canalId = interaction.options.getChannel("canal") || interaction.channel;
		const categoriaId = interaction.options.getChannel("categoria")
		const rolId = interaction.options.getRole("rol")
		const titulo = interaction.options.getString("titulo") || null;
		const descripcion = interaction.options.getString("descripcion")
		const colorembed = interaction.options.getString("color_embed") || "#2e3137";
		const imagen = interaction.options.getString("imagen") || null;
		const thumbnail = interaction.options.getString("thumbnail") || null;
		const nombreboton = interaction.options.getString("nombre_boton") || "Tickets";
		const emojiboton = interaction.options.getString("emoji_boton") || "✅";
		const colorboton = interaction.options.getString("color_boton") || `${ButtonStyle.Secondary}`;

		const data = await TicketSetup.findOne({
			ServerID: interaction.guild.id
		})

		if(action === "on"){
			if(data) return interaction.reply({ content: "Este servidor ya tiene activado el sistema de tickets", ephemeral: true })

				new TicketSetup({
					ServerID: interaction.guild.id,
					CanalID: canalId.id,
					CategoriaID: categoriaId.id,
					RolID: rolId.id
				}).save()

			interaction.reply({ content: `El sistema de ticket fue creado correctamente en el canal ${canalId}` })

			const embed = new EmbedBuilder()
			.setTitle(titulo)
			.setDescription(descripcion)
			.setImage(imagen)
			.setThumbnail(thumbnail)

			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setCustomId("crear")
				.setLabel(nombreboton)
				.setStyle(colorboton)
				.setEmoji(emojiboton))

			canalId.send({ embeds: [embed], components: [row] })

		} if(action === "edit"){
			if(!data) return interaction.reply({ content: "Este servidor no tiene habilitado el sistema de tickets" })

				await TicketSetup.findOneAndUpdate({
					ServerID: interaction.guild.id
				},{
					RolID: rolId.id,
					CategoriaID: categoriaId.id
				})

			interaction.reply({ content: "El sistema de ticket ha sido editado con exito" })

		} if(action === "off"){
			if(!data) return interaction.reply({ content: "Este servidor no tiene habilitado el sistema de tickets" })

				await TicketSetup.findOne({
					ServerID: interaction.guild.id
				}).deleteOne()

			interaction.reply({ content: "Los sistemas de tickets han sido deshabilitados" })
		}
	}
}

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/