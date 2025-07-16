import axios from 'axios';
import {News} from "../models/news.model";
import {NewsRepository} from "../repositories/news.repository";

export class NewsService {
    private newsRepository: NewsRepository;
    NEWS_API_KEY = process.env.NEWS_API_KEY;

    constructor() {
        this.newsRepository = new NewsRepository();
    }

    async getNews(page: number, userId: number) {
        if (!this.NEWS_API_KEY) {
            throw new Error('NEWS_API_KEY is not set in the environment variables');
        }

        const sources = 'bbc-news,the-new-york-times,al-jazeera-english,associated-press,the-guardian-uk';
        const newsApiUrl = `https://newsapi.org/v2/everything?sources=${sources}&page=${page}&pageSize=20&language=en&apiKey=${this.NEWS_API_KEY}`;
        const newsResponse = await axios.get(newsApiUrl);
        const newsArticles = newsResponse.data.articles;

        const bookmarks = await this.newsRepository.getBookmarks(userId);
        const bookmarkedArticles = bookmarks.map(bookmark => bookmark.article);

        newsArticles.forEach((article: News) => {
            article.isBookmarked = bookmarkedArticles.some(bookmarkedArticle =>
                bookmarkedArticle.title === article.title &&
                new Date(bookmarkedArticle.publishedAt).getTime() === new Date(article.publishedAt).getTime() &&
                bookmarkedArticle.url === article.url
            );
        });

        return newsArticles;
    }

    async getNewsByKeyword(keyword: string, page: number, userId: number) {
        if (!this.NEWS_API_KEY) {
            throw new Error('NEWS_API_KEY is not set in the environment variables');
        }
        console.log('user--Id', userId);
        const sources = 'bbc-news,the-new-york-times,al-jazeera-english,associated-press,the-guardian-uk';
        const encodedKeyword = encodeURIComponent(keyword);
        const newsApiUrl = `https://newsapi.org/v2/everything?sources=${sources}&q=${encodedKeyword}&page=${page}&pageSize=20&language=en&apiKey=${this.NEWS_API_KEY}`;
        const newsResponse = await axios.get(newsApiUrl);
        const newsArticles = newsResponse.data.articles;

        const bookmarks = await this.newsRepository.getBookmarks(userId);
        const bookmarkedArticles = bookmarks.map(bookmark => bookmark.article);

        newsArticles.forEach((article: News) => {
            article.isBookmarked = bookmarkedArticles.some(bookmarkedArticle =>
                bookmarkedArticle.title === article.title &&
                new Date(bookmarkedArticle.publishedAt).getTime() === new Date(article.publishedAt).getTime() &&
                bookmarkedArticle.url === article.url
            );
        });

        return newsArticles;
    }

    async saveBookmark(userId: number, news: News) {
        return await this.newsRepository.createNews(news, userId);
    }

    async deleteBookmark(userId: number, articleId: number) {
        return await this.newsRepository.deleteBookmark(userId, articleId);
    }

    async getBookmarks(userId: number) {
        const bookmarks = await this.newsRepository.getBookmarks(userId);
        return bookmarks.map(bookmark => {
            return {...bookmark.article, isBookmarked: true};
        });
    }
}