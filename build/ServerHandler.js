"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Discord = require("discord.js");
var config = require("./config.json");
var init = require("./init");
var util = require("./util");
var notifications = require("./notifications");
var ServerHandler = /** @class */ (function () {
    function ServerHandler(client, server) {
        this.client = client;
        this.server = server;
        this.initialized = false;
        this.active = true;
        this.courses = [];
        this.notificationChannels = [];
    }
    ServerHandler.prototype.handleMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(message.channel instanceof Discord.TextChannel))
                            return [2 /*return*/];
                        if (message.author.bot)
                            return [2 /*return*/];
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize(message)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.active)
                            return [2 /*return*/];
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.initialize = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var channels, dirPath, _i, channels_1, channel, _a, _b, channels_2, channel, _c, notificationChannel, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(message.channel instanceof Discord.TextChannel))
                            return [2 /*return*/];
                        this.active = false;
                        dirPath = config.savePath + this.server.id;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 29, , 30]);
                        return [4 /*yield*/, util.ensureDir(config.savePath)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, util.ensureDir(dirPath)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, init.getChannels(this.server)];
                    case 4:
                        channels = _d.sent();
                        console.log(channels);
                        _i = 0, channels_1 = channels;
                        _d.label = 5;
                    case 5:
                        if (!(_i < channels_1.length)) return [3 /*break*/, 12];
                        channel = channels_1[_i];
                        _a = channel.structure;
                        switch (_a) {
                            case 3: return [3 /*break*/, 6];
                            case 4: return [3 /*break*/, 8];
                            case 5: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, util.ensureRole(this.server, channel.name)];
                    case 7:
                        _d.sent();
                        console.log("Created role " + channel.name);
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, util.ensureRole(this.server, channel.name + "-sl")];
                    case 9:
                        _d.sent();
                        console.log("Created role " + (channel.name + "-sl"));
                        return [4 /*yield*/, util.ensureRole(this.server, channel.name + "-hl")];
                    case 10:
                        _d.sent();
                        console.log("Created role " + (channel.name + "-hl"));
                        _d.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 5];
                    case 12:
                        _b = 0, channels_2 = channels;
                        _d.label = 13;
                    case 13:
                        if (!(_b < channels_2.length)) return [3 /*break*/, 28];
                        channel = channels_2[_b];
                        _c = channel.structure;
                        switch (_c) {
                            case 0: return [3 /*break*/, 14];
                            case 1: return [3 /*break*/, 16];
                            case 2: return [3 /*break*/, 18];
                            case 3: return [3 /*break*/, 20];
                            case 4: return [3 /*break*/, 22];
                            case 5: return [3 /*break*/, 24];
                        }
                        return [3 /*break*/, 27];
                    case 14: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, channel.category, channel.roles, false)];
                    case 15:
                        _d.sent();
                        console.log("Created channel " + channel.name);
                        return [3 /*break*/, 27];
                    case 16: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, channel.category, channel.roles, true)];
                    case 17:
                        _d.sent();
                        console.log("Created channel " + channel.name);
                        return [3 /*break*/, 27];
                    case 18: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, channel.category, channel.roles, true)];
                    case 19:
                        notificationChannel = _d.sent();
                        console.log("Created channel " + channel.name);
                        this.notificationChannels.push(notificationChannel);
                        return [3 /*break*/, 27];
                    case 20: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, channel.category, [channel.name], false)];
                    case 21:
                        _d.sent();
                        console.log("Created channel " + channel.name);
                        this.courses.push(channel);
                        return [3 /*break*/, 27];
                    case 22: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, channel.category, [channel.name + "-sl", channel.name + "-hl"], false)];
                    case 23:
                        _d.sent();
                        console.log("Created channel " + channel.name);
                        this.courses.push(channel);
                        return [3 /*break*/, 27];
                    case 24: return [4 /*yield*/, util.ensureChannel(this.server, channel.name + "-sl", channel.category, [channel.name + "-sl"], false)];
                    case 25:
                        _d.sent();
                        console.log("Created channel " + (channel.name + "-sl"));
                        return [4 /*yield*/, util.ensureChannel(this.server, channel.name + "-hl", channel.category, [channel.name + "-hl"], false)];
                    case 26:
                        _d.sent();
                        console.log("Created channel " + (channel.name + "-hl"));
                        this.courses.push(channel);
                        return [3 /*break*/, 27];
                    case 27:
                        _b++;
                        return [3 /*break*/, 13];
                    case 28: return [3 /*break*/, 30];
                    case 29:
                        err_1 = _d.sent();
                        notifications.fatal(err_1, message.channel);
                        return [2 /*return*/];
                    case 30:
                        this.initialized = true;
                        this.active = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    return ServerHandler;
}());
exports["default"] = ServerHandler;
