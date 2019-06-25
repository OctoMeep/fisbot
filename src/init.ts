import { Client, Message, Guild } from "discord.js";
import { promises } as fsp from "fs";
import { savePath } from "./config.json";

export const initialize = async (client: Client, server: Guild) => {
	const dirPath = savePath + server.id;
	const dirStats;
	try {
		dirStats = await fsp.stat(dirPath);
	} catch (err) {
		if (err.code == "ENOENT") {
			await fsp.mkdir(dirPath);
		} else throw err;
	}
	if (!dirStats.isDirectory) throw new Error(`Initialization failed: ${dirPath} exists and is not a directory.`);

	
}
