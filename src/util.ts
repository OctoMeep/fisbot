import * as Discord from "discord.js";
import * as fs from "fs";
const fsp = fs.promises;

export const ensureDir = async (dirPath: string) => {
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

export const ensureRole = async (server: Discord.Guild, name: string, color?: string | number | [number, number, number]): Promise<Discord.Role> => {
	let role = server.roles.find(r => r.name == name);
	if (role) return role;
	else return await server.createRole({
		name,
		mentionable: true,
		color,
		permissions: 0 //37084224
	});
}

export const ensureChannel = async (server: Discord.Guild, name: string, category: Discord.CategoryChannel, roles: string[], readOnly: boolean, reset?: boolean): Promise<Discord.TextChannel> => {
	let channel = server.channels.find(c => c.name == name);
	if (channel) {
		if (!(channel instanceof Discord.TextChannel)) throw `Channel ${name} exists but is not a text channel.`;
		if (!reset) return channel;
	}
	let permissionOverwrites = [];
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
	});
	permissionOverwrites.push({
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
