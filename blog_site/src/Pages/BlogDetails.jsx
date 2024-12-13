import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./BlogDetails.css";
import { useSelector } from "react-redux";
import { User } from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const {generalBlogs} = useSelector(state => state.blogs);
  const blog = generalBlogs.find((b) => b._id === id);
  const navigate = useNavigate();
  const [likes, setLikes] = useState(blog?.likes?.length); // State to track likes
  const [saved, setSaved] = useState(false); // State to track if the blog is saved
  const [newComment, setNewComment] = useState(""); // State to track new comment
  const [comments, setComments] = useState(blog?.comments || []); // State for comments

  if (!blog) {
    return <h2>Blog not found</h2>;
  }

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: "Anonymous", // Replace with the logged-in user's name if available
        comment: newComment,
        timestamp: new Date().toISOString(),
      };
      // setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="blog-details">
      <div className="blog-info">
        <div className="author-details" onClick={() => navigate(`/profile/${blog.author._id}`)}>
          {blog.author.image ? (
            <img
              src={blog.author.image}
              alt={`${blog.author.firstName} ${blog.author.lastName}`}
              className="author-image"
            />
          ) : (
            <User className="profile-icon" />
          )}
          <div className="author-info">
            <p>
              <strong>{blog.author.firstName} {blog.author.lastName}</strong>
            </p>
            <p>{blog.author.email}</p>
          </div>
        </div>

        <h1>{blog.title}</h1>
        <img src={blog.image} alt={blog.title} />
        <div dangerouslySetInnerHTML={{__html: blog.content}}/>

        <div className="action-buttons">
          <button onClick={handleLike} className="like-button">
            👍 Like {likes > 0 && `(${likes})`}
          </button>
          <button onClick={handleSave} className="save-button">
            {saved ? "💾 Saved" : "💾 Save"}
          </button>
        </div>
      </div>
      <div className="blog-comments">
        <div className="comment-section">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleComment} className="comment-button">
            Add Comment
          </button>
        </div>

        <h3>Comments</h3>
        {blog.comments.length > 0 ? (
          <ul com>
            {blog.comments.map((comment) => (
              <li key={comment._id}>
                <strong>@{comment.user.username}:</strong> {comment.comment}
                <br />
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
      
    </div>
  );
};

export default BlogDetails;
