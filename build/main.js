"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var config = require("../config.json");
var client = new Discord.Client();
client.login(config.token);
client.on("ready", function () {
    console.log("Ready!");
});
client.on("message", function (message) {
    if (message.content == "ping")
        message.channel.send("pong");
});
