import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Helps to catch bugs by doubling render()
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
