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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = exports.createBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const book_zod_1 = require("../zod/book.zod");
exports.createBook = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user_role == "VIEW ALL")
        throw new apiError_1.default(400, "You are not authorized to perform this action");
    const { title, content } = req.body;
    if ([title, content].some(ele => ele.trim() == ""))
        throw new apiError_1.default(400, "Please provide every necessary field");
    const isDataCorrect = book_zod_1.registerBookValidation.safeParse(req.body);
    if (!isDataCorrect.success)
        throw new apiError_1.default(400, "Invalid data provided");
    const createBook = yield book_model_1.default.create(req.body);
    if (!createBook)
        throw new apiError_1.default(500, "Error while create books, please try after some times");
    createBook.owner = req.user_id;
    createBook.save({ validateBeforeSave: false });
    res.status(201).json(new apiResponse_1.default(201, createBook));
}));
exports.getBooks = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user_role == "CREATOR") {
        console.log(typeof req.user_id);
        console.log(req.user_id);
        const books = yield book_model_1.default.find({ owner: req.user_id });
        console.log(books);
        return res.status(201).json(new apiResponse_1.default(201, books));
    }
    const books = yield book_model_1.default.find();
    console.log(books);
    if (!books)
        throw new apiError_1.default(500, "Something went wrong while fetching the data");
    res.status(200).json(new apiResponse_1.default(200, books));
}));
