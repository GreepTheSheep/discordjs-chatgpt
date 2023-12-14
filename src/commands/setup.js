const Command = require('../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, ButtonStyle, ChannelType } = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'setup';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Setup the bot for using ChatGPT';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'channel',
        description: 'Server Channel',
        type: 'channel',
        required: true,
        channelTypes: ChannelType.GuildText
    },
    {
        name: 'model',
        description: 'GPT model version',
        type: 'string',
        required: true,
        choices: [
            {
                name: "GPT 3.5 Turbo",
                value: "gpt-3.5-turbo"
            },
            {
                name: "GPT 3.5 Turbo (1106)",
                value: "gpt-3.5-turbo-1106"
            },
            {
                name: "GPT 3.5 Turbo (16k tokens)",
                value: "gpt-3.5-turbo-16k"
            },
            {
                name: "GPT 4",
                value: "gpt-4"
            },
            {
                name: "GPT 4 Turbo (1106 Preview)",
                value: "gpt-4-1106-preview"
            },
            {
                name: "GPT 3.5 Turbo (0301)",
                value: "gpt-3.5-turbo-0301"
            },
            {
                name: "GPT 3.5 Turbo (0613)",
                value: "gpt-3.5-turbo-0613"
            },
            {
                name: "GPT 3.5 Turbo (16k context / 0613)",
                value: "gpt-3.5-turbo-16k-0613"
            },
            {
                name: "GPT 4 (0314)",
                value: "gpt-4-0314"
            },
            {
                name: "GPT 4 (0613)",
                value: "gpt-4-0613"
            }
        ]
    },
    {
        name: "begin_message",
        description: "A message to tell users that they need to reply to this",
        type: 'string',
        required: false
    },
    {
        name: "delete_delay",
        description: "A delay (in minutes) for the message to be deleted after being sent (not deleted by default).",
        type: 'number',
        required: false
    }
];

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
    if (db.has("setup_ok") && db.get("setup_ok")) return interaction.reply({content: "Setup is already done. Please use `/resetsetup` to reset and redo the setup.", ephemeral: true});

    await interaction.deferReply({ephemeral: true});

    let channel = interaction.options.getChannel("channel"),
        model = interaction.options.getString("model"),
        beginMessage = interaction.options.getString("begin_message"),
        delete_delay = interaction.options.getNumber("delete_delay");

    db.set("channel", channel.id);
    db.set("model", model);
    db.set("delete_delay", delete_delay);

    if (beginMessage == null) beginMessage = "Hello! To start chatting, reply directly to this message! (do not send messages directly to the channel)";

    let message = await channel.send({
        content: beginMessage
    });

    db.set("beginMessage", message.id);

    interaction.editReply({
        content: `Channel set correctly to <#${channel.id}>`
    });

    db.set("setup_ok", true);
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