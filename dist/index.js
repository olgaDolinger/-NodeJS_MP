"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var dotenv_1 = __importDefault(require("dotenv"));
var data_json_1 = __importDefault(require("./mock/data.json"));
var validate_1 = require("./validate");
dotenv_1.default.config();
var PORT = process.env.PORT || 8080;
var app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// get user
app.get('/:id', function (req, res) {
    console.log('> get user', req.params.id);
    var id = req.params.id.toString();
    var user = data_json_1.default.filter(function (user) { return user.id == id; });
    res.send(JSON.stringify(user));
});
// get users (auto suggest)
app.get('/find/:login', function (req, res) {
    var login = req.params.login.toString();
    var users = data_json_1.default.filter(function (user) {
        return user.login.toLowerCase().indexOf(login) > -1;
    });
    res.send(users);
});
// add new user
app.post('/', function (req, res) {
    var user = req.body;
    var result = validate_1.userSchema.validate(user);
    var error = result.error;
    var valid = error == null;
    if (!valid) {
        res.status(validate_1.STATUS.VALIDATON_ERROR).json(error);
    }
    else {
        data_json_1.default.push(user);
        res.send(data_json_1.default);
    }
});
// update user
app.post('/update', function (req, res) {
    var userToUpdate = req.body;
    var result = validate_1.userSchema.validate(userToUpdate);
    var error = result.error;
    var valid = error == null;
    if (!valid) {
        res.status(validate_1.STATUS.VALIDATON_ERROR).json(error);
    }
    else {
        var index = data_json_1.default.findIndex(function (user) {
            console.log('>>> ', user);
            return user.id === userToUpdate.id;
        });
        if (index > -1) {
            data_json_1.default[index] = userToUpdate;
            res.send(data_json_1.default);
        }
        else {
            res.send("Can't find user: " + JSON.stringify(userToUpdate));
        }
    }
});
// delete user
app.delete('/:id', function (req, res) {
    var id = req.params.id.toString();
    var index = data_json_1.default.findIndex(function (user) { return user.id === id; });
    if (index > 0) {
        data_json_1.default[index].isDeleted = true;
        res.send("User deleted " + id);
    }
    else {
        res.send("Can't find user: " + id);
    }
});
app.listen(PORT, function () { return console.log("Running on " + PORT + " \u26A1"); });
