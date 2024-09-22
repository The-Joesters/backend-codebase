import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/ImageService';
import firebaseService from '../services/firebaseService';
import booksService from '../services/booksService';
import ApiError from '../middlewares/ApiError';
import BookData from '../interfaces/BookData';
import prisma from '../prisma/prismaClient';

export const getBooksInProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.userId = req.userId || 70;// for test purposes
        const userId = req.userId;
        const Books = await booksService.GetBooksInProgress(userId!, 'inprogress');
        res.status(200).send({ "message": "Got Successfully", "data": Books });
    } catch (error) {
        next(new ApiError("Error While getting the Books ", 500))
    }
}

export const getBooksCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("ia m here and this the error")
        const userId = req.userId || 70; //for test purposes
        const completedBooks = await booksService.GetBooksInProgress(userId!, 'completed');
        res.status(200).send({ "message": "Got Successfully", "data": completedBooks });
    } catch (error) {
        next(new ApiError("Error while getting the completed Books", 500));
    }
}
export const StartBookleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.userId = req.userId||70;
        const data: BookData = {};
        data.book_id = parseInt(req.params.book_id);
        data.user_id = req.userId;
        req.body = data;
        const isExist = await prisma.book_progress.findFirst({
            where: data
        })

        if (!isExist) {
            const created = await prisma.book_progress.create({
                data: req.body
            })
            return res.status(201).json({ message: 'Created successfully', data: created });
        } else {
            return res.status(200).json({ message: "already Started reading" })
        }


    } catch (error) {
        next(new ApiError("Error while Starting this Book , please try again later", 500));
    }
}
export const FinishBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.userId = req.userId || 70;
        const data: BookData = {};
        data.book_id = parseInt(req.params.book_id);
        data.user_id = req.userId;
        const isBookExist = await booksService.isExist(data.book_id);
        if (!isBookExist) {
            return res.status(404).send({ "message": "This Books is not found" })
        }

        const updated = await booksService.FinishBook(data);
        if (updated) {
            res.status(200).json({ "message": "Updated Successfully", data: updated })
        } else {
            next(new ApiError("Error Finsishing the book, try again later after while", 500));
        }

    } catch (error) {
        next(error);
        next(new ApiError("Error Finsishing the book, try again later", 500));
    }

}
export const CreateBook=async (req: Request, res: Response, next: NextFunction) => {
try {
    
} catch (error) {
    
}
}

export const addBookCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { bookId }: any = req.params;
        const { file } = req;
        bookId = parseInt(bookId);

        const photoName = await firebaseService.uploadImage(bookId, file!.path, file!.originalname, 'book-covers');
        const publicUrl = await firebaseService.getPublicUrl(photoName);
        console.log(photoName);
        console.log(publicUrl);
        const updatedBook = await ImageService.addBookCoverImage(bookId, publicUrl);

        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add book cover image' });
    }
}

export const bookmarkBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId || 70;
        const book_id = parseInt(req.params.book_id);

        const isExist = await prisma.books.findFirst({
            where: {
                id: book_id
            }
        })
        if (!isExist) {
            return next(new ApiError("This book id is not found", 404));
        }

        const data = await booksService.BookmarkBook(userId, book_id);
        return res.status(200).send({ "message": "Created Successfully", "data": data });


    } catch (error) {
        next(error);
    }
}
export const deleteBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId || 70;
        const book_id = parseInt(req.params.bookId);

        const isExist = await prisma.books.findFirst({
            where: {
                id: book_id
            }
        })
        if (!isExist) {
            return next(new ApiError("This book id is not found", 404));
        }

        const isbookmarked = await booksService.checkBookmark(userId, book_id);
        if (!isbookmarked) {
            return next(new ApiError("This book is not bookmarked", 404));
        }
        await booksService.deleteBookmarkBook(userId, book_id);
        return res.status(204);
    } catch (error) {

    }
}
export const getBookmarkedBooks = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = req.userId || 70;
        const data = await booksService.getBookMarked(userId);
        if (!data) {
            return next(new ApiError("there is no bookmarks yet!", 404));
        }
        return res.status(200).send({ "message": "Got Successfully", "data": data })
    } catch (error) {
        next(error);
    }
}

export const ValidateId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ status: "error", message: "This is Invalid  ID." });
    }
    next();
}