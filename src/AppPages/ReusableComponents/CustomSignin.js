import React from 'react';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import '../../App.css'; // Import the custom CSS

const CustomSignIn = () => {
  return (
    <AmplifyAuthenticator>
      <div className="custom-auth-container">
        <AmplifySignIn
          slot="sign-in"
          formFields={[
            {
              type: 'username',
              label: 'Custom Username Label',
              placeholder: 'Enter your custom username',
              required: true,
            },
            {
              type: 'password',
              label: 'Custom Password Label',
              placeholder: 'Enter your custom password',
              required: true,
            },
          ]}
        >
          <div className="custom-auth-card">
            {/* The Amplify Sign-In content will be here */}
          </div>
        </AmplifySignIn>
      </div>
    </AmplifyAuthenticator>
  );
};

export default CustomSignIn;