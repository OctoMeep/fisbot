"use strict";
exports.__esModule = true;
var init_1 = require("./init");
var ServerHandler = /** @class */ (function () {
    function ServerHandler(client, server) {
        this.client = client;
        this.server = server;
        this.initialized = false;
    }
    ServerHandler.prototype.handleMessage = function (message) {
        if (message.author.bot)
            return;
        if (!this.initialized)
            init_1.initialize(this.client, this.server);
    };
    return ServerHandler;
}());
exports["default"] = ServerHandler;
