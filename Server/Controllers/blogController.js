import mongoose from "mongoose";
import Blog from "../Models/blogModel.js";
import User from "../Models/userModel.js"
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

const editBlog = async (req, res) => {
    try {
        const { blog } = req.body;
        const {userId} = req;
        const {id} = req.params;
        const existingBlog = await Blog.findById(id);
        if(!existingBlog){
            throw new Error("Blog not found");
        }
        if(existingBlog.author._id.toString() !== userId.toString()){
            throw new Error("Blog doesn't belong to you");
        }

        const window = new JSDOM('').window;
        const purify = DOMPurify(window);

        const sanitizedHtml = purify.sanitize(blog.content);
        blog.content = sanitizedHtml;        
        await Blog.findByIdAndUpdate(id, blog);

        return res.status(201).json({ message: "Blog updated successfully." });
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

const getBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id).populate({
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

        return res.status(200).json({ blog });
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

const likeBlog = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        if (blog.likes.includes(userId)) {
            blog.likes = blog.likes.filter((id) => id.toString() !== userId);            
            await blog.save();
            return res.status(200).json({ 
                message: "Blog unliked successfully"
            });
        } else {
            blog.likes.unshift(userId);
            await blog.save();
            return res.status(200).json({ 
                message: "Blog liked successfully"
            });
        }
    } catch (err) {
        console.error("Error liking blog:", err);
        res.status(500).json({ error: "An error occurred while liking the blog" });
    }
};

const saveBlog = async (req, res) => {
    try{
        const { userId } = req;
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) throw new Error("Blog not found");
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        if(user.savedBlogs.includes(id)){
            console.log("Already saved")
            var savedBlogs = user.savedBlogs.filter(blogId => blogId.toString() !== id.toString()); 
            console.log({savedBlogs})
            user.savedBlogs = savedBlogs;
            await user.save();
        }else{
            console.log("Now saving")
            user.savedBlogs.unshift(id);
            await user.save();
        }

        user.password = undefined;
        user.secret = undefined;

        return res.status(200).json({ message: "Successful", user});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export { addBlog, editBlog, fetchBlogs, getBlog, deleteBlog, uploadImage, likeBlog, saveBlog};
