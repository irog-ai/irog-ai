import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CustomSignin({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [signUpStage, setSignUpStage] = useState(0); // Added to track signup stages
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupusername, setSignupUsername] = useState('');
  const [signuppassword, setSignupPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    try {
      await Auth.signIn(username, password).then(()=>{navigate('/Landingpage');});
      
      onClose();
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    console.log(signupusername);
    if (signUpStage === 0) {
      try {
        await Auth.signUp({
          username:signupusername,
          password:signuppassword,
          attributes: {
            email: email,
            given_name: firstName,
            family_name: lastName,
          },
        });
        setSignUpStage(1); // Move to the verification stage
      } catch (error) {
        console.error('Error signing up', error);
      }
    } else if (signUpStage === 1) {
      try {
        await Auth.confirmSignUp(signupusername, code);
        await Auth.signIn(signupusername, password);
        navigate('/Landingpage');
        onClose();
      } catch (error) {
        console.error('Error confirming sign up', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        {tabIndex === 0 ? (
          <form onSubmit={handleSignInSubmit}>
            {/* <Typography variant="h6" marginY={2}>Sign In</Typography> */}
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: '15px', marginBottom: '15px' }}
            >
              Sign In
            </Button>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => setTabIndex(1)}
            >
              Don't have an account? Sign up
            </Typography>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit}>
            {/* <Typography variant="h6" marginY={2}>Sign Up</Typography> */}
            {signUpStage === 0 ? (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  name="signupusername"
                  value={signupusername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  name="signuppassword"
                  value={signuppassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="First Name"
                  name="given_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Name"
                  name="family_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: '15px', marginBottom: '15px' }}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirmation Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: '15px', marginBottom: '15px' }}>
                  Confirm Sign Up
                </Button>
              </>
            )}
          </form>
        )}
        {/* <Button onClick={onClose} color="secondary" fullWidth>
          Cancel
        </Button> */}
      </DialogContent>
    </Dialog>
  );
}

export default CustomSignin;
