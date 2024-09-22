import prisma from "../prisma/prismaClient";
import BookData from "../interfaces/BookData";
import ApiError from "../middlewares/ApiError";

type Completeness = 'inprogress' | 'completed';

class bookReadingProgressService {
    async FinishBook(data: BookData) {
        try {
            let currentRecord = await prisma.book_progress.findFirst({
                where: {
                    user_id: data.user_id!,
                    book_id: data.book_id!,
                },
            },
            );

            if (currentRecord == null) {
                currentRecord = await prisma.book_progress.create({
                    data: {
                        user_id: data.user_id!,
                        book_id: data.book_id!,
                        is_completed: true
                    }
                })
            }
            if (currentRecord!.is_completed === null) {
                const updated = await prisma.book_progress.updateMany({
                    where: {
                        user_id: data.user_id,
                        book_id: data.book_id
                    },
                    data: {
                        is_completed: true,
                    },
                });

                return updated;
            }

            return currentRecord;

        } catch (err) {
            throw new ApiError("Error while finishing the article in the database", 500);
        }

    }

    async GetBooksInProgress(userId: number, completedValue: Completeness): Promise<any> {
        try {
            const isCompletedCondition = completedValue === 'inprogress'
                ? null
                : { not: null };

            const booksInProgress = await prisma.book_progress.findMany({
                where: {
                    user_id: userId,
                    is_completed: isCompletedCondition,
                },
                include: {
                    books: {
                        select: {
                            id: true,
                            title: true,
                            summary: true,
                        },
                    },
                },
            });

            if (booksInProgress.length === 0) {
                return [];
            }

            return booksInProgress;
        } catch (error) {
            console.error("Error finding in-progress or completed books:", error);
            throw new ApiError("Error finding in-progress or completed books", 500);
        }
    }

    async BookmarkBook(userId: number, book_id: number) {
        try {
            console.log(userId,book_id);
            const IsExistData = await prisma.bookmarked_books.findFirst({
                where: {
                    user_id: userId,
                    book_id: book_id
                }
            })
            
            // if (IsExistData!=null) {
            //     return IsExistData;
            // }



            console.log("this is the data", IsExistData);
            const data = await prisma.bookmarked_books.create({
                data: {
                    user_id: userId,
                    book_id: book_id
                }
            })
            console.log("data after creation",data)
            return data;
        } catch (error) {
            new ApiError("Error while creating the bookmark in db", 500);
        }
    }

    async getBookMarked(userId: number) {
        try {
            const data = await prisma.bookmarked_books.findMany({
                where: {
                    user_id: userId
                }
            })

            return data;
        } catch (error) {
            new ApiError("Error while getting the books from the db", 500)
        }
    }

    async checkBookmark(userId: number, book_id: number) {
        try {

            const data = await prisma.bookmarked_books.findFirst({
                where: {
                    user_id: userId,
                    book_id: book_id
                }
            })
            return data;
        } catch (error) {
            new ApiError("Error while checking on the bookmark from db", 500);
        }
    }
    async deleteBookmarkBook(userId: number, book_id: number) {
        try {

            const data = await prisma.bookmarked_books.deleteMany({
                where: {
                        user_id: userId,
                        book_id: book_id
                }
            })
            return data;
        } catch (error) {
            new ApiError("Error while checking on the bookmark from db", 500);
        }
    }
    async isExist(book_id: number): Promise<boolean> {
        try {
            const book = await prisma.books.findFirst({
                where: {
                    id: book_id
                }
            })
            if (book)
                return true;
            else
                return false;
        }


        catch (error) {
            new ApiError("Error finding this books", 500)
            return false
        }
    }

}
export default new bookReadingProgressService() 
