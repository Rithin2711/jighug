import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// PUBLIC_INTERFACE
/**
 * App entry point. Renders the main application component to the root div.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
