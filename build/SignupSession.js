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
var Prompt_1 = require("./Prompt");
var SignupSession = /** @class */ (function () {
    function SignupSession(client, user, serverHandlers) {
        var _this = this;
        this.client = client;
        this.user = user;
        this.state = 0;
        var guilds = Array.from(client.guilds.values());
        this.serverHandlers = serverHandlers;
        this.servers = guilds.filter(function (s) {
            var handler = serverHandlers.find(function (h) { return h.server == s; });
            return handler && handler.initialized && handler.active && _this.user.client.guilds.has(s.id);
        });
        if (this.servers.length == 0) {
            this.user.send("No servers available!");
            return;
        }
        this.subjectGroups = [];
        this.ib = false;
        this.courses = [];
        this.currentPrompt = new Prompt_1.default(this.user, "\nRespond to prompts by sending the number next to the answer you want.\nThe signup system is not yet complete. If the option you need is not available please contact an administrator.\nWhich server would you like to sign up for?\n\t\t", this.servers.map(function (s) { return s.name; }));
        this.currentPrompt.ask();
    }
    SignupSession.prototype.process = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var response, courses_1, course, no_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (message.author != this.user)
                            return [2 /*return*/];
                        if (!this.currentPrompt)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.currentPrompt.respond(message)];
                    case 1:
                        response = _a.sent();
                        switch (this.state) {
                            case 0:
                                this.server = this.servers.find(function (s) { return s.name == response; });
                                courses_1 = this.serverHandlers.find(function (h) { return h.server == _this.server; }).courses;
                                [1, 2, 3, 4, 5, 6].forEach(function (n) {
                                    _this.subjectGroups[n - 1] = courses_1.filter(function (c) { return c.group == n; });
                                });
                                this.currentPrompt = new Prompt_1.default(this.user, "Are you taking the full IB?", ["Yes", "No"]);
                                this.state = 1;
                                break;
                            case 1:
                                this.ib = response == "Yes";
                                this.group = 1;
                                this.promptSubject();
                                break;
                            case 2:
                                course = this.subjectGroups[this.group - 1].find(function (c) { return c.name == response; });
                                if (course)
                                    this.courses.push({ course: course, hl: false });
                                if (!course || this.courses[this.courses.length - 1].course.structure == 3) { // "Skip" or no hl
                                    this.nextGroup();
                                    break;
                                }
                                this.promptHL();
                                break;
                            case 3:
                                this.courses[this.courses.length - 1].hl = response == "Yes";
                                this.nextGroup();
                                break;
                            case 4:
                                this.extra = true;
                                no_1 = true;
                                [1, 2, 3, 4, 5, 6].forEach(function (n) {
                                    if (response.includes("" + n)) {
                                        _this.group = n;
                                        no_1 = false;
                                    }
                                });
                                if (no_1) {
                                    this.done();
                                    return [2 /*return*/];
                                }
                                else {
                                    this.promptSubject();
                                }
                                break;
                            default:
                                return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.currentPrompt.ask()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SignupSession.prototype.promptSubject = function () {
        var options = this.subjectGroups[this.group - 1].map(function (c) { return c.name; }).concat(["I don't take any of these"]);
        this.currentPrompt = new Prompt_1.default(this.user, "Which group " + this.group + " subject do you take?", options);
        this.state = 2;
    };
    SignupSession.prototype.promptExtra = function () {
        this.currentPrompt = new Prompt_1.default(this.user, "Do you take another subject?", [
            "I take another group 1 subject",
            "I take another group 2 subject",
            "I take another group 3 subject",
            "I take another group 4 subject",
            "I take another group 5 subject",
            "I take another group 6 subject",
            "No"
        ]);
        this.state = 4;
    };
    SignupSession.prototype.promptHL = function () {
        this.currentPrompt = new Prompt_1.default(this.user, "Do you take this course at the higher level?", ["Yes", "No"]);
        this.state = 3;
    };
    SignupSession.prototype.nextGroup = function () {
        if (this.extra) {
            this.promptExtra();
        }
        else {
            do
                this.group++;
            while (this.subjectGroups[this.group - 1].length == 0 && this.group < 6);
            if (this.group == 6) {
                this.promptExtra();
            }
            else {
                this.promptSubject();
            }
        }
    };
    SignupSession.prototype.done = function () {
        return __awaiter(this, void 0, void 0, function () {
            var handler;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // console.log(this.courses);
                    // let output = this.user.id + "\t" + (this.ib ? "y" : "n") + "\t" + this.courses.map(c => {
                    // 	return c.course.name + (c.hl ? "-hl" : "-sl");
                    // }).join(",")
                    // this.user.send(output);
                    // this.state = 5;
                    return [4 /*yield*/, this.user.send("Processing signup request...")];
                    case 1:
                        // console.log(this.courses);
                        // let output = this.user.id + "\t" + (this.ib ? "y" : "n") + "\t" + this.courses.map(c => {
                        // 	return c.course.name + (c.hl ? "-hl" : "-sl");
                        // }).join(",")
                        // this.user.send(output);
                        // this.state = 5;
                        _a.sent();
                        handler = this.serverHandlers.find(function (h) { return h.server == _this.server; });
                        return [4 /*yield*/, handler.addUser(this.user.id, this.ib, this.courses.map(function (c) {
                                return c.course.name + (c.hl ? "-hl" : "-sl");
                            }).join(","))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, handler.updateUsers()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.user.send("Thank you for signing up!")];
                    case 4:
                        _a.sent();
                        this.state = 5;
                        return [2 /*return*/];
                }
            });
        });
    };
    return SignupSession;
}());
exports.default = SignupSession;
