import { Router } from 'express';
import { addBookCoverImage, bookmarkBook, deleteBookmark, FinishBook, getBookmarkedBooks, getBooksCompleted, getBooksInProgress, StartBookleById, UploadPdf, ValidateId } from '../controllers/booksController';
import multer from 'multer';
import { getAll, getOne } from '../utils/crudUtils';
import fs from 'fs';

const path = require('path');

const pdfsDir = path.resolve(__dirname, '../../pdfs');

// Ensure the "pdfs" folder exists (create it if it doesn't)
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
}
console.log(pdfsDir);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save the file in the "pdfs" directory outside "src"
        cb(null, pdfsDir); // Use the resolved absolute path
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Save with original extension
    }
});

// Initialize multer with the storage configuration
const uploadpdffile = multer({ storage: storage });
const upload=multer({dest:'booksCovers/'})
const booksRoute: Router = Router()
// Static GET Routes
booksRoute.get("/books", getAll('books')); // Fetch all books
booksRoute.get("/books/completed", getBooksCompleted); // Fetch completed books
booksRoute.get("/books/inprogress", getBooksInProgress); // Fetch books in progress
booksRoute.get("/books/bookmarked", getBookmarkedBooks); // Fetch bookmarked books

// Dynamic GET Routes
booksRoute.get("/books/:id", ValidateId, getOne('books')); // Fetch a book by ID
7425
// POST Routes
booksRoute.post("/books/upload",uploadpdffile.single('file'),UploadPdf)
booksRoute.post("/books/bookmark/:book_id", bookmarkBook); // Bookmark a book
booksRoute.post("/books/finish/:book_id", FinishBook); // Mark a book as finished
booksRoute.post('/books/coverImage/:bookId', upload.single('file'), addBookCoverImage);
// booksRoute.post("/books/:book_id", StartBookleById); // Start reading a book by ID
// booksRoute.post('/books/create',CreateBook);
// DELETE Routes
booksRoute.delete("/books/bookmark/:BookId", deleteBookmark); // Delete a bookmark


export default booksRoute;