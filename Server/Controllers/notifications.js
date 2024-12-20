import Notification from '../Models/Notification.js'
import User from '../Models/userModel.js'

const getNotifiactions = async (req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1
    })

    return res.status(200).json({ notifications })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const readNotifications = async (req, res) => {
  try {
    const { userId } = req
    const { id } = req.params
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const notification = await Notification.findByIdAndUpdate(id, {
      read: true
    })
    if (!notification) throw new Error('Failed to read notifications')
    return res.status(200).json({ message: 'Read' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

export { getNotifiactions, readNotifications }
