import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./auth/reducer"
import blogReducer from './blogs/reducer';

const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogReducer
    },
});

export default store;