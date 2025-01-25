import React from 'react';

// Define a separate functional component for displaying errors
const ErrorComponent = ({ errorMessage, customMessage }) => {
  const errorStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    margin: '10px 0',
  };

  return (
    <div style={errorStyle}>
      <strong>Something went wrong. Please try again after some time.</strong>
      {customMessage && <p>{customMessage}</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
    </div>
  );
};

export default ErrorComponent;
