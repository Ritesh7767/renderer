import User from "../models/user.model";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'

interface jwtPayload {
    _id: mongoose.Schema.Types.ObjectId,
    username: string,
    email: string,
    role: string
}

const isAuth = asyncHandler(async(req, res, next) => {
    try {
        
        const token = req.cookies.accessToken
        if(!token) throw new ApiError(403, "Your are not authorized to perform this action")

        const verifyToken = jwt.verify(token, `${process.env.ACCESS_SECRET}`) as jwtPayload
        const user = await User.findById(verifyToken._id)
    
        if(!user) throw new ApiError(404, "Invalid token")

        req.user_id = user._id
        req.user_role = user.role
        next()

    } catch (error) {
        throw new ApiError(400, "Invalid token")
    }
})

export default isAuth