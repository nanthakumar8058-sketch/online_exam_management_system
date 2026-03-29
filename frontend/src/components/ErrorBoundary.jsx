import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '20px' }}>React Application Crashed 🛑</h1>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>An uncaught exception occurred while rendering this view.</p>
          
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', overflowX: 'auto' }}>
            <h3 style={{ color: '#f87171', marginBottom: '10px' }}>{this.state.error?.toString()}</h3>
            <pre style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.5' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
            <hr style={{ borderColor: '#334155', margin: '20px 0' }} />
            <pre style={{ color: '#94a3b8', whiteSpace: 'pre-wrap', fontSize: '11px' }}>
              {this.state.error?.stack}
            </pre>
          </div>

          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '30px', padding: '12px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
