import * as Discord from "discord.js";
import * as config from "./config.json";
import * as init from "./init";
import * as util from "./util";
import * as notifications from "./notifications";
import ChannelSetting from "./ChannelSetting";

export default class ServerHandler {

	client: Discord.Client;
	server: Discord.Guild;
	initialized: boolean;
	active: boolean;
	courses: ChannelSetting[];
	notificationChannels: Discord.Channel[];

	constructor (client: Discord.Client, server: Discord.Guild) {
		this.client = client;
		this.server = server;
		this.initialized = false;
		this.active = true;
		this.courses = [];
		this.notificationChannels = [];
	}

	async handleMessage (message: Discord.Message) {
		if (!(message.channel instanceof Discord.TextChannel)) return;
		if (message.author.bot) return;
		if (!this.initialized) await this.initialize(message);
		if (!this.active) return;
	}

	async initialize(message: Discord.Message) {
		if (!(message.channel instanceof Discord.TextChannel)) return;
		this.active = false;
		let categories = [];
		let categoryChannels = [];
		let channels = [];
		const dirPath = config.savePath + this.server.id;
		try {
			await util.ensureDir(config.savePath);
			await util.ensureDir(dirPath);
			categories = await init.getCategories(this.server);
			channels = await init.getChannels(this.server);
			for (let category of categories) {
				const categoryChannel = await util.ensureCategory(this.server, category);
				console.log(`Created category ${category}`);
				categoryChannels.push(categoryChannel);
			}
			for (let channel of channels) {
				switch (channel.structure) {
					case 3:
						await util.ensureRole(this.server, channel.name);
						console.log(`Created role ${channel.name}`);
						break;
					case 4:
					case 5:
						await util.ensureRole(this.server, channel.name + "-sl", "BLUE");
						console.log(`Created role ${channel.name + "-sl"}`);
						await util.ensureRole(this.server, channel.name + "-hl", "GREEN");
						console.log(`Created role ${channel.name + "-hl"}`);
				}
			}

			for (let channel of channels) {
				switch (channel.structure) {
					case 0:
						await util.ensureChannel(this.server, channel.name, categoryChannels[categoryChannels[channel.category]], channel.roles, false);
						console.log(`Created channel ${channel.name}`);
						break;
					case 1:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true);
						console.log(`Created channel ${channel.name}`);
						break;
					case 2:
						let notificationChannel = await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true);
						console.log(`Created channel ${channel.name}`);
						this.notificationChannels.push(notificationChannel);
						break;
					case 3:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name], false);
						console.log(`Created channel ${channel.name}`);
						this.courses.push(channel);
						break;
					case 4:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl", channel.name + "-hl"], false);
						console.log(`Created channel ${channel.name}`);
						this.courses.push(channel);
						break;
					case 5:
						await util.ensureChannel(this.server, channel.name + "-sl", categoryChannels[channel.category], [channel.name + "-sl"], false);
						console.log(`Created channel ${channel.name + "-sl"}`);
						await util.ensureChannel(this.server, channel.name + "-hl", categoryChannels[channel.category], [channel.name + "-hl"], false);
						console.log(`Created channel ${channel.name + "-hl"}`);
						this.courses.push(channel);
						break;

				}
			}
		} catch (err) {
			notifications.fatal(err, message.channel);
			return;
		}

		

		this.initialized = true;
		this.active = true;
	}
}
