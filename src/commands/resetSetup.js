const Command = require('../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonInteraction, ButtonStyle } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'resetsetup';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Reset the bot setup (Careful!)';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 * @param {import('enmap').default} db
 */
exports.execute = async (interaction, commands, db) => {
    if (interaction.user.id != process.env.OWNER_ID) return interaction.reply({content: "You don't have permissions to do this", ephemeral: true});
    if (process.env.OPENAI_KEY == undefined) return interaction.reply({content: "Your bot is missing a `OPENAI_KEY` in your .env, please add it and restart your bot.", ephemeral: true});
    if (!db.has("setup_ok") || !db.get("setup_ok")) return interaction.reply({content: "Setup has not been done. Please use `/setup`", ephemeral: true});

    const interactionComponentRows = [new ActionRowBuilder()];

    // Add 2 button to the message in the first row
    interactionComponentRows[0].addComponents(
        new ButtonBuilder()
            .setCustomId(this.name+'_'+'button-validate')
            .setLabel('YES')
            .setStyle(ButtonStyle.Danger)
    );

    interaction.reply({
        content: 'Are you sure you vant to reset the setup ? You need to do `/setup` after that.',
        components: interactionComponentRows,
        ephemeral: true
    });
};

/**
 * This method is executed when an a button is clicked in the message
 * @param {ButtonInteraction} interaction
 * @param {string} buttonId
 * @param {string} argument
 * @param {Command[]} commands
 * @param {import('enmap').default} db
 */
exports.executeButton = async (interaction, buttonId, argument, commands, db) => {
    if (buttonId == 'button-validate') {
        let channel = await interaction.client.channels.fetch(db.get("channel"));
        try {
            let message = await channel.messages.fetch(db.get("beginMessage"));
            await message.delete();
        } catch (err) {
            console.error(err);
        }

        db.delete("setup_ok");
        db.delete("channel");
        db.delete("beginMessage");
        db.delete("model");
        db.delete("delete_delay");
        db.delete("system_input");
        db.delete("max_tokens");

        interaction.update({
            content: "Configuration has been reseted! Please use `/setup` to resetup the bot",
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