import express from "express";
import { auth } from "../middleware/middleware.js";
import { 
    addBlog, 
    deleteBlog, 
    fetchBlogs, 
    likeBlog, 
    updateBlog, 
    uploadImage,
    getBlog,
    saveBlog
} from "../Controllers/blogController.js";
import { upload } from "../Utils/uploads.js";

const router = express.Router();

router.get("/", fetchBlogs);

router.get("/:id", getBlog);

router.post("/", auth, addBlog);

router.put("/like/:id", auth, likeBlog);

router.put("/save/:id", auth, saveBlog);

router.put("/:id", auth, updateBlog);

router.delete("/:id", auth, deleteBlog);

router.post("/upload", upload.single("image"), uploadImage);

export default router;
