const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client){

        if(interaction.isCommand()) {
            const cmd = client.slashCommands.get(interaction.commandName);
            if(!cmd) return;

            const args = []
            for(let option of interaction.options.data){
                if(option.type === 1){
                    if(option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if(x.value) args.push(x.value);
                    })
                } else if(option.value) args.push(option.value);
            }
            cmd.execute(client, interaction, args);
        }
    }
}

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
