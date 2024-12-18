import { Navigate, Route, Routes, useLocation } from 'react-router'
import React, { useEffect } from 'react'
import './App.css'
import HomePage from './Pages/HomePage/HomePage'
import BlogDetails from './Pages/BlogDetails/BlogDetails'
import SignUp from './Pages/Auth/SignUp'
import Login from './Pages/Auth/Login'
import NavBar from './Components/NarBar'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './Redux/auth/thunks'
import { fetchAllBlogs } from './Redux/blogs/thunks'
import BlogPage from './Pages/BlogPage/BlogPage'
import ProfilePage from './Pages/ProfilePages/ProfilePage'
import CreateBlogPage from './Pages/BlogCreateEdit/CreateBlogPage'
import { useSearchParams } from 'react-router-dom'
import EditBlogPage from './Pages/BlogCreateEdit/EditBlogPage'
import Loader from './features/Loader'
import Settings from './Pages/Settings/Settings'
import ForgotPassword from './Pages/Auth/ForgotPassword'

function App () {
  const dispatch = useDispatch()
  const { isAuth, authLoading } = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.blogs)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path')

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('userToken')
        if (token) {
          dispatch(checkAuth(token))
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      }
    }
    initializeAuth()
    dispatch(fetchAllBlogs())
  }, [dispatch])

  if (authLoading) {
    return <Loader text='Checking auth' />
  }

  if (loading) {
    return <Loader text='Checking blogs' />
  }

  return (
    <div className='App'>
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/blogs' element={<BlogPage />} />
        <Route path='/blog/:id' element={<BlogDetails />} />
        <Route
          path='/signup'
          element={
            isAuth ? (
              path ? (
                <Navigate to={path} />
              ) : (
                <Navigate to='/' />
              )
            ) : (
              <SignUp />
            )
          }
        />
        <Route
          path='/login'
          element={
            !isAuth ? (
              <Login />
            ) : path ? (
              <Navigate to={path} />
            ) : (
              <Navigate to='/' />
            )
          }
        />
        <Route
          path='/forgot-password'
          element={!isAuth ? <ForgotPassword /> : <Navigate to={`/`} />}
        />
        <Route path='/profile/:id' element={<ProfilePage />} />
        <Route
          path='/new'
          element={
            isAuth ? (
              <CreateBlogPage />
            ) : (
              <Navigate to={`/login?path=${location.pathname}`} />
            )
          }
        />
        <Route
          path='/edit/:blogId'
          element={
            isAuth ? (
              <EditBlogPage />
            ) : (
              <Navigate to={`/login?path=${location.pathname}`} />
            )
          }
        />
        <Route
          path='/settings'
          element={
            isAuth ? (
              <Settings />
            ) : (
              <Navigate to={`/login?path=${location.pathname}`} />
            )
          }
        />
      </Routes>
      <footer>
        <p>&copy; 2024 My Blog. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
