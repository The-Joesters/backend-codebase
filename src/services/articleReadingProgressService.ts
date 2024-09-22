import prisma from "../prisma/prismaClient";
import ArticleData from "../interfaces/ArticleData";
import ApiError from "../middlewares/ApiError";

type Completeness = 'inprogress' | 'completed';

class articleReadingProgressService {
    async FinishArticle(data: ArticleData) {
        try {
            let currentRecord = await prisma.article_reading_progress.findUnique({
                where: {
                    article_id_user_id: {
                        user_id: data.user_id!,
                        article_id: data.article_id!,
                    },
                },
            });
            if (currentRecord == null) {
                currentRecord = await prisma.article_reading_progress.create({
                    data: {
                        user_id: data.user_id!,
                        article_id: data.article_id!,
                        is_completed: new Date().toISOString()

                    }
                })
            }
            if (currentRecord!.is_completed === null) {
                const updated = await prisma.article_reading_progress.update({
                    where: {
                        article_id_user_id: {
                            user_id: data.user_id!,
                            article_id: data.article_id!,
                        },
                    },
                    data: {
                        is_completed: new Date().toISOString(),
                    },
                });

                return updated;
            }

            return currentRecord;

        } catch (err) {
            throw new ApiError("Error while finishing the article in the database", 500);
        }

    }

    async articlesInProgress(userId: number, completedValue: Completeness): Promise<any> {
        try {
            const isCompletedCondition = completedValue === 'inprogress'
                ? null
                : { not: null };

            const articlesInProgress = await prisma.article_reading_progress.findMany({
                where: {
                    user_id: userId,
                    is_completed: isCompletedCondition,
                },
                include: {
                    articles: {
                        select: {
                            id: true,
                            title: true,
                            summary: true,
                        },
                    },
                },
            });

            if (articlesInProgress.length === 0) {
                return [];
            }

            return articlesInProgress;
        } catch (error) {
            console.error("Error finding in-progress or completed articles:", error);
            throw new ApiError("Error finding in-progress or completed articles", 500);
        }
    }


    async isExist(article_id: number): Promise<boolean> {
        try {
            const article = await prisma.articles.findFirst({
                where: {
                    id: article_id
                }
            })
            if (article)
                return true;
            else
                return false;
        }


        catch (error) {
            new ApiError("Error finding this article", 500)
            return false
        }
    }
    
}
export default new articleReadingProgressService() 
