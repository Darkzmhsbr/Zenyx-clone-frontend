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
  Crown, // 👑 Ícone do Super Admin
  Send // 🚀 Ícone do Disparo Automático
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout, hasBot } = useAuth();
  
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

  const isActive = (path) => {
    return currentPath === path ? 'active' : '';
  };

  // 🛡️ VERIFICA SE É SUPER ADMIN
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.is_superuser;

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
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
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
              Zenyx<span style={{color: '#c333ff'}}>GBOT</span>
            </span>
          </div>

          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          
          {/* 🔥 ÁREA MESTRA (SUPER ADMIN) 🔥 */}
          {(isSuperAdmin || user?.username === 'AdminZenyx') && (
            <div className="admin-section" style={{ marginBottom: '15px' }}>
              <div className="menu-label" style={{ color: '#f59e0b', marginBottom: '5px' }}>
                ADMINISTRAÇÃO
              </div>
              <Link 
                to="/superadmin" 
                className={`nav-item super-admin-link ${isActive('/superadmin')}`}
                onClick={onClose}
                style={{ color: '#f59e0b' }}
              >
                <Crown size={20} />
                <span>Painel Master</span>
              </Link>
              <div className="divider"></div>
            </div>
          )}

          {/* MENU GERAL */}
          <Link 
            to={hasBot ? "/dashboard" : "#"} 
            className={`nav-item ${isActive('/dashboard')} ${!hasBot ? 'locked-nav' : ''}`} 
            onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
            style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link 
            to={hasBot ? "/funil" : "#"} 
            className={`nav-item ${isActive('/funil')} ${!hasBot ? 'locked-nav' : ''}`} 
            onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
            style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <TrendingUp size={20} />
            <span>Funil de Vendas</span>
          </Link>

          <Link 
            to={hasBot ? "/contatos" : "#"} 
            className={`nav-item ${isActive('/contatos')} ${!hasBot ? 'locked-nav' : ''}`} 
            onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
            style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <Users size={20} />
            <span>Contatos (Leads)</span>
          </Link>

          {/* === GRUPO: MEUS BOTS === */}
          <div className="nav-group">
            <div 
              className={`nav-item has-submenu ${isBotMenuOpen ? 'open' : ''}`}
              onClick={() => setIsBotMenuOpen(!isBotMenuOpen)}
            >
              <div className="nav-item-content" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquare size={20} />
                <span>Meus Bots</span>
              </div>
              {isBotMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            
            {isBotMenuOpen && (
              <div className="submenu">
                <Link 
                  to={hasBot ? "/bots" : "#"} 
                  className={`nav-item ${isActive('/bots')} ${!hasBot ? 'locked-nav' : ''}`} 
                  onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
                  style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <Zap size={18} /> <span>Gerenciar Bots</span>
                </Link>
                <Link to="/bots/new" className={`nav-item ${isActive('/bots/new')}`} onClick={onClose}>
                  <PlusCircle size={18} /> <span>Novo Bot</span>
                </Link>
              </div>
            )}
          </div>

          <Link 
            to={hasBot ? "/flow" : "#"} 
            className={`nav-item ${isActive('/flow')} ${!hasBot ? 'locked-nav' : ''}`} 
            onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
            style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <Layers size={20} />
            <span>Flow Chat (Fluxo)</span>
          </Link>

          <Link 
            to={hasBot ? "/remarketing" : "#"} 
            className={`nav-item ${isActive('/remarketing')} ${!hasBot ? 'locked-nav' : ''}`} 
            onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
            style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <Megaphone size={20} />
            <span>Remarketing</span>
          </Link>

          {/* SUBMENU: PLANOS E OFERTAS */}
          <div className="nav-group" style={!hasBot ? { opacity: 0.5 } : {}}>
            <div 
              className={`nav-item has-submenu ${isOffersMenuOpen ? 'open' : ''}`} 
              onClick={() => hasBot && setIsOffersMenuOpen(!isOffersMenuOpen)}
            >
              <div className="nav-item-content" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard size={20} />
                <span>Planos e Ofertas</span>
              </div>
              {isOffersMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {hasBot && isOffersMenuOpen && (
              <div className="submenu">
                <Link to="/planos" className={`nav-item ${isActive('/planos')}`} onClick={onClose}>
                  <Star size={18} /> <span>Planos de Acesso</span>
                </Link>
                <Link to="/ofertas/order-bump" className={`nav-item ${isActive('/ofertas/order-bump')}`} onClick={onClose}>
                  <ShoppingBag size={18} /> <span>Order Bump</span>
                </Link>
              </div>
            )}
          </div>

          {/* SUBMENU: EXTRAS - 🆕 COM DISPARO AUTOMÁTICO */}
          <div className="nav-group" style={!hasBot ? { opacity: 0.5 } : {}}>
            <div 
              className={`nav-item has-submenu ${isExtrasMenuOpen ? 'open' : ''}`} 
              onClick={() => hasBot && setIsExtrasMenuOpen(!isExtrasMenuOpen)}
            >
              <div className="nav-item-content" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={20} />
                <span>Extras</span>
              </div>
              {isExtrasMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {hasBot && isExtrasMenuOpen && (
              <div className="submenu">
                <Link to="/tutorial" className={`nav-item ${isActive('/tutorial')}`} onClick={onClose}>
                  <BookOpen size={18} /> <span>Tutoriais</span>
                </Link>

                <Link to="/funcoes/admins" className={`nav-item ${isActive('/funcoes/admins')}`} onClick={onClose}>
                  <ShieldCheck size={18} /> <span>Administradores</span>
                </Link>

                <Link to="/funcoes/grupos" className={`nav-item ${isActive('/funcoes/grupos')}`} onClick={onClose}>
                  <Layers size={18} /> <span>Grupos e Canais</span>
                </Link>

                <Link to="/funcoes/free" className={`nav-item ${isActive('/funcoes/free')}`} onClick={onClose}>
                  <Unlock size={18} /> <span>Canal Free</span>
                </Link>

                <Link to="/rastreamento" className={`nav-item ${isActive('/rastreamento')}`} onClick={onClose}>
                  <Target size={18} /> <span>Rastreamento</span>
                </Link>

                {/* 🆕 NOVA ROTA: DISPARO AUTOMÁTICO */}
                <Link 
                  to="/extras/auto-remarketing" 
                  className={`nav-item ${isActive('/extras/auto-remarketing')}`} 
                  onClick={onClose}
                >
                  <Send size={18} /> <span>Disparo Automático</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="divider"></div>

          <Link 
            to={hasBot ? "/integracoes" : "#"} 
            className={`nav-item ${isActive('/integracoes')} ${!hasBot ? 'locked-nav' : ''}`} 
            onClick={(e) => !hasBot ? e.preventDefault() : onClose()}
            style={!hasBot ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <Settings size={20} />
            <span>Integrações</span>
          </Link>

          <Link to="/perfil" className={`nav-item ${isActive('/perfil')}`} onClick={onClose}>
            <User size={20} />
            <span>Meu Perfil</span>
          </Link>

          <div className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </div>

        </nav>
      </div>
    </>
  );
}