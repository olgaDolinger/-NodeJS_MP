"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.STATUS = void 0;
var joi_1 = __importDefault(require("joi"));
var STATUS;
(function (STATUS) {
    STATUS[STATUS["OK"] = 200] = "OK";
    STATUS[STATUS["CONNECTION_REJECTED"] = 500] = "CONNECTION_REJECTED";
    STATUS[STATUS["VALIDATON_ERROR"] = 400] = "VALIDATON_ERROR";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var MIN_AGE = 4;
var MAX_AGE = 130;
// Validation schema for User
exports.userSchema = joi_1.default.object().keys({
    id: joi_1.default.string().required(),
    login: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^[\w.-]+$/).required(),
    age: joi_1.default.number().greater(MIN_AGE).less(MAX_AGE).required(),
    isDeleted: joi_1.default.boolean().required(),
});
