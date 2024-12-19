import User from '../Models/userModel.js'
import {
  generateToken,
  sendResetEmail,
  sendVerificationEmail
} from '../Utils/auth.js'
import jwt from 'jsonwebtoken';
import { sendNotification } from '../Utils/notifications.js'


const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body
    if (!password) throw new Error('Password is required')
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password
    })
    if (!user) throw new Error('User creation error')
    res.status(201).json({ message: 'User created successfully, login' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { identity, password } = req.body
    const user = await User.findOne({ email: identity }).select('+password')
    if (!user) throw new Error('User not found')

    const isMatch = await user.comparePassword(password)
    if (!isMatch) throw new Error('Invalid credentials')

    const now = new Date()
    user.lastSignIn = now
    await user.save()

    const token = generateToken(user, 'auth', '1d')
    user.password = undefined
    res.status(200).json({ user, token })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: error.message })
  }
}

const googleAuth = async (req, res) => {
  try {
    const { googleUser } = req.body
    if (!googleUser || !googleUser.email)
      throw new Error('Invalid Google user data')

    let user = await User.findOne({ email: googleUser.email })

    if (!user) {
      let baseUsername = `${googleUser.given_name.toLowerCase()}${googleUser.family_name.toLowerCase()}`
      let uniqueUsername = baseUsername
      let suffix = 0

      while (await User.findOne({ username: uniqueUsername })) {
        suffix++
        uniqueUsername = `${baseUsername}${suffix}`
      }

      user = await User.create({
        email: googleUser.email,
        firstName: googleUser.given_name,
        username: uniqueUsername,
        lastName: googleUser.family_name,
        image: googleUser.picture,
        isVerified: googleUser.email_verified
      })
    }

    const now = new Date()

    user.lastSignIn = now
    await user.save()

    user.password = undefined
    user.secret = undefined

    const token = generateToken(user, 'auth', '1d')

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const isAuth = async (req, res) => {
  try {
    const { userId } = req
    if (!userId) throw new Error('Unauthorized')

    const user = await User.findById(userId)
      .populate({
        path: 'savedBlogs',
        populate: {
          path: 'author',
          select: 'firstName lastName email image _id username'
        }
      })
      .populate({
        path: 'following',
        select: 'firstName lastName email image _id username'
      })
      .populate({
        path: 'followers',
        select: 'firstName lastName email image _id username'
      })

    if (!user) throw new Error('User not found')

    const now = new Date()

    user.lastSignIn = now
    await user.save()

    user.password = undefined
    user.secret = undefined

    return res.json({ message: 'Authenticated', user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}

const getUser = async (req, res) => {
  try {
    const userId = req.params.id
    if (!userId) throw new Error('Unauthorized')

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'firstName lastName email image _id username'
      })
      .populate({
        path: 'following',
        select: 'firstName lastName email image _id username'
      })

    if (!user) throw new Error('User not found')

    user.password = undefined
    user.secret = undefined

    return res.json({ user })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const followUser = async (req, res) => {
  try {
    const { userId } = req
    const userToFollowId = req.params.id

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')

    const userToFollow = await User.findById(userToFollowId)

    if (!userToFollow) throw new Error('User to follow not found')

    if (user.following.includes(userToFollowId)) {
      console.log('Already following')
      user.following = user.following.filter(
        id => id.toString() !== userToFollowId.toString()
      )
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== userId.toString()
      )
      await user.save()
      await userToFollow.save()
    } else {
      console.log('Following')
      user.following.unshift(userToFollowId)
      userToFollow.followers.unshift(userId)
      await user.save();
      await userToFollow.save();
      const io = req.app.get("socketio");
      const message = `${user.firstName} ${user.lastName} just followed you`;
      sendNotification(userToFollow._id, message, "follower", user._id, io);
    }
    return res.json({ message: 'Followed' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const editUser = async (req, res) => {
  try {
    const { userId } = req
    const { changes } = req.body
    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')

    Object.keys(changes).forEach(key => {
      if (user[key] !== undefined) {
        user[key] = changes[key]
      }
    })
    await user.save()

    return res.status(200).json({ message: 'User updated' })
  } catch (er) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const updatePreferences = async (req, res) => {
  try {
    const { userId } = req
    const { preferences } = req.body
    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')

    user.preferences = preferences
    await user.save()

    return res
      .status(200)
      .json({ message: 'User updated', preferences: user.preferences })
  } catch (er) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { userId } = req
    const { details } = req.body

    const user = await User.findById(userId).select('+password')

    if (!user) throw new Error('User not found')

    const match = user.comparePassword(details.currentPassword)

    if (!match) throw new Error('Password incorrect')

    user.password = details.newPassword

    await user.save()

    return res.status(200).json({ message: 'Password Changed' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const getToken = async (req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)

    if (!user) {
      return res.status(409).json({ error: 'User not found' })
    }

    const verificationToken = generateToken(user, 'verification', '5m')
    const sent = await sendVerificationEmail(user, verificationToken)
    if (!sent) throw new Error('Sending failed')
    return res.status(200).json({ message: 'Token sent to ' + user.email })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }
}

const verifyUser = async (req, res) => {
  try {
    const { token } = req.params
    if (!token) {
      return
    }
    let payload

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
      if (payload.type !== 'verification') {
        return res.status(400).json({ error: 'Invalid token' })
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid token' })
    }

    const user = await User.findById(payload._id)
    if (!user) {
      return res.status(409).json({ error: 'User not found' })
    }
    if (user.isVerified) {
      return res.status(409).json({ error: 'User already verified' })
    }

    user.isVerified = true

    await user.save()
    return res.status(200).json({ message: 'Verification Successful' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.params
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(409).json({ error: 'User not found' })
    }
    const resetToken = generateToken(user, 'reset', '5m')
    const sent = await sendResetEmail(user, resetToken)
    if (!sent) throw new Error('Sending failed')
    return res
      .status(200)
      .json({ message: 'Reset password link sent to ' + email })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body
    console.log({ password })

    if (!token) {
      return res.status(400).json({ error: 'Token is required' })
    }

    if (!password || password.length < 8) {
      return res.status(404).json({
        error: 'Password is required and must be more than 8 characters'
      })
    }
    let payload

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
      if (payload.type !== 'reset') {
        return res.status(400).json({ error: 'Invalid token' })
      }
    } catch (err) {
      return res.status(401).json({ error: 'Token Expired' })
    }

    const user = await User.findById(payload._id).select('+password')
    if (!user) {
      return res.status(409).json({ error: 'User not found' })
    }
    user.password = password
    await user.save()
    return res.status(200).json({ message: 'Password reset successful' })
  } catch (err) {
    console.error(err)
    return res.status(500).json(err.message)
  }
}

export {
  register,
  login,
  googleAuth,
  isAuth,
  getUser,
  followUser,
  editUser,
  changePassword,
  updatePreferences,
  getToken,
  verifyUser,
  forgotPassword,
  resetPassword
}
