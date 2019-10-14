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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var getStatus = function (member, handler) { return __awaiter(_this, void 0, void 0, function () {
    var record, unbanDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, handler.getUserRecord(member.id)];
            case 1:
                record = _a.sent();
                if (!record)
                    return [2 /*return*/, member.nickname || member.user.username + " has not signed up."];
                else {
                    unbanDate = record.unbanDate instanceof Date ? record.unbanDate : new Date(record.unbanDate);
                    return [2 /*return*/, "\nStatus for " + (member.nickname || member.user.username) + ":\nThey have signed up for the following courses: " + record.courses.join(", ") + ".\nThey " + (record.ib ? "" : "do not ") + "take the full IBDP.\nThey have " + record.strikes + " strikes.\nThey are " + (record.unbanDate === 0 ? "not banned" : "banned until " + unbanDate) + ".\n\t\t\t"];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.handleMessage = function (message, handler) { return __awaiter(_this, void 0, void 0, function () {
    var args, _a, status_1, _i, _b, member, _c, _d, time, unbanDate, _e, _f, member, user, _g, _h, member, user, _j, _k, member, user, result, _l, _m, channel;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                if (!message.content.startsWith("!"))
                    return [2 /*return*/];
                args = message.content.slice(1).split(" ");
                _a = args[0];
                switch (_a) {
                    case "status": return [3 /*break*/, 1];
                    case "ban": return [3 /*break*/, 10];
                    case "strike": return [3 /*break*/, 25];
                    case "unstrike": return [3 /*break*/, 36];
                    case "fixAdmin": return [3 /*break*/, 50];
                }
                return [3 /*break*/, 53];
            case 1:
                if (!(message.mentions.members.size == 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, getStatus(message.member, handler)];
            case 2:
                status_1 = _o.sent();
                console.log(status_1);
                return [4 /*yield*/, message.channel.send(status_1)];
            case 3:
                _o.sent();
                return [3 /*break*/, 9];
            case 4:
                _i = 0, _b = Array.from(message.mentions.members.values());
                _o.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 9];
                member = _b[_i];
                _d = (_c = message.channel).send;
                return [4 /*yield*/, getStatus(member, handler)];
            case 6: return [4 /*yield*/, _d.apply(_c, [_o.sent()])];
            case 7:
                _o.sent();
                _o.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 5];
            case 9: return [3 /*break*/, 53];
            case 10:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 12];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 11:
                _o.sent();
                return [2 /*return*/];
            case 12:
                if (!(args.length < 2)) return [3 /*break*/, 14];
                return [4 /*yield*/, message.channel.send("You must specify a time to ban for.")];
            case 13:
                _o.sent();
                return [2 /*return*/];
            case 14:
                time = +args[1];
                if (!!time) return [3 /*break*/, 16];
                return [4 /*yield*/, message.channel.send("Invalid time.")];
            case 15:
                _o.sent();
                return [2 /*return*/];
            case 16:
                unbanDate = new Date();
                unbanDate.setHours(unbanDate.getHours() + time);
                _e = 0, _f = Array.from(message.mentions.members.values());
                _o.label = 17;
            case 17:
                if (!(_e < _f.length)) return [3 /*break*/, 24];
                member = _f[_e];
                user = member.user;
                return [4 /*yield*/, handler.getUserRecord(user.id)];
            case 18:
                if (!_o.sent()) return [3 /*break*/, 21];
                return [4 /*yield*/, handler.banUser(user, unbanDate)];
            case 19:
                _o.sent();
                return [4 /*yield*/, message.channel.send("Banned " + (member.nickname || user.username) + " until " + unbanDate + ".")];
            case 20:
                _o.sent();
                return [3 /*break*/, 23];
            case 21: return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has not signed up yet.")];
            case 22:
                _o.sent();
                _o.label = 23;
            case 23:
                _e++;
                return [3 /*break*/, 17];
            case 24: return [3 /*break*/, 53];
            case 25:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 27];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 26:
                _o.sent();
                return [2 /*return*/];
            case 27:
                _g = 0, _h = Array.from(message.mentions.members.values());
                _o.label = 28;
            case 28:
                if (!(_g < _h.length)) return [3 /*break*/, 35];
                member = _h[_g];
                user = member.user;
                return [4 /*yield*/, handler.getUserRecord(user.id)];
            case 29:
                if (!_o.sent()) return [3 /*break*/, 32];
                return [4 /*yield*/, handler.strikeUser(user)];
            case 30:
                _o.sent();
                return [4 /*yield*/, message.channel.send("Added 1 strike for " + (member.nickname || user.username) + ".")];
            case 31:
                _o.sent();
                return [3 /*break*/, 34];
            case 32: return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has not signed up yet.")];
            case 33:
                _o.sent();
                _o.label = 34;
            case 34:
                _g++;
                return [3 /*break*/, 28];
            case 35: return [3 /*break*/, 53];
            case 36:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 38];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 37:
                _o.sent();
                return [2 /*return*/];
            case 38:
                _j = 0, _k = Array.from(message.mentions.members.values());
                _o.label = 39;
            case 39:
                if (!(_j < _k.length)) return [3 /*break*/, 49];
                member = _k[_j];
                user = member.user;
                return [4 /*yield*/, handler.getUserRecord(user.id)];
            case 40:
                if (!_o.sent()) return [3 /*break*/, 46];
                return [4 /*yield*/, handler.unstrikeUser(user)];
            case 41:
                result = _o.sent();
                if (!result) return [3 /*break*/, 43];
                return [4 /*yield*/, message.channel.send("Removed 1 strike for " + (member.nickname || user.username) + ".")];
            case 42:
                _o.sent();
                _o.label = 43;
            case 43:
                if (!!result) return [3 /*break*/, 45];
                return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has no strikes.")];
            case 44:
                _o.sent();
                _o.label = 45;
            case 45: return [3 /*break*/, 48];
            case 46: return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has not signed up yet.")];
            case 47:
                _o.sent();
                _o.label = 48;
            case 48:
                _j++;
                return [3 /*break*/, 39];
            case 49: return [3 /*break*/, 53];
            case 50:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 52];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 51:
                _o.sent();
                return [2 /*return*/];
            case 52:
                for (_l = 0, _m = Array.from(message.guild.channels.values()); _l < _m.length; _l++) {
                    channel = _m[_l];
                    channel.overwritePermissions(message.guild.roles.find(function (r) { return r.name == "Admin"; }), { "VIEW_CHANNEL": true });
                }
                _o.label = 53;
            case 53: return [2 /*return*/];
        }
    });
}); };
