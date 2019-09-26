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
exports.handleMessage = function (message, handler) { return __awaiter(_this, void 0, void 0, function () {
    var args, _a, record, unbanDate_1, time, unbanDate, _i, _b, member, user, _c, _d, member, user, _e, _f, member, user, result, _g, _h, channel;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                if (!message.content.startsWith("!"))
                    return [2 /*return*/];
                args = message.content.slice(1).split(" ");
                _a = args[0];
                switch (_a) {
                    case "status": return [3 /*break*/, 1];
                    case "ban": return [3 /*break*/, 3];
                    case "strike": return [3 /*break*/, 18];
                    case "unstrike": return [3 /*break*/, 29];
                    case "fixAdmin": return [3 /*break*/, 43];
                }
                return [3 /*break*/, 46];
            case 1: return [4 /*yield*/, handler.getUserRecord(message.author.id)];
            case 2:
                record = _j.sent();
                if (!record)
                    message.reply("You have not signed up.");
                else {
                    unbanDate_1 = record.unbanDate instanceof Date ? record.unbanDate : new Date(record.unbanDate);
                    message.reply("\nYou have signed up for the following courses: " + record.courses.join(", ") + ".\nYou " + (record.ib ? "" : "do not ") + "take the full IBDP.\nYou have " + record.strikes + " strikes.\nYou are " + (record.unbanDate === 0 ? "not banned" : "banned until " + unbanDate_1) + ".\n\t\t\t\t");
                }
                return [3 /*break*/, 46];
            case 3:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 5];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 4:
                _j.sent();
                return [2 /*return*/];
            case 5:
                if (!(args.length < 2)) return [3 /*break*/, 7];
                return [4 /*yield*/, message.channel.send("You must specify a time to ban for.")];
            case 6:
                _j.sent();
                return [2 /*return*/];
            case 7:
                time = +args[1];
                if (!!time) return [3 /*break*/, 9];
                return [4 /*yield*/, message.channel.send("Invalid time.")];
            case 8:
                _j.sent();
                return [2 /*return*/];
            case 9:
                unbanDate = new Date();
                unbanDate.setHours(unbanDate.getHours() + time);
                _i = 0, _b = Array.from(message.mentions.members.values());
                _j.label = 10;
            case 10:
                if (!(_i < _b.length)) return [3 /*break*/, 17];
                member = _b[_i];
                user = member.user;
                return [4 /*yield*/, handler.getUserRecord(user.id)];
            case 11:
                if (!_j.sent()) return [3 /*break*/, 14];
                return [4 /*yield*/, handler.banUser(user, unbanDate)];
            case 12:
                _j.sent();
                return [4 /*yield*/, message.channel.send("Banned " + (member.nickname || user.username) + " until " + unbanDate + ".")];
            case 13:
                _j.sent();
                return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has not signed up yet.")];
            case 15:
                _j.sent();
                _j.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 10];
            case 17: return [3 /*break*/, 46];
            case 18:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 20];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 19:
                _j.sent();
                return [2 /*return*/];
            case 20:
                _c = 0, _d = Array.from(message.mentions.members.values());
                _j.label = 21;
            case 21:
                if (!(_c < _d.length)) return [3 /*break*/, 28];
                member = _d[_c];
                user = member.user;
                return [4 /*yield*/, handler.getUserRecord(user.id)];
            case 22:
                if (!_j.sent()) return [3 /*break*/, 25];
                return [4 /*yield*/, handler.strikeUser(user)];
            case 23:
                _j.sent();
                return [4 /*yield*/, message.channel.send("Added 1 strike for " + (member.nickname || user.username) + ".")];
            case 24:
                _j.sent();
                return [3 /*break*/, 27];
            case 25: return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has not signed up yet.")];
            case 26:
                _j.sent();
                _j.label = 27;
            case 27:
                _c++;
                return [3 /*break*/, 21];
            case 28: return [3 /*break*/, 46];
            case 29:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 31];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 30:
                _j.sent();
                return [2 /*return*/];
            case 31:
                _e = 0, _f = Array.from(message.mentions.members.values());
                _j.label = 32;
            case 32:
                if (!(_e < _f.length)) return [3 /*break*/, 42];
                member = _f[_e];
                user = member.user;
                return [4 /*yield*/, handler.getUserRecord(user.id)];
            case 33:
                if (!_j.sent()) return [3 /*break*/, 39];
                return [4 /*yield*/, handler.unstrikeUser(user)];
            case 34:
                result = _j.sent();
                if (!result) return [3 /*break*/, 36];
                return [4 /*yield*/, message.channel.send("Removed 1 strike for " + (member.nickname || user.username) + ".")];
            case 35:
                _j.sent();
                _j.label = 36;
            case 36:
                if (!!result) return [3 /*break*/, 38];
                return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has no strikes.")];
            case 37:
                _j.sent();
                _j.label = 38;
            case 38: return [3 /*break*/, 41];
            case 39: return [4 /*yield*/, message.channel.send((member.nickname || user.username) + " has not signed up yet.")];
            case 40:
                _j.sent();
                _j.label = 41;
            case 41:
                _e++;
                return [3 /*break*/, 32];
            case 42: return [3 /*break*/, 46];
            case 43:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 45];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 44:
                _j.sent();
                return [2 /*return*/];
            case 45:
                for (_g = 0, _h = Array.from(message.guild.channels.values()); _g < _h.length; _g++) {
                    channel = _h[_g];
                    channel.overwritePermissions(message.guild.roles.find(function (r) { return r.name == "Admin"; }), { "VIEW_CHANNEL": true });
                }
                _j.label = 46;
            case 46: return [2 /*return*/];
        }
    });
}); };
