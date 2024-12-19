import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './BlogDetails.css'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, User, TrashIcon } from 'lucide-react'
import {
  deleteBlog,
  likeBlog,
  newComment,
  saveBlog
} from '../../Redux/blogs/thunks'
import axios from 'axios'
import Loader from '../../features/Loader'
import { DeleteModal } from '../../Components/DeleteModal'
import { formatDistanceToNow } from 'date-fns'

const BlogDetails = () => {
  const { id } = useParams()
  const { user } = useSelector(state => state.auth)
  const [blog, setBlog] = useState(null)
  const [saved, setSaved] = useState(
    user?.savedBlogs.some(blog => blog._id === id)
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [visibleComments, setVisibleComments] = useState(5)

  useEffect(() => {
    getBlog(id)
      .then(res => {
        setBlog(res)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
        setSent(false)
      })
  }, [id, sent])

  const handleShowMore = () => {
    setVisibleComments(prev => prev + 10)
  }

  const getBlog = async id => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`/blogs/${id}`)
        resolve(data.blog)
      } catch (err) {
        reject(err.response?.data.error || err.message)
      }
    })
  }

  const handleLike = () => {
    const token = localStorage.getItem('userToken')
    if (token) {
      dispatch(likeBlog(id, token)).then(() => {
        setSent(true)
      })
    }
  }

  const handleSave = () => {
    const token = localStorage.getItem('userToken')
    if (token) {
      dispatch(saveBlog(id, token)).then(() => {
        setSaved(!saved)
      })
    }
  }

  const handleComment = () => {
    if (comment.trim()) {
      const token = localStorage.getItem('userToken')
      if (token) {
        dispatch(newComment(comment, blog._id, token)).then(() => {
          setSent(true)
        })
      } else {
        alert('You need to login first')
      }
      setComment('')
    }
  }

  const onEditClick = blogId => {
    navigate(`/edit/${blogId}`)
  }

  const handleDelete = () => {
    const token = localStorage.getItem('userToken')
    if (token) {
      dispatch(deleteBlog(id, token)).then(() => {
        navigate('/') // Navigate back to the home page after deletion
      })
    }
  }

  if (!blog) {
    return <h2>Blog not found</h2>
  }

  if (loading) {
    ;<Loader text={`Loading details...`} />
  }

  return (
    <div className='blog-details'>
      <div className='blog-info'>
        <div
          className='author-details'
          onClick={() => navigate(`/profile/${blog.author._id}`)}
        >
          {blog.author.image ? (
            <img
              src={blog.author.image}
              alt={`${blog.author.firstName} ${blog.author.lastName}`}
              className='author-image'
            />
          ) : (
            <User className='profile-icon' />
          )}
          <div className='author-info'>
            <p>
              <strong>
                {blog.author.firstName} {blog.author.lastName}
              </strong>
            </p>
            <p>{blog.author.email}</p>
          </div>
        </div>

        <h1 className='edit-heading'>
          {blog.title}
          <div className='edit-button'>
            {user && blog.author._id === user._id && (
              <div className='edit-delete'>
                <Edit
                  className='edit-button-icon'
                  size={22}
                  onClick={() => onEditClick(blog._id)}
                />
                <TrashIcon
                  className='delete-button-icon'
                  size={22}
                  onClick={() => setShowDeleteModal(true)}
                />

                {showDeleteModal && (
                  <DeleteModal
                    onDelete={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                  />
                )}
              </div>
            )}
          </div>
        </h1>
        <img className='blog-image' src={blog.image} alt={blog.title} />
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className='action-buttons'>
          <button onClick={handleLike} className='like-button'>
            👍 Like {blog.likes.length > 0 && `(${blog.likes.length})`}
          </button>
          <button onClick={handleSave} className='save-button'>
            {saved ? '💾 Saved' : '💾 Save'}
          </button>
        </div>
      </div>
      <div className='blog-comments'>
        <div className='comment-section'>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder='Add a comment...'
          />
          <button onClick={handleComment} className='comment-button'>
            Add Comment
          </button>
        </div>

        <h3>Comments</h3>
        {blog.comments.length > 0 ? (
          <ul>
            {blog.comments.slice(0, visibleComments).map(comment => (
              <li key={comment._id}>
                <strong
                  onClick={() => navigate(`/profile/${comment.user._id}`)}
                >
                  @{comment.user.username}:
                </strong>{' '}
                {comment.comment}
                <br />
                <small style={{textTransform: "capitalize"}}>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true
                  })}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
        {visibleComments < blog.comments.length && (
          <button className='show-more-btn' onClick={handleShowMore}>
            Show More
          </button>
        )}
        <Link to='/' className='back-button'>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default BlogDetails
