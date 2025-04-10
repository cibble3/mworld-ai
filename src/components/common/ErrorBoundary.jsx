import React from 'react';

/**
 * ErrorBoundary - A component that catches JavaScript errors anywhere in its child component tree.
 * This prevents the entire application from crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p>We're experiencing technical difficulties. Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="cursor-pointer text-red-700">Technical details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-sm overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 