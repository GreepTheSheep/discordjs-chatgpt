const Command = require('../../structures/Command'),
    { CommandInteraction, SelectMenuInteraction } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'model';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Set ChatGPT model';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'model',
        description: 'ChatGPT model',
        type: 'string',
        required: true,
        choices: [
            {
                name: "GPT 4o Mini",
                value: "gpt-4o-mini"
            },
            {
                name: "GPT 3.5 Turbo",
                value: "gpt-3.5-turbo"
            },
            {
                name: "GPT 4",
                value: "gpt-4"
            },
            {
                name: "GPT 4 Turbo (Preview)",
                value: "gpt-4-turbo-preview"
            },
            {
                name: "GPT 4 Turbo (with Vision)",
                value: "gpt-4-turbo"
            }
        ]
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

    let model = interaction.options.getString('model');

    db.set("model", model);

    interaction.reply({
        content: 'Model set to ' + model,
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