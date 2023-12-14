const Command = require('../structures/Command'),
    {EmbedBuilder, CommandInteraction, SelectMenuInteraction, } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'info';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Bot and GPT Infos';


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
 */
exports.execute = async (interaction, commands, db) => {
    let embed = new EmbedBuilder();

    embed.setTitle("About " + interaction.client.user.tag)
        .setDescription("* Model: `"+db.get("model")+"`\n* Channel: <#"+db.get("channel")+">\n* Delete delay: "+(db.has("delete_delay") ? db.get("delete_delay")+" minutes" : "no delete") + "\n* Max tokens: "+(db.has("max_tokens") ? db.get("max_tokens") : 256))
        .setThumbnail(interaction.client.user.displayAvatarURL({size:512}))
        .setColor("Random");

    interaction.reply({
        embeds: [embed]
    });
};

/**
 * This method is executed when an a button is clicked in the message
 * @param {ButtonInteraction} interaction
 * @param {string} buttonId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeButton = async (interaction, buttonId, argument, commands) => {
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