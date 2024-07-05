import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { AuthProvider } from './contexts/authContext.jsx'
import { WebSocketProvider } from './contexts/socketContext';

import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(

    <AuthProvider>
      <WebSocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WebSocketProvider>
    </AuthProvider>
)
