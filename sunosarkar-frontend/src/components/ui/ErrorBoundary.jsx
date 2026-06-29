import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App Error:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh', background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, textAlign: 'center',
        }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', marginBottom: 8 }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, color: 'var(--txt-3)', marginBottom: 16 }}>
              An unexpected error occurred. Try refreshing the page.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: 10, padding: '10px 16px',
                marginBottom: 24, fontSize: 12, color: '#f87171',
                fontFamily: 'monospace', wordBreak: 'break-word',
                textAlign: 'left',
              }}>
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              >
                ← Go Home
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
