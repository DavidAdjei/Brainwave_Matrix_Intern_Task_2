import React, { useEffect, useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';
import axios from 'axios';
import Loader from '../features/Loader';
import { MoreVertical } from 'lucide-react';
import { performLogout } from '../Redux/auth/thunks';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { generalBlogs } = useSelector((state) => state.blogs);
  const [activeTab, setActiveTab] = useState('blogs');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userComments, setCommets] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); 
  const dispatch = useDispatch();
  const userBlogs = generalBlogs.filter(blog => blog.author._id === id);
  const isCurrentUser = user && user._id === id;

  useEffect(() => {
    getUser(id).then((res) => {
      console.log({res});
      setSelectedUser(res);
      getComments(id).then((response) => {
        setCommets(response);
      })
    }).finally(setLoading(false));
  }, [id]);

  const getUser = async (id) => {
    return new Promise(async (resolve, reject) =>{
      try{
        const {data} = await axios.get(`/auth/get-user/${id}`);
        resolve(data.user);
      }catch(err){
        reject(err.response?.data.error || err.message)
      }
    })
  };

  const getComments = async (id) => {
    return new Promise(async (resolve, reject) => {
      try{
        const {data} = await axios.get("/comments/" + id);
        resolve(data.comments);
      }catch(err){
        const message = err.response?.data?.error || err.message;
        reject(message)
      }
    })
  }

  const handleEditProfile = () => {
    navigate('/edit-profile')
  }

  const handleLogout = () => {
    dispatch(performLogout()).then(() => {
      navigate("/login")
    })
  };


  if(loading){
    <Loader text="Just a moment"/>
  }
  return (
    <div className="profile-page">
      {isCurrentUser && (
        <div className="menu-container">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={24} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={handleEditProfile}>Edit Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-header">
          <img
            src={selectedUser?.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-picture"
          />
          {isCurrentUser && (
            <button className="edit-profile-btn">✏️</button>
          )}
        </div>
        <h1 className="profile-name">{selectedUser?.firstName} {selectedUser?.lastName}</h1>
        <p className="profile-email">{selectedUser?.email}</p>
      </section>

      {/* Activity Section */}
      <section className="activity-section">
      <div className="tabs">
        <button
          className={activeTab === 'blogs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button
          className={activeTab === 'comments' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
        {isCurrentUser && (
          <button
            className={activeTab === 'savedBlogs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('savedBlogs')}
          >
            Saved Blogs
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === 'blogs' && (
          <div className="blogs">
            <h2>Your Blogs</h2>
            <div className="blogs-list">
              {userBlogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  <img
                    src={blog.image || "https://via.placeholder.com/100"}
                    alt={blog.title}
                    className="blog-image"
                  />
                  <div className="blog-info">
                    <h3>{blog.title}</h3>
                    <button className="read-more-btn" onClick={() => navigate(`/blog/${blog._id}`)}>Read More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'comments' && (
          <div className="comments">
            <h2>Your Comments</h2>
            <ul>
              {userComments.length > 0 ? (
                userComments.map((comment) => (
                  <li key={comment._id} onClick={() => navigate(`/blog/${comment.blog}`)}>
                    {comment.user.firstName} {comment.user.lastName} commented on a post on{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}:
                    <p>{comment.comment}</p>
                  </li>
                ))
              ) : (
                <p>You haven't commented on any posts yet.</p>
              )}
            </ul>
          </div>
        )}
        {activeTab === 'savedBlogs' && (
          <div className="saved-blogs">
            <h2>Your Saved Blogs</h2>
            <div className="blogs-list">
              {user.savedBlogs.length > 0 ? (
                user.savedBlogs.map((blog) => (
                  <div key={blog._id} className="blog-card">
                    <img
                      src={blog.image || "https://via.placeholder.com/100"}
                      alt={blog.title}
                      className="blog-image"
                    />
                    <div className="blog-info">
                      <h3>{blog.title}</h3>
                      <button className="read-more-btn" onClick={() => navigate(`/blog/${blog._id}`)}>Read More</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>You haven't saved any blogs yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
      </section>
    </div>
  );
};

export default ProfilePage;
