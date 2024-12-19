import React, { useState, useEffect } from 'react'
import './SignUp.css'
import { InputField } from '../../features/InputField'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthError } from '../../Redux/auth/actions'
import { forgotPassword, login, loginWithGoogle } from '../../Redux/auth/thunks'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [formData, setFormData] = useState({
    identity: '',
    password: ''
  })
  const [forgotten, setForgotten] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const dispatch = useDispatch()
  const { error } = useSelector(state => state.auth)

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleGoogleCallback
      })
      window.google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        { theme: 'outline', size: 'large' }
      )
    }
  }, [])

  const handleGoogleCallback = response => {
    const { credential } = response
    const user = jwtDecode(credential)
    dispatch(loginWithGoogle(user))
  }

  const handleInputChange = e => {
    dispatch(setAuthError(null))
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const clearFields = () => {
    setFormData({
      identity: '',
      password: ''
    })
  }

  const handleCloseModal = () => {
    setForgotten(false)
  }

  const handleForgotPasswordSubmit = () => {
    if (resetEmail) {
      dispatch(forgotPassword(resetEmail))
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!formData.password || !formData.identity) {
      dispatch(setAuthError('All fields are required'))
    } else {
      dispatch(login(formData)).then(clearFields())
    }
  }

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h1>Login to your account</h1>
        {error && <p className='auth-error'>{error}</p>}

        <InputField
          name='identity'
          label='Email or Username'
          type='email'
          required={true}
          placeholder='Enter your email or username'
          value={formData.identity}
          onChange={handleInputChange}
        />
        <InputField
          name='password'
          label='Password'
          type='password'
          required={true}
          placeholder='Password'
          value={formData.password}
          onChange={handleInputChange}
        />

        <div className='forgot-password'>
          <Link onClick={() => setForgotten(true)}>Forgot Password?</Link>
        </div>

        <button type='submit' className='submit-button'>
          Login
        </button>

        <p className='or'>Or</p>

        {/* Google OAuth Button */}
        <div className='google-login'>
          <div id='google-login-button'></div>
        </div>

        <p className='member'>
          Not a member? <Link to='/signup'>Sign Up</Link>
        </p>
      </form>

      {forgotten && (
        <div className='modal-overlay' onClick={handleCloseModal}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h2>Forgot Password</h2>
            <p>Enter your email address to receive a password reset link.</p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <InputField
                name='resetEmail'
                label='Email'
                type='email'
                required={true}
                placeholder='Enter your email'
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
              />
              <button type='submit' className='submit-button'>
                Get Reset Link
              </button>
            </form>
            <button className='close-button' onClick={handleCloseModal}>
              &#x2715;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
