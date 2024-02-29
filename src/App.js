import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Switch
import logo from './logo.svg';
import './App.css';
import AzureAuth from './Authhandler';
import SignIn from './Signin'; // Import the SignIn component
import GetAllUsers from './Getusers';
import TokenExpiryHandler from './Tokenexpiryhandler';
import EditUsers from './Editusers';
function App() {
  return (
    <Router> {/* Wrap your app with BrowserRouter */}
      <div className="App">
        <header className="App-header">
        <TokenExpiryHandler />
          
          <Routes> {/* Wrap your routes with Switch */}
            <Route exact path="/" element={<AzureAuth/>} /> {/* Define route for AzureAuth */}
            <Route path="/signin" element={<SignIn/>} /> {/* Define route for SignIn */}
            <Route path = "/getusers" element = {<GetAllUsers/>}/>
            <Route path = "/editusers" element = {<EditUsers/>}/>
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
