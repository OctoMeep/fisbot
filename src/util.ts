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
		} else throw err;
	} finally {
		if (!dirStats.isDirectory) throw new Error("Path exists and is not a directory!");
	}
}

export const ensureRole = async (server: Discord.Guild, name: string): Promise<Discord.Role> => {
	let role = await server.roles.find(r => r.name == name);
	if (role) return role;
	else return await server.createRole({
		name,
		mentionable: true
	});
}

export const ensureChannel = async (server: Discord.Guild, name: string, category: number, roles: string[], readOnly: boolean): Promise<Discord.TextChannel> => {
	let channel = await server.channels.find(c => c.name == name);
	if (channel) {
		if (!(channel instanceof Discord.TextChannel)) throw new Error(`Channel ${name} exists but is not a text channel.`);
		return channel;
	}
	let permissionOverwrites = []; // TODO: readonly channels
	if (!roles.includes("*")) {
		permissionOverwrites.push({
			id: server.roles.find(r => r.name == "@everyone"),
			deny: Discord.Permissions.FLAGS.VIEW_CHANNEL
		});
		roles.forEach((role: string) => {
			const serverRole = server.roles.find(r => r.name == role);
			console.log(serverRole);
			permissionOverwrites.push({
				id: serverRole,
				allow: Discord.Permissions.FLAGS.VIEW_CHANNEL
			});
		});
	}
	channel = await server.createChannel(name, {
		type: "text",
		permissionOverwrites
	});
	console.log(channel);
	if (!(channel instanceof Discord.TextChannel)) throw new Error("This should never happen");
	return channel;
}
