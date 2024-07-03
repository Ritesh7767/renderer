import Book from "../models/book.model";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { registerBookValidation } from "../zod/book.zod";

export const createBook = asyncHandler(async(req, res, next) => {

    if(req.user_role == "VIEW ALL") throw new ApiError(400, "You are not authorized to perform this action")
    
    const {title, content} = req.body;
    if([title, content].some(ele => ele.trim() == "")) throw new ApiError(400, "Please provide every necessary field");

    const isDataCorrect = registerBookValidation.safeParse(req.body)
    if(!isDataCorrect.success) throw new ApiError(400, "Invalid data provided")

    const createBook = await Book.create({...req.body, owner: req.user_id})
    if(!createBook) throw new ApiError(500, "Error while create books, please try after some times")
    
    res.status(201).json(new ApiResponse(201, createBook))
})

export const getBooks = asyncHandler(async(req, res, next) => {

    if(req.user_role == "CREATOR"){
        const books = await Book.find({owner: req.user_id})
        return res.status(201).json(new ApiResponse(201, books))
    }

    const books = await Book.find();
    console.log(books)
    if(!books) throw new ApiError(500, "Something went wrong while fetching the data")

    res.status(200).json(new ApiResponse(200, books))
})

export const updateBook = asyncHandler(async(req, res, next) => {

    try {
        const bookId = req.query.bookId
        const {title, content} = req.body
        if(title == '' && content == "") throw new ApiError(400, "Please provide necessary field")
        
        const isDataValid = registerBookValidation.safeParse(req.body)
        if(!isDataValid.success) throw new ApiError(402, "Invalid data provided")
    
        const existingBook = await Book.findByIdAndUpdate(bookId, {$set: {title, content}}, {new: true}) as {}
        res.status(201).json(new ApiResponse(201, existingBook, "Book updated successfully"))
        
    } catch (error) {
        throw new ApiError(400, "Invalid operation")
    }
})

export const deleteBook = asyncHandler(async (req, res, next) => {

    try {
        const _id = req.query._id
        if(!_id) throw new ApiError(400, "Invalid book id")

        const deletedBook = await Book.findByIdAndDelete(_id) as {}
        res.status(201).json(new ApiResponse(201, deletedBook, "Book deleted successfully"))

    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
})

