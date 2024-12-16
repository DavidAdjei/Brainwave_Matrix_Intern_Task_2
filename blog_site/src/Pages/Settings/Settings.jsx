import React, { useState } from 'react';
import './Settings.css';
import { useSelector } from 'react-redux';
import EditProfile from '../../Components/EditProfile';
import Security from '../../Components/Security';

const Settings = ({ onSave, onVerifyEmail, onChangePassword, onChangeEmail }) => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('editProfile');

    const [preferences, setPreferences] = useState({
        notifications: true,
        emails: false,
        newsletter: true,
    });

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handlePreferenceToggle = (preference) => {
        setPreferences({
            ...preferences,
            [preference]: !preferences[preference],
        });
    };

    const handlePasswordFieldChange = (e) => {
        setPasswordFields({
            ...passwordFields,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordSubmit = () => {
        const { currentPassword, newPassword, confirmNewPassword } = passwordFields;
        if (newPassword !== confirmNewPassword) {
            alert('New password and confirmation do not match!');
            return;
        }
        onChangePassword(currentPassword, newPassword);
        setIsChangingPassword(false); // Close the form after submission
        setPasswordFields({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
    };

    return (
        <div className="settings">
            <div className="settings-menu">
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
            <div className="settings-content">
                {activeTab === 'editProfile' && (
                    <EditProfile user={user} onSave={onSave} />
                )}
                {activeTab === 'security' && (
                    <Security user={user} onVerifyEmail={onVerifyEmail} onChangePassword={onChangePassword} onChangeEmail={onChangeEmail} />
                )}
                {activeTab === 'preferences' && (
                    <div className="preferences">
                        <h2>Preferences</h2>
                        <div className="preference-item">
                            <label>
                                Notifications
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications}
                                    onChange={() => handlePreferenceToggle('notifications')}
                                />
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                Email Notifications
                                <input
                                    type="checkbox"
                                    checked={preferences.emails}
                                    onChange={() => handlePreferenceToggle('emails')}
                                />
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                Newsletter
                                <input
                                    type="checkbox"
                                    checked={preferences.newsletter}
                                    onChange={() => handlePreferenceToggle('newsletter')}
                                />
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
