require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("Le bot est prêt !");
});

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    message.channel.id !== process.env.CHANNEL_ID ||
    message.content.startsWith("!")
  ) {
    return;
  }
  let conversationLog = [{ role: "system", content: "Je suis un bot" }];

  try {
    await MediaKeyMessageEvent.channel.sendTyping();
    const prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse().forEach((msg) => {
      if (
        msg.content.startsWith("!") ||
        (msg.author.bot && msg.author.id !== client.user.id)
      ) {
        return;
      }
      const role = msg.author.id === client.user.id ? "assistant" : "user";
      const name = msg.author.username
        .replace(/_s+/g, " ")
        .replace(/[^\w\s]/gi, "");

      conversationLog.push({ role, content: msg.content, name });
    });
    const completion = await openai.chat.completion.create({
      model: "gpt-3.0-turbo",
      messages: conversationLog,
    });
    if (completion.choices.length > 0 && completion.choices[0].message) {
      await message.reply(competion.choices[0].message);
    }
  } catch (error) {
    console.error("Erreur: ${error.message}");
  }
});

client.login(process.env.TOKEN);
