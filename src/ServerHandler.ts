import { Client, Message, Guild } from "discord.js";
import { initialize } from "./init";

export default class ServerHandler {

	client: Client;
	server: Guild;
	initialized: boolean;

	constructor (client: Client, server: Guild) {
		this.client = client;
		this.server = server;
		this.initialized = false;
	}

	handleMessage (message: Message) {
		if (message.author.bot) return;
		if (!this.initialized) initialize(this.client, this.server);
	}
}
