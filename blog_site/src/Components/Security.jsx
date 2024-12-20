import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changePassword, initiateVerification } from '../Redux/auth/thunks'

const Security = ({ user, onChangeEmail }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const handlePasswordFieldChange = e => {
    setPasswordFields({
      ...passwordFields,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordSubmit = () => {
    const { newPassword, confirmNewPassword } = passwordFields
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirmation do not match!')
      return
    }
    const token = localStorage.getItem('userToken')
    dispatch(changePassword(token, passwordFields))
    setIsChangingPassword(false)
    setPasswordFields({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
  }

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false)
    setPasswordFields({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
  }

  const initiateUserVerification = () => {
    const token = localStorage.getItem('userToken')
    dispatch(initiateVerification(token)).then(() => {
      navigate(`/profile/${user._id}`)
    })
  }

  return (
    <div className='security'>
      <h2>Security</h2>
      <div className='security-email'>
        <h3>Email</h3>
        <div className='email-status'>
          <p>
            <strong>Current Email:</strong> {user.email}
          </p>
          <div className='email-actions'>
            {user?.isVerified ? (
              <p className='verified-text'>
                <span className='check-icon'>✔</span> Verified
              </p>
            ) : (
              <p
                onClick={initiateUserVerification}
                className='verify-email-link'
              >
                Verify Email
              </p>
            )}
            <button onClick={onChangeEmail} className='change-email-btn'>
              Change Email
            </button>
          </div>
        </div>
      </div>
      <h3>Password</h3>
      {!isChangingPassword ? (
        <button
          onClick={() => setIsChangingPassword(true)}
          className='change-password-btn'
        >
          Change Password
        </button>
      ) : (
        <form className='change-password-form'>
          <div className='form-group'>
            <label>Current Password:</label>
            <input
              type='password'
              name='currentPassword'
              value={passwordFields.currentPassword}
              onChange={handlePasswordFieldChange}
            />
          </div>
          <div className='form-group'>
            <label>New Password:</label>
            <input
              type='password'
              name='newPassword'
              value={passwordFields.newPassword}
              onChange={handlePasswordFieldChange}
            />
          </div>
          <div className='form-group'>
            <label>Confirm New Password:</label>
            <input
              type='password'
              name='confirmNewPassword'
              value={passwordFields.confirmNewPassword}
              onChange={handlePasswordFieldChange}
            />
          </div>
          <div className='form-actions'>
            <button
              type='button'
              onClick={handlePasswordSubmit}
              className='submit-btn'
            >
              Submit
            </button>
            <button
              type='button'
              onClick={handleCancelPasswordChange}
              className='cancel-btn'
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Security
