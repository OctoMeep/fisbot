import * as Discord from "discord.js";
import * as config from "./config.json";
import ChannelSetting from "./ChannelSetting";
import * as fs from "fs";

const fsp = fs.promises;

export const ensureDir = async (dirPath: string): Promise<void> => {
	let dirStats: fs.Stats;
	try {
		dirStats = await fsp.stat(dirPath);
		if (!dirStats.isDirectory) throw "Path exists and is not a directory!";
	} catch (err) {
		if (err.code == "ENOENT") {
			await fsp.mkdir(dirPath);
			dirStats = await fsp.stat(dirPath);
		} else throw err;
	}
}

export const ensureCategory = async (server: Discord.Guild, name: string): Promise<Discord.CategoryChannel> => {
	let category = server.channels.find(c => c.name == name);
	console.log(category);
	if (category) {
		if (!(category instanceof Discord.CategoryChannel)) throw new Error(`Channel ${name} exists but is not a category channel.`);
		return category;
	}
	category = await server.createChannel(name, {
		type: "category",
	});
	if (!(category instanceof Discord.CategoryChannel)) throw new Error("This should never happen");
	console.log(category);
	return category;

}

export const ensureRole = async (server: Discord.Guild, name: string, color?: string | number, reset?: boolean): Promise<Discord.Role> => {
	let role = server.roles.find(r => r.name == name);
	if (!role) {
			role = await server.createRole({
			name,
			mentionable: true,
			color,
			permissions: 0 //37084224
		});
	} else if (reset) {
		await Promise.all([
			role.setMentionable(true),
			role.setColor(color),
			role.setPermissions(0)
		]);
	}
	return role;
}

export const ensureChannel = async (server: Discord.Guild, name: string, category: Discord.CategoryChannel, roles: string[], readOnly: boolean, reset?: boolean): Promise<Discord.TextChannel> => {
	let channel = server.channels.find(c => c.name == name);
	if (channel) {
		if (!(channel instanceof Discord.TextChannel)) throw `Channel ${name} exists but is not a text channel.`;
		if (!reset) return channel;
	}
	const permissionOverwrites = [];
	const everyone = server.roles.find(r => r.name == "@everyone")
	const muted = server.roles.find(r => r.name == "muted")
	const admin = server.roles.find(r => r.name == "Admin")
	if (!everyone) throw "\"@everyone\" role does not exist";
	if (readOnly) permissionOverwrites.push({
		id: everyone,
		deny: Discord.Permissions.FLAGS.SEND_MESSAGES
	});
	permissionOverwrites.push({
		id: admin,
		allow: Discord.Permissions.FLAGS.VIEW_CHANNEL
	}, {
		id: admin,
		allow: Discord.Permissions.FLAGS.SEND_MESSAGES
	}, {
		id: muted,
		deny: Discord.Permissions.FLAGS.SEND_MESSAGES
	});
	if (!roles.includes("*")) {
		permissionOverwrites.push({
			id: everyone,
			deny: Discord.Permissions.FLAGS.VIEW_CHANNEL
		});
		roles.forEach((role: string) => {
			const serverRole = server.roles.find(r => r.name == role);
			if (!serverRole) throw `"${role}" role does not exist`;
			permissionOverwrites.push({
				id: serverRole,
				allow: Discord.Permissions.FLAGS.VIEW_CHANNEL
			});
		});
	}
	console.log(permissionOverwrites)
	if (!channel) channel = await server.createChannel(name, {
		type: "text",
		permissionOverwrites,
		parent: category
	});
	else if (reset) channel.replacePermissionOverwrites({overwrites: permissionOverwrites});
	if (!(channel instanceof Discord.TextChannel)) throw new Error("This should never happen");
	return channel;
}


export const readFileIfExists = async (filePath: string): Promise<string> => {
	try {
		return await fsp.readFile(filePath, "utf-8");
	} catch (err) {
		if (err.code == "ENOENT") {
			await fsp.writeFile(filePath, "", "utf-8")
			return "";
		}
		else throw err;
	}
};

export const getChannels = async (server: Discord.Guild): Promise<ChannelSetting[]> => {
	const result: ChannelSetting[] = [];
	const filePath: string = config.savePath + server.id + "/channels";
	const data = await readFileIfExists(filePath);
	if (data) data.replace(/\r/g, "").split("\n").forEach((line: string) => {
		if (line.length == 0 || line.startsWith("#")) return;
		const elements = line.split("\t");
		if (elements.length == 1) return;
		if (elements.length !== 4) throw new Error("Invalid channel definition file! Each row must have 4 columns.");
		const name = elements[0];
		const category = +elements[1];
		const structure = +elements[2];
		if ([0, 1, 2].includes(structure)) { // This is a special channel
			result.push({
				name,
				category,
				structure,
				roles: elements[3].split(",")
			});
		} else if ([3, 4, 5].includes(structure)) { // This is a course
			result.push({
				name,
				category,
				structure,
				group: +elements[3]
			});
		} else throw new Error("Invalid channel definition file! Structure (3rd column) cannot be greater than 5.");
	});
	return result;
};

export const getCategories = async (server: Discord.Guild): Promise<string[]> => {
	const filePath: string = config.savePath + server.id + "/categories";
	const data = await readFileIfExists(filePath);
	if (data) return data.replace(/\r/g, "").split("\n").filter(line => line.length != 0 && !line.startsWith("#"));
	else return [];
};
