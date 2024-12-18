import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';
import axios from 'axios';
import Loader from '../../features/Loader';
import { MoreVertical } from 'lucide-react';
import { followUser, performLogout } from '../../Redux/auth/thunks';

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
  const [follow, setFollow] = useState(true);

  useEffect(() => {
    getUser(id).then((res) => {
      setSelectedUser(res);
      getComments(id).then((response) => {
        setCommets(response);
      })
    }).finally(setLoading(false));
  }, [id, follow]);

  const getUser = async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`/auth/get-user/${id}`);
        resolve(data.user);
      } catch (err) {
        reject(err.response?.data.error || err.message)
      }
    })
  };

  const getComments = async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get("/comments/" + id);
        resolve(data.comments);
      } catch (err) {
        const message = err.response?.data?.error || err.message;
        reject(message)
      }
    })
  }

  const handleFollow = (id) => {
    const token = localStorage.getItem("userToken");
    dispatch(followUser(id, token)).then(() => setFollow(!follow));
  }

  const handleEditProfile = () => {
    navigate('/settings')
  }

  const handleLogout = () => {
    dispatch(performLogout()).then(() => {
      navigate("/login")
    })
  };

  const handleUserClick = (id) => {
    setActiveTab("blogs");
    navigate(`/profile/${id}`);
  }


  if (loading) {
    <Loader text="Just a moment" />
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
              <button onClick={handleEditProfile}>Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}

      {!isCurrentUser && (
        <button className="follow" onClick={() => handleFollow(selectedUser._id)}>
          {selectedUser?.followers.some((follower) => follower._id === user?._id)
            ? "Following"
            : "Follow"}
        </button>
      )}

      <section className="profile-section">
        <div className="profile-header">
          <img
            src={selectedUser?.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <h1 className="profile-name">
          {selectedUser?.firstName} {selectedUser?.lastName}
        </h1>
        <p className="profile-email">{selectedUser?.email}</p>
        {
          selectedUser?.bio && (
            <p>{selectedUser?.bio}</p>
          )
        }
        
      </section>

      <section className="activity-section">
        <div className="tabs">
          <button
            className={activeTab === "blogs" ? "tab active" : "tab"}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs
          </button>
          <button
            className={activeTab === "comments" ? "tab active" : "tab"}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
          {isCurrentUser && (
            <>
              <button
                className={activeTab === "savedBlogs" ? "tab active" : "tab"}
                onClick={() => setActiveTab("savedBlogs")}
              >
                Saved
              </button>
              <button
                className={activeTab === "following" ? "tab active" : "tab"}
                onClick={() => setActiveTab("following")}
              >
                Following
              </button>
              <button
                className={activeTab === "followers" ? "tab active" : "tab"}
                onClick={() => setActiveTab("followers")}
              >
                Followers
              </button>
            </>
          )}
        </div>

        <div className="tab-content">
          {activeTab === "blogs" && (
            <div className="blogs">
              <h2>{ isCurrentUser ? "Your Blogs" : `${selectedUser?.firstName}'s Blogs`}</h2>
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
                      <button
                        className="read-more-btn"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "comments" && (
            <div className="comments">
              <h2>{ isCurrentUser ? "Your Comments" : `${selectedUser.firstName}'s Comments`}</h2>
              <ul>
                {userComments.length > 0 ? (
                  userComments.map((comment) => (
                    <li
                      key={comment._id}
                      onClick={() => navigate(`/blog/${comment.blog}`)}
                    >
                      {comment.user.firstName} {comment.user.lastName} commented
                      on a post on{" "}
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
          {activeTab === "savedBlogs" && (
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
                        <button
                          className="read-more-btn"
                          onClick={() => navigate(`/blog/${blog._id}`)}
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You haven't saved any blogs yet.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "following" && (
            <div className="following">
              <h2>Following</h2>
              <ul className="user-list">
                {selectedUser.following.length > 0 ? (
                  selectedUser.following.map((followingUser) => (
                    <li
                      key={followingUser._id}
                      onClick={() => handleUserClick(followingUser._id)}
                    >
                      <img
                        src={followingUser.image || "https://via.placeholder.com/50"}
                        alt={`${followingUser.firstName} ${followingUser.lastName}`}
                        className="user-image"
                      />
                      <div className="user-info">
                        <p className="user-name">
                          {followingUser.firstName} {followingUser.lastName}
                        </p>
                        <p className="user-details">{followingUser.email}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>You are not following anyone yet.</p>
                )}
              </ul>
            </div>
          )}
          {activeTab === "followers" && (
            <div className="followers">
              <h2>Followers</h2>
              <ul className="user-list">
                {selectedUser.followers.length > 0 ? (
                  selectedUser.followers.map((follower) => (
                    <li
                      key={follower._id}
                      onClick={() => handleUserClick(follower._id)}
                    >
                      <img
                        src={follower.image || "https://via.placeholder.com/50"}
                        alt={`${follower.firstName} ${follower.lastName}`}
                        className="user-image"
                      />
                      <div className="user-info">
                        <p className="user-name">
                          {follower.firstName} {follower.lastName}
                        </p>
                        <p className="user-details">{follower.email}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>You don't have any followers yet.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );

};

export default ProfilePage;
