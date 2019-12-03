import * as Discord from "discord.js";
import { promises as fsp } from "fs";
import * as config from "./config.json";
import * as init from "./init";
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

	async handleMessage (message: Discord.Message): Promise<void> {
		if (!(message.channel instanceof Discord.TextChannel)) return;
		if (message.author.bot) return;
		if (!this.initialized) await this.initialize(false, message);
		if (!this.active) return;

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
			categories = await init.getCategories(this.server);
			channels = await init.getChannels(this.server);
			console.log("Ensuring categories");
			console.log(categories);
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

			console.log("Ensuring channels");
			for (const channel of channels) {
				switch (channel.structure) {
					case 0:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, false, reset);
						console.log(`Ensured channel ${channel.name}`);
						break;
					case 1:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true, reset);
						console.log(`Ensured channel ${channel.name}`);
						break;
					case 2:
						const notificationChannel = await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true, reset);
						console.log(`Ensured channel ${channel.name}`);
						this.notificationChannels.push(notificationChannel);
						break;
					case 3:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl"], false, reset);
						console.log(`Ensured channel ${channel.name}`);
						this.courses.push(channel);
						break;
					case 4:
						await util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl", channel.name + "-hl"], false, reset);
						console.log(`Ensured channel ${channel.name}`);
						this.courses.push(channel);
						break;
					case 5:
						await util.ensureChannel(this.server, channel.name + "-sl", categoryChannels[channel.category], [channel.name + "-sl"], false, reset);
						console.log(`Ensured channel ${channel.name + "-sl"}`);
						await util.ensureChannel(this.server, channel.name + "-hl", categoryChannels[channel.category], [channel.name + "-hl"], false, reset);
						console.log(`Ensured channel ${channel.name + "-hl"}`);
						this.courses.push(channel);
						break;

				}
			}
		} catch (err) {
			this.notify("Error during setup, please notify an administrator:\n" + err.stack);
		}

		this.initialized = true;
		this.active = true;

		(async function loop(self: ServerHandler): Promise<void> {
			let now = new Date();
			for (const user of self.server.members.map((m: Discord.GuildMember) => m.user)) {
				const record = await self.getUserRecord(user.id);
				if (!record) continue;
				console.log(record);
				const unmuteTime = (record.unmuteDate instanceof Date) ? record.unmuteDate.getTime() : record.unmuteDate;
				console.log("Unmuting at: " + unmuteTime);
				if (unmuteTime === 0) continue;
				if (unmuteTime < now.getTime()) self.unmuteUser(user);
			}
			self.updateUsers();
			now = new Date();
			setTimeout(() => {loop(self)}, 60000 - (now.getTime() % 60000));
		})(this);

		this.notify("Setup complete, the bot is now operational.");
	}

	async addUser(record: UserRecord): Promise<void> {
		console.log(record);
		const userData = await init.readFileIfExists(config.savePath + this.server.id + "/users");
		const lines = userData.split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith(record.id)) {
				lines[i] = record.toString();
				await fsp.writeFile(config.savePath + this.server.id + "/users", lines.join("\n"));
				return;
			}		
		}
		await fsp.appendFile(config.savePath + this.server.id + "/users", "\n" + record.toString())
	}

	async updateUsers(): Promise<void> {
		const userData = await init.readFileIfExists(config.savePath + this.server.id + "/users");
		for (const userLine of userData.split("\n")) {
			if (userLine.length == 0) continue;
			const userRecord = UserRecord.fromString(userLine);
			const member = this.server.members.get(userRecord.id);
			if (!member) return;
			const roles = [];
			for (const roleString of userRecord.courses) {
				if (roleString.length > 0) roles.push(this.server.roles.find(r => r.name == roleString));
			}
			if (userRecord.ib) roles.push(this.server.roles.find(r => r.name == "ib"));
			roles.push(this.server.roles.find(r => r.name == "signed-up"));
			for (const role of roles) {
				if (!member.roles.has(role.id)) member.addRole(role);
			}
		}
	}

	async getUserRecord(id: string): Promise<UserRecord> {
		const userData = await init.readFileIfExists(config.savePath + this.server.id + "/users");
		const userLine = await userData.split("\n").find((s: string) => s.startsWith(id));
		if (!userLine) return null;
		return UserRecord.fromString(userLine);
	}

	async muteUser(user: Discord.User, unmuteDate, reason?: string): Promise<void> {
		const record = await this.getUserRecord(user.id);
		if (!record) return;
		record.unmuteDate = unmuteDate.getTime();
		await this.addUser(record);
		const member = await this.server.fetchMember(user);
		member.addRole(this.server.roles.find((r: Discord.Role) => r.name === "muted"), reason);
	}

	async unmuteUser(user: Discord.User): Promise<void> {
		const record = await this.getUserRecord(user.id);
		if (!record) return;
		record.unmuteDate = 0;
		const member = await this.server.fetchMember(user);
		const role = member.roles.find((r: Discord.Role) => r.name === "muted");
		if (role) member.removeRole(role);
		this.updateUsers();
	}

	async strikeUser(user: Discord.User): Promise<void> {
		const record = await this.getUserRecord(user.id);
		if (!record) return;
		record.strikes++;
		if (record.strikes >= 3) {
			const unmuteDate = new Date();
			unmuteDate.setHours(unmuteDate.getHours() + 24);
			await this.addUser(record);
			await this.muteUser(user, unmuteDate);
		} else await this.addUser(record);

	}

	async unstrikeUser(user: Discord.User): Promise<boolean> {
		const record = await this.getUserRecord(user.id);
		if (!record) return;
		if (record.strikes === 0) return false;
		else record.strikes--;
		await this.addUser(record);
		return true;
	}

	async notify(msg: string): Promise<void> {
		console.error(msg);
		for (const channel of this.notificationChannels) {
			channel.send(msg);
		}
	}
}
