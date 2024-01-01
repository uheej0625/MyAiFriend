const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
require("dotenv").config();

// Discord Client
const client = new Client({
  intents: [
        GatewayIntentBits.Guilds,
				GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
	partials: [
    Partials.Channel,
    Partials.Message
  ]
});
//module.exports = { client };

// 이벤트 핸들링
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// MainChat
const MainChat = require("../src/Chat/MainChat.js");
client.on(MainChat.name, (...args) => MainChat.execute(...args, client));

client.login(process.env.Bot_Token);