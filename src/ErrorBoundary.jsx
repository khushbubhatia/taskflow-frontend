import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F8F9FC',
          padding: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <h1 style={{
              fontSize: '48px',
              color: '#8B5CF6',
              marginBottom: '20px'
            }}>Oops!</h1>
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              marginBottom: '30px'
            }}>Something went wrong. Please refresh the page.</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                padding: '12px 32px',
                background: '#8B5CF6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;