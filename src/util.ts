import * as Discord from "discord.js";
import * as fs from "fs";
const fsp = fs.promises;

export const ensureDir = async (dirPath: string) => {
	let dirStats: fs.Stats;
	try {
		dirStats = await fsp.stat(dirPath);
	} catch (err) {
		if (err.code == "ENOENT") {
			await fsp.mkdir(dirPath);
			dirStats = await fsp.stat(dirPath);
		} else throw err;
	} finally {
		if (!dirStats.isDirectory) throw new Error("Path exists and is not a directory!");
	}
}

export const ensureCategory = async (server: Discord.Guild, name: string): Promise<Discord.CategoryChannel> => {
	let category = await server.channels.find(c => c.name == name);
	if (category) {
		if (!(category instanceof Discord.CategoryChannel)) throw new Error(`Channel ${name} exists but is not a category channel.`);
		return category;
	}
	category = await server.createChannel(name, {
		type: "category",
	});
	if (!(category instanceof Discord.CategoryChannel)) throw new Error("This should never happen");
	return category;

}

export const ensureRole = async (server: Discord.Guild, name: string, color?: string | number | [number, number, number]): Promise<Discord.Role> => {
	let role = await server.roles.find(r => r.name == name);
	if (role) return role;
	else return await server.createRole({
		name,
		mentionable: true,
		color
	});
}

export const ensureChannel = async (server: Discord.Guild, name: string, category: Discord.CategoryChannel, roles: string[], readOnly: boolean): Promise<Discord.TextChannel> => {
	let channel = await server.channels.find(c => c.name == name);
	if (channel) {
		if (!(channel instanceof Discord.TextChannel)) throw new Error(`Channel ${name} exists but is not a text channel.`);
		return channel;
	}
	let permissionOverwrites = [];
	const everyone = server.roles.find(r => r.name == "@everyone")
	if (!everyone) throw "\"@everyone\" role does not exist";
	if (readOnly) permissionOverwrites.push({
		id: everyone,
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
	channel = await server.createChannel(name, {
		type: "text",
		permissionOverwrites,
		parent: category
	});
	if (!(channel instanceof Discord.TextChannel)) throw new Error("This should never happen");
	return channel;
}
