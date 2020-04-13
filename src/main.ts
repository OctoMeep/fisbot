import * as Discord from "discord.js";
import * as config from "./config.json";
import { promises as fsp } from "fs";
import * as path from "path"
import ServerHandler from "./ServerHandler"
import DMHandler from "./DMHandler"

const client = new Discord.Client();

let initialized = false; // Avoid rerunning init code on connection loss
const serverHandlers: ServerHandler[] = [];
let dm: DMHandler;

client.login(config.token);

client.on("ready", async () => {
	if (initialized) return;
	console.log(`Beginning setup. Save directory is ${config.savePath}`);
	for (const server of Array.from(client.guilds.values())) {
		const dirPath = path.resolve(config.savePath + server.id);
		try {
			const dirStats = await fsp.stat(dirPath);
			if (!dirStats.isDirectory()) {
				console.log(`${dirPath} exists but is not a directory; skipping this server.`);
			} else {
				console.log(`Detected server ${server.id}.`);
				serverHandlers.push(new ServerHandler(client, server));
			}		
		} catch (err) {
			console.log(`Ignoring unconfigured server ${server.id}. If you want to use this server, create the folder ${dirPath}`);
		}
	}
	dm = new DMHandler(client, serverHandlers);

	initialized = true;

	for (const handler of serverHandlers) {
		console.log("Setting up " + handler.server.id);
		await handler.initialize();
		await handler.updateMembers();
		
	}
});

client.on("message", (message: Discord.Message) => {
	if (message.guild) serverHandlers.forEach((serverHandler: ServerHandler) => {
		if (message.guild == serverHandler.server) serverHandler.handleMessage(message,client); 
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
	if (oldMessage.guild && oldMessage.content != newMessage.content) await oldMessage.guild.owner.user.send(`
Message edited in ${(oldMessage.channel as Discord.TextChannel).name} in ${oldMessage.guild.name} at ${new Date()}
Send time: ${oldMessage.createdAt}
Author: ${oldMessage.author}
Old content: ${oldMessage.content}
New content: ${newMessage.content}

	`);
});

process.on("unhandledRejection", (err, promise) => {
	console.error("Unhandled promise rejection at " + promise + ", reason:\n" + (err instanceof Error ? err.stack : err));
	try {
		for (const handler of serverHandlers) {
			handler.notify("An error occured, please notify an administrator:\n" + (err instanceof Error ? err.stack : err))
		}
	} catch (err) {
		console.error("Sending error message failed.");
	}
});

process.on("uncaughtException", err => {
	console.error("Uncaught exception:\n" + err.stack);
	console.error("Error message:\n" + err.message);
	try {
		for (const handler of serverHandlers) {
			handler.notify("An error occured, please notify an administrator:\n" + err.stack)
		}
	} catch (err) {
		console.error("Sending error message failed.");
	}
});
