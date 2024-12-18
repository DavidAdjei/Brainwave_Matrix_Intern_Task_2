import React, { useState } from 'react'
import './Settings.css'
import { useSelector, useDispatch } from 'react-redux'
import EditProfile from '../../Components/EditProfile'
import Security from '../../Components/Security'
import { updatePreferences } from '../../Redux/auth/thunks'
import { setUser } from '../../Redux/auth/actions'

const Settings = ({
  onSave,
  onVerifyEmail,
  onChangePassword,
  onChangeEmail
}) => {
  const { user } = useSelector(state => state.auth)
  const [activeTab, setActiveTab] = useState('editProfile')
  const dispatch = useDispatch()

  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications,
    emails: user?.preferences?.emails,
    newsletter: user?.preferences?.newsletter
  })

  const handlePreferenceToggle = preference => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference]
    })
  }

  const handleSave = () => {
    const token = localStorage.getItem('userToken')
    console.log({ preferences })
    dispatch(updatePreferences(token, preferences)).then(res => {
      console.log({ res })
      dispatch(
        setUser({
          ...user,
          preferences: res.preferences
        })
      )
    })
  }

  return (
    <div className='settings'>
      <div className='settings-menu'>
        <ul>
          <li
            className={activeTab === 'editProfile' ? 'active' : ''}
            onClick={() => setActiveTab('editProfile')}
          >
            Edit Profile
          </li>
          <li
            className={activeTab === 'security' ? 'active' : ''}
            onClick={() => setActiveTab('security')}
          >
            Security
          </li>
          <li
            className={activeTab === 'preferences' ? 'active' : ''}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </li>
        </ul>
      </div>
      <div className='settings-content'>
        {activeTab === 'editProfile' && (
          <EditProfile user={user} onSave={onSave} />
        )}
        {activeTab === 'security' && (
          <Security
            user={user}
            onVerifyEmail={onVerifyEmail}
            onChangePassword={onChangePassword}
            onChangeEmail={onChangeEmail}
          />
        )}
        {activeTab === 'preferences' && (
          <div className='preferences'>
            <h2>Preferences</h2>
            <div className='preference-item'>
              Notifications
              <label className='toggle-switch'>
                <input
                  type='checkbox'
                  checked={preferences.notifications}
                  onChange={() => handlePreferenceToggle('notifications')}
                />
                <span className='slider'></span>
              </label>
            </div>
            <div className='preference-item'>
              Email Notifications
              <label className='toggle-switch'>
                <input
                  type='checkbox'
                  checked={preferences.emails}
                  onChange={() => handlePreferenceToggle('emails')}
                />
                <span className='slider'></span>
              </label>
            </div>
            <div className='preference-item'>
              Newsletter
              <label className='toggle-switch'>
                <input
                  type='checkbox'
                  checked={preferences.newsletter}
                  onChange={() => handlePreferenceToggle('newsletter')}
                />
                <span className='slider'></span>
              </label>
            </div>

            <button onClick={handleSave} className='change-email-btn'>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
