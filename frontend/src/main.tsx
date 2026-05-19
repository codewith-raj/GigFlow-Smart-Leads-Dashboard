import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

try {
  const stored = localStorage.getItem('theme-storage');
  const isDark = stored ? (JSON.parse(stored)?.state?.isDark !== false) : true;
  if (!isDark) document.documentElement.classList.add('light');
} catch {
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
