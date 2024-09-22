import { error } from "console";
import ApiError from "../middlewares/ApiError";
import prisma from "../prisma/prismaClient";

class articlesService {
    isMediumWebsite(link: string) {
        try {
            const re = /medium.com/i;
            if (link.search(re) != -1) {
                return true;
            } else {
                throw (error);
            }
        } catch (err) {
            throw new ApiError("Link provided is not Medium website", 501);
        }
    }

    async BookmarkArticle(userId: number, article_id: number) {
        try {
            const IsExistData = await prisma.bookmarked_articles.findFirst({
                where: {
                    user_id: userId,
                    article_id: article_id
                }
            })
            console.log("this is the data", IsExistData);
            if (IsExistData) {
                return IsExistData;
            }
            const data = await prisma.bookmarked_articles.create({
                data: {
                    user_id: userId,
                    article_id: article_id
                }
            })
            return data;
        } catch (error) {
            new ApiError("Error while creating the bookmark in db", 500);
        }
    }
    async getBookMarked(userId: number) {
        try {
            const data = await prisma.bookmarked_articles.findMany({
                where: {
                    user_id: userId
                }
            })

            return data;
        } catch (error) {
            new ApiError("Error while getting the books from the db", 500)
        }
    }
    async checkBookmark(userId: number, article_id: number) {
        try {

            const data = await prisma.bookmarked_articles.findFirst({
                where: {
                    user_id: userId,
                    article_id: article_id
                }
            })
            return data;
        } catch (error) {
            new ApiError("Error while checking on the bookmark from db", 500);
        }
    }
    async deleteBookmarkArticle(userId: number, article_id: number) {
        try {

            const data = await prisma.bookmarked_articles.delete({
                where: {
                    user_id_article_id: {
                        user_id: userId,
                        article_id: article_id
                    }
                }
            })
            return data;
        } catch (error) {
            new ApiError("Error while checking on the bookmark from db", 500);
        }
    }
}

export default new articlesService();