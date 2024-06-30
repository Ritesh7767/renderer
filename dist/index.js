"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = __importDefault(require("./connectDB/connectDB"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, connectDB_1.default)()
    .then(() => {
    app_1.default.listen(process.env.PORT || 8080, () => {
        console.log("Server started at port", process.env.PORT || 8080);
    });
})
    .catch(() => {
    console.log("Something went wrong");
});
