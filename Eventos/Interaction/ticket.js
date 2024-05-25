const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextInputBuilder, ModalBuilder, TextInputStyle, TextInputComponent, getTextInputValue } = require("discord.js")
const TicketCanal = require("../../Schemas/Configuraciones/Tickets/TicketsSetupCanales")
const TicketPanel = require("../../Schemas/Configuraciones/Tickets/TicketsSetup")
const transcripts = require("discord-html-transcripts")

module.exports = {
	name: "interactionCreate",

	async execute(interaction, client){

		if(interaction.isButton()){
			if(interaction.customId === "crear"){
				try{
					let modal = new ModalBuilder()
					.setCustomId("modal")
					.setTitle("🎫 Crear un ticket")

					let razon_txt = new TextInputBuilder()
					.setCustomId("razon")
					.setLabel("Asunto")
					.setStyle(TextInputStyle.Paragraph)
					.setPlaceholder("Escribe el asunto del ticket")
					.setRequired(true)

					const razon = new ActionRowBuilder().addComponents(razon_txt)

					modal.addComponents(razon);
					await interaction.showModal(modal);

					const modalInteraction = await interaction.awaitModalSubmit({ filter: i => i.user.id === interaction.user.id, time: 1200000_000 })

					const razon2 = modalInteraction.fields.getTextInputValue("razon")

					const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
					if(Data === null) return; const RolId = Data.RolID; const CategoriaId = Data.CategoriaID;

					let data_ticket = await TicketCanal.find({ ServerID: interaction.guild.id, AuthorID: interaction.user.id, Cerrado: false })

					for(const ticket of data_ticket){
						if(interaction.guild.channels.cache.get(ticket.Canal)) return modalInteraction.reply({ content: `❌ Ya tienes un ticket habierto: <#${ticket.Canal}>`, ephemeral: true })
					}

				await modalInteraction.reply({ content: "⌛ Creando ticket", ephemeral: true })

				const canal = await interaction.guild.channels.create({
					name: `ticket-${interaction.user.tag}`,
					type: ChannelType.GuildText,
					parent: CategoriaId
				})
				canal.permissionOverwrites.create(interaction.user.id, {
					ViewChannel: true,
					SendMessages: true
				})
				canal.permissionOverwrites.create(canal. guild.roles.everyone, {
					ViewChannel: false,
					SendMessages: false
				})

				const mensaje = new EmbedBuilder()
				.setTitle("Ticket habierto")
				.setDescription(`Ticket habierto por <@${interaction.user.id}>\nAsunto ${razon2}`)
				.setColor("Green")

				let data = new TicketCanal({
					ServerID: interaction.guild.id,
					AuthorID: interaction.user.id,
					Canal: canal.id,
					Cerrado: false
				}).save()

				await modalInteraction.editReply({ content: `Tciket creado ${canal}`, ephemeral: true })

				const botones = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
					.setCustomId("cerrar")
					.setEmoji("🔒")//Emoji del boton
					.setLabel("Cerrar")//nombre del boton
					.setStyle(ButtonStyle.Secondary),//Estilo del boton

					new ButtonBuilder()
					.setCustomId("borrar")
					.setEmoji("🗑")//Emoji del boton
					.setLabel("Borrar")//nombre del boton
					.setStyle(ButtonStyle.Secondary),//Estilo del boton
					

				new ButtonBuilder()
					.setCustomId("claim")
					.setEmoji("📌")//Emoji del boton
					.setLabel("Claim")//nombre del boton
					.setStyle(ButtonStyle.Secondary),//Estilo del boton
					

				new ButtonBuilder()
					.setCustomId("transcript")
					.setEmoji("📋")//Emoji del boton
					.setLabel("Transcript")//nombre del boton
					.setStyle(ButtonStyle.Secondary)//Estilo del boton
					)
				canal.send({ embeds: [mensaje], components: [botones], content: `<@${interaction.user.id}> <@&${RolId}>` })
				} catch (error){
					console.log(error)
				}
			}
		} if(interaction.customId === "cerrar"){
			try{
				const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
				if(Data === null) return; const RolId = Data.RolID; const Author = Data.AuthorID;

				const permiso = interaction.user.id !== `${Author}`
				if(!permiso)
					return interaction.reply({ content: "❌ No tengo permisos suficientes", ephemeral: true })
				let data_ticket = await TicketCanal.findOne({ ServerID: interaction.guild.id, Canal: interaction.channel.id })

				if(data_ticket && data_ticket.Cerrado) return interaction.reply({ content: `Ticket cerrado por <@${interaction.user.id}>` })

					interaction.deferUpdate()

				const btn1 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
					.setCustomId("verificar")
					.setEmoji("✅")
					.setLabel("si")
					.setStyle(ButtonStyle.Secondary)
					)

				const btn2 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
					.setCustomId("verificar")
					.setEmoji("✅")
					.setLabel("si")
					.setDisable(true)
					.setStyle(ButtonStyle.Secondary)
					)
				const  btn3 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
					.setCustomId("verificar")
					.setEmoji("❌")
					.setLabel("No fue aceptado el cerrado")
					.setDisable(true)
					.setStyle(ButtonStyle.Secondary)
					)

				const verificar = await interaction.channel.send({ content: `📌 ¿Estas seguro que quieres cerrar tu ticket?`, components: [btn1] })

				const collector = verificar.createMessageComponentCollector({ filter: i => i.isButton() && i.message.author.id == client.user.id && i.user, time: 180e3})

				collector.on("collect", boton => {
					if(boton.user.id !== interaction.user.id) return boton.reply({ content: `Solo ${interaction.user} puede usar ese boton`, ephemeral: true })

						collector.stop()
						boton.deferUpdate()

						data_ticket.Cerrado = true;
						data_ticket.save();

					interaction.channel.permissionOverwrites.create(data_ticket.AuthorID, {
						ViewChannel: false,
						SendMessages: false
					})
				})

				collector.on("end", (collected) => {
					if(collected && collected.first() && collected.first().customId){
						verificar.edit({ components: [btn2] })
					} else {
						verificar.edit({ embeds: [verificar.embeds[0]], components: [btn3] })
					}
				})
			} catch (error){
				console.log(error)
			}
		} if(interaction.customId === "borrar"){
			try{
				const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
				if(Data === null) return; const RolId = Data.RolID;

				const permiso = interaction.member.roles.cache.has(`${RolId}`)
				if(!permiso)
					return interaction.reply({ content: "❌ No tienes suficientes permiso", ephemeral: true })

				const mensaje = new EmbedBuilder()
				.setDescription("📌 ¿Estas seguro que quieres borrar el ticket?")
				.setColor("Red")

				const botones = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
					.setCustomId("siboton")
					.setEmoji("✅")
					.setLabel("si")
					.setStyle(ButtonStyle.Secondary),

					new ButtonBuilder()
					.setCustomId("noboton")
					.setEmoji("❌")
					.setLabel("No")
					.setStyle(ButtonStyle.Secondary)
					)

				await interaction.reply({ embeds: [mensaje], components: [botones],ephemeral: true })
			} catch(error){
				console.log(error)
			}
		} if(interaction.customId === "siboton"){
			try{

				const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
				if(Data === null) return; const RolId = Data.RolID;

				const permiso = interaction.member.roles.cache.has(`${RolId}`)
				if(!permiso)
					return interaction.reply({ content: "❌ No tienes permisos suficientes", ephemeral: true })

				const mensaje = new EmbedBuilder()
				.setDescription("✅ El ticket sera eliminado dentro de **5** segundos")
				.setColor("Green")
				return interaction.reply({ embeds: [mensaje], ephemeral: true })

				&& setTimeout(() => {
					interaction.channel.delete(`${interaction.channels}`)
				}, 5000)
			} catch(error){
				console.log(error)
			}
		} if(interaction.customId === "noboton"){
			try{

				const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
				if(Data === null) return; const RolId = Data.RolID;

				const permiso = interaction.member.roles.cache.has(`${RolId}`)
				if(!permiso)
					return interaction.reply({ content: "❌ No tienes permisos suficientes", ephemeral: true })

				const mensaje = new EmbedBuilder()
				.setDescription("❌ El ticket no fue eliminado")
				.setColor("Red")

				await interaction.reply({ embeds: [mensaje], ephemeral: true })
			} catch(error){
				console.log(error)
			}
		} if(interaction.customId === "claim"){
			try{
				const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
				if(Data === null) return; const RolId = Data.RolID;

				const permiso = interaction.member.roles.cache.has(`${RolId}`)
				if(!permiso)
					return interaction.reply({ content: "❌ No tienes permisos suficientes", ephemeral: true })

				const embed = new EmbedBuilder()
				.setDescription(`💬 Ticket claimeado por <@${interaction.user.id}>`)
				.setColor("Green")

				interaction.reply({ embeds: [embed] })
			} catch(error){
				console.log(error)
			}
		} if(interaction.customId === "transcript"){
			try{
				const Data = await TicketPanel.findOne({ ServerID: interaction.guild.id })
				if(Data === null) return; const RolId = Data.RolID;

				const permiso = interaction.member.roles.cache.has(`${RolId}`)
				if(!permiso)
					return interaction.reply({ content: "❌ No tienes permisos suficientes", ephemeral: true })

				const canal = interaction.channel;

				const trans_tickets = await transcripts.createTranscript(canal)

				interaction.reply({ files: [trans_tickets] })
			} catch(error){
				console.log(error)
			}
		}
	}
}