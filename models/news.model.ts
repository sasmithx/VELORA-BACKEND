export interface News {
    id: number;
    source?: string;
    author?: string;
    title: string;
    description?: string;
    url?: string;
    urlToImage?: string;
    publishedAt: string;
    content?: string;
    createdAt?: Date;
    isBookmarked?: boolean;
}