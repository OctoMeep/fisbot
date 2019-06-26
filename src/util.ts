import * as fs from "fs";
const fsp = fs.promises;

export const ensureDir = async (dirPath: string) => {
	let dirStats: fs.Stats;
	try {
		dirStats = await fsp.stat(dirPath);
	} catch (err) {
		if (err.code == "ENOENT") {
			await fsp.mkdir(dirPath);
		} else throw err;
	} finally {
		if (!dirStats.isDirectory) throw new Error("Path exists and is not a directory!");
	}
}
