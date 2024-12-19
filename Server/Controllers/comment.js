import Blog from '../Models/blogModel.js'
import Comment from '../Models/CommentModel.js'
import User from '../Models/userModel.js'
import { sendNotification } from '../Utils/notifications.js'

const getUserComments = async (req, res) => {
  try {
    const user = req.params.id
    const comments = await Comment.find({ user })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'firstName lastName email image _id username'
      })
    res.status(200).json({ comments })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const newComment = async (req, res) => {
  try {
    const { userId } = req
    const { blog } = req.params
    const { comment } = req.body

    const newComment = await Comment.create({
      user: userId,
      blog,
      comment
    })

    const existingBlog = await Blog.findById(blog)
    existingBlog.comments.unshift(newComment._id)

    existingBlog.save()

    if (!newComment) throw new Error('Failed to add comment')

    const commentowner = await User.findById(userId);
    const io = req.app.get('socketio')
    const message = `${commentowner.firstName} ${commentowner.lastName} commented on your post: "${comment}"`
    sendNotification(
      existingBlog.author._id,
      message,
      'comments',
      existingBlog._id,
      io
    )
    return res.status(200).json({ message: 'Comment added' })
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message })
  }
}

export { getUserComments, newComment }
