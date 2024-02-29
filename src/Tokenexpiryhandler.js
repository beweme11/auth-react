import React, { useEffect } from 'react';
import axios from 'axios';

const TokenExpiryHandler = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken && refreshToken) {
        axios.post('http://localhost:8000/api/token/verify/',{
            "token" : accessToken
        })
          .then(response => {
            console.log(response)
            if (response.data || response.data.code === 'token_not_valid') {
              axios.post('http://localhost:8000/api/token/refresh/', {
                refresh: refreshToken
              }).then(refreshResponse => {
                console.log('refresh response :', refreshResponse)
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                console.log('Access token refreshed successfully.');
              }).catch(error => {
                console.error('Error refreshing token:', error);
              });
            } else {
              console.log("Token not expired yet");
            }
          }).catch(error => {
            console.error('Error checking token validity:', error);
          });
      }
    }, 10 * 1000); // poll every 5 mins for token validity

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default TokenExpiryHandler;
