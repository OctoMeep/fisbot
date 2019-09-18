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
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var fs_1 = require("fs");
var config = require("./config.json");
var init = require("./init");
var util = require("./util");
var notifications = require("./notifications");
var serverCommands = require("./serverCommands");
var UserRecord_1 = require("./UserRecord");
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
                        if (message.content.startsWith("!"))
                            serverCommands.handleMessage(message, this);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.initialize = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var categories, categoryChannels, channels, dirPath, _i, categories_1, category, categoryChannel, _a, channels_1, channel, _b, _c, channels_2, channel, _d, notificationChannel, err_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (message && !(message.channel instanceof Discord.TextChannel))
                            return [2 /*return*/];
                        this.active = false;
                        categories = [];
                        categoryChannels = [];
                        channels = [];
                        dirPath = config.savePath + this.server.id;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 37, , 38]);
                        return [4 /*yield*/, util.ensureDir(config.savePath)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, util.ensureDir(dirPath)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, init.getCategories(this.server)];
                    case 4:
                        categories = _e.sent();
                        return [4 /*yield*/, init.getChannels(this.server)];
                    case 5:
                        channels = _e.sent();
                        _i = 0, categories_1 = categories;
                        _e.label = 6;
                    case 6:
                        if (!(_i < categories_1.length)) return [3 /*break*/, 9];
                        category = categories_1[_i];
                        return [4 /*yield*/, util.ensureCategory(this.server, category)];
                    case 7:
                        categoryChannel = _e.sent();
                        console.log("Ensured category " + category);
                        categoryChannels.push(categoryChannel);
                        _e.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [4 /*yield*/, util.ensureRole(this.server, "banned", "RED")];
                    case 10:
                        _e.sent();
                        console.log("Ensured role banned");
                        return [4 /*yield*/, util.ensureRole(this.server, "signed-up", "AQUA")];
                    case 11:
                        _e.sent();
                        console.log("Ensured role signed-up");
                        return [4 /*yield*/, util.ensureRole(this.server, "ib", "AQUA")];
                    case 12:
                        _e.sent();
                        console.log("Ensured role ib");
                        _a = 0, channels_1 = channels;
                        _e.label = 13;
                    case 13:
                        if (!(_a < channels_1.length)) return [3 /*break*/, 20];
                        channel = channels_1[_a];
                        _b = channel.structure;
                        switch (_b) {
                            case 3: return [3 /*break*/, 14];
                            case 4: return [3 /*break*/, 16];
                            case 5: return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 19];
                    case 14: return [4 /*yield*/, util.ensureRole(this.server, channel.name + "-sl", "PURPLE")];
                    case 15:
                        _e.sent();
                        console.log("Ensured role " + channel.name);
                        return [3 /*break*/, 19];
                    case 16: return [4 /*yield*/, util.ensureRole(this.server, channel.name + "-sl", "BLUE")];
                    case 17:
                        _e.sent();
                        console.log("Ensured role " + (channel.name + "-sl"));
                        return [4 /*yield*/, util.ensureRole(this.server, channel.name + "-hl", "GREEN")];
                    case 18:
                        _e.sent();
                        console.log("Ensured role " + (channel.name + "-hl"));
                        _e.label = 19;
                    case 19:
                        _a++;
                        return [3 /*break*/, 13];
                    case 20:
                        _c = 0, channels_2 = channels;
                        _e.label = 21;
                    case 21:
                        if (!(_c < channels_2.length)) return [3 /*break*/, 36];
                        channel = channels_2[_c];
                        _d = channel.structure;
                        switch (_d) {
                            case 0: return [3 /*break*/, 22];
                            case 1: return [3 /*break*/, 24];
                            case 2: return [3 /*break*/, 26];
                            case 3: return [3 /*break*/, 28];
                            case 4: return [3 /*break*/, 30];
                            case 5: return [3 /*break*/, 32];
                        }
                        return [3 /*break*/, 35];
                    case 22: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, false)];
                    case 23:
                        _e.sent();
                        console.log("Ensured channel " + channel.name);
                        return [3 /*break*/, 35];
                    case 24: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true)];
                    case 25:
                        _e.sent();
                        console.log("Ensured channel " + channel.name);
                        return [3 /*break*/, 35];
                    case 26: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], channel.roles, true)];
                    case 27:
                        notificationChannel = _e.sent();
                        console.log("Ensured channel " + channel.name);
                        this.notificationChannels.push(notificationChannel);
                        return [3 /*break*/, 35];
                    case 28: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl"], false)];
                    case 29:
                        _e.sent();
                        console.log("Ensured channel " + channel.name);
                        this.courses.push(channel);
                        return [3 /*break*/, 35];
                    case 30: return [4 /*yield*/, util.ensureChannel(this.server, channel.name, categoryChannels[channel.category], [channel.name + "-sl", channel.name + "-hl"], false)];
                    case 31:
                        _e.sent();
                        console.log("Ensured channel " + channel.name);
                        this.courses.push(channel);
                        return [3 /*break*/, 35];
                    case 32: return [4 /*yield*/, util.ensureChannel(this.server, channel.name + "-sl", categoryChannels[channel.category], [channel.name + "-sl"], false)];
                    case 33:
                        _e.sent();
                        console.log("Ensured channel " + (channel.name + "-sl"));
                        return [4 /*yield*/, util.ensureChannel(this.server, channel.name + "-hl", categoryChannels[channel.category], [channel.name + "-hl"], false)];
                    case 34:
                        _e.sent();
                        console.log("Ensured channel " + (channel.name + "-hl"));
                        this.courses.push(channel);
                        return [3 /*break*/, 35];
                    case 35:
                        _c++;
                        return [3 /*break*/, 21];
                    case 36: return [3 /*break*/, 38];
                    case 37:
                        err_1 = _e.sent();
                        notifications.error(err_1, message && message.channel);
                        return [3 /*break*/, 38];
                    case 38:
                        this.initialized = true;
                        this.active = true;
                        (function loop(self) {
                            return __awaiter(this, void 0, void 0, function () {
                                var now, _i, _a, user, record;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            now = new Date();
                                            _i = 0, _a = self.server.members.map(function (m) { return m.user; });
                                            _b.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                            user = _a[_i];
                                            return [4 /*yield*/, self.getUserRecord(user.id)];
                                        case 2:
                                            record = _b.sent();
                                            if (!record)
                                                return [3 /*break*/, 3];
                                            if (+record.unbanDate === 0)
                                                return [3 /*break*/, 3];
                                            else if (record.unbanDate < now.getTime())
                                                self.unbanUser(user);
                                            _b.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            self.updateUsers();
                                            now = new Date();
                                            setTimeout(function () { loop(self); }, 60000 - (now.getTime() % 60000));
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        })(this);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.addUser = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, lines, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(record);
                        return [4 /*yield*/, init.readFileIfExists(config.savePath + this.server.id + "/users")];
                    case 1:
                        userData = _a.sent();
                        lines = userData.split("\n");
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < lines.length)) return [3 /*break*/, 5];
                        if (!lines[i].startsWith(record.id)) return [3 /*break*/, 4];
                        lines[i] = record.toString();
                        return [4 /*yield*/, fs_1.promises.writeFile(config.savePath + this.server.id + "/users", lines.join("\n"))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, fs_1.promises.appendFile(config.savePath + this.server.id + "/users", record.toString())];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.updateUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userData, _i, _a, userLine, userRecord, member, roles, _loop_1, this_1, _b, _c, roleString, _d, roles_1, role;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, init.readFileIfExists(config.savePath + this.server.id + "/users")];
                    case 1:
                        userData = _e.sent();
                        for (_i = 0, _a = userData.split("\n"); _i < _a.length; _i++) {
                            userLine = _a[_i];
                            if (userLine.length == 0)
                                continue;
                            userRecord = UserRecord_1.default.fromString(userLine);
                            member = this.server.members.get(userRecord.id);
                            roles = [];
                            _loop_1 = function (roleString) {
                                if (roleString.length > 0)
                                    roles.push(this_1.server.roles.find(function (r) { return r.name == roleString; }));
                            };
                            this_1 = this;
                            for (_b = 0, _c = userRecord.courses; _b < _c.length; _b++) {
                                roleString = _c[_b];
                                _loop_1(roleString);
                            }
                            if (userRecord.ib)
                                roles.push(this.server.roles.find(function (r) { return r.name == "ib"; }));
                            roles.push(this.server.roles.find(function (r) { return r.name == "signed-up"; }));
                            for (_d = 0, roles_1 = roles; _d < roles_1.length; _d++) {
                                role = roles_1[_d];
                                if (!member.roles.has(role.id))
                                    member.addRole(role);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.getUserRecord = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, userLine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, init.readFileIfExists(config.savePath + this.server.id + "/users")];
                    case 1:
                        userData = _a.sent();
                        return [4 /*yield*/, userData.split("\n").find(function (s) { return s.startsWith(id); })];
                    case 2:
                        userLine = _a.sent();
                        if (!userLine)
                            return [2 /*return*/, null];
                        return [2 /*return*/, UserRecord_1.default.fromString(userLine)];
                }
            });
        });
    };
    ServerHandler.prototype.banUser = function (user, unbanDate) {
        return __awaiter(this, void 0, void 0, function () {
            var record, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserRecord(user.id)];
                    case 1:
                        record = _a.sent();
                        record.unbanDate = unbanDate.getTime();
                        return [4 /*yield*/, this.addUser(record)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.server.fetchMember(user)];
                    case 3:
                        member = _a.sent();
                        member.removeRoles(member.roles.filter(function (r) { return ["-sl", "-hl"].includes(r.name.slice(-3)) || ["ib", "signed-up"].includes(r.name); }));
                        member.addRole(this.server.roles.find(function (r) { return r.name === "banned"; }));
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.unbanUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var record, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserRecord(user.id)];
                    case 1:
                        record = _a.sent();
                        record.unbanDate = 0;
                        return [4 /*yield*/, this.addUser(record)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.server.fetchMember(user)];
                    case 3:
                        member = _a.sent();
                        member.removeRole(member.roles.find(function (r) { return r.name === "banned"; }));
                        this.updateUsers();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.strikeUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var record, unbanDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserRecord(user.id)];
                    case 1:
                        record = _a.sent();
                        record.strikes++;
                        if (!(record.strikes >= 3)) return [3 /*break*/, 4];
                        unbanDate = new Date();
                        unbanDate.setHours(unbanDate.getHours() + 24);
                        return [4 /*yield*/, this.addUser(record)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.banUser(user, unbanDate)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.addUser(record)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ServerHandler.prototype.unstrikeUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserRecord(user.id)];
                    case 1:
                        record = _a.sent();
                        if (record.strikes === 0)
                            return [2 /*return*/, false];
                        else
                            record.strikes--;
                        return [4 /*yield*/, this.addUser(record)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ServerHandler.prototype.error = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                notifications.error(err, this.notificationChannels);
                return [2 /*return*/];
            });
        });
    };
    return ServerHandler;
}());
exports.default = ServerHandler;
