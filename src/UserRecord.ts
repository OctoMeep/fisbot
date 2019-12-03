export default class UserRecord {

	id: string;
	ib: boolean;
	courses: string[];
	strikes: number;
	unmuteDate: Date | number;

	constructor (id: string, ib: boolean, courses: string[], strikes: number, unmuteDate: Date | number) {
		this.id = id;
		this.ib = ib;
		this.courses = courses;
		this.strikes = strikes;
		this.unmuteDate = unmuteDate;
	}

	toString(): string {
		const unmuteTime = this.unmuteDate instanceof Date ? this.unmuteDate.getTime() : this.unmuteDate;
		return this.id + "\t" + (this.ib ? "y" : "n") + "\t" + this.courses.join(",") + "\t" + this.strikes + "\t" + unmuteTime;
	}

	static fromString(line: string): UserRecord {
		const parts = line.split("\t");
		return new UserRecord(parts[0], parts[1] == "y", parts[2].split(","), +parts[3], +parts[4]);
	}
}
