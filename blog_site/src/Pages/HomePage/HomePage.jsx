import React, {useEffect} from "react";
import "./HomePage.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import {verifyUser} from '../../Redux/auth/thunks';

export default function HomePage() {
  const { isAuth, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { generalBlogs } = useSelector((state) => state.blogs);
  const blogs = generalBlogs.slice(0, 4);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if(token){
      dispatch(verifyUser(token));
    }
  },[dispatch, token, navigate, user])

  const onButtonClick = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="home">
      <section className="hero-container">
        <div className="hero-content">
          <h1>A modern publishing platform</h1>
          <p>Grow your audience and build your online brand</p>
          {!isAuth && (
            <div className="hero-buttons">
              <button
                className="start-free"
                onClick={() => onButtonClick("signup")}
              >
                Start for Free
              </button>
              <button
                className="learn-more"
                onClick={() => onButtonClick("about")}
              >
                Learn More
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="container">
        <div className="blog-header">
          <h1>Latest Blogs</h1>
          <Link to="/blogs">
            Explore More <ArrowRight size={16} />
          </Link>
        </div>
        <div className="main-content">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-post">
              <img src={blog.image} alt={blog.title} />
              <div className="content">
                <h2>{blog.title}</h2>
                <div
                  className="author-info"
                  onClick={() => onButtonClick(`profile/${blog.author._id}`)}
                >
                  {blog.author.image ? (
                    <img
                      src={blog.author.image}
                      alt={blog.author.username}
                      className="author-image"
                    />
                  ) : (
                    <User className="profile-icon" />
                  )}
                  <p>{user?._id === blog.author._id ? "You" : `@${blog.author.username}`}</p>
                </div>
                <a href={`/blog/${blog._id}`}>Read More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
