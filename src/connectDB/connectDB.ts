import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log("Database connection successful at host :- ", connection.connection.host)
    } catch (error) {
        console.log("Connection failed")
        process.exit(1)
    }
}

export default connectDB