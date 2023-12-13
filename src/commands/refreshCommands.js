const Command = require('../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, ButtonStyle } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'refreshcommands';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Refresh commands';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'thisguild',
        description: 'Only for this Guild ?',
        type: 'bool',
        required: false
    }
];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {
    await interaction.deferReply({ephemeral: true});

    let thisGuild = interaction.options.getBoolean("thisguild") | false;

    let cmds = require('../fetchAllCommands')();

    await require('../registerCommandsScript')(thisGuild ? interaction.guild.id : null, interaction.client.user.id, cmds);

    interaction.editReply({
        content: `Done.`
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