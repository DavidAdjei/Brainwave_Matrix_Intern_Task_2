import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';
import { fetchUserComments } from '../Redux/blogs/thunks';
import { getUser } from '../Redux/auth/thunks';

const ProfilePage = () => {
  const { id } = useParams();
  const { user, selectedUser, authLoading } = useSelector((state) => state.auth);
  const { loading, generalBlogs, userComments } = useSelector((state) => state.blogs);
  const [activeTab, setActiveTab] = useState('blogs');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userBlogs = generalBlogs.filter(blog => blog.author._id === id);
  const isCurrentUser = user && user._id === id;

  useEffect(() => {
    try {
      dispatch(fetchUserComments(id));
      dispatch(getUser(id));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [dispatch, id]);

  if (loading) {
    return <div>loading....</div>;
  }

  if (authLoading) {
    return <div>loading....</div>;
  }

  return (
    <div className="profile-page">
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
        </div>

        <div className="tab-content">
          {activeTab === 'blogs' ? (
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
          ) : (
            <div className="comments">
              <h2>Your Comments</h2>
              <ul>
                {userComments.length > 0 ? (
                  userComments.map((comment) => (
                    <li key={comment._id} onClick={() => navigate(`/blog/${comment.blog}`) }>
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
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
