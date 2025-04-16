import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import './styles.css';
const Login = ({ onLoginSuccess, onSignup }) => {
  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google Login Success:', decoded);
    onLoginSuccess({ profile: decoded, token: credentialResponse.credential });
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="945543904789-6l24jog44pla67i2q9a223lv7upgapq6.apps.googleusercontent.com">
      <div className="login-container">
        <h1>Welcome to EventEase</h1>
        <p>Sign in to continue</p>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
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