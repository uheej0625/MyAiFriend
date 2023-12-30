//기본 선언들
const dotenv = require("dotenv");
const { Client, Collection, REST, Routes, EmbedBuilder, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require('node:path');
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(process.env.Bot_Token);

//몽고 DB
// const mongoose = require("mongoose")
// mongoose.connect(process.env.MongoDB,{
//   dbName: 'RoBank',
// }).then(console.log("데이터베이스 연결 완료"))

//이벤트 핸들링
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

//슬래쉬 커맨드 핸들링
client.commands = new Collection();
const GlobalCommands_json = [];
const PrivateCommands_json = [];
const DLabCommands_json = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`${foldersPath}/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
    const command = require(`${foldersPath}/${folder}/${file}`);
    if (folder === 'Global') {
      GlobalCommands_json.push(command.data.toJSON());
    } else if (folder === 'Private') {
      PrivateCommands_json.push(command.data.toJSON());
    } else if (folder === 'DLab') {
      DLabCommands_json.push(command.data.toJSON());
    }
    client.commands.set(command.data.name, command);
  }
}
const rest = new REST({ version: "10" }).setToken(process.env.Bot_Token);
rest // 글로벌 커맨드 등록
  .put(Routes.applicationCommands(process.env.Bot_Id), { body: GlobalCommands_json })
  .then((command) => console.log(`${command.length}개의 글로벌 커맨드를 등록했습니다`));
rest // 프라이빗 커맨드 등록
  .put(Routes.applicationGuildCommands(process.env.Bot_Id, 1129384723685318708n), { body: PrivateCommands_json })
  .then((command) => console.log(`${command.length}개의 프라이빗 커맨드를 등록했습니다`));
rest // DLab 커맨드 등록
  .put(Routes.applicationGuildCommands(process.env.Bot_Id, 876464586663014420n), { body: DLabCommands_json })
  .then((command) => console.log(`${command.length}개의 DLab서버 커맨드를 등록했습니다`));

//에러 무시
//process.on('unhandledRejection', console.error);
//process.on('uncaughtException', console.error);