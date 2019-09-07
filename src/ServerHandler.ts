import * as Discord from "discord.js";
import { promises as fsp } from "fs";
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

	async initialize(message?: Discord.Message) {
		if (message && !(message.channel instanceof Discord.TextChannel)) return;
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
				console.log(`Ensured category ${category}`);
				categoryChannels.push(categoryChannel);
			}
			for (let channel of channels) {
				switch (channel.structure) {
					case 3:
						await util.ensureRole(this.server, channel.name + "-sl", "PURPLE");
						console.log(`Ensured role ${channel.name}`);
						break;
					case 4:
					case 5:
						await util.ensureRole(this.server, channel.name + "-sl", "BLUE");
						console.log(`Ensured role ${channel.name + "-sl"}`);
						await util.ensureRole(this.server, channel.name + "-hl", "GREEN");
						console.log(`Ensured role ${channel.name + "-hl"}`);
				}
			}

			for (let channel of channels) {
				switch (channel.structure) {
					case 0:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, false);
						console.log(`Ensured channel ${channel.name}`);
						break;
					case 1:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true);
						console.log(`Ensured channel ${channel.name}`);
						break;
					case 2:
						let notificationChannel = await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true);
						console.log(`Ensured channel ${channel.name}`);
						this.notificationChannels.push(notificationChannel);
						break;
					case 3:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name], false);
						console.log(`Ensured channel ${channel.name}`);
						this.courses.push(channel);
						break;
					case 4:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl", channel.name + "-hl"], false);
						console.log(`Ensured channel ${channel.name}`);
						this.courses.push(channel);
						break;
					case 5:
						await util.ensureChannel(this.server, channel.name + "-sl", categoryChannels[channel.category], [channel.name + "-sl"], false);
						console.log(`Ensured channel ${channel.name + "-sl"}`);
						await util.ensureChannel(this.server, channel.name + "-hl", categoryChannels[channel.category], [channel.name + "-hl"], false);
						console.log(`Ensured channel ${channel.name + "-hl"}`);
						this.courses.push(channel);
						break;

				}
			}
		} catch (err) {
			try {
				notifications.error(err, message && <Discord.TextChannel>message.channel);
			} catch (err) {
				throw err;
			}		
		}

		

		this.initialized = true;
		this.active = true;
	}
	
	async addUser(id: string, ib: boolean, courses: string) {
		let output = id + "\t" + (ib ? "y" : "n") + "\t" + courses + "\n";
		await fsp.appendFile(config.savePath + this.server.id + "/users", output)
	}
	
	async updateUsers() {
		let userData = await init.readFileIfExists(config.savePath + this.server.id + "/users", true);
		for (let userLine of userData.split("\n")) {
			if (userLine.length == 0) continue;
			let userValues = userLine.split("\t");
			console.log(userValues);
			let member = this.server.members.get(userValues[0]);
			let roles = [];
			for (let roleString of userValues[2].split(",")) {
				if (roleString.length > 0) roles.push(this.server.roles.find(r => r.name == roleString));
			}
			if (userValues[1] == "y") roles.push(this.server.roles.find(r => r.name == "ib"));
			for (let role of roles) {
				if (!member.roles.has(role.id)) member.addRole(role);
			}
		}
	}

	async error(err: Error) {
		try {
			notifications.error(err, <Discord.TextChannel[]>this.notificationChannels);
		} catch (err) {
			throw err;
		}		
	}
}
