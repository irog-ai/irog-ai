import React from 'react';
import { Auth } from 'aws-amplify';

const CustomLandingPage = () => {

  const handleLogin = async () => {
    try {
      await Auth.signIn();
    } catch (error) {
      console.log('Error signing in', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Custom Landing Page!</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default CustomLandingPage;