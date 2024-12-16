import React, { useState } from "react";
import "./CreateBlogPage.css";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch } from "react-redux";
import { createBlog } from "../Redux/blogs/thunks";
import axios from "axios";
import {tags as availableTags, categories} from "../Utils/utils"

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleTagToggle = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (formdata) => {
    return new Promise( async (resolve, reject) => {
      try{
        const {data} = await axios.post(`/blogs/upload`, formdata, {
          headers: {
              "Content-Type" : 'muiltipart/form-data',
          }
        });
        console.log({data});
        resolve(data.imageUrl);
      }catch(err){
        reject(err.response?.data.error || err.message)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    const token = localStorage.getItem("userToken");
    try{
      const imageUrl = await handleUpload(formData);
      console.log(imageUrl);
      const blog ={
        title,
        category,
        tags,
        content,
        image: imageUrl
      }; 
      dispatch(createBlog(blog, token));
    }catch(error){
      console.log(error);
    }
    console.log("Blog Submitted:", { title, category, tags, content, image });

  };

  return (
    <div className="create-blog-page">
      <h1>Create New Blog</h1>
      <form onSubmit={handleSubmit} className="blog-form" encType="multipart/form-data">
        {/* Image Field */}
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange} // Correct file handling
          />
        </div>

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter blog title"
          />
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Section */}
        <div className="form-group">
          <label>Tags:</label>
          <div className="tags-container">
            {availableTags.map((tag) => (
              <div
                key={tag}
                className={`tag ${tags.includes(tag) ? "selected" : ""}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <Editor
            id="content"
            apiKey="7du7lpoudth7gj7pht1q23typ66bt25dta0nmhxgk1cyxfv7"
            value={content}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                "insertdatetime", "media", "table", "code", "help", "wordcount"
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
            }}
            onEditorChange={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
