import User from "../models/user.model";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { userRegisterValidation, userLoginValidation } from "../zod/userValidation.zod";
import {Request, Response, NextFunction, json} from 'express'

export const userRegister = asyncHandler(async(req, res: Response, next) => {

    const {fullname, username, email, password, role} = req.body;
    if([fullname, username, email, password].some(ele => ele.trim == "")) throw new ApiError(400, "Please provide every necessary field");

    const isDataCorrect = userRegisterValidation.safeParse(req.body);
    if(!isDataCorrect.success) throw new ApiError(400, "Invalid data Provided")

    const existingUser = await User.findOne({$or: [{email},{username}]});
    if(existingUser) throw new ApiError(403, "User already exist")

    const createUser = await User.create({fullname, username, email, password, role});
    if(!createUser) throw new ApiError(500, "Internal Server error while registering the user, please try after some thime");

    const createdUser = await User.findById(createUser._id).select("-password -refreshToken -blacklistToken")
    if(!createdUser) throw new ApiError(500, "Something went wrong, please try again")

    res.status(201).json(new ApiResponse(201, createdUser))
})

export const userLogin = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const {email, password} = req.body;
    if([email, password].some(ele => ele.trim() == "")) throw new ApiError(400, "Please provide every necessary field");

    const isDataCorrect = userLoginValidation.safeParse(req.body);
    if(!isDataCorrect.success) throw new ApiError(400, "Invalid data provided");

    const user = await User.findOne({email})
    if(!user) throw new ApiError(404, "User does not exist")

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(402, "Username, email, or password is incorrect");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({validateBeforeSave: false});

    const existingUser = await User.findById(user._id).select("-password -refreshToken -blacklistToken");
    console.log(existingUser)
    if(!existingUser) throw new ApiError(500, "Something went wrong")

    res.status(201).cookie("accessToken", accessToken).cookie('refreshToken', refreshToken).json(new ApiResponse(201, existingUser, "User logged in successfully"))

})

