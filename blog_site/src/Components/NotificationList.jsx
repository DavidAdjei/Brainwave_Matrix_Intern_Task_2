import React, { useState } from 'react';
import './NotificationList.css';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { readNotification } from '../Redux/auth/thunks';

export default function NotificationList({ notifications, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visibleNotifications, setVisibleNotifications] = useState(10);

  const handleNotificationClick = (notification) => {
    const token = localStorage.getItem('userToken');
    if (!notification.read) {
      dispatch(readNotification(token, notification._id));
    }
    if(notification.type !== "follower"){
      navigate(`/blog/${notification.blogId}`);
    }else{
      navigate(`/profile/${notification.follower}`);
    }
    
    onClose();
  };

  const trimMessage = (message, maxLength) => {
    return message.length > maxLength
      ? `${message.slice(0, maxLength)}...`
      : message;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleShowMore = () => {
    setVisibleNotifications((prev) => prev + 10);
  };

  return (
    <div className="notification-list">
      <div className="notification-header">
        <div className="not-left">
          <h4>Notifications</h4>
          <span className="notification-badge">{unreadCount}</span>
        </div>
        <button onClick={onClose} className="close-btn">
          X
        </button>
      </div>
      <ul className="notification-container">
        {notifications.length > 0 ? (
          notifications.slice(0, visibleNotifications).map((notification) => (
            <li
              key={notification._id}
              className={`notification-item ${
                notification.read ? 'read' : 'unread'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <p>{trimMessage(notification.message, 50)}</p>
              <small>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </small>
            </li>
          ))
        ) : (
          <li className="no-notifications">No notifications</li>
        )}
      </ul>
      {visibleNotifications < notifications.length && (
        <button className="show-more-btn" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
}
