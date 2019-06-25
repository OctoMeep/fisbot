import { Client, Message, Guild } from "discord.js";
import * as config from "./config.json";
import ServerHandler from "./ServerHandler"

const client = new Client();

let initialized: boolean = false; // Avoid rerunning init code on connection loss
let serverHandlers: ServerHandler[] = [];

client.login(config.token);

client.on("ready", () => {
	if (initialized) return;
	console.log("Ready!");
	
	client.guilds.forEach((server: Guild) => {
		serverHandlers.push(new ServerHandler(client, server));
	});
	console.log(serverHandlers.length);

	initialized = true;
});

client.on("message", (message: Message) => {
	if (message.content == "ping") message.channel.send("pong");
	serverHandlers.forEach((serverHandler: ServerHandler) => {
		if (message.guild == serverHandler.server) serverHandler.handleMessage(message); 
	});
})
