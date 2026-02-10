import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import { App } from './App'

const container = document.querySelector<HTMLDivElement>('#app')

if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
