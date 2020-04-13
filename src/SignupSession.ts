import * as Discord from "discord.js";
import Prompt from "./Prompt";
import ChannelSetting from "./ChannelSetting";
import ServerHandler from "./ServerHandler";
import UserRecord from "./UserRecord";

export default class SignupSession {
	client: Discord.Client;
	user: Discord.User;
	servers: Discord.Guild[]
	state: number;
	group: number;
	extra: boolean;
	currentPrompt: Prompt;
	subjectGroups: ChannelSetting[][];
	serverHandlers: ServerHandler[];

	server: Discord.Guild;
	ib: boolean;
	courses: any[];

	constructor (client: Discord.Client, user: Discord.User, serverHandlers: ServerHandler[]) {
		this.client = client;
		this.user = user;
		this.state = 0;
		const guilds = Array.from(client.guilds.values());
		this.serverHandlers = serverHandlers;
		this.servers = guilds.filter(s => {
			const handler = serverHandlers.find(h => h.server == s);
			return handler && handler.initialized && handler.active && this.user.client.guilds.has(s.id);
		});
		if (this.servers.length == 0) {
			this.user.send("No servers available!");
			return;
		}
		this.subjectGroups = [];
		this.ib = false;
		this.courses = [];

		this.currentPrompt = new Prompt(this.user, `
Respond to prompts by sending the number next to the answer you want.
The signup system is not yet complete. If the option you need is not available please contact an administrator.
Which server would you like to sign up for?
		`, this.servers.map(s => s.name));
		this.currentPrompt.ask();
	}

	async process (message: Discord.Message): Promise<void> {
		if (message.author != this.user) return;
		if (!this.currentPrompt) return;
		const response: string = await this.currentPrompt.respond(message);
		switch (this.state) {
			case 0: {
				this.server = this.servers.find(s => s.name == response);
				const handler = this.serverHandlers.find((h: ServerHandler) => h.server == this.server)
				const member = this.server.member(this.user);
				if (!member) {
					this.user.send("You are not a member of this server!");
					this.state = 5;
					return;
				} else if (await handler.getUserRecord(member)) {
					this.user.send("You have already signed up for this server!");
					this.state = 5;
					return;
				}
				const courses = handler.courses;
				[1, 2, 3, 4, 5, 6].forEach(n => {
					this.subjectGroups[n-1] = courses.filter(c => c.group == n);
				});


				this.currentPrompt = new Prompt(this.user, "Are you taking the full IB?", ["Yes", "No"]);
				this.state = 1;
				break;
			}
			case 1: {
				this.ib = response == "Yes";
				this.group = 1;
				this.promptSubject();
				break;
			}
			case 2: {
				const course = this.subjectGroups[this.group - 1].find(c => c.name == response);
				if (course) this.courses.push({course, hl: false});

				if (!course || this.courses[this.courses.length-1].course.structure == 3) { // "Skip" or no hl
					this.nextGroup();
					break;
				}
				this.promptHL();
				break;
			}
			case 3: {
				this.courses[this.courses.length-1].hl = response == "Yes";
				this.nextGroup();

				break;
			}
			case 4: {
				this.extra = true;
				let no = true;
				[1, 2, 3, 4, 5, 6].forEach(n => {
					if (response.includes(""+n)) {
						this.group = n;
						no = false;
					}
				});
				if (no) {
					this.done();
					return;
				} else {
					this.promptSubject();
				}
				break;
			}
			default: {
				return;
			}
		}
		await this.currentPrompt.ask();
	}

	promptSubject(): void {
		const options = [...this.subjectGroups[this.group-1].map(c => c.name), "I don't take any of these"];
		this.currentPrompt = new Prompt(this.user, `Which group ${this.group} subject do you take?`, options);
		this.state = 2;
	}

	promptExtra(): void {
		this.currentPrompt = new Prompt(this.user, "Do you take another subject?", [
			"I take another group 1 subject",
			"I take another group 2 subject",
			"I take another group 3 subject",
			"I take another group 4 subject",
			"I take another group 5 subject",
			"I take another group 6 subject",
			"No"
		]);
		this.state = 4;
	}

	promptHL(): void {
		this.currentPrompt = new Prompt(this.user, "Do you take this course at the higher level?", ["Yes", "No"]);
		this.state = 3;
	}

	nextGroup(): void {
		if (this.extra) {
			this.promptExtra();
		} else {
			do this.group++;
			while (this.subjectGroups[this.group - 1].length == 0 && this.group < 6);
			if (this.group == 6) {
				this.promptExtra();
			} else {
				this.promptSubject();
			}
		}
	}

	async done(): Promise<void> {
		// console.log(this.courses);
		// let output = this.user.id + "\t" + (this.ib ? "y" : "n") + "\t" + this.courses.map(c => {
		// 	return c.course.name + (c.hl ? "-hl" : "-sl");
		// }).join(",")
		// this.user.send(output);
		// this.state = 5;

		await this.user.send("Processing signup request...");
		const handler = this.serverHandlers.find(h => h.server == this.server);
		const record = new UserRecord(this.user.id, this.ib, this.courses.map(c => {
			return c.course.name + (c.hl ? "-hl" : "-sl");
		}), 0, 0);
		await handler.updateRecord(record);
		await handler.updateMember(record);
		await this.user.send("Thank you for signing up!");
		this.state = 5;
	}
}
