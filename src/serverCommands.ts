import * as Discord from "discord.js";
import ServerHandler from "./ServerHandler";

const getStatus = async (member: Discord.GuildMember, handler: ServerHandler): Promise<string> => {
		const record = await handler.getUserRecord(member.id);
		if (!record) return member.nickname || member.user.username + " has not signed up.";
		else {
			const unbanDate = record.unbanDate instanceof Date ? record.unbanDate : new Date(record.unbanDate);
			return `
Status for ${member.nickname || member.user.username}:
They have signed up for the following courses: ${record.courses.join(", ")}.
They ${record.ib ? "" : "do not "}take the full IBDP.
They have ${record.strikes} strikes.
They are ${record.unbanDate === 0 ? `not banned` : `banned until ${unbanDate}`}.
			`;
		}
}

export const handleMessage = async (message: Discord.Message, handler: ServerHandler): Promise<void> => {
	if (!message.content.startsWith("!")) return;
	const args = message.content.slice(1).split(" ");
	switch (args[0]) {
		case "status":
			let members = [];
			for (const arg of args.slice(1)) {
				for (const member of Array.from(message.guild.members.values())) {
					if (arg === member.nickname || arg === member.user.username) {
						members.push(member);
					}
				}
			}
			members = members.filter((m, i, self) => self.indexOf(m) === i);
			for (const member of members) {
				await message.channel.send(await getStatus(member, handler));
			}
			break;
		case "ban":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			if (args.length < 3) {
				await message.channel.send("You must specify a time to ban for and a reason.");
				return;
			}
			const time = +args[1];
			if (!time) {
				await message.channel.send("Invalid time.");
				return;
			}

			const reason = args[2];

			const unbanDate = new Date();
			unbanDate.setHours(unbanDate.getHours() + time);

			for (const member of Array.from(message.mentions.members.values())) {
				const user = member.user;
				if (await handler.getUserRecord(user.id)) {
					await handler.banUser(user, unbanDate, reason);
					await message.channel.send(`Banned ${member.nickname || user.username} until ${unbanDate}.`);
				} else await message.channel.send(`${member.nickname || user.username} has not signed up yet.`);
			}
			break;
		case "strike":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const member of Array.from(message.mentions.members.values())) {
				const user = member.user;
				if (await handler.getUserRecord(user.id)) {
					await handler.strikeUser(user);
					await message.channel.send(`Added 1 strike for ${member.nickname || user.username}.`);
				} else await message.channel.send(`${member.nickname || user.username} has not signed up yet.`);
			}
			break;
		case "unstrike":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const member of Array.from(message.mentions.members.values())) {
				const user = member.user;
				if (await handler.getUserRecord(user.id)) {
					const result = await handler.unstrikeUser(user);
					if (result) await message.channel.send(`Removed 1 strike for ${member.nickname || user.username}.`);
					if (!result) await message.channel.send(`${member.nickname || user.username} has no strikes.`);
				} else await message.channel.send(`${member.nickname || user.username} has not signed up yet.`);
			}
			break;
		case "mute":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const member of Array.from(message.mentions.members.values())) {
				await handler.muteUser(member.user);
				await message.channel.send(`Muted ${member.nickname || member.user.username}`);
			}
			break;
		case "unmute":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const member of Array.from(message.mentions.members.values())) {
				await handler.unmuteUser(member.user);
				await message.channel.send(`Unmuted ${member.nickname || member.user.username}`);
			}
			break;
		case "fixAdmin":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const channel of Array.from(message.guild.channels.values())) {
				channel.overwritePermissions(message.guild.roles.find((r: Discord.Role) => r.name == "Admin"), {"VIEW_CHANNEL": true})
			}
			break;
		case "init":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			await message.channel.send("Rerunning initialization for this server");
			handler.initialize();
			break;
		case "init-reset":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			await message.channel.send("Rerunning initialization for this server and resetting channel permissions");
			handler.initialize(true);
			break;


	}
}
