import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Redirecter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for access token in localStorage
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Print the access token
    if (!accessToken) {
      navigate('/auth');
    }
  }, [navigate]);
  
};

export default Redirecter;
