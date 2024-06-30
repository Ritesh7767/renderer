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
exports.userLogin = exports.userRegister = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const userValidation_zod_1 = require("../zod/userValidation.zod");
exports.userRegister = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, username, email, password } = req.body;
    if ([fullname, username, email, password].some(ele => ele.trim == ""))
        throw new apiError_1.default(400, "Please provide every necessary field");
    const isDataCorrect = userValidation_zod_1.userRegisterValidation.safeParse(req.body);
    if (!isDataCorrect.success)
        throw new apiError_1.default(400, "Invalid data Provided");
    const existingUser = yield user_model_1.default.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
        throw new apiError_1.default(403, "User already exist");
    const createUser = yield user_model_1.default.create({ fullname, username, email, password });
    if (!createUser)
        throw new apiError_1.default(500, "Internal Server error while registering the user, please try after some thime");
    const createdUser = yield user_model_1.default.findById(createUser._id).select("-password -refreshToken -blacklistToken");
    if (!createdUser)
        throw new apiError_1.default(500, "Something went wrong, please try again");
    res.status(201).json(new apiResponse_1.default(201, createdUser));
}));
exports.userLogin = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if ([email, password].some(ele => ele.trim() == ""))
        throw new apiError_1.default(400, "Please provide every necessary field");
    const isDataCorrect = userValidation_zod_1.userLoginValidation.safeParse(req.body);
    if (!isDataCorrect.success)
        throw new apiError_1.default(400, "Invalid data provided");
    const user = yield user_model_1.default.findOne({ email });
    if (!user)
        throw new apiError_1.default(404, "User does not exist");
    const isPasswordCorrect = yield user.isPasswordCorrect(password);
    if (!isPasswordCorrect)
        throw new apiError_1.default(402, "Username, email, or password is incorrect");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    const existingUser = yield user_model_1.default.findById(user._id).select("-password -refreshToken -blacklistToken");
    console.log(existingUser);
    if (!existingUser)
        throw new apiError_1.default(500, "Something went wrong");
    res.status(201).cookie("accessToken", accessToken).cookie('refreshToken', refreshToken).json(new apiResponse_1.default(201, existingUser, "User logged in successfully"));
}));
