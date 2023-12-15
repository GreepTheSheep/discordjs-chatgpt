const Command = require('../../structures/Command'),
    { CommandInteraction, SelectMenuInteraction } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'deletedelay';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Set a delay (in minutes) for the message to be deleted after being sent';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: "delete_delay",
        description: "A delay (in minutes) for the message to be deleted after being sent (0: do not delete).",
        type: 'number',
        required: true
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

    let delay = interaction.options.getNumber('delete_delay');

    db.set("delete_delay", delay);

    interaction.reply({
        content: 'Delete delay set to ' + delay + " minutes",
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