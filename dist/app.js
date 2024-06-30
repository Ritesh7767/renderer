"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const apiError_1 = __importDefault(require("./utils/apiError"));
const app = (0, express_1.default)();
// const whitelist = process.env.WHITELIST?.split(',')
// const corOptions = {
//     origin: (origin: string | undefined, callback: (err: null | Error, allowed?: boolean)=>void) => {
//         if(!origin || whitelist?.includes(origin)) callback(null, true)
//         else callback(new ApiError(400, "Not allowed by CORS policy"))
//     }
// }
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '20kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static('public'));
app.get('/', (req, res) => {
    res.send("Server is running fine");
});
const user_router_1 = __importDefault(require("./routers/user.router"));
app.use('/api/v1/user', user_router_1.default);
const books_router_1 = __importDefault(require("./routers/books.router"));
app.use('/api/v1/book', books_router_1.default);
app.use((err, req, res, next) => {
    if (err instanceof apiError_1.default) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: err.data,
            errors: err.errors
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: "Interval Server error",
            data: null,
            errors: []
        });
    }
});
exports.default = app;
