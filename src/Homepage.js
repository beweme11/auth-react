import React from 'react';
import { handleLogout, isAuthenticatedGlobal } from './Authhandler'; // Import isAuthenticatedGlobal

const HomePage = () => {
  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function
  };

  return (
    <div>
      {isAuthenticatedGlobal ? ( // Conditionally render content based on isAuthenticatedGlobal
        <div>
          <h2>Welcome to the Homepage</h2>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please sign in</h2>
          {/* You can add sign-in button or any other sign-in related content here */}
        </div>
      )}
    </div>
  );
};

export default HomePage;
