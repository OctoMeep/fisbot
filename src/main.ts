import * as Discord from "discord.js";
import * as config from "./config.json";
import ServerHandler from "./ServerHandler"
import DMHandler from "./DMHandler"

const client = new Discord.Client();

let initialized = false; // Avoid rerunning init code on connection loss
const serverHandlers: ServerHandler[] = [];
let dm: DMHandler;

client.login(config.token);

client.on("ready", async () => {
	if (initialized) return;
	console.log("Ready!");
	client.guilds.forEach((server: Discord.Guild) => {
		serverHandlers.push(new ServerHandler(client, server));
	});
	dm = new DMHandler(client, serverHandlers);

	

	initialized = true;

	for (const handler of serverHandlers) {
		await handler.initialize();
		await handler.updateUsers();
		
	}
});

client.on("message", (message: Discord.Message) => {
	if (message.guild) serverHandlers.forEach((serverHandler: ServerHandler) => {
		if (message.guild == serverHandler.server) serverHandler.handleMessage(message); 
	});
	else dm.handle(message);
});

client.on("messageDelete", async (message: Discord.Message) => {
	if (message.guild) await message.guild.owner.user.send(`
Message deleted from ${(message.channel as Discord.TextChannel).name} in ${message.guild.name} at ${new Date()}
Send time: ${message.createdAt}
Author: ${message.author}
Content: ${message.content}

	`);
});

client.on("messageUpdate", async (oldMessage: Discord.Message, newMessage: Discord.Message) => {
	if (oldMessage.guild) await oldMessage.guild.owner.user.send(`
Message edited in ${(oldMessage.channel as Discord.TextChannel).name} in ${oldMessage.guild.name} at ${new Date()}
Send time: ${oldMessage.createdAt}
Author: ${oldMessage.author}
Old content: ${oldMessage.content}
New content: ${newMessage.content}

	`);
});

process.on("unhandledRejection", (err, promise) => {
		// This should only happen because a .send failed -> connection issue
		console.error("Unhandled promise rejection at " + promise + ", reason:\n" + (err instanceof Error ? err.stack : err));
});
