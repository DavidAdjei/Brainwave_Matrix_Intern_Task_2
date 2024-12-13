import express from "express"
import { getUserComments } from "../Controllers/comment.js"
const router = express.Router();

router.get("/:id", getUserComments);

export default router;