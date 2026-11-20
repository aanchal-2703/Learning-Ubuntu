import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class AppBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Pulse failed to render:', error);
  }

  render() {
    if (this.state.failed) {
      return <main className="page-shell"><div className="empty"><span className="material-symbols-outlined">error</span><h3>Pulse hit a snag</h3><p>Reload the page to start the campus feed again.</p><button className="primary-btn" onClick={() => window.location.reload()}>Reload Pulse</button></div></main>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppBoundary><App /></AppBoundary>
  </React.StrictMode>,
);
