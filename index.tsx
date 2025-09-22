import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Ensure createRoot is only called once.
// In some environments (like certain live-reloading setups),
// the script might be executed multiple times, causing this error.
if (!rootElement.hasAttribute('data-react-root')) {
  rootElement.setAttribute('data-react-root', 'true');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DataProvider>
        <App />
      </DataProvider>
    </React.StrictMode>
  );
}