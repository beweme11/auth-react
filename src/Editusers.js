import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditUsers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userid: '',
    name: '',
    email: '',
    is_staff: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve access token from local storage
      const accessToken = localStorage.getItem('access_token');
      
      // Set request headers with Bearer token
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };

      // Send POST request to endpoint with headers
      const response = await axios.post('http://localhost:8000/api/editusers/', formData, { headers });
      
      console.log(response.data); // Log the response from the server
      
      // Reset form data after successful submission
      setFormData({
        userid: '',
        name: '',
        email: '',
        is_staff: false
      });
      
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const handleLogout = () => {
    // Remove access token from local storage
    localStorage.removeItem('access_token');
    // Redirect user to home page
    navigate('/');
  };

  return (
    <div>
      <h2>Edit Users</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input type="text" name="userid" value={formData.userid} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Is Staff:
          <input type="checkbox" name="is_staff" checked={formData.is_staff} onChange={(e) => setFormData({...formData, is_staff: e.target.checked})} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default EditUsers;
