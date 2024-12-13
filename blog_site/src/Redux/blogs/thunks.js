import { setAllBlogs, setBlogError, setBlogLoading, setUserBlogs } from "./action";
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

export const fetchUserBlogs = () => async (dispatch) => {
    dispatch(setBlogLoading(true))
    try{
        const {data} = await axios.get("/blogs/user");
        dispatch(setUserBlogs(data.blogs));
        dispatch(setBlogLoading(false));
    }catch(error){
        const message = error.response?.data?.error || 'Login failed';
        dispatch(setBlogError(message));
        dispatch(setBlogLoading(false));
    }
}