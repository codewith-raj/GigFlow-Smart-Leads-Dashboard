import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Apply theme class before first render to avoid flash of wrong theme
try {
  const stored = localStorage.getItem('theme-storage');
  const isDark = stored ? (JSON.parse(stored)?.state?.isDark !== false) : true;
  if (!isDark) document.documentElement.classList.add('light');
} catch {
  // localStorage unavailable — stay dark by default
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
