import connectDB from "./connectDB/connectDB";
import app from "./app";
import dotenv from 'dotenv'

dotenv.config()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8080, ()=>{
        console.log("Server started at port" , process.env.PORT || 8080)
    })
})
.catch(() => {
    console.log("Something went wrong")
})
