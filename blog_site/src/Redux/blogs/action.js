import { FETCH_GENERAL_BLOGS, FETCH_USER_COMMENTS, SET_ERROR, SET_LOADING } from "./types";

export const setAllBlogs = (blogs) => ({
    type: FETCH_GENERAL_BLOGS,
    payload: blogs
});

export const setUserComments = (comments) => ({
    type: FETCH_USER_COMMENTS,
    payload: comments
});

export const setBlogLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading
});

export const setBlogError = (error) => ({
    type: SET_ERROR,
    payload: error
});