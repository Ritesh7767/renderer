import {Router} from 'express'
import { createBook, deleteBook, getBooks, updateBook } from '../controllers/book.controller'
import isAuth from '../middlewares/auth.middleware'
const router = Router()

router.route('/createBook').post(isAuth, createBook)
router.route('/getBooks').get(isAuth, getBooks)
router.route('/updateBook').post(isAuth, updateBook)
router.route('/deleteBook').post(isAuth, deleteBook)

export default router