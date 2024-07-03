import mongoose from "mongoose";

interface bookInterface {
    title: string, 
    content: string, 
    owner: mongoose.Types.ObjectId;
}

const bookSchema = new mongoose.Schema<bookInterface>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

const Book = mongoose.model<bookInterface>("Book", bookSchema)

export default Book
