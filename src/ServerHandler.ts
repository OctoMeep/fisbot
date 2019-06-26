import * as Discord from "discord.js";
import * as config from "./config.json";
import * as init from "./init";
import * as util from "./util";
import * as notifications from "./notifications";
import CourseSetting from "./CourseSetting";

export default class ServerHandler {

	client: Discord.Client;
	server: Discord.Guild;
	initialized: boolean;
	courses: CourseSetting[];

	constructor (client: Discord.Client, server: Discord.Guild) {
		this.client = client;
		this.server = server;
		this.initialized = false;
		this.courses = [];
	}

	async handleMessage (message:Discord. Message) {
		if (!(message.channel instanceof Discord.TextChannel)) return;
		if (message.author.bot) return;
		if (!this.initialized) {
			const dirPath = config.savePath + this.server.id;
			try {
				await util.ensureDir(config.savePath);
				await util.ensureDir(dirPath);
				this.courses = await init.getCourses(this.server);
				console.log(this.courses);
			} catch (err) {
				notifications.fatal(err, message.channel);
			}
			this.initialized = true;
		}
	}
}
