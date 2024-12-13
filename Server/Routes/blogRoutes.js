import express from "express";
import { auth } from "../middleware/middleware.js";
import { 
    addBlog, 
    deleteBlog, 
    fetchBlogs, 
    fetchUserBlogs, 
    updateBlog, 
    uploadImage
} from "../Controllers/blogController.js";
import { upload } from "../Utils/uploads.js";

const router = express.Router();

router.get("/", fetchBlogs);

router.get("/user/:id", fetchUserBlogs);

router.post("/", auth, addBlog);

router.put("/:id", auth, updateBlog);

router.delete("/:id", auth, deleteBlog);

router.post("/upload", upload.single("image"), uploadImage);

export default router;
