import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ApiError from './utils/apiError'
import {Request, Response, NextFunction} from 'express';

const app = express()
// const whitelist = process.env.WHITELIST?.split(',')

// const corOptions = {
//     origin: (origin: string | undefined, callback: (err: null | Error, allowed?: boolean)=>void) => {
//         if(!origin || whitelist?.includes(origin)) callback(null, true)
//         else callback(new ApiError(400, "Not allowed by CORS policy"))
//     }
// }

app.use(cors())
app.use(express.json({limit: '20kb'}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send("Server is running fine")
})

import userRouter from './routers/user.router'
app.use('/api/v1/user', userRouter)

import bookRouter from './routers/books.router'
app.use('/api/v1/book', bookRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError){
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: err.data,
            errors: err.errors
        })
    }
    else{
        res.status(500).json({
            success: false,
            message: "Interval Server error",
            data: null,
            errors: []
        })
    }
})

export default app
