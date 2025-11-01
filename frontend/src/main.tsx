import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import OAuthCallback from './pages/OAuthCallback.tsx';
import './index.css';

// Simple routing based on pathname
const pathname = window.location.pathname;
const isOAuthCallback = pathname.startsWith('/auth/zoom/callback');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isOAuthCallback ? <OAuthCallback /> : <App />}
  </React.StrictMode>,
);
