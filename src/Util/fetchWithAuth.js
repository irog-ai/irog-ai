import axios from 'axios';
import { Auth } from 'aws-amplify';
import { handleAuthError } from './auth';  // Assuming this function handles sign-out and redirection logic

const apipath = process.env.REACT_APP_API_URL;

export async function fetchWithAuth(apiEndpoint, options = {}) {
  try {
    let path = apipath+apiEndpoint;
    // Get the current session token
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();

    // Set headers for the request, add the JWT token as Authorization
    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,  // Merge any additional headers passed
    };

    // Make the axios request
    const response = await axios({
      url: path,
      headers,
      method: options.method || 'get',  // Default to GET if no method is specified
      data: options.data || {},  // Payload for methods like POST
    });
    
    // Return the response data
    return response.data;
  } catch (error) {
    // Handle authentication errors and possibly other errors
    if (error.response && error.response.status === 401) {
      handleAuthError(error);  // Handle potential token expiration or invalid token
    } else {
      console.error('An error occurred during the API call:', error.message);
      throw error;  // Optionally rethrow error if further handling is needed
    }
  }
}
