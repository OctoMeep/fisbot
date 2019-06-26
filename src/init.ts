import { Client, Message, Guild } from "discord.js";
import { promises as fsp } from "fs";
import * as config from "./config.json";
import CourseSetting from "./CourseSetting"

export const getCourses = async (server: Guild) => {
	let result: CourseSetting[] = [];
	const filePath: string = config.savePath + server.id + "/courses";
	let data: string;
	try {
		data = await fsp.readFile(filePath, "utf-8");
	} catch (err) {
		if (err.code == "ENOENT") data = "";
		else throw err;
	} finally {
		console.log(data);
		if (data) data.split("\n").forEach((line: string) => {
			const elements = line.split("\t");
			if (elements.length !== 3) throw new Error("Invalid course definition file! Each row must have 3 columns.");
			result.push({
				name: elements[0],
				group: +elements[1],
				structure: +elements[2]
			});
		});
		return result;
	}
}
