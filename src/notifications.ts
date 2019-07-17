import * as Discord from "discord.js";

export const fatal = async (err: Error, channel?: Discord.TextChannel | Discord.TextChannel[]) => {
	console.error(err);
	const msg = "Fatal error, please notify an administrator: \n" + err.message;
	if (!channel) return;
	if (channel instanceof Discord.TextChannel) await channel.send(msg);
	else for (let c of channel) {
		await c.send(msg);
	}
}; 
