import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

enum UserRole {
    CREATOR = 'CREATOR',
    VIEW = 'VIEW',
    VIEWALL = 'VIEW ALL',
}

interface userSchemaInterface {
    fullname: string,
    username: string,
    email: string,
    password: string,
    role: "CREATOR" | "VIEW ALL",
    refreshToken: string,
    blacklistToken: string[],
    isPasswordCorrect: (password: string)=>Promise<boolean>,
    generateAccessToken: ()=>string,
    generateRefreshToken: ()=>string
}

const userSchema = new mongoose.Schema<userSchemaInterface>({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["CREATOR", "VIEW ALL"],
        default: "CREATOR"
    },
    refreshToken: {
        type: String
    },
    blacklistToken: [
        {
            type: String
        }
    ]
})

userSchema.pre('save', async function(next){

    if(!this.isModified('password')) return next() 
    this.password = await bcrypt.hash(this.password, 5)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password: string){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role: this.role
        },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn: `${process.env.ACCESS_EXPIRY}`
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        `${process.env.REFRESH_TOKEN}`,
        {
            expiresIn: process.env.REFRESH_EXPIRY
        }
    )
}

const User = mongoose.model<userSchemaInterface>("User", userSchema)

export default User