import { FETCH_GENERAL_BLOGS, FETCH_USER_BLOGS, SET_ERROR, SET_LOADING } from "./types";

const initialState = {
    generalBlogs: [],
    userBlogs: [],
    loading: false,
    error: null
}

const blogReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_GENERAL_BLOGS:
            return{
                ...state,
                generalBlogs: action.payload
            }
        case FETCH_USER_BLOGS:
            return{
                ...state,
                userBlogs: action.payload
            }
        case SET_LOADING: 
            return{
                ...state,
                loading: action.payload
            }
        case SET_ERROR:
            return{
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

export default blogReducer;