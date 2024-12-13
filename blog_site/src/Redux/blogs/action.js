import { FETCH_GENERAL_BLOGS, FETCH_USER_BLOGS, SET_ERROR, SET_LOADING } from "./types";

export const setAllBlogs = (blogs) => ({
    type: FETCH_GENERAL_BLOGS,
    payload: blogs
});

export const setUserBlogs = (blogs) => ({
    type: FETCH_USER_BLOGS,
    payload: blogs
});

export const setBlogLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading
});

export const setBlogError = (error) => ({
    type: SET_ERROR,
    payload: error
});