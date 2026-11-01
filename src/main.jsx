import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/site.css'
import App from './App.jsx'

// Reveals hide content only once scripting is known to run.
document.documentElement.classList.add('js')

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships the page pre-rendered, so it reads with scripting off.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
