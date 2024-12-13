import { logout, setAuth, setAuthError, setAuthLoading, setSelectedUser, setUser } from "./actions";
import axios from "axios";

export const signUp = (formData) => async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
        await axios.post('/auth/register', formData);
        dispatch(setAuthLoading(false));
    } catch (error) {
        const message = error.response?.data?.message || 'Signup failed';
        dispatch(setAuthError(message));
        dispatch(setAuthLoading(false));
    }
}

export const login = (credentials) => async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
      const { data } = await axios.post('/auth/login', credentials);
      localStorage.setItem('userToken', data.token);
      dispatch(setUser(data.user));
      dispatch(setAuth(true));
      dispatch(setAuthLoading(false));
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      dispatch(setAuthError(message));
      dispatch(setAuthLoading(false));
    }
};

export const checkAuth = (token) => async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
      const { data } = await axios.get('/auth/check-auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUser(data.user));
      dispatch(setAuth(true));
      dispatch(setAuthLoading(false));
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Not Authenticated";
      dispatch(setAuthError(message));
      dispatch(setAuthLoading(false));
    }
};

export const getUser = (id) => async (dispatch) => {
  dispatch(setAuthLoading(true));
  try {
    const { data } = await axios.get('/auth/get-user/' + id);
    dispatch(setSelectedUser(data.user))
    dispatch(setAuthLoading(false));
  } catch (error) {
    const message = error.response?.data?.error || error.message || "Not Authenticated";
    dispatch(setAuthError(message));
    dispatch(setAuthLoading(false));
  }
};

export const performLogout = () => async (dispatch) => {
    try {
      localStorage.removeItem('userToken'); 
      dispatch(logout()); 
    } catch (error) {
      console.error('Logout failed', error);
    }
};