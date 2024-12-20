import {
  logout,
  setAuth,
  setAuthError,
  setAuthLoading,
  setNotifications,
  setUser
} from './actions'
import axios from 'axios'

export const signUp = formData => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    await axios.post('/auth/register', formData)
    dispatch(setAuthLoading(false))
  } catch (error) {
    const message = error.response?.data?.message || 'Signup failed'
    dispatch(setAuthError(message))
    dispatch(setAuthLoading(false))
  }
}

export const login = credentials => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.post('/auth/login', credentials)
    localStorage.setItem('userToken', data.token)
    dispatch(setUser(data.user))
    dispatch(setAuth(true))
    dispatch(setAuthLoading(false))
  } catch (error) {
    const message = error.response?.data?.error || 'Login failed'
    dispatch(setAuthError(message))
    dispatch(setAuthLoading(false))
  }
}

export const loginWithGoogle = googleUser => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.post('/auth/google-auth', { googleUser })
    localStorage.setItem('userToken', data.token)
    dispatch(setUser(data.user))
    dispatch(setAuth(true))
    dispatch(setAuthLoading(false))
  } catch (error) {
    const message = error.response?.data?.error || 'Login failed'
    dispatch(setAuthError(message))
    dispatch(setAuthLoading(false))
  }
}

export const checkAuth = token => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.get('/auth/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    dispatch(setUser(data.user))
    dispatch(setAuth(true))
    dispatch(setAuthLoading(false))
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
    dispatch(setAuthLoading(false))
  }
}

export const followUser = (id, token) => async dispatch => {
  try {
    await axios.put(
      `/auth/follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  }
}

export const editUser = (token, changes) => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    await axios.put(
      `/auth`,
      { changes },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const changePassword = (token, details) => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    await axios.put(
      `/auth/change-password`,
      { details },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const updatePreferences = (token, preferences) => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.put(
      `/auth/preferences`,
      { preferences },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return data
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const initiateVerification = token => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.get(`/auth/initiate-verification`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    alert(data.message)
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const verifyUser = token => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.put(`/auth/verify-user/${token}`)
    alert(data.message)
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const forgotPassword = email => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.get(`/auth/forgot-password/${email}`)
    alert(data.message)
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const resetPassword = (token, password) => async dispatch => {
  dispatch(setAuthLoading(true))
  try {
    const { data } = await axios.put(`/auth/reset-password/${token}`, {
      password
    })
    alert(data.message)
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Not Authenticated'
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const fetchNotifications = token => async dispatch => {
  try {
    const { data } = await axios.get(`/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    dispatch(setNotifications(data.notifications))
  } catch (error) {
    const message = error.response?.data?.error || error.message
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const readNotification = (token, id) => async dispatch => {
  try {
    await axios.put(
      `/notifications/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    dispatch(fetchNotifications(token))
  } catch (error) {
    const message = error.response?.data?.error || error.message
    dispatch(setAuthError(message))
  } finally {
    dispatch(setAuthLoading(false))
  }
}

export const performLogout = () => async dispatch => {
  try {
    localStorage.removeItem('userToken')
    dispatch(logout())
  } catch (error) {
    console.error('Logout failed', error)
  }
}
