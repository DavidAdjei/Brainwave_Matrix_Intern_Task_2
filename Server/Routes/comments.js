import express from "express"
import { getUserComments, newComment } from "../Controllers/comment.js"
import { auth } from "../middleware/middleware.js";
const router = express.Router();

router.get("/:id", getUserComments);

router.post("/:blog", auth, newComment)

export default router;