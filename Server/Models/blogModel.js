import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'A blog must have content'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Tech', 'Travel', 'Lifestyle', 'Food', 'Other'],
      default: 'Other',
    },
    tags: {
      type: [String],
    },
    image: {
      type: String, 
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Blog = model("Blog", BlogSchema);

export default Blog;