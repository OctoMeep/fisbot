import * as Discord from "discord.js";

export const error = async (err: Error, target?: Discord.TextChannel | Discord.TextChannel[] | Discord.User): Promise<void> => {
	console.error(err);
	const msg = "Fatal error, please notify an administrator: \n" + err.message;
	if (!target) return;
	try {
		if (target instanceof Discord.TextChannel || target instanceof Discord.User) await target.send(msg);
		else for (const c of target) {
			await c.send(msg);
		}
	} catch (err) {
		console.error("Encountered another error while handling the previous one.");
		console.error(err);
		throw err;
	}		
}; 
