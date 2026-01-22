import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ✅ VERSÃO LIMPA: Sem Google por enquanto
// Vamos adicionar o Google depois que "Manter Conectado" estiver funcionando

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)