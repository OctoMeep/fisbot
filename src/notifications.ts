import * as Discord from "discord.js";

export const fatal = (err: Error, channel: Discord.TextChannel | Discord.TextChannel[]) => {
	console.error(err);
	const msg = "Fatal error, please notify an administrator: \n" + err.message;
	if (channel instanceof Discord.TextChannel) channel.send(msg);
	else channel.forEach((c: Discord.TextChannel) => c.send(msg));
}; 
