import Blog from "../Models/blogModel.js";

const addBlog = async (req, res) => {
    try {
        const { blog } = req.body;
        const author = req.userId;

        if (!blog || !author) {
            throw new Error("Missing blog content or author information.");
        }

        await Blog.create({ ...blog, author });
        return res.status(201).json({ message: "Blog added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const fetchBlogs = async (req, res) => {
    try {
        const filters = req.query || {};
        const blogs = await Blog.find({ ...filters }).populate({
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
        const userId = req.userId;
        const filters = req.query || {};

        if (!userId) throw new Error("User ID is missing.");

        const blogs = await Blog.find({ ...filters, author: userId }).populate({
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

export { addBlog, fetchBlogs, fetchUserBlogs, updateBlog, deleteBlog };
