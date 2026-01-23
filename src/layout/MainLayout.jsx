import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Circle, ArrowRight, X } from 'lucide-react';

// 👇 Importa componentes de estrutura
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  const { user, onboarding } = useAuth();
  const navigate = useNavigate();
  
  // Estado para controlar o Menu Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 🔥 NOVO: Estado para mostrar/ocultar banner de onboarding
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true);

  // 🔒 BLOQUEIO: Se não tiver usuário logado, chuta para o Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 NOVO: Função para calcular progresso
  const getProgress = () => {
    if (!onboarding) return 0;
    
    const steps = onboarding.steps;
    const completed = [
      steps.botCreated,
      steps.botConfigured,
      steps.plansCreated,
      steps.flowConfigured
    ].filter(Boolean).length;
    
    return (completed / 4) * 100;
  };

  // 🔥 NOVO: Função para obter próxima etapa
  const getNextStep = () => {
    if (!onboarding || onboarding.completed) return null;
    
    const steps = onboarding.steps;
    
    if (!steps.botCreated) return { label: 'Criar Bot', path: '/bots/new', num: 1 };
    if (!steps.botConfigured) return { label: 'Configurar Bot', path: '/bots', num: 2 };
    if (!steps.plansCreated) return { label: 'Criar Planos', path: '/planos', num: 3 };
    if (!steps.flowConfigured) return { label: 'Configurar Fluxo', path: '/flow', num: 4 };
    
    return null;
  };

  const progress = getProgress();
  const nextStep = getNextStep();

  return (
    <div className="app-container">
      {/* 🔥 NOVO: Banner de Progresso do Onboarding */}
      {!onboarding?.completed && showOnboardingBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(135deg, #1a0933 0%, #2d1554 100%)',
          borderBottom: '1px solid rgba(195, 51, 255, 0.3)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          
          {/* Lado Esquerdo: Progresso */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#fff',
              minWidth: '140px'
            }}>
              🎯 Setup Inicial ({Math.round(progress)}%)
            </div>
            
            {/* Barra de Progresso */}
            <div style={{
              flex: 1,
              maxWidth: '400px',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #c333ff 0%, #d65ad1 100%)',
                borderRadius: '10px',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(195, 51, 255, 0.5)'
              }} />
            </div>
            
            {/* Etapas */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {onboarding?.steps.botCreated ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <Circle size={16} color="#666" />
              )}
              {onboarding?.steps.botConfigured ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <Circle size={16} color="#666" />
              )}
              {onboarding?.steps.plansCreated ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <Circle size={16} color="#666" />
              )}
              {onboarding?.steps.flowConfigured ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <Circle size={16} color="#666" />
              )}
            </div>
          </div>
          
          {/* Lado Direito: Próximo Passo */}
          {nextStep && (
            <button
              onClick={() => navigate(nextStep.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #c333ff 0%, #d65ad1 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Passo {nextStep.num}: {nextStep.label}
              <ArrowRight size={16} />
            </button>
          )}
          
          {/* Botão Fechar */}
          <button
            onClick={() => setShowOnboardingBanner(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Ocultar banner"
          >
            <X size={18} />
          </button>
          
        </div>
      )}
      
      {/* Sidebar recebe o estado e a função para fechar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Header recebe a função para abrir o menu */}
      <Header 
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      
      {/* Fundo escuro (Overlay) no mobile ao abrir menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main style={{
        // 🔥 NOVO: Adiciona padding-top quando banner está visível
        paddingTop: (!onboarding?.completed && showOnboardingBanner) ? '60px' : '0'
      }}>
        {/* Outlet é onde as páginas (Dashboard, Bots, etc) serão renderizadas */}
        <Outlet />
      </main>
    </div>
  );
}