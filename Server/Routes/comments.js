import express from "express"
import { auth } from '../middleware/middleware.js';
import { getComments } from "../Controllers/comment.js"
const router = express.Router();

router.get("/", auth, getComments);

export default router;