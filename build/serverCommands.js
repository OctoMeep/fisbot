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
    var args, _a, record, unbanDate_1, time, unbanDate, _i, _b, user, _c, _d, user, _e, _f, user, result;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (!message.content.startsWith("!"))
                    return [2 /*return*/];
                args = message.content.slice(1).split(" ");
                _a = args[0];
                switch (_a) {
                    case "status": return [3 /*break*/, 1];
                    case "ban": return [3 /*break*/, 3];
                    case "strike": return [3 /*break*/, 17];
                    case "unstrike": return [3 /*break*/, 27];
                }
                return [3 /*break*/, 40];
            case 1: return [4 /*yield*/, handler.getUserRecord(message.author.id)];
            case 2:
                record = _g.sent();
                if (!record)
                    message.reply("You have not signed up.");
                else {
                    unbanDate_1 = record.unbanDate instanceof Date ? record.unbanDate : new Date(record.unbanDate);
                    message.reply("\nYou have signed up for the following courses: " + record.courses.join(", ") + ".\nYou " + (record.ib ? "" : "do not ") + "take the full IBDP.\nYou have " + record.strikes + " strikes.\nYou are " + (record.unbanDate === 0 ? "not banned" : "banned until " + unbanDate_1) + ".\n\t\t\t\t");
                }
                return [3 /*break*/, 40];
            case 3:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 5];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 4:
                _g.sent();
                return [2 /*return*/];
            case 5:
                if (!(args.length < 2)) return [3 /*break*/, 7];
                return [4 /*yield*/, message.channel.send("You must specify a time to ban for.")];
            case 6:
                _g.sent();
                return [2 /*return*/];
            case 7:
                time = +args[1];
                if (!!time) return [3 /*break*/, 9];
                return [4 /*yield*/, message.channel.send("Invalid time.")];
            case 8:
                _g.sent();
                return [2 /*return*/];
            case 9:
                unbanDate = new Date();
                unbanDate.setHours(unbanDate.getHours() + time);
                _i = 0, _b = Array.from(message.mentions.users.values());
                _g.label = 10;
            case 10:
                if (!(_i < _b.length)) return [3 /*break*/, 16];
                user = _b[_i];
                if (!handler.getUserRecord(user.id)) return [3 /*break*/, 13];
                return [4 /*yield*/, handler.banUser(user, unbanDate)];
            case 11:
                _g.sent();
                return [4 /*yield*/, message.channel.send("Banned " + user.username + " until " + unbanDate + ".")];
            case 12:
                _g.sent();
                return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, message.channel.send(user.username + " has not signed up yet.")];
            case 14:
                _g.sent();
                _g.label = 15;
            case 15:
                _i++;
                return [3 /*break*/, 10];
            case 16: return [3 /*break*/, 40];
            case 17:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 19];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 18:
                _g.sent();
                return [2 /*return*/];
            case 19:
                _c = 0, _d = Array.from(message.mentions.users.values());
                _g.label = 20;
            case 20:
                if (!(_c < _d.length)) return [3 /*break*/, 26];
                user = _d[_c];
                if (!handler.getUserRecord(user.id)) return [3 /*break*/, 23];
                return [4 /*yield*/, handler.strikeUser(user)];
            case 21:
                _g.sent();
                return [4 /*yield*/, message.channel.send("Added 1 strike for " + user.username + ".")];
            case 22:
                _g.sent();
                return [3 /*break*/, 25];
            case 23: return [4 /*yield*/, message.channel.send(user.username + " has not signed up yet.")];
            case 24:
                _g.sent();
                _g.label = 25;
            case 25:
                _c++;
                return [3 /*break*/, 20];
            case 26: return [3 /*break*/, 40];
            case 27:
                if (!!message.member.roles.find(function (r) { return r.name == "Admin"; })) return [3 /*break*/, 29];
                return [4 /*yield*/, message.channel.send("Only admins can use this command.")];
            case 28:
                _g.sent();
                return [2 /*return*/];
            case 29:
                _e = 0, _f = Array.from(message.mentions.users.values());
                _g.label = 30;
            case 30:
                if (!(_e < _f.length)) return [3 /*break*/, 39];
                user = _f[_e];
                if (!handler.getUserRecord(user.id)) return [3 /*break*/, 36];
                return [4 /*yield*/, handler.unstrikeUser(user)];
            case 31:
                result = _g.sent();
                if (!result) return [3 /*break*/, 33];
                return [4 /*yield*/, message.channel.send("Removed 1 strike for " + user.username + ".")];
            case 32:
                _g.sent();
                _g.label = 33;
            case 33:
                if (!!result) return [3 /*break*/, 35];
                return [4 /*yield*/, message.channel.send(user.username + " has no strikes.")];
            case 34:
                _g.sent();
                _g.label = 35;
            case 35: return [3 /*break*/, 38];
            case 36: return [4 /*yield*/, message.channel.send(user.username + " has not signed up yet.")];
            case 37:
                _g.sent();
                _g.label = 38;
            case 38:
                _e++;
                return [3 /*break*/, 30];
            case 39: return [3 /*break*/, 40];
            case 40: return [2 /*return*/];
        }
    });
}); };
