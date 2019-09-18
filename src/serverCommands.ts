import * as Discord from "discord.js";
import ServerHandler from "./ServerHandler";

export const handleMessage = async (message: Discord.Message, handler: ServerHandler): Promise<void> => {
	if (!message.content.startsWith("!")) return;
	const args = message.content.slice(1).split(" ");
	switch (args[0]) {
		case "status":
			const record = await handler.getUserRecord(message.author.id);
			if (!record) message.reply("You have not signed up.");
			else {
				const unbanDate = record.unbanDate instanceof Date ? record.unbanDate : new Date(record.unbanDate);
				message.reply(`
You have signed up for the following courses: ${record.courses.join(", ")}.
You ${record.ib ? "" : "do not "}take the full IBDP.
You have ${record.strikes} strikes.
You are ${record.unbanDate === 0 ? `not banned` : `banned until ${unbanDate}`}.
				`);
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

			for (const user of Array.from(message.mentions.users.values())) {
				if (handler.getUserRecord(user.id)) {
					await handler.banUser(user, unbanDate);
					await message.channel.send(`Banned ${user.username} until ${unbanDate}.`);
				} else await message.channel.send(`${user.username} has not signed up yet.`);
			}
			break;
		case "strike":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const user of Array.from(message.mentions.users.values())) {
				if (handler.getUserRecord(user.id)) {
					await handler.strikeUser(user);
					await message.channel.send(`Added 1 strike for ${user.username}.`);
				} else await message.channel.send(`${user.username} has not signed up yet.`);
			}
			break;
		case "unstrike":
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const user of Array.from(message.mentions.users.values())) {
				if (handler.getUserRecord(user.id)) {
					const result = await handler.unstrikeUser(user);
					if (result) await message.channel.send(`Removed 1 strike for ${user.username}.`);
					if (!result) await message.channel.send(`${user.username} has no strikes.`);
				} else await message.channel.send(`${user.username} has not signed up yet.`);
			}
			break;
	}
}
