import User from '../Models/userModel.js'
import Notification from '../Models/Notification.js'

const sendNotification = async (userId, message, type, id, io) => {
  try {
    const user = await User.findById(userId)
    if (!user || !user.preferences[type]) return
    let notification;

    if(type !== "follower"){
      notification = new Notification({
        userId,
        message,
        type,
        blogId: id
      })
    }else{
      notification = new Notification({
        userId,
        message,
        type,
        follower: id
      })
    };

    const saved = await notification.save()
    if (saved) {
      io.emit('notification', { userId, message, type, id })
    }
    return saved
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export { sendNotification }
