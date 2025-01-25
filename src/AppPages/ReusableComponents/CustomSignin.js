import React, { useState } from "react";
import { Auth } from "aws-amplify";
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";

function CustomSignin({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [signUpStage, setSignUpStage] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupusername, setSignupUsername] = useState("");
  const [signuppassword, setSignupPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Password validation states
  const [lengthValid, setLengthValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);
  const [specialCharValid, setSpecialCharValid] = useState(false);
  const [uppercaseValid, setUppercaseValid] = useState(false);
  const [lowercaseValid, setLowercaseValid] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setShowErrorMessage(false);
    setSuccessMessage("");
    if (newValue === 1) setSignUpStage(0); // Reset sign-up stage when switching back to sign-up tab
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    try {
      await Auth.signIn(username, password);
      setShowErrorMessage(false);
      onClose();
      navigate("/Landingpage");
    } catch (error) {
      console.error("Error signing in", error);
      setShowErrorMessage(true);
      setErrorMessage(
        error.message || "An error occurred while signing in. Please try again."
      );
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    try {
      if (signUpStage === 0) {
        await Auth.signUp({
          username: signupusername,
          password: signuppassword,
          attributes: {
            email: email,
            given_name: firstName,
            family_name: lastName,
          },
        });
        setSignUpStage(1);
        setShowErrorMessage(false);
      } else if (signUpStage === 1) {
        await Auth.confirmSignUp(signupusername, code);
        setTabIndex(0);
        setSuccessMessage("Sign-up successful! Please log in.");
        setShowErrorMessage(false);
        resetFormFields();
        resetSigninFormFields();
      }
    } catch (error) {
      console.error("Error in sign-up process", error);
      setShowErrorMessage(true);
      let message = "An error occurred. Please try again.";
      if (error.code === "UsernameExistsException") {
        message = "Username already exists.";
      } else if (error.code === "InvalidPasswordException") {
        message = "The password does not meet the minimum requirements.";
      } else if (error.message) {
        message = error.message;
      }
      setErrorMessage(message);
    }
  };

  const resetFormFields = () => {
    setEmail("");
    setSignupUsername("");
    setSignupPassword("");
    setFirstName("");
    setLastName("");
    setCode("");
    resetPasswordValidation();
  };

  const resetSigninFormFields = () => {
    setUsername("");
    setPassword("");
  };

  const resetPasswordValidation = () => {
    setLengthValid(false);
    setNumberValid(false);
    setSpecialCharValid(false);
    setUppercaseValid(false);
    setLowercaseValid(false);
  };

  const validatePassword = (password) => {
    setLengthValid(password.length >= 8);
    setNumberValid(/[0-9]/.test(password));
    setSpecialCharValid(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setUppercaseValid(/[A-Z]/.test(password));
    setLowercaseValid(/[a-z]/.test(password));
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
              sx={{ marginTop: "15px", marginBottom: "15px" }}
            >
              Sign In
            </Button>
            {showErrorMessage && (
              <Typography variant="body2" align="center" color="orangered">
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography variant="body2" align="center" color="green">
                {successMessage}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ cursor: "pointer" }}
              onClick={() => setTabIndex(1)}
            >
              Don't have an account? Sign up
            </Typography>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit}>
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
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      {lengthValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    Minimum 8 characters
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {numberValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    Contains at least 1 number
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {specialCharValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    Contains at least 1 special character
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {uppercaseValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    Contains at least 1 uppercase letter
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {lowercaseValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    Contains at least 1 lowercase letter
                  </ListItem>
                </List>
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
                {showErrorMessage && (
                  <Typography variant="body2" color="orangered">
                    {errorMessage}
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginTop: "15px", marginBottom: "15px" }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" align="center" color="textPrimary">
                  A confirmation code has been sent to your email. Please enter
                  it below.
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirmation Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginTop: "15px", marginBottom: "15px" }}
                >
                  Confirm Sign Up
                </Button>
              </>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CustomSignin;

// import React, { useState } from 'react';
// import { Auth } from 'aws-amplify';
// import {
//   Dialog,
//   DialogContent,
//   Tabs,
//   Tab,
//   TextField,
//   Button,
//   Typography
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// function CustomSignin({ open, onClose }) {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [signUpStage, setSignUpStage] = useState(0); // Added to track signup stages
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [signupusername, setSignupUsername] = useState('');
//   const [signuppassword, setSignupPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [code, setCode] = useState('');
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue);
//   };

//   const handleSignInSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await Auth.signIn(username, password);
//       navigate('/Landingpage');
//       setShowErrorMessage(false); // Hide previous errors if any
//       onClose();
//     } catch (error) {
//       console.error('Error signing in', error);
//       setShowErrorMessage(true);
//       if (error.message) {
//         setErrorMessage(error.message); // Display the error message returned by AWS
//       } else {
//         setErrorMessage('An error occurred while signing in. Please try again.');
//       }
//     }
//   };

//   const handleSignUpSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       if (signUpStage === 0) {
//         await Auth.signUp({
//           username: signupusername,
//           password: signuppassword,
//           attributes: {
//             email: email,
//             given_name: firstName,
//             family_name: lastName,
//           },
//         });
//         setSignUpStage(1); // Move to the verification stage
//         setShowErrorMessage(false); // Hide error message if sign-up is successful
//       } else if (signUpStage === 1) {
//         await Auth.confirmSignUp(signupusername, code);
//         await Auth.signIn(signupusername, signuppassword);
//         navigate('/Landingpage');
//         setShowErrorMessage(false); // Hide any error message before navigating
//         onClose();
//       }
//     } catch (error) {
//       console.error('Error', error);
//       setShowErrorMessage(true);
//       if (error.message) {
//         setErrorMessage(error.message); // Display the error message
//       } else {
//         setErrorMessage('An error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogContent>
//         <Tabs
//           value={tabIndex}
//           onChange={handleTabChange}
//           indicatorColor="primary"
//           textColor="primary"
//           centered
//         >
//           <Tab label="Sign In" />
//           <Tab label="Sign Up" />
//         </Tabs>
//         {tabIndex === 0 ? (
//           <form onSubmit={handleSignInSubmit}>
//             {/* <Typography variant="h6" marginY={2}>Sign In</Typography> */}
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Username"
//               name="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Password"
//               type="password"
//               name="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               type="submit"
//               sx={{ marginTop: '15px', marginBottom: '15px' }}
//             >
//               Sign In
//             </Button>
//             {showErrorMessage && <Typography variant="body2" align="center" color="orangered">
//               {errorMessage}
//               </Typography>}
//             <Typography
//               variant="body2"
//               color="textSecondary"
//               align="center"
//               sx={{ cursor: 'pointer' }}
//               onClick={() => setTabIndex(1)}
//             >
//               Don't have an account? Sign up
//             </Typography>
//           </form>
//         ) : (
//           <form onSubmit={handleSignUpSubmit}>
//             {/* <Typography variant="h6" marginY={2}>Sign Up</Typography> */}
//             {signUpStage === 0 ? (
//               <>
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Username"
//                   name="signupusername"
//                   value={signupusername}
//                   onChange={(e) => setSignupUsername(e.target.value)}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Password"
//                   type="password"
//                   name="signuppassword"
//                   value={signuppassword}
//                   onChange={(e) => setSignupPassword(e.target.value)}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="First Name"
//                   name="given_name"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Last Name"
//                   name="family_name"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   required
//                 />
//                 {showErrorMessage && <Typography variant="body2" color="orangered">
//               {errorMessage}
//               </Typography>}
//                 <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: '15px', marginBottom: '15px' }}>
//                   Sign Up
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Confirmation Code"
//                   name="code"
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                   required
//                 />
//                 <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: '15px', marginBottom: '15px' }}>
//                   Confirm Sign Up
//                 </Button>
//               </>
//             )}
//           </form>
//         )}
//         {/* <Button onClick={onClose} color="secondary" fullWidth>
//           Cancel
//         </Button> */}
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default CustomSignin;
