import React, { useState, useEffect } from 'react'
import './SignUp.css'
import { InputField } from '../../features/InputField'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthError } from '../../Redux/auth/actions'
import { resetPassword } from '../../Redux/auth/thunks'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  useEffect(() => {
    if (!token) {
      alert('Reset token is required')
    }
  }, [token])

  const dispatch = useDispatch()
  const { error } = useSelector(state => state.auth)

  const handleInputChange = e => {
    dispatch(setAuthError(null))
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const clearFields = () => {
    setFormData({
      password: '',
      confirmPassword: ''
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!formData.password || !formData.confirmPassword) {
      dispatch(setAuthError('All fields are required'))
    } else if (formData.password !== formData.confirmPassword) {
      dispatch(setAuthError('Passwords do not match'))
    } else {
      dispatch(resetPassword(token, formData.password)).then(() => {
        dispatch(setAuthError(null))
        clearFields()
      })
      navigate('/login')
    }
  }

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h1>Reset Your Password</h1>
        {error && <p className='auth-error'>{error}</p>}

        <InputField
          name='password'
          label='New Password'
          type='password'
          required={true}
          placeholder='Enter your new password'
          value={formData.password}
          onChange={handleInputChange}
        />
        <InputField
          name='confirmPassword'
          label='Confirm Password'
          type='password'
          required={true}
          placeholder='Confirm password'
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />

        <button type='submit' className='submit-button'>
          Reset Password
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
