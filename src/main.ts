import { Client, Message, Guild } from "discord.js";
import * as config from "./config.json";
import ServerHandler from "./ServerHandler"
import DMHandler from "./DMHandler"

const client = new Client();

let initialized: boolean = false; // Avoid rerunning init code on connection loss
let serverHandlers: ServerHandler[] = [];
let dm: DMHandler;

client.login(config.token);

client.on("ready", () => {
	if (initialized) return;
	console.log("Ready!");
	client.guilds.forEach((server: Guild) => {
		serverHandlers.push(new ServerHandler(client, server));
	});
	dm = new DMHandler(client, serverHandlers);
	initialized = true;

	serverHandlers.forEach((h: ServerHandler) => {
		h.initialize();
	});
});

client.on("message", (message: Message) => {
	if (message.guild) serverHandlers.forEach((serverHandler: ServerHandler) => {
		if (message.guild == serverHandler.server) serverHandler.handleMessage(message); 
	});
	else dm.handle(message);
});
