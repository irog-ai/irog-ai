import { Auth } from 'aws-amplify';

export async function signOutAndRedirect() {
  try {
    await Auth.signOut();
    // Redirect the user to the login page or show a notification
    window.location.href = '/'; // Ensure this points to your login route
  } catch (error) {
    console.error('Sign-out error:', error);
  }
}

export function handleAuthError(error) {
  if (error.response && error.response.status === 401) {
    console.error("Unauthorized access - possibly due to token expiration. Signing out.");
    signOutAndRedirect();
  } else {
    console.error('API call error:', error);
    // Handle other error cases as needed
  }
}