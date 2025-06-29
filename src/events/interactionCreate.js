const { Interaction } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                const player = useMainPlayer();
                const data = { guild: interaction.guild };

                await player.context.provide(data, () => command.execute(interaction, client));
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!', 
                    ephemeral: true
                });
            }

        } else if(interaction.isButton()) {

            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);

            console.log(buttons);

            if(!button) return new Error('There is no code for this button');
        
            try {
                await button.execute(interaction, client);
            } catch (err){
                console.error(err);
            }

        } else if(interaction.isStringSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);

            if(!menu) return new Error("There is no code for this select menu");

            try {
                await menu.execute(interaction, client);
            } catch(err) {
                console.log(err);
            }
        }

    },
};