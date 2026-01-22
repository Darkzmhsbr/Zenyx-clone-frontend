import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🔑 CLIENT ID do Google (mesmo do backend)
const GOOGLE_CLIENT_ID = "851618246810-npe0qg47u8stb2s269n0g5bfbr4e0lo1.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🔥 Envolve o App com Google OAuth Provider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)