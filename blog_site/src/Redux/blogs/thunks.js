import { setUser } from "../auth/actions";
import { setAllBlogs, setBlogError, setBlogLoading, setUserComments } from "./action";
import axios from "axios"

export const fetchAllBlogs = () => async (dispatch) => {
    dispatch(setBlogLoading(true))
    try{
        const {data} = await axios.get("/blogs");
        dispatch(setAllBlogs(data.blogs));
        dispatch(setBlogLoading(false));
    }catch(error){
        const message = error.response?.data?.error || 'Login failed';
        dispatch(setBlogError(message));
        dispatch(setBlogLoading(false));
    }
}

export const createBlog = (blog, token) => async (dispatch) => {
    try {
      dispatch(setBlogLoading(true)); 
      await axios.post(`/blogs`, {blog}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchAllBlogs()); 
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Failed to create blog.";
      dispatch(setBlogError(message)); 
    } finally {
      dispatch(setBlogLoading(false)); 
    }
  };

  export const updateBlog = (id, blog, token) => async (dispatch) => {
    try {
      dispatch(setBlogLoading(true)); 
      await axios.put(`/blogs/${id}`, {blog}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchAllBlogs()); 
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Failed to create blog.";
      dispatch(setBlogError(message)); 
    } finally {
      dispatch(setBlogLoading(false)); 
    }
  };

  export const newComment = (comment, blog, token) => async (dispatch) => {
    try {
      dispatch(setBlogLoading(true)); 
      await axios.post(`/comments/${blog}`, {comment}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchAllBlogs()); 
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      dispatch(setBlogError(message)); 
    } finally {
      dispatch(setBlogLoading(false)); 
    }
  };

  export const likeBlog = ( blog, token) => async (dispatch) => {
    try {
      dispatch(setBlogLoading(true)); 
      await axios.put(`/blogs/like/${blog}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchAllBlogs()); 
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      dispatch(setBlogError(message)); 
    } finally {
      dispatch(setBlogLoading(false)); 
    }
  };

  export const saveBlog = ( blog, token) => async (dispatch) => {
    try { 
      const {data} = await axios.put(`/blogs/save/${blog}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUser(data.user));
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      dispatch(setBlogError(message)); 
    }
  };

export const fetchUserComments = (id) => async (dispatch) => {
    dispatch(setBlogLoading(true))
    try{
        const {data} = await axios.get("/comments/" + id);
        dispatch(setUserComments(data.comments));
        dispatch(setBlogLoading(false));
    }catch(error){
        const message = error.response?.data?.error || error.message;
        dispatch(setBlogError(message));
        dispatch(setBlogLoading(false));
    }
}