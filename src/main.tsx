import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import { RoleProvider } from './lib/rbac'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <RoleProvider>
          <App />
        </RoleProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
