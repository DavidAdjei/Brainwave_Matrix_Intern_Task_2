import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const { sign } = jwt
import dotenv from 'dotenv'

dotenv.config()

export function generateToken (user, type, expiresIn) {
  return sign({ _id: user._id, type }, process.env.JWT_SECRET, {
    expiresIn
  })
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendVerificationEmail = async (user, token) => {
  const uri = `${process.env.FRONTEND_URL}?token=${token}`
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    html: `<h1>Verify Your Email</h1>
          <p>Click on the link below to verify your email</p>
          <a href=${uri}>Verify Email</a>
          `
  }
  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (err) {
    console.error('Error sending email', err)
    return false
  }
}

export const sendResetEmail = async (user, token) => {
  const uri = `${process.env.FRONTEND_URL}/forgot-password?token=${token}`
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: 'Password Reset',
    html: `<h1>Reset Your Password</h1>
          <p>Click on the link below to change your password</p>
          <a href=${uri}>Change Password</a>
          `
  }
  try {
    const data = await transporter.sendMail(mailOptions)
    return true
  } catch (err) {
    console.error('Error sending email', err)
    return false
  }
}
