"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var config = require("./config.json");
var ServerHandler_1 = require("./ServerHandler");
var DMHandler_1 = require("./DMHandler");
var client = new discord_js_1.Client();
var initialized = false; // Avoid rerunning init code on connection loss
var serverHandlers = [];
var dm;
client.login(config.token);
client.on("ready", function () {
    if (initialized)
        return;
    console.log("Ready!");
    client.guilds.forEach(function (server) {
        serverHandlers.push(new ServerHandler_1["default"](client, server));
    });
    console.log(serverHandlers.length);
    dm = new DMHandler_1["default"](client, serverHandlers);
    initialized = true;
});
client.on("message", function (message) {
    if (message.guild)
        serverHandlers.forEach(function (serverHandler) {
            if (message.guild == serverHandler.server)
                serverHandler.handleMessage(message);
        });
    else
        dm.handle(message);
});
