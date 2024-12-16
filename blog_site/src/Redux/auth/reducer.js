import { LOGOUT, SET_AUTH, SET_AUTH_ERROR, SET_AUTH_LOADING, SET_USER } from "./types"

const initialState = {
    user: null,
    isAuth: false,
    authLoading: false,
    error: null,
    selectedUser: null
}

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_AUTH_LOADING: 
            return{
                ...state,
                authLoading: action.payload
            }
        case SET_USER: 
            return{
                ...state,
                user: action.payload
            }  
        case SET_AUTH: 
            return{
                ...state,
                isAuth: action.payload
            } 
        case SET_AUTH_ERROR: 
            return{
                ...state,
                error: action.payload
            } 
        case LOGOUT:
            return{
                ...state,
                user: null,
                authLoading: false,
                error: null,
                isAuth: false
            }
        default:
            return state
    }
}

export default authReducer;