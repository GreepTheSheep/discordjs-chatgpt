require('dotenv').config();
const Command = require('./structures/Command'),
    { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js'),
    client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel]
    }),
    Enmap = require('enmap'),
    db = new Enmap({name: "discordgpt"});

client.login().catch(err=>{
    console.error("❌ Connexion to Discord failed: " + err);
    process.exit(1);
});

/**
 * The list of commands the bot will use
 * @type {Command[]}
 */
let commands=[];


client.on('ready', async () => {
    console.log(`🤖 Logged in as ${client.user.tag}!`);

    commands = require('./fetchAllCommands')();

    // Register commands
    await require('./registerCommandsScript')(null, client.user.id, commands);
    // client.guilds.cache.forEach(async (guild) => {
    //     await require('./registerCommandsScript')(guild.id, client.user.id, []);
    // });
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isCommand()) {
            const command = commands.find(c => c.name === interaction.commandName);
            if (!command) return;

            await command.execute(interaction, commands, db);

        } else if (interaction.isStringSelectMenu()) {

            const command = commands.find(c => c.name === interaction.customId.split('_')[0]);
            if (!command) return;

            let idIndexOf = interaction.customId.indexOf('_')+1,
                categoryId = interaction.customId.substring(idIndexOf, interaction.customId.indexOf('_', idIndexOf)),
                argument = null;

            if (categoryId === command.name+'_') categoryId = interaction.customId.substring(idIndexOf);
            else argument = interaction.customId.substring(interaction.customId.indexOf('_', idIndexOf)+1);

            await command.executeSelectMenu(interaction, categoryId, argument, commands, db);

        } else if (interaction.isButton()) {

            const command = commands.find(c => c.name === interaction.customId.split('_')[0]);
            if (!command) return;

            let idIndexOf = interaction.customId.indexOf('_')+1,
                buttonId = interaction.customId.substring(idIndexOf, interaction.customId.indexOf('_', idIndexOf)),
                argument = null;

            if (buttonId === command.name+'_') buttonId = interaction.customId.substring(idIndexOf);
            else argument = interaction.customId.substring(interaction.customId.indexOf('_', idIndexOf)+1);

            await command.executeButton(interaction, buttonId, argument, commands, db);

        } else if (interaction.isModalSubmit()) {
            const command = commands.find(c => c.name === interaction.customId.split('_')[0]);
            if (!command) return;

            let idIndexOf = interaction.customId.indexOf('_')+1,
                modalId = interaction.customId.substring(idIndexOf, interaction.customId.indexOf('_', idIndexOf)),
                argument = null;

            if (modalId === command.name+'_') modalId = interaction.customId.substring(idIndexOf);
            else argument = interaction.customId.substring(interaction.customId.indexOf('_', idIndexOf)+1);

            await command.executeModal(interaction, modalId, argument, commands, db);
        }
    } catch (err) {
        interaction.reply({
            content: '❌ An error occurred while executing the command: ' + err,
            ephemeral: true
        });
        console.error(err);
    }
});

client.on('messageCreate', async message=>{
    if (
        message.author.bot ||
        !db.has("setup_ok") ||
        !db.get("setup_ok") ||
        !db.has("channel") ||
        message.channel.id != db.get("channel")
    ) return;

    try {
        await message.fetchReference();
        await require('./gpt')(message, client, db);
    } catch (err) {
        let botMsg;
        if (err.code == "MessageReferenceMissing")
            botMsg = await message.reply({
                content: "Do not send messages directly in this channel. Please reply to a message."
            });
        else
            botMsg = await message.reply({
                content: '❌ An error occurred while processing the message: ' + err,
            });
        setTimeout(() => message.delete(), 1000);
        setTimeout(() => botMsg.delete(), 7000);
    }
});