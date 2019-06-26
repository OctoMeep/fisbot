"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
exports.fatal = function (err, channel) {
    console.error(err);
    var msg = "Fatal error, please notify an administrator: \n" + err.message;
    if (channel instanceof Discord.TextChannel)
        channel.send(msg);
    else
        channel.forEach(function (c) { return c.send(msg); });
};
