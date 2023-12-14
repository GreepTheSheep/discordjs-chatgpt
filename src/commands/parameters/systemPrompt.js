const Command = require('../../structures/Command'),
    { CommandInteraction, SelectMenuInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'system';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Set ChatGPT System Prompt';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'prompt',
        description: 'ChatGPT System Prompt',
        type: 'string',
        required: false
    }
];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands, db) => {
    if (interaction.user.id != process.env.OWNER_ID) return interaction.reply({content: "You don't have permissions to do this", ephemeral: true});
    if (process.env.OPENAI_KEY == undefined) return interaction.reply({content: "Your bot is missing a `OPENAI_KEY` in your .env, please add it and restart your bot.", ephemeral: true});
    if (!db.has("setup_ok") || !db.get("setup_ok")) return interaction.reply({content: "Setup has not been done. Please use `/setup`", ephemeral: true});

    let prompt = interaction.options.getString('prompt');

    if (prompt == null) {
        if (db.has("system_input")) {
            const interactionComponentRows = [new ActionRowBuilder()];

            // Add 2 button to the message in the first row
            interactionComponentRows[0].addComponents(
                new ButtonBuilder()
                    .setCustomId(this.name+'_'+'button-delete')
                    .setLabel('DELETE')
                    .setStyle(ButtonStyle.Danger)
            );

            return interaction.reply({
                content: "```"+db.get("system_input")+"```",
                components: interactionComponentRows,
                ephemeral: true
            });
        } else return interaction.reply({
            content: "No prompt was indicated, you can make one!",
            ephemeral: true
        });
    }

    db.set("system_input", prompt);

    interaction.reply({
        content: 'Prompt set!',
        ephemeral: true
    });
};

/**
 * This method is executed when an a button is clicked in the message
 * @param {ButtonInteraction} interaction
 * @param {string} buttonId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeButton = async (interaction, buttonId, argument, commands, db) => {
    if (buttonId == 'button-delete') {
        db.delete("system_input");

        interaction.update({
            content: "✅",
            components: []
        });
    }
};

/**
 * This method is executed when an update is made in a selectMenu
 * @param {SelectMenuInteraction} interaction
 * @param {string} categoryId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeSelectMenu = async (interaction, categoryId, argument, commands) => {
};

/**
 * This method is executed when a modal dialog is submitted
 * @param {ModalSubmitInteraction} interaction
 * @param {string} modalId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeModal = async (interaction, modalId, argument, commands) => {
};