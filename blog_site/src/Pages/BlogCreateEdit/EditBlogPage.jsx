import React, { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updateBlog } from '../../Redux/blogs/thunks'
import axios from 'axios'
import { tags as availableTags, categories } from '../../Utils/utils'
import { Loader } from 'lucide-react'

const EditBlogPage = () => {
  const { blogId } = useParams()
  const dispatch = useDispatch()
  const { generalBlogs } = useSelector(state => state.blogs)
  const blog = generalBlogs.find(b => b._id === blogId)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState([])
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
    const [imageLoading, setImageLoading] = useState(false)

  const [currentImage, setCurrentImage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setTitle(blog.title)
    setCategory(blog.category)
    setTags(blog.tags)
    setContent(blog.content)
    setCurrentImage(blog.image)
  }, [blog, blogId, dispatch])

  const handleTagToggle = tag => {
    setTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    )
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setCurrentImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async formData => {
    return new Promise(async (resolve, reject) => {
      setImageLoading(true)
      try {
        const { data } = await axios.post(`/blogs/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setImageLoading(false)
        resolve(data.imageUrl)
      } catch (err) {
        setImageLoading(false)
        reject(err.response?.data.error || err.message)
      }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    let imageUrl = currentImage
    const token = localStorage.getItem('userToken')

    if (image) {
      const formData = new FormData()
      formData.append('image', image)
      try {
        imageUrl = await handleUpload(formData)
      } catch (error) {
        console.error(error)
        return
      }
    }

    const updatedBlog = {
      title,
      category,
      tags,
      content,
      image: imageUrl
    }

    dispatch(updateBlog(blogId, updatedBlog, token)).then(
      navigate(`/blog/${blogId}`)
    )
  }

  if (imageLoading) {
    return <Loader text='Uploading Image...' />
  }

  if (!blog) {
    return <Loader text='Getting blog...' />
  }

  return (
    <div className='edit-blog-page'>
      <h1>Edit Blog</h1>
      <form
        onSubmit={handleSubmit}
        className='blog-form'
        encType='multipart/form-data'
      >
        {/* Image Field */}
        <div className='form-group'>
          <label htmlFor='image'>Image:</label>
          {currentImage && (
            <img src={currentImage} alt='Current' className='current-image' />
          )}
          <input
            type='file'
            id='image'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>

        {/* Title Field */}
        <div className='form-group'>
          <label htmlFor='title'>Title:</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder='Enter blog title'
          />
        </div>

        {/* Category Dropdown */}
        <div className='form-group'>
          <label htmlFor='category'>Category:</label>
          <select
            id='category'
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value=''>Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Section */}
        <div className='form-group'>
          <label>Tags:</label>
          <div className='tags-container'>
            {availableTags.map(tag => (
              <div
                key={tag}
                className={`tag ${tags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className='form-group'>
          <label htmlFor='content'>Content:</label>
          <Editor
            id='content'
            apiKey='7du7lpoudth7gj7pht1q23typ66bt25dta0nmhxgk1cyxfv7'
            value={content}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount'
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help'
            }}
            onEditorChange={newContent => setContent(newContent)}
          />
        </div>

        {/* Submit Button */}
        <button type='submit' className='submit-btn'>
          Update Blog
        </button>
      </form>
    </div>
  )
}

export default EditBlogPage
