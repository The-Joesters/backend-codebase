import { Router } from 'express';
import { addBookCoverImage } from '../controllers/booksController';
import multer from 'multer';

const upload=multer({dest:'booksCovers/'})
const booksRoute: Router = Router()

booksRoute.post('/books/coverImage/:bookId',upload.single('file'),addBookCoverImage)

export default booksRoute;