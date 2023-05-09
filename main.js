"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var _a = require('@slack/bolt'), App = _a.App, LogLevel = _a.LogLevel;
//importing interface and api-function from weather-api.ts
var weather_api_1 = require("./weather-api");
// Create a new Slack Bolt app
var app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    logLevel: LogLevel.INFO,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
});
// Listen for the /weather command and respond with the current weather data for the specified city
app.command('/weather', function (_a) {
    var ack = _a.ack, command = _a.command, respond = _a.respond, client = _a.client;
    return __awaiter(void 0, void 0, void 0, function () {
        var city, weatherData, temperature, description, humidity, message, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: 
                // Acknowledge the command request
                return [4 /*yield*/, ack()];
                case 1:
                    // Acknowledge the command request
                    _b.sent();
                    city = command.text;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, (0, weather_api_1.getWeatherData)(city)];
                case 3:
                    weatherData = _b.sent();
                    temperature = weatherData.main.temp;
                    description = weatherData.weather[0].description;
                    humidity = weatherData.main.humidity;
                    message = "The current temperature and humidity in ".concat(city, " is ").concat(temperature, "\u00B0C and ").concat(humidity, " respectively with ").concat(description, ".");
                    // Post the message in the channel where the command was issued
                    return [4 /*yield*/, client.respond({
                            response_type: 'in_channel',
                            text: message,
                        })];
                case 4:
                    // Post the message in the channel where the command was issued
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _b.sent();
                    console.error(error_1);
                    // Post an error message in the channel where the command was issued
                    return [4 /*yield*/, client.respond({
                            response_type: 'ephemeral',
                            text: "Sorry, there was an error retrieving the weather data for ".concat(city, "."),
                        })];
                case 6:
                    // Post an error message in the channel where the command was issued
                    _b.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
// Start the app
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.start(process.env.PORT || 3000)];
            case 1:
                _a.sent();
                console.log('Eureka!');
                return [2 /*return*/];
        }
    });
}); })();
/*
bot_token : xoxb-5206254512375-5223392242386-ePOBPpjKlkYGU9U1ppSN3XDl
signing_secret : 463b503513f09be114c51aee40b2c4b
app_token : xapp-1-A056Y0KQ3TK-5236973208292-0107afd576c2d6aba4bc4fd3a0dbc0aa130fc2f8565e1f17a7f3a5e60f8d5bf4
 */ 
