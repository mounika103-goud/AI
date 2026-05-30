import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </ThemeProvider>
  </StrictMode>,
);
