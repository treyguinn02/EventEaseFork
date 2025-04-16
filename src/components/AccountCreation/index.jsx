import React, { useState } from 'react';
import './styles.css';

const AccountCreation = ({ onAccountCreated, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const isPasswordMatch = password === confirmPassword;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username || !password || !isPasswordMatch || !firstName || !lastName || !email) {
      alert('Please fill all fields and make sure passwords match');
      return;
    }
    
    // In a real app, you would send this data to your backend
    console.log('Account created with username:', username);
    
    // Create user data object with profile information
    const userData = {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      username
    };
    
    // Call the callback to navigate to the Home page with user data
    if (onAccountCreated) {
      onAccountCreated(userData);
    }
  };  return (
    <div className="account-creation-container">
      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            value={firstName}
            onChange={handleFirstNameChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            value={lastName}
            onChange={handleLastNameChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email}
            onChange={handleEmailChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={handleUsernameChange}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password-btn"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M12 4.5C7.305 4.5 3.135 7.61 1.5 12c1.635 4.39 5.805 7.5 10.5 7.5s8.865-3.11 10.5-7.5c-1.635-4.39-5.805-7.5-10.5-7.5zm0 12c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.5c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M12 4.5C7.305 4.5 3.135 7.61 1.5 12c1.635 4.39 5.805 7.5 10.5 7.5s8.865-3.11 10.5-7.5c-1.635-4.39-5.805-7.5-10.5-7.5zm0 12c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.5c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />          {!isPasswordMatch && confirmPassword && (
            <p className="error-message">Passwords do not match</p>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="create-button" disabled={!isPasswordMatch}>
            Create Account
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountCreation;