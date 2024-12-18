import { Navigate, Route, Routes, useLocation } from 'react-router'
import React, { useEffect } from 'react'
import './App.css'
import HomePage from './Pages/HomePage/HomePage'
import BlogDetails from './Pages/BlogDetails/BlogDetails'
import SignUp from './Pages/Auth/SignUp'
import Login from './Pages/Auth/Login'
import NavBar from './Components/NarBar'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth, fetchNotifications } from './Redux/auth/thunks'
import { fetchAllBlogs } from './Redux/blogs/thunks'
import BlogPage from './Pages/BlogPage/BlogPage'
import ProfilePage from './Pages/ProfilePages/ProfilePage'
import CreateBlogPage from './Pages/BlogCreateEdit/CreateBlogPage'
import { useSearchParams } from 'react-router-dom'
import EditBlogPage from './Pages/BlogCreateEdit/EditBlogPage'
import Loader from './features/Loader'
import Settings from './Pages/Settings/Settings'
import ForgotPassword from './Pages/Auth/ForgotPassword'
import { io } from 'socket.io-client'
import AboutPage from './Pages/AboutPage/AboutPage'

const socket = io(process.env.REACT_APP_SERVER, {
  transports: ["websocket"], 
  reconnectionAttempts: 5,  
  timeout: 10000,
});
// axios.defaults.baseURL = 'http://172.20.10.3:8000/api/v1';
// axios.defaults.baseURL = "http://192.168.0.161:8000/api/v1"

function App () {
  const dispatch = useDispatch()
  const { isAuth, authLoading, user } = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.blogs)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path')

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('userToken')
        if (token) {
          dispatch(checkAuth(token)).then(() => {
            dispatch(fetchNotifications(token))
          }) 
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      }
    }
    initializeAuth()
    dispatch(fetchAllBlogs())
  }, [dispatch])


  useEffect(() => {
    // Listen for notifications
    socket.on("notification", (notification) => {
      if(isAuth){
        if(notification.userId === user._id){
          console.log(true);
          const token = localStorage.getItem("userToken");
          dispatch(fetchNotifications(token));
        }else{
          console.log(false);
        }
      }
      console.log("Notification received:", notification);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("notification");
    };
  }, [dispatch, isAuth, user]);

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
        <Route path='/about' element={<AboutPage/>}/>
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
