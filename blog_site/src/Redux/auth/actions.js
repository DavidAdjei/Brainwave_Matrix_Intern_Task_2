import { LOGOUT, SET_AUTH, SET_AUTH_ERROR, SET_AUTH_LOADING, SET_USER } from "./types";

export const setAuthLoading = (loading) => ({
    type: SET_AUTH_LOADING,
    payload: loading
});

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

export const setAuth = (auth) => ({
    type: SET_AUTH,
    payload: auth
});

export const setAuthError = (error) => ({
    type: SET_AUTH_ERROR,
    payload: error
})

export const logout = () => ({
    type: LOGOUT
})