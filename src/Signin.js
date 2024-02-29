import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/signin/',
        {
          email,
          password
        },
      );

      // Check if response contains access token
      if (response.data.access_token && response.data.refresh_token) {
        // Save access token to local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        console.log('Access token saved to local storage:', response.data.access_token);
        console.log('Refresh token saved to local storage:', response.data.refresh_token);
        navigate('/getusers')
        // Redirect or perform any other actions after successful sign-in
        // For example, you can redirect to a different page
        // window.location.href = '/dashboard';
      } else {
        console.error('Access token not found in server response');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
