import { Router } from 'express';
import { addBookCoverImage, bookmarkBook, deleteBookmark, FinishBook, getBookmarkedBooks, getBooksCompleted, getBooksInProgress, StartBookleById, ValidateId } from '../controllers/booksController';
import multer from 'multer';
import { getAll, getOne } from '../utils/crudUtils';

const upload=multer({dest:'booksCovers/'})
const booksRoute: Router = Router()
// Static GET Routes
booksRoute.get("/books", getAll('books')); // Fetch all books
booksRoute.get("/books/completed", getBooksCompleted); // Fetch completed books
booksRoute.get("/books/inprogress", getBooksInProgress); // Fetch books in progress
booksRoute.get("/books/bookmarked", getBookmarkedBooks); // Fetch bookmarked books

// Dynamic GET Routes
booksRoute.get("/books/:id", ValidateId, getOne('books')); // Fetch a book by ID

// POST Routes
booksRoute.post("/books/bookmark/:book_id", bookmarkBook); // Bookmark a book
booksRoute.post("/books/finish/:book_id", FinishBook); // Mark a book as finished
booksRoute.post("/books/:book_id", StartBookleById); // Start reading a book by ID
booksRoute.post('/books/coverImage/:bookId', upload.single('file'), addBookCoverImage);
// booksRoute.post('/books/create',CreateBook);
// DELETE Routes
booksRoute.delete("/books/bookmark/:BookId", deleteBookmark); // Delete a bookmark


export default booksRoute;