const OpenAI = require('openai'),
    openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY,
    });

/**
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').Client} client
 * @param {import('enmap').default} db
 */
module.exports = async function(message, client, db) {
    await message.channel.sendTyping();

    let messagesArray = [message],
        reachedEnd = false;
    while (reachedEnd == false) {
        try {
            console.log(messagesArray[0].reference);
            if (messagesArray[0].reference == null) reachedEnd = true;
            else {
                let msg = await messagesArray[0].channel.messages.fetch(messagesArray[0].reference.messageId);
                // let msg = await messagesArray[0].fetchReference();
                messagesArray.unshift(msg);
            }
        } catch (err) {
            if (err.code == "MessageReferenceMissing") reachedEnd = true;
            else throw err;
        }
    }

    const openAiMessages = [
        {
            "role": "system",
            "content": (db.has("system_input") ? db.get("system_input") : "") + "\n\nUser's name is set before the first double dots in user's message (:).\n\nPlease use Markdown and Discord's formatting."
        },
        ...messagesArray.map(m=>{
            return {
                "role": m.author.id == client.user.id ? "assistant" : "user",
                "content": (m.author.id == client.user.id ? "" : m.author.displayName + ": ") + m.content
            };
        })
    ];

    console.log(JSON.stringify(openAiMessages, null, 2));

    const response = await openai.chat.completions.create({
        model: db.has("model") ? db.get("model") : "gpt-3.5-turbo",
        messages: openAiMessages,
        temperature: 1,
        max_tokens: db.has("max_tokens") ? db.get("max_tokens") : 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    let gptResponse = await message.reply({
        content: response.choices[0].message.content
    });

    if (db.has("delete_delay"))
        setTimeout(() => {
            message.delete();
            gptResponse.delete();
        }, db.get("delete_delay") * 60 * 1000);
};