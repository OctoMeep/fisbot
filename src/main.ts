import * as Discord from "discord.js";
import * as config from "../config.json";

const client = new Discord.Client();

client.login(config.token);

client.on("ready", () => {
	console.log("Ready!");
});

client.on("message", message => {
	if (message.content == "ping") message.channel.send("pong");
})
