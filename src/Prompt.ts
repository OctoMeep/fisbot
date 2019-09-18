import * as Discord from "discord.js";

export default class Prompt {
	user: Discord.User;
	text: string;
	options: string[];

	constructor (user: Discord.User, text: string, options: string[]) {
		this.user = user;
		this.text = text;
		this.options = options;
	}

	async ask(): Promise<void> {
		await this.user.send(this.text + "\n" + this.options.map((option, index) => (index + 1) + ": " + option).join("\n"));
	}

	async respond (message: Discord.Message): Promise<string> {
		if (message.author != this.user) return;
		const response: number = +message.content;
		if (isNaN(response) || response > this.options.length) {
			await this.user.send(`Your response must be a number from 1 to ${this.options.length}`);
			return null;
		}
		return this.options[response-1];
	}
}
