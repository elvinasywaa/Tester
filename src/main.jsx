import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import PWABadge - pastikan path-nya benar
import PWABadge from "./PWABadge.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <PWABadge />
  </StrictMode>,
)