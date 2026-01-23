import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ChevronDown, 
  ChevronRight, 
  PlusCircle, 
  Settings, 
  BookOpen, 
  Zap, 
  LogOut,
  CreditCard,
  Megaphone,
  Users,
  Star,
  ShieldCheck,
  Layers,
  Unlock,
  X,
  TrendingUp, 
  ShoppingBag,
  User, 
  Target,
  Crown,
  Lock // 🔥 NOVO: Ícone de bloqueio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout, onboarding } = useAuth(); // 🔥 NOVO: Importa onboarding
  
  const currentPath = location.pathname;
  
  // Estados dos menus
  const [isBotMenuOpen, setIsBotMenuOpen] = useState(true);
  const [isExtrasMenuOpen, setIsExtrasMenuOpen] = useState(false);
  const [isOffersMenuOpen, setIsOffersMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    window.location.href = '/login';
  };

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path) => {
    return currentPath === path ? 'active' : '';
  };

  // 🔥 NOVO: Função para verificar se menu deve estar bloqueado
  const isLocked = (requiredStep) => {
    if (!onboarding || onboarding.completed) return false; // Se completou, libera tudo
    
    // Define ordem das etapas
    const stepOrder = {
      'botCreated': 1,
      'botConfigured': 2,
      'plansCreated': 3,
      'flowConfigured': 4
    };
    
    const requiredStepNum = stepOrder[requiredStep];
    const currentStepNum = onboarding.currentStep;
    
    // Bloqueia se a etapa requerida é maior que a atual
    return requiredStepNum > currentStepNum;
  };

  // 🔥 NOVO: Renderiza item de menu (com ou sem bloqueio)
  const renderNavItem = (to, icon, label, requiredStep = null, onClick = null) => {
    const locked = requiredStep ? isLocked(requiredStep) : false;
    
    if (locked) {
      return (
        <div className="nav-item locked" title={`Complete a etapa anterior primeiro`}>
          {icon}
          <span>{label}</span>
          <Lock size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
        </div>
      );
    }
    
    return (
      <Link 
        to={to} 
        className={`nav-item ${isActive(to)}`} 
        onClick={() => {
          if (onClick) onClick();
          if (onClose) onClose();
        }}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay para fechar ao clicar fora (Mobile) */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* Logo ou Título */}
          <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(135deg, #c333ff, #7b1fa2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Z
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Zenyx<span style={{color: '#c333ff'}}>GBOT</span></span>
          </div>

          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          
          {/* 🔥 ÁREA MESTRA (SUPER ADMIN) */}
          {(user?.is_superuser || user?.username === 'AdminZenyx') && (
            <div className="admin-section">
              <div className="admin-section-title">
                ÁREA MESTRA
              </div>
              <Link 
                to="/superadmin" 
                className={`nav-item super-admin ${isActive('/superadmin')}`}
                onClick={onClose}
              >
                <Crown size={20} />
                <span>Super Admin</span>
              </Link>
            </div>
          )}

          {/* 🔥 MENU GERAL - Dashboard sempre liberado */}
          {renderNavItem('/dashboard', <LayoutDashboard size={20} />, 'Dashboard')}

          {/* 🔥 Bloqueados até completar Etapa 4 (flowConfigured) */}
          {renderNavItem('/funil', <TrendingUp size={20} />, 'Funil de Vendas', 'flowConfigured')}
          {renderNavItem('/contatos', <Users size={20} />, 'Contatos (Leads)', 'flowConfigured')}

          {/* === GRUPO: MEUS BOTS === */}
          <div className="nav-group">
            <div 
              className={`nav-item group-header ${isBotMenuOpen ? 'open' : ''}`}
              onClick={() => setIsBotMenuOpen(!isBotMenuOpen)}
            >
              <div className="group-label">
                <MessageSquare size={20} />
                <span>Meus Bots</span>
              </div>
              {isBotMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            
            {isBotMenuOpen && (
              <div className="nav-subitems">
                {/* 🔥 Gerenciar Bots - Bloqueado até criar primeiro bot */}
                {renderNavItem('/bots', <Zap size={18} />, 'Gerenciar Bots', 'botCreated')}
                
                {/* 🔥 Novo Bot - Sempre liberado (é o passo 1!) */}
                {renderNavItem('/bots/new', <PlusCircle size={18} />, 'Novo Bot')}
              </div>
            )}
          </div>

          {/* 🔥 Flow - É o PASSO 4, só libera após criar planos */}
          {renderNavItem('/flow', <Layers size={20} />, 'Flow Chat (Fluxo)', 'plansCreated')}

          {/* 🔥 Remarketing - Bloqueado até finalizar onboarding */}
          {renderNavItem('/remarketing', <Megaphone size={20} />, 'Remarketing', 'flowConfigured')}

          {/* SUBMENU: PLANOS E OFERTAS */}
          <div className="nav-group">
            <div 
              className={`nav-item-header ${isOffersMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsOffersMenuOpen(!isOffersMenuOpen)}
            >
              <div className="nav-item-header-content">
                <CreditCard size={20} />
                <span>Planos e Ofertas</span>
              </div>
              {isOffersMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {isOffersMenuOpen && (
              <div className="nav-subitems">
                {/* 🔥 Planos - É o PASSO 3, só libera após configurar bot */}
                {renderNavItem('/planos', <Star size={18} />, 'Planos de Acesso', 'botConfigured')}
                
                {/* 🔥 Order Bump - Bloqueado até finalizar onboarding */}
                {renderNavItem('/ofertas/order-bump', <ShoppingBag size={18} />, 'Order Bump', 'flowConfigured')}
              </div>
            )}
          </div>

          {/* SUBMENU: EXTRAS */}
          <div className="nav-group">
            <div 
              className={`nav-item-header ${isExtrasMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsExtrasMenuOpen(!isExtrasMenuOpen)}
            >
              <div className="nav-item-header-content">
                <BookOpen size={20} />
                <span>Extras</span>
              </div>
              {isExtrasMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {isExtrasMenuOpen && (
              <div className="nav-subitems">
                {/* 🔥 Todos bloqueados até finalizar onboarding */}
                {renderNavItem('/tutoriais', <BookOpen size={18} />, 'Tutoriais', 'flowConfigured')}
                {renderNavItem('/funcoes/admins', <ShieldCheck size={18} />, 'Administradores', 'flowConfigured')}
                {renderNavItem('/funcoes/grupos', <Layers size={18} />, 'Grupos e Canais', 'flowConfigured')}
                {renderNavItem('/funcoes/free', <Unlock size={18} />, 'Canal Free', 'flowConfigured')}
                {renderNavItem('/rastreamento', <Target size={18} />, 'Rastreamento', 'flowConfigured')}
              </div>
            )}
          </div>
          
          <div className="divider"></div>

          {/* 🔥 Integrações e Perfil - Bloqueados até finalizar */}
          {renderNavItem('/integracoes', <Settings size={20} />, 'Integrações', 'flowConfigured')}
          {renderNavItem('/perfil', <User size={20} />, 'Meu Perfil', 'flowConfigured')}

          <div className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </div>

        </nav>
      </div>
    </>
  );
}