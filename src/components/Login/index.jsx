import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import './styles.css';

const Login = ({ onLoginSuccess, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google Login Success:', decoded);
    
    // Extract relevant profile information from Google response
    // Google OAuth provides name, given_name, family_name, email, etc.
    onLoginSuccess({ profile: decoded, token: credentialResponse.credential });
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setErrorMessage('Google login failed. Please try again.');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    // In a real app, you would verify credentials with your backend
    // For this example, we'll simulate a successful login
    console.log('Email Login Success:', email);
    
    // Extract first name and last name from email (simple simulation)
    const username = email.split('@')[0];
    const nameParts = username.includes('.') ? 
      username.split('.') : 
      [username, '']; // Default if we can't split
    
    const userData = {
      profile: {
        name: `${nameParts[0]} ${nameParts[1]}`.trim(),
        given_name: nameParts[0],
        family_name: nameParts[1] || '',
        email: email
      },
      token: 'email-login-token'
    };
    
    onLoginSuccess(userData);
  };
  return (
    <GoogleOAuthProvider clientId="945543904789-6l24jog44pla67i2q9a223lv7upgapq6.apps.googleusercontent.com">
      <div className="login-container">
        <h1>Welcome to EventEase</h1>
        <p>Sign in to continue</p>
        
        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin} className="login-form">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
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
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        {/* Google Login */}
        <div className="google-login-container">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
        
        <button
          className="signup-button"
          onClick={onSignup}
          style={{ marginTop: '20px' }} // Inline style for spacing
        >
          Create Account
        </button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;