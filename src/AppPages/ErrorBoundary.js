import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state to display the fallback UI
    console.log("Exceptin caught");
    return { hasError: true, errorMessage: error.message || '' };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console or an error reporting service
    console.error("Logged error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Define inline styles for the error message
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
          {this.props.customMessage && <p>{this.props.customMessage}</p>}
          {this.state.errorMessage && <p>Error: {this.state.errorMessage}</p>}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
