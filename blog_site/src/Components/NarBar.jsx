import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import "./NavBar.css";
import { UserRound, MenuIcon} from "lucide-react"

export default function NavBar() {
  const {user, isAuth} = useSelector((state) => state.auth);
  const [currentPage, setCurrent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getCurrent = () => {
      let current = null;
      const loc = location.pathname;
      switch (loc) {
        case "/":
          current = "Home"
          return current;
        case "/blogs":
          current = "Blogs";
          return current;
        case "/about":
          current = "About";
          return current;
        default:
          return current
      };
    }
    setCurrent(getCurrent());
  },[location]);

  const onButtonClick = (page) => {
    setMenuOpen(false);
    navigate(`/${page}`)
  }
  return (
      <header className="navbar">
        <div className='nav-right'>
          <div className="logo" onClick={()=> onButtonClick("")}>Blogr</div>
          <ul className="nav-links">
            <li className={currentPage === "Home" ? "active" : undefined}>
              <NavLink to="/">Home</NavLink>
            </li>
            <li className={currentPage === "Blogs" ? "active" : undefined}>
              <NavLink to="/blogs">Explore</NavLink>
            </li>
            <li className={currentPage === "About" ? "active" : undefined}>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>
        </div>
        {
          !isAuth ? (
            <div className="auth-buttons">
              <button className="login" onClick={() => onButtonClick("login")}>Login</button>
              <button className="signup" onClick={() => onButtonClick("signup")}>Sign Up</button>
            </div>
          ) : (
            <div className='auth-buttons'>
              <button className='create' onClick={() => onButtonClick('new')}>Create Blog</button>
              <div className='profile' onClick={() => onButtonClick(`profile/${user._id}`)}>
                <UserRound size={20}/>
                <p>{user?.username}</p>
              </div>
            </div>
          )
        }

        <div className='menu' onClick={() => setMenuOpen(true)}>
          <MenuIcon onClick={() => setMenuOpen(true)}/>
        </div>
      
        {menuOpen && (
          <div className={`mobile-links ${menuOpen ? 'slide-in' : 'slide-out'}`}>
            {isAuth && (
              <div className='userInfo' onClick={() => onButtonClick(`profile/${user._id}`)}> 
                <UserRound/>
                <p>{user.firstName} {user.lastName}</p>
              </div>
            )}
            {isAuth && (
              <button className='create' onClick={() => onButtonClick('new')}>Create Blog</button>
            )}
            <li className={currentPage === "Home" ? "active" : undefined}>
              <NavLink onClick={() => onButtonClick('')} to="/">Home</NavLink>
            </li>
            <li className={currentPage === "Blogs" ? "active" : undefined}>
              <NavLink onClick={() => onButtonClick('blogs')} to="/blogs">Explore</NavLink>
            </li>
            <li className={currentPage === "About" ? "active" : undefined}>
              <NavLink onClick={() => onButtonClick('about')} to="/about">About</NavLink>
            </li>
            {!isAuth && (
              <div className="mobile-buttons">
                <button className="login" onClick={() => onButtonClick("login")}>Login</button>
                <button className="signup" onClick={() => onButtonClick("signup")}>Sign Up</button>
              </div>
            )}
            <button className='close' onClick={() => setMenuOpen(false)}>Close</button>
          </div>
        )}
      </header>
  );
};