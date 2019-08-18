import { Client, Message, Guild } from "discord.js";
import { promises as fsp } from "fs";
import * as config from "./config.json";
import ChannelSetting from "./ChannelSetting"

const readFileIfExists = async (filePath: string): Promise<string> => {
	let data: string;
	try {
		return await fsp.readFile(filePath, "utf-8");
	} catch (err) {
		if (err.code == "ENOENT") return "";
		else throw err;
	}
};

export const getChannels = async (server: Guild): Promise<ChannelSetting[]> => {
	let result: ChannelSetting[] = [];
	const filePath: string = config.savePath + server.id + "/channels";
	const data = await readFileIfExists(filePath);
	console.log(data);
	if (data) data.replace(/\r/g, "").split("\n").forEach((line: string) => {
		if (line.length == 0 || line.startsWith("#")) return;
		const elements = line.split("\t");
		console.log(elements);
		if (elements.length == 1) return;
		if (elements.length !== 4) throw new Error("Invalid channel definition file! Each row must have 4 columns.");
		const name = elements[0];
		const category = +elements[1];
		const structure = +elements[2];
		if ([0, 1, 2].includes(structure)) { // This is a special channel
			result.push({
				name,
				category,
				structure,
				roles: elements[3].split(",")
			});
		} else if ([3, 4, 5].includes(structure)) { // This is a course
			result.push({
				name,
				category,
				structure,
				group: +elements[3]
			});
		} else throw new Error("Invalid channel definition file! Structure (3rd column) cannot be greater than 5.");
	});
	console.log(result);
	return result;
};

export const getCategories = async (server: Guild): Promise<string[]> => {
	const filePath: string = config.savePath + server.id + "/categories";
	const data = await readFileIfExists(filePath);
	if (data) return data.replace(/\r/g, "").split("\n").filter(line => line.length != 0 && !line.startsWith("#"));
	else return [];
};
