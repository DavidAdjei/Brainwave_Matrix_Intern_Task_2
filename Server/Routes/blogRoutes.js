import express from "express";
import { auth } from "../middleware/middleware.js";
import { 
    addBlog, 
    deleteBlog, 
    fetchBlogs, 
    fetchUserBlogs, 
    updateBlog 
} from "../Controllers/blogController.js";

const router = express.Router();

router.get("/", fetchBlogs);

router.get("/user", auth, fetchUserBlogs);

router.post("/", auth, addBlog);

router.put("/:id", auth, updateBlog);

router.delete("/:id", auth, deleteBlog);

export default router;
