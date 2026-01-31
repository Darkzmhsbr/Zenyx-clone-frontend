import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importa componentes de estrutura
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  const { user } = useAuth();
  
  // Estado para controlar o Menu Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🔒 BLOQUEIO: Se não tiver usuário logado, chuta para o Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {/* Sidebar recebe o estado e a função para fechar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Header recebe a função para abrir o menu */}
      <Header 
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      
      {/* 🔥 OVERLAY MOBILE CORRIGIDO 🔥 */}
      {/* Só aparece se isMobileMenuOpen for TRUE */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main>
        {/* Outlet é onde as páginas (Dashboard, Bots, etc) são renderizadas */}
        <Outlet />
      </main>
    </div>
  );
}