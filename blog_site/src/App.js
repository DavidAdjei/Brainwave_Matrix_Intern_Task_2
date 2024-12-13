import { Navigate, Route, Routes } from 'react-router';
import React, {useEffect} from "react";
import './App.css';
import HomePage from './Pages/HomePage';
import BlogDetails from './Pages/BlogDetails';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import NavBar from './Components/NarBar';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './Redux/auth/thunks';
import { fetchAllBlogs } from './Redux/blogs/thunks';
import BlogPage from './Pages/BlogPage';

function App() {
  const dispatch = useDispatch();
  const {isAuth} = useSelector(state => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('userToken'); 
        if (token) {
          dispatch(checkAuth(token)); 
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    initializeAuth();
    dispatch(fetchAllBlogs())
  }, [dispatch]);
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/blogs" element={<BlogPage/>}/>
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path='/signup' element={isAuth ? <Navigate to="/"/> : <SignUp/>}/>
        <Route path='/login' element={!isAuth ? <Login/> : <Navigate to="/"/> }/>
      </Routes>
      <footer>
        <p>&copy; 2024 My Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;