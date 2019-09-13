import * as Discord from "discord.js";
import SignupSession from "./SignupSession";
import ServerHandler from "./ServerHandler"

export default class DMHandler {
	client: Discord.Client;
	sessions: SignupSession[];
	serverHandlers: ServerHandler[];

	constructor (client: Discord.Client, serverHandlers: ServerHandler[]) {
		this.client = client;
		this.sessions = [];
		this.serverHandlers = serverHandlers;
	}

	async handle (message: Discord.Message) {
		if (message.guild) return;
		if (message.author.bot) return;
		console.log(message.content);

		if (message.content.startsWith("!")) {
			const command = message.content.substring(1);
			let currentSession;
			switch (command.split(" ")[0]) {
				case "delete":
					// TODO: Remove user data
					break;
				case "privacy":
					//TODO: Privacy policy
					break;
				case "signup":
					currentSession = this.sessions.find(s => s.user == message.author);
					if (currentSession) {
						if (currentSession.state == 5) this.sessions.splice(this.sessions.indexOf(currentSession));
						else {
							message.author.send("There is already an active signup session!");
							return;
						}
					}

					this.sessions.push(new SignupSession(this.client, message.author, this.serverHandlers));
					break;
				case "cancel":
					currentSession = this.sessions.find(s => s.user == message.author);
					if (currentSession) {
						this.sessions.splice(this.sessions.indexOf(currentSession));
						message.author.send("Signup canceled");
					}
					else message.author.send("No signup session in progress");
					break;
			}
		} else {
			let textMessage = message.content.toLowerCase().replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g,"");
			switch (textMessage) {//special responses
				case "thanks":
				case "thx":
				case "thank you":
					await message.author.send("You're welcome!");
					break;
				case "how are you":
				case "whats up":
				case "sup":
					await message.author.send("I'm doing great, thanks for asking!");
					break;
				case "hello there":
					await message.author.send("General Kenobi!");
					break;
				default:
					for (let session of this.sessions) {
						if (message.author == session.user) {
								await session.process(message);
								if (session.state == 5) this.sessions.splice(this.sessions.indexOf(session));
						}
					}
					break;
			}
			if (["bonobo","monkey","asshole","retard","dumbass","fuck you","bitch","bastard","buffoon","kill yourself","kys","commit neckrope","pull an okonkwo","die", "commit toasterbath"].some(s => textMessage.includes(s)) {
				await message.author.send("No u.");
			}
		}
	};
}
