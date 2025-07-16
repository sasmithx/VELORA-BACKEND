import {Router} from "express";
import {deleteBookmark, findBookmarks, findNews, findNewsByKeyword, saveBookmark} from "../controllers/news.controller";

const router = Router();

router.post('/:userId', saveBookmark);

router.delete('/:userId/:articleId', deleteBookmark);

router.get('/:userId/:page', findNews);

router.get('/keyword/:keyword/:userId/:page', findNewsByKeyword);

router.get('/:userId', findBookmarks);

export default router;