import React, { useEffect, useState } from 'react'
import './SignUp.css'
import { InputField } from '../../features/InputField'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginWithGoogle, signUp } from '../../Redux/auth/thunks'
import { setAuthError } from '../../Redux/auth/actions'
import { jwtDecode } from 'jwt-decode'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  })
  const { error } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          '567170483864-6dbt5mj4bhcheppu4jead2ks9lthjojn.apps.googleusercontent.com',
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

  const handleFileChange = e => {
    setFormData({ ...formData, profileImage: e.target.files[0] })
  }
  const clearFields = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImage: null
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (formData.password === formData.confirmPassword) {
      console.log(formData)
      dispatch(signUp(formData)).then(() => {
        clearFields()
        navigate('/login')
      })
    } else {
      dispatch(setAuthError('Passwords do not match'))
    }
  }

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        {error && <p className='auth-error'>{error}</p>}
        <InputField
          name='profileImage'
          label='Profile image'
          type='file'
          onChange={handleFileChange}
          required={false}
        />
        <InputField
          name='firstName'
          label='First Name'
          type='text'
          required={true}
          placeholder='First Name'
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <InputField
          name='lastName'
          label='Last Name'
          type='text'
          required={true}
          placeholder='Last Name'
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <InputField
          name='username'
          label='Username'
          type='text'
          required={true}
          placeholder='Usermame'
          value={formData.username}
          onChange={handleInputChange}
        />
        <InputField
          name='email'
          label='Email'
          type='email'
          required={true}
          placeholder='Email'
          value={formData.email}
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
        <InputField
          name='confirmPassword'
          label='Password Confirmation'
          type='password'
          required={true}
          placeholder='Confirm your password'
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        <button type='submit' className='submit-button'>
          Sign up
        </button>

        <p className='or'>Or</p>

        <div className='google-login'>
          <div id='google-login-button'></div>
        </div>

        <p className='member'>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp
