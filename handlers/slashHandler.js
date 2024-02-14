const { readdirSync } = require("node:fs");

module.exports = {

	async loadSlash(client){
		for(const category of readdirSync("./slashcommands")){
			for(const otherCategory of readdirSync(`./slashcommands/${category}`)){
				for(const fileName of readdirSync(`./slashcommands/${category}/${otherCategory}`).filter((file) => file.endsWith(".js"))){

					const command = require(`../slashcommands/${category}/${otherCategory}/${fileName}`);
					client.slashCommands.set(command.name, command);
				}
			}
		}
		await client.application?.commands.set(client.slashCommands.map((x) => x));
	},
};

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
