import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { useNavigate } from 'react-router-dom';

const msalConfig = {
  auth: {
    clientId: '0e2c8ab8-5887-4e37-b297-e50477178438',
    redirectUri: 'http://localhost:3000/getusers',
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();
const AzureAuth = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null); // State to store refresh token
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userObjectId, setUserObjectId] = useState(null);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  useEffect(() => {


    msalInstance.handleRedirectPromise()
      .then(() => {
        const accounts = msalInstance.getAllAccounts();
        setIsAuthenticated(accounts.length > 0);
        if (accounts.length > 0) {
          msalInstance.acquireTokenSilent({
            scopes: ['https://graph.microsoft.com/.default'],
            account: accounts[0]
          }).then(response => {
            setAccessToken(response.accessToken);
            sendCredsToBackend(response.accessToken);
          }).catch(error => {
            console.error('Failed to acquire token silently:', error);
          });
        }
      })
      .catch(error => {
        console.error('MSAL initialization failed:', error);
      });
  }, []);

  const handleLoginWithMicrosoft = async () => {
    try {
      const response = await msalInstance.loginPopup();
      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken; // Obtain the refresh token from the login response

    //   // Store the tokens in localStorage
    //   localStorage.setItem('access_token', accessToken);
    //   localStorage.setItem('refreshToken', refreshToken);

      const claims = msalInstance.getAllAccounts()[0].idTokenClaims;
      setUserEmail(claims.preferred_username);
      setUserName(claims.name);
      setUserObjectId(claims.oid);

      setIsAuthenticated(true);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      sendCredsToBackend(accessToken);
    } catch (error) {
      console.error('Login with Microsoft failed:', error);
    }
  };

  const sendCredsToBackend = async (token) => {
    try {
      const claims = msalInstance.getAllAccounts()[0].idTokenClaims;
      const userEmail = claims.preferred_username;
      const userName = claims.name;
  
      const response = await axios.post(
        'http://localhost:8000/api/ssosignup/',
        {
          accessToken: token,
        //   email: userEmail,
        //   name: userName
        }
      );
      console.log('Response from backend:', response.data);
  
      const { message, access_token, refresh_token } = response.data;
  
      if (message === 'success' && access_token && refresh_token) {
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
          setAccessToken(access_token);
        setIsAuthenticated(true);
        navigate('/getusers')
      }
    } catch (error) {
      console.error('Error calling backend:', error);
    }
  };
  

  const handleLogout = async () => {
    try {
      await msalInstance.logout();
      setIsAuthenticated(false);
      setAccessToken(null);
      setUserEmail(null);
      setUserName(null);
      setUserObjectId(null);
      localStorage.removeItem('accessToken');
    //   localStorage.removeItem('refreshToken'); // Remove both tokens from localStorage upon logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/signup/',
        {
          name: signupName,
          email: signupEmail,
          password: signupPassword
        }
      );
      console.log('Signup response:', response.data);

      if (response.data.message === 'User created') {
        const access_token = response.data.acess_token
        setAccessToken(access_token);
        setIsAuthenticated(true);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        const jwt_stored = localStorage.getItem('access_token');
        console.log('Stored access Token:',  access_token);
        navigate('/getusers')
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };
  const redirectToSignInPage = () => {
    navigate('/signin'); // Redirect to the sign in page
  };

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h2>Login with Microsoft Account</h2>
          <button onClick={handleLoginWithMicrosoft}>Login with Microsoft</button>

          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Sign Up</button>

          <p>Already a user? <button onClick={redirectToSignInPage}>Sign In</button></p>
        </div>
      ) : (
        <div>
          <h2>Welcome to Homepage</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AzureAuth;

