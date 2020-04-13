import * as Discord from "discord.js";
import ServerHandler from "./ServerHandler";

const getStatus = async (member: Discord.GuildMember, handler: ServerHandler): Promise<string> => {
		const record = await handler.getUserRecord(member);
		if (!record) return member.nickname || member.user.username + " has not signed up.";
		else {
			const unmuteDate = record.unmuteDate instanceof Date ? record.unmuteDate : new Date(record.unmuteDate);
			return `
Status for ${member.nickname || member.user.username}:
They have signed up for the following courses: ${record.courses.join(", ")}.
They ${record.ib ? "" : "do not "}take the full IBDP.
They have ${record.strikes} strikes.
They are ${record.unmuteDate === 0 ? `not muted` : `muted until ${unmuteDate}`}.
			`;
		}
}

const unformatName = (name: string): string => name.toLowerCase().replace(/ /g,'');

const matchesName = (name: string, member: Discord.GuildMember): boolean => {
	const usernameMatches = (unformatName(name) === unformatName(member.user.username));
	const nicknameMatches = (member.nickname !== null && unformatName(name) === unformatName(member.nickname));
	console.log(usernameMatches, nicknameMatches)
	return usernameMatches || nicknameMatches;
}

export const handleMessage = async (message: Discord.Message, handler: ServerHandler): Promise<void> => {
	if (!message.content.startsWith("!")) return;
	const args = message.content.slice(1).split(" ");
	switch (args[0]) {
		case "status": {
			let members = [];
			for (const arg of args.slice(1)) {
				for (const member of Array.from(message.guild.members.values())) {
					if (matchesName(arg, member)) {
						console.log(`Found member ${member.user.username}`);
						members.push(member);
					}
				}
			}
			members = members.filter((m, i, self) => self.indexOf(m) === i);
			for (const member of members) {
				await message.channel.send(await getStatus(member, handler));
			}
			break;
		}
		case "mute": {
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			if (args.length < 3) {
				await message.channel.send("You must specify a time to mute for and a reason.");
				return;
			}
			
			const time = +args[1];
			if (!time) {
				await message.channel.send("Invalid time.");
				return;
			}
			

			const reason = args[2];

			const unmuteDate = new Date();
			unmuteDate.setHours(unmuteDate.getHours() + time);

			for (const member of Array.from(message.mentions.members.values())) {
				const record = await handler.getUserRecord(member);
				if (record) {
					await handler.muteMember(record, unmuteDate);
					await message.channel.send(`Muted ${member.nickname || member.user.username} until ${unmuteDate}.`);
				} else await message.channel.send(`${member.nickname || member.user.username} has not signed up yet.`);
			}
			break;
		}
		case "unmute": {
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const member of Array.from(message.mentions.members.values())) {
				await handler.unmuteMember(await handler.getUserRecord(member));
				await message.channel.send(`Unmuted ${member.nickname || member.user.username}`);
			}
			break;
		}
		case "strike": {
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			
			for (const member of Array.from(message.mentions.members.values())) {
				const record = await handler.getUserRecord(member)
				if (record) {
					await handler.strikeMember(record);
					await message.channel.send(`Added 1 strike for ${member.nickname || member.user.username}.`);
				} else await message.channel.send(`${member.nickname || member.user.username} has not signed up yet.`);
			}
			break;
		}
		case "unstrike": {
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			for (const member of Array.from(message.mentions.members.values())) {
				const record = await handler.getUserRecord(member);
				if (record) {
					const result = await handler.unstrikeMember(record);
					if (result) await message.channel.send(`Removed 1 strike for ${member.nickname || member.user.username}.`);
					if (!result) await message.channel.send(`${member.nickname || member.user.username} has no strikes.`);
				} else await message.channel.send(`${member.nickname || member.user.username} has not signed up yet.`);
			}
			break;
		}
		case "init": {
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			await message.channel.send("Rerunning initialization for this server");
			handler.initialize();
			break;
		}
		case "init-reset": {
			if (!message.member.roles.find((r: Discord.Role) => r.name == "Admin")) {
				await message.channel.send("Only admins can use this command.");
				return;
			}
			await message.channel.send("Rerunning initialization for this server and resetting channel permissions");
			handler.initialize(true);
			break;
		}
	}
}
