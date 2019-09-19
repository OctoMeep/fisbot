import { Client, Message, Guild } from "discord.js";
import * as config from "./config.json";
import ServerHandler from "./ServerHandler"
import DMHandler from "./DMHandler"

const client = new Client();

let initialized = false; // Avoid rerunning init code on connection loss
const serverHandlers: ServerHandler[] = [];
let dm: DMHandler;

client.login(config.token);

client.on("ready", async () => {
	if (initialized) return;
	console.log("Ready!");
	client.guilds.forEach((server: Guild) => {
		serverHandlers.push(new ServerHandler(client, server));
	});
	dm = new DMHandler(client, serverHandlers);

	

	initialized = true;

	for (const handler of serverHandlers) {
		await handler.initialize();
		await handler.updateUsers();
		
	}
});

client.on("message", (message: Message) => {
	if (message.guild) serverHandlers.forEach((serverHandler: ServerHandler) => {
		if (message.guild == serverHandler.server) serverHandler.handleMessage(message); 
	});
	else dm.handle(message);
});

client.on("messageDelete", async (message: Message) => {
	if (message.guild) await message.guild.owner.user.send(`
Server: ${message.guild.name}
Deletion time: ${new Date()}
Send time: ${message.createdAt}
Author: ${message.author}
Content: ${message.content}
	`);
});

process.on("unhandledRejection", (err, promise) => {
		// This should only happen because a .send failed -> connection issue
		console.error("Unhandled promise rejection at " + promise + ", reason:\n" + (err instanceof Error ? err.stack : err));
	});
