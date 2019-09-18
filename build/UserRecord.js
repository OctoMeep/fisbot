"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserRecord = /** @class */ (function () {
    function UserRecord(id, ib, courses, strikes, unbanDate) {
        this.id = id;
        this.ib = ib;
        this.courses = courses;
        this.strikes = strikes;
        this.unbanDate = unbanDate;
    }
    UserRecord.prototype.toString = function () {
        var unbanTime = this.unbanDate instanceof Date ? this.unbanDate.getTime() : this.unbanDate;
        return this.id + "\t" + (this.ib ? "y" : "n") + "\t" + this.courses.join(",") + "\t" + this.strikes + "\t" + unbanTime;
    };
    UserRecord.fromString = function (line) {
        var parts = line.split("\t");
        return new UserRecord(parts[0], parts[1] == "y", parts[2].split(","), +parts[3], +parts[4]);
    };
    return UserRecord;
}());
exports.default = UserRecord;
