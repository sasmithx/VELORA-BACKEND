import { PrismaClient } from "../generated/prisma";
import {News} from "../models/news.model";

const prisma = new PrismaClient();

export class NewsRepository {
    async createNews(news: News, userId: number) {
        const existingArticle = await prisma.article.findUnique({
            where: {
                title: news.title,
                url: news.url,
                publishedAt: news.publishedAt,
            },
        });

        let article;

        if (existingArticle) {
            article = existingArticle;
        } else {
            article = await prisma.article.create({
                data: {
                    source: news.source || '',
                    author: news.author || '',
                    title: news.title,
                    description: news.description || '',
                    url: news.url || '',
                    urlToImage: news.urlToImage || '',
                    publishedAt: news.publishedAt,
                    content: news.content || '',
                },
            });
        }

        await prisma.bookmark.create({
            data: {
                userId: userId,
                articleId: article.id,
            },
        });

        return {...article, isBookmarked: true};
    }

    async deleteBookmark(userId: number, articleId: number) {
        console.log('deleting', userId, articleId);
        const deletedResult = await prisma.bookmark.deleteMany({
            where: {
                userId: userId,
                articleId: articleId,
            },
        });

        const remainingBookmarks = await prisma.bookmark.count({
            where: {
                articleId: articleId,
            },
        });

        let articleDeleted = false;
        if (remainingBookmarks === 0) {
            await prisma.article.delete({
                where: {
                    id: articleId,
                },
            });
            articleDeleted = true;
        }

        return { deletedBookmarks: deletedResult.count, articleDeleted };
    }

    async getBookmarks(userId: number) {
        console.log('userid', userId);
        return prisma.bookmark.findMany({
            where: {
                userId: userId,
            },
            include: {
                article: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}