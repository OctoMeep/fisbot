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
			if (message.mentions.members.size == 0) {
				const status = await getStatus(message.member, handler)
				console.log(status);
				await message.channel.send(status);
			}
			else for (const member of Array.from(message.mentions.members.values())) {
				await message.channel.send(await getStatus(member, handler));
			}
			break;
		case "ban":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			if (args.length < 2) {
				await message.channel.send("You must specify a time to ban for.");
				return;
			}
			const time = +args[1];
			if (!time) {
				await message.channel.send("Invalid time.");
				return;
			}
			const unbanDate = new Date();
			unbanDate.setHours(unbanDate.getHours() + time);

			for (const member of Array.from(message.mentions.members.values())) {
				const user = member.user;
				if (await handler.getUserRecord(user.id)) {
					await handler.banUser(user, unbanDate);
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
		case "fixAdmin":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const channel of Array.from(message.guild.channels.values())) {
				channel.overwritePermissions(message.guild.roles.find((r: Discord.Role) => r.name == "Admin"), {"VIEW_CHANNEL": true})
			}

	}
}
