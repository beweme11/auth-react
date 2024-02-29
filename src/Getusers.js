import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GetAllUsers = () => {
  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch users when component mounts
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Retrieve access token from local storage
        const accessToken = localStorage.getItem('access_token');
        
        // Set request headers with Bearer token
        const headers = {
          Authorization: `Bearer ${accessToken}`
        };
        
        // Send GET request with Bearer token
        const response = await axios.get('http://localhost:8000/api/users', { headers });
        
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        setError('You are not authenticated to access this endpoint');
      } finally {
        setLoading(false);
      }
    };
    
    // Call the function to fetch users
    fetchUsers();
  }, []); // Empty dependency array to ensure the effect runs only once

  // Function to handle logout
  const handleLogout = () => {
    // Remove access token from local storage
    localStorage.removeItem('access_token');
    // Reload the page or perform any other action as needed
    navigate('/')
  };

  // Function to handle navigation to '/editusers'
  const handleEditUsers = () => {
    navigate('/editusers');
  };

  return (
    <div>
      <h2>All Users</h2>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <button onClick={handleEditUsers}>Edit Users</button> {/* Edit Users button */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {users.length > 0 && (
        <div>
          <h3>Users:</h3>
          <ul>
            {users.map(user => (
              <li key={user.id} style={{ marginBottom: '10px' }}>
                <strong style={{ marginRight: '10px' }}>Email:</strong> {user.email}, 
                <strong style={{ marginLeft: '10px', marginRight: '10px' }}>Name:</strong> {user.name}, 
                <strong style={{ marginLeft: '10px' }}>Single Sign-On:</strong> {user.sso ? 'Enabled' : 'Disabled'}
                <strong style={{ marginLeft: '10px' }}>Admin:</strong> {user.is_staff ? 'Yes' : 'No'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetAllUsers;
