import mongoose from "mongoose";
import Blog from "../Models/blogModel.js";
import DOMPurify from "dompurify";
import {JSDOM} from "jsdom";
import { uploadSingleImage } from "../Utils/uploads.js";

const addBlog = async (req, res) => {
    try {
        const { blog } = req.body;
        const window = new JSDOM('').window;
        const purify = DOMPurify(window);

        const sanitizedHtml = purify.sanitize(blog.content);
        const author = req.userId;

        if (!blog || !author) {
            throw new Error("Missing blog content or author information.");
        }

        await Blog.create({ 
            title: blog.title, 
            category: blog.category, 
            tags: blog.tags,
            content: sanitizedHtml,
            author,
            image: blog.image
        });

        return res.status(201).json({ message: "Blog added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const fetchBlogs = async (req, res) => {
    try {
        const filters = req.query || {};
        const blogs = await Blog.find({ ...filters }).sort({createdAt: -1}).populate({
            path: 'author',
            select: 'firstName lastName email image _id username',
        })
        .populate({
            path: 'comments',
            populate: {
              path: 'user',
              select: 'firstName lastName email image _id username',
            },
        });

        return res.status(200).json({ blogs });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const fetchUserBlogs = async (req, res) => {
    try {
        const userId = req.params.id;
        const filters = req.query || {};
        const query = {author: new mongoose.Types.ObjectId(userId), ...filters};
        console.log({query});
        if (!userId) throw new Error("User ID is missing.");
        const blogs = await Blog.find({query}).populate({
            path: 'author',
            select: 'firstName lastName email image _id',
        })
        .populate({
            path: 'comments',
            populate: {
              path: 'user',
              select: 'firstName lastName email image _id',
            },
        });

        console.log({blogs});
        return res.status(200).json({ blogs });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { changes } = req.body;

        if (!id || !changes) throw new Error("Invalid request: Missing blog ID or changes.");

        const blog = await Blog.findById(id);
        if (!blog) throw new Error("Blog not found.");

        Object.keys(changes).forEach((key) => {
            if (blog[key] !== undefined) {
                blog[key] = changes[key];
            }
        });

        await blog.save();
        return res.status(200).json({ message: "Blog updated successfully.", blog });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error("Invalid request: Blog ID is missing.");

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) throw new Error("Blog not found.");

        return res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(401).json({ error: 'No file uploaded' });
        }
        const { imageUrl } = await uploadSingleImage(file);
        if (!imageUrl) {
            return res.status(404).json({error: 'Failed to upload image'});
        };
        console.log({imageUrl})
        return res.status(200).json({ imageUrl});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export { addBlog, fetchBlogs, fetchUserBlogs, updateBlog, deleteBlog, uploadImage };
