import { version } from "./package.json";
import * as Discord from "discord.js";
import { promises as fsp } from "fs";
import * as config from "./config.json";
import * as util from "./util";
import ChannelSetting from "./ChannelSetting";
import * as serverCommands from "./serverCommands";
import UserRecord from "./UserRecord"

export default class ServerHandler {

	client: Discord.Client;
	server: Discord.Guild;
	initialized: boolean;
	active: boolean;
	courses: ChannelSetting[];
	notificationChannels: Discord.TextChannel[];

	constructor (client: Discord.Client, server: Discord.Guild) {
		this.client = client;
		this.server = server;
		this.initialized = false;
		this.active = true;
		this.courses = [];
		this.notificationChannels = [];
	}

	async handleMessage (message: Discord.Message, client: Discord.Client): Promise<void> {
		const akhat = client.emojis.find(emoji => emoji.name === "Akhat");
		if (!(message.channel instanceof Discord.TextChannel)) return;
		if (message.author.bot) return;
		if (!this.initialized) await this.initialize(false, message);
		if (!this.active) return;
		if(akhat != null && message.content === "Akhat above all" || message.content === akhat.toString()){
			await message.channel.send(`${akhat} I only support the Akhat, everyone else is inferior.`);
			return;
		}
		
		if (message.content.startsWith("!")) serverCommands.handleMessage(message, this);
	}

	async initialize(reset?: boolean, message?: Discord.Message): Promise<void> {
		if (message && !(message.channel instanceof Discord.TextChannel)) return;
		this.active = false;
		let categories = [];
		const categoryChannels: Discord.CategoryChannel[] = [];
		let channels: ChannelSetting[] = [];
		const dirPath = config.savePath + this.server.id;
		console.log("Setting up using config in " + dirPath);
		try {
			await util.ensureDir(config.savePath);
			await util.ensureDir(dirPath);
			categories = await util.getCategories(this.server);
			channels = await util.getChannels(this.server);
			console.log("Ensuring categories");
			for (const category of categories) {
				console.log("Ensuring " + category);
				const categoryChannel = await util.ensureCategory(this.server, category);
				console.log(`Ensured category ${category}`);
				categoryChannels.push(categoryChannel);
			}

			await util.ensureRole(this.server, "Admin", "YELLOW");
			console.log("Ensured role Admin");
			await util.ensureRole(this.server, "muted", "ORANGE");
			console.log("Ensured role muted");
			await util.ensureRole(this.server, "signed-up", "AQUA");
			console.log("Ensured role signed-up");
			await util.ensureRole(this.server, "ib", "AQUA");
			console.log("Ensured role ib");

			console.log("Ensuring roles");
			for (const channel of channels) {
				switch (channel.structure) {
					case 3: {
						await util.ensureRole(this.server, channel.name + "-sl", "PURPLE");
						console.log(`Ensured role ${channel.name}`);
						break;
					}
					case 4:
					case 5: {
						await util.ensureRole(this.server, channel.name + "-sl", "BLUE");
						console.log(`Ensured role ${channel.name + "-sl"}`);
						await util.ensureRole(this.server, channel.name + "-hl", "GREEN");
						console.log(`Ensured role ${channel.name + "-hl"}`);	
					}
				}
			}

			console.log("Ensuring channels");
			for (const channel of channels) {
				switch (channel.structure) {
					case 0: {
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, false, reset);
						console.log(`Ensured channel ${channel.name}`);
						break;
					}
					case 1: {
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true, reset);
						console.log(`Ensured channel ${channel.name}`);
						break;
					}
					case 2: {
						const notificationChannel = await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true, reset);
						console.log(`Ensured channel ${channel.name}`);
						this.notificationChannels.push(notificationChannel);
						break;
					}
					case 3: {
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl"], false, reset);
						console.log(`Ensured channel ${channel.name}`);
						this.courses.push(channel);
						break;
					}
					case 4: {
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl", channel.name + "-hl"], false, reset);
						console.log(`Ensured channel ${channel.name}`);
						this.courses.push(channel);
						break;
					}
					case 5: {
						await util.ensureChannel(this.server, channel.name + "-sl", categoryChannels[channel.category], [channel.name + "-sl"], false, reset);
						console.log(`Ensured channel ${channel.name + "-sl"}`);
						await util.ensureChannel(this.server, channel.name + "-hl", categoryChannels[channel.category], [channel.name + "-hl"], false, reset);
						console.log(`Ensured channel ${channel.name + "-hl"}`);
						this.courses.push(channel);
						break;
					}
				}
			}
		} catch (err) {
			this.notify("Error during setup, please notify an administrator:\n" + err.stack);
		}

		this.initialized = true;
		this.active = true;

		// (async function loop(self: ServerHandler): Promise<void> {
		// 	await self.updateMembers();
		// 	setTimeout(() => {loop(self)}, 60000);
		// })(this);

		this.notify(`Setup complete, the bot is now operational. Running fisbot version ${version}`);
	}

	async updateRecord(record: UserRecord): Promise<void> {
		console.trace(`Why is this running?`);
		const userData = await util.readFileIfExists(config.savePath + this.server.id + "/users");
		const lines = userData.split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith(record.id)) {
				lines[i] = record.toString();
				console.log(`Saving ${lines.join("\n")} to ${config.savePath + this.server.id + "/users"}`);
				await fsp.writeFile(config.savePath + this.server.id + "/users", lines.join("\n"));
				return;
			}		
		}
		await fsp.appendFile(config.savePath + this.server.id + "/users", "\n" + record.toString())
	}

	async updateMember(record: UserRecord): Promise<void> {
		const member = this.server.members.get(record.id);
		const roles = [];
		for (const roleString of record.courses) {
			if (roleString.length > 0) roles.push(this.server.roles.find(r => r.name == roleString));
		}
		if (record.ib) roles.push(this.server.roles.find(r => r.name == "ib"));
		roles.push(this.server.roles.find(r => r.name == "signed-up"));
		for (const role of roles) {
			if (!member.roles.has(role.id)) await member.addRole(role);
		}
		const unmuteTime = (record.unmuteDate instanceof Date) ? record.unmuteDate.getTime() : record.unmuteDate;
		// console.log("Unmuting at: " + unmuteTime);
		const muted = this.server.roles.find((r: Discord.Role) => r.name === "muted");
		if (unmuteTime == 0) {
			if (member.roles.has(muted.id)) member.removeRole(muted);
		} else if (unmuteTime < new Date().getTime()) this.unmuteMember(record);
		else if (!member.roles.has(muted.id)) member.addRole(muted);
	}

	async updateMembers(): Promise<void> {
		const userData = await util.readFileIfExists(config.savePath + this.server.id + "/users");
		for (const userLine of userData.split("\n")) {
			if (userLine.length == 0) continue;
			const record = UserRecord.fromString(userLine);
			const member = this.server.members.get(record.id);
			if (!member) return;
			await this.updateMember(record)
		}
	}

	async getUserRecord(member: Discord.GuildMember): Promise<UserRecord> {
		const userData = await util.readFileIfExists(config.savePath + this.server.id + "/users");
		const userLine = await userData.split("\n").find((s: string) => s.startsWith(member.user.id));
		if (!userLine) return null;
		return UserRecord.fromString(userLine);
	}

	async muteMember(record: UserRecord, unmuteDate: Date): Promise<void> {
		record.unmuteDate = unmuteDate.getTime();
		await this.updateRecord(record);
		await this.updateMember(record);
	}

	async unmuteMember(record: UserRecord): Promise<void> {
		if (!record) return;
		record.unmuteDate = 0;
		await this.updateRecord(record);
		this.updateMember(record);
	}

	async strikeMember(record: UserRecord): Promise<void> {
		if (!record) return;
		record.strikes++;
		if (record.strikes >= 3) {
			const unmuteDate = new Date();
			unmuteDate.setHours(unmuteDate.getHours() + 24);
			await this.updateRecord(record);
			await this.muteMember(record, unmuteDate);
		} else await this.updateRecord(record);
	}

	async unstrikeMember(record: UserRecord): Promise<boolean> {
		if (!record) return;
		if (record.strikes === 0) return false;
		else record.strikes--;
		await this.updateRecord(record);
		return true;
	}

	async notify(msg: string): Promise<void> {
		console.error(msg);
		for (const channel of this.notificationChannels) {
			channel.send(msg);
		}
	}
}
