import { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import './styles.css';

const User = ({ user, onUserUpdate, onLogout }) => {
  const [profileMode, setProfileMode] = useState('view'); // view, edit, settings, delete
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    title: user?.title || '',
    company: user?.company || ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications || true,
    taskReminders: user?.settings?.taskReminders || true,
    darkMode: user?.settings?.darkMode || false,
    calendarSync: user?.settings?.calendarSync || false,
    language: user?.settings?.language || 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    // Update local state if user prop changes
    if (user) {
      setUserProfile({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        title: user.title || '',
        company: user.company || ''
      });
      setSettings({
        emailNotifications: user.settings?.emailNotifications || true,
        taskReminders: user.settings?.taskReminders || true,
        darkMode: user.settings?.darkMode || false,
        calendarSync: user.settings?.calendarSync || false,
        language: user.settings?.language || 'en'
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSettingsChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userService.updateProfile({
        ...userProfile,
        id: user.id
      });
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setProfileMode('view');
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userService.updateSettings({
        id: user.id,
        settings
      });
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setProfileMode('view');
      setLoading(false);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmation !== user.email) {
      setError('Please enter your email correctly to confirm account deletion.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await userService.deleteAccount(user.id);
      
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      setLoading(false);
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      setLoading(true);
      const response = await userService.uploadAvatar(formData);
      
      setUserProfile(prev => ({
        ...prev,
        avatar: response.avatarUrl
      }));
      
      if (onUserUpdate) {
        onUserUpdate({
          ...user,
          avatar: response.avatarUrl
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      setLoading(false);
    }
  };

  const renderProfileView = () => (
    <div className="profile-view">
      <div className="profile-header">
        <div className="avatar-container">
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt={userProfile.name} className="user-avatar" />
          ) : (
            <div className="avatar-placeholder">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        <div className="profile-name-email">
          <h2>{userProfile.name || 'User'}</h2>
          <p className="email">{userProfile.email}</p>
          {userProfile.title && <p className="title">{userProfile.title}</p>}
          {userProfile.company && <p className="company">{userProfile.company}</p>}
        </div>
      </div>
      
      <div className="profile-actions">
        <button className="edit-profile-btn" onClick={() => setProfileMode('edit')}>
          Edit Profile
        </button>
        <button className="settings-btn" onClick={() => setProfileMode('settings')}>
          Account Settings
        </button>
        <button className="danger-btn" onClick={() => setProfileMode('delete')}>
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderProfileEdit = () => (
    <div className="profile-edit">
      <h2>Edit Profile</h2>
      
      <div className="avatar-edit">
        {userProfile.avatar ? (
          <img src={userProfile.avatar} alt={userProfile.name} className="user-avatar" />
        ) : (
          <div className="avatar-placeholder">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <div className="upload-avatar">
          <label htmlFor="avatar-upload" className="upload-btn">
            Change Photo
          </label>
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*" 
            onChange={uploadAvatar} 
            className="hidden-input" 
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userProfile.name}
          onChange={handleProfileChange}
          placeholder="Your name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userProfile.email}
          onChange={handleProfileChange}
          placeholder="Your email"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={userProfile.phone}
          onChange={handleProfileChange}
          placeholder="Your phone number"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="title">Job Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={userProfile.title}
          onChange={handleProfileChange}
          placeholder="Your job title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={userProfile.company}
          onChange={handleProfileChange}
          placeholder="Your company"
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-actions">
        <button 
          className="save-btn" 
          onClick={saveProfile} 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button 
          className="cancel-btn" 
          onClick={() => {
            setProfileMode('view');
            setError(null);
            // Reset to original values
            if (user) {
              setUserProfile({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
                phone: user.phone || '',
                title: user.title || '',
                company: user.company || ''
              });
            }
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="profile-settings">
      <h2>Account Settings</h2>
      
      <div className="settings-section">
        <h3>Notifications</h3>
        
        <div className="setting-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleSettingsChange('emailNotifications', !settings.emailNotifications)}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="setting-info">
            <h4>Email Notifications</h4>
            <p>Receive updates about your events, tasks, and guest responses</p>
          </div>
        </div>
        
        <div className="setting-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.taskReminders}
              onChange={() => handleSettingsChange('taskReminders', !settings.taskReminders)}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="setting-info">
            <h4>Task Reminders</h4>
            <p>Get reminders about upcoming tasks and deadlines</p>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Preferences</h3>
        
        <div className="setting-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleSettingsChange('darkMode', !settings.darkMode)}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="setting-info">
            <h4>Dark Mode</h4>
            <p>Switch between light and dark themes</p>
          </div>
        </div>
        
        <div className="setting-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.calendarSync}
              onChange={() => handleSettingsChange('calendarSync', !settings.calendarSync)}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="setting-info">
            <h4>Calendar Sync</h4>
            <p>Sync events with your external calendar</p>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => handleSettingsChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-actions">
        <button 
          className="save-btn" 
          onClick={saveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        <button 
          className="cancel-btn" 
          onClick={() => {
            setProfileMode('view');
            setError(null);
            // Reset to original values
            if (user) {
              setSettings({
                emailNotifications: user.settings?.emailNotifications || true,
                taskReminders: user.settings?.taskReminders || true,
                darkMode: user.settings?.darkMode || false,
                calendarSync: user.settings?.calendarSync || false,
                language: user.settings?.language || 'en'
              });
            }
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <div className="delete-account">
      <h2>Delete Account</h2>
      
      <div className="warning-box">
        <div className="warning-icon">⚠️</div>
        <h3>Warning: This action cannot be undone</h3>
        <p>
          Deleting your account will remove all of your information from our database. 
          This includes all your saved events, tasks, guest lists, and personal information. 
          This cannot be recovered once deleted.
        </p>
      </div>
      
      <div className="form-group">
        <label htmlFor="confirm-email">To confirm, please enter your email address:</label>
        <input
          type="email"
          id="confirm-email"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          placeholder={user.email}
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-actions">
        <button 
          className="delete-confirm-btn" 
          onClick={deleteAccount}
          disabled={loading || deleteConfirmation !== user.email}
        >
          {loading ? 'Deleting...' : 'Permanently Delete Account'}
        </button>
        <button 
          className="cancel-btn" 
          onClick={() => {
            setProfileMode('view');
            setDeleteConfirmation('');
            setError(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-profile-container">
      {profileMode === 'view' && renderProfileView()}
      {profileMode === 'edit' && renderProfileEdit()}
      {profileMode === 'settings' && renderSettings()}
      {profileMode === 'delete' && renderDeleteConfirmation()}
    </div>
  );
};

export default User;
