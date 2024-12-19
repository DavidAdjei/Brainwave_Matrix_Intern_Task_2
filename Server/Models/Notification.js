import { Schema, model } from 'mongoose'

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['comments', 'likes', 'newBlogs', 'follower'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog"
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

export default model('Notification', notificationSchema)
