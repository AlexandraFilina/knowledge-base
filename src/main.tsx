import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // 1. Remove ReactDOM from here
import './index.css'
import App from './App'

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
