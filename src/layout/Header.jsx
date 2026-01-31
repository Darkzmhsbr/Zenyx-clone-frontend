import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBot } from '../context/BotContext';
import { notificationService } from '../services/api';
import { 
  Bot, ChevronDown, Check, Bell, Moon, Sun, Menu, User, Settings, LogOut, 
  Info, AlertTriangle, XCircle, CheckCircle 
} from 'lucide-react'; 
import './Header.css'; 

export function Header({ onToggleMenu }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { bots, selectedBot, changeBot } = useBot();
  
  const [isBotMenuOpen, setIsBotMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Estados de Notificação
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs para fechar ao clicar fora
  const notifRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('zenyx_theme') || 'dark';
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  // Busca notificações (Polling a cada 30s)
  useEffect(() => {
    if (!user) return;

    const fetchNotifs = async () => {
      try {
        const data = await notificationService.getAll();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('zenyx_theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (notifId) => {
    try {
      await notificationService.markRead(notifId);
      // Atualiza localmente
      setNotifications(prev => prev.map(n => 
        n.id === notifId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Erro ao marcar lida", e);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Erro ao marcar todas", e);
    }
  };

  // 🛡️ FUNÇÃO VISUAL PARA OS CARGOS (BADGES)
  const getRoleBadge = (role) => {
    // Se não tiver role definida ou for USER, não mostra nada (ou mostra Cliente)
    if (!role || role === 'USER') return null;

    let label = role;
    let color = '#6c757d'; // Cinza (padrão)
    let bg = 'rgba(108, 117, 125, 0.2)';

    if (role === 'SUPER_ADMIN') {
      label = 'MASTER';
      color = '#ef4444'; // Vermelho
      bg = 'rgba(239, 68, 68, 0.2)';
    } else if (role === 'ADMIN') {
      label = 'SUPORTE';
      color = '#f59e0b'; // Laranja
      bg = 'rgba(245, 158, 11, 0.2)';
    } else if (role === 'PARTNER') {
      label = 'PARCEIRO';
      color = '#3b82f6'; // Azul
      bg = 'rgba(59, 130, 246, 0.2)';
    }

    return (
      <span style={{
        fontSize: '10px',
        fontWeight: 'bold',
        color: color,
        backgroundColor: bg,
        padding: '2px 6px',
        borderRadius: '4px',
        marginLeft: '8px',
        verticalAlign: 'middle',
        letterSpacing: '0.5px'
      }}>
        {label}
      </span>
    );
  };

  return (
    <header className="header">
      {/* Esquerda: Botão Menu + Seletor de Bots */}
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleMenu}>
          <Menu size={24} />
        </button>

        <div className="bot-selector-wrapper">
          <div 
            className="bot-selector-trigger"
            onClick={() => setIsBotMenuOpen(!isBotMenuOpen)}
          >
            <div className="bot-icon-circle">
              <Bot size={20} />
            </div>
            <div className="bot-info">
              <span className="bot-label">Bot Selecionado</span>
              <span className="bot-name">
                {selectedBot ? selectedBot.nome : 'Selecione um Bot'}
              </span>
            </div>
            <ChevronDown size={16} className={`chevron ${isBotMenuOpen ? 'open' : ''}`} />
          </div>

          {isBotMenuOpen && (
            <div className="bot-dropdown-menu">
              {bots.length > 0 ? (
                bots.map(bot => (
                  <div 
                    key={bot.id} 
                    className={`bot-option ${selectedBot?.id === bot.id ? 'active' : ''}`}
                    onClick={() => {
                      changeBot(bot);
                      setIsBotMenuOpen(false);
                    }}
                  >
                    <div className="bot-option-icon">
                      <Bot size={16} />
                    </div>
                    <span>{bot.nome}</span>
                    {selectedBot?.id === bot.id && <Check size={16} className="check-icon" />}
                  </div>
                ))
              ) : (
                <div className="no-bots">Nenhum bot encontrado</div>
              )}
              
              <div className="bot-dropdown-footer" onClick={() => navigate('/bots/new')}>
                + Criar Novo Bot
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direita: Ações, Notificações e Perfil */}
      <div className="header-right">
        
        {/* Toggle Tema */}
        <button className="icon-btn theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notificações */}
        <div className="notification-wrapper" ref={notifRef}>
          <button 
            className="icon-btn notification-btn"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileMenuOpen(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {isNotificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notificações</h3>
                {unreadCount > 0 && (
                  <span className="mark-all-read" onClick={markAllRead}>
                    Marcar todas lidas
                  </span>
                )}
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="notif-icon">
                        {notif.type === 'alert' ? <AlertTriangle size={16} color="#ef4444" /> :
                         notif.type === 'success' ? <CheckCircle size={16} color="#22c55e" /> :
                         <Info size={16} color="#3b82f6" />}
                      </div>
                      <div className="notif-content">
                        <p>{notif.message}</p>
                        <span className="notif-time">
                          {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <Bell size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
                    <p>Nenhuma notificação</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perfil */}
        <div className="profile-dropdown-wrapper">
          <div 
            className="user-avatar"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationOpen(false);
            }}
          >
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
          </div>

          {isProfileMenuOpen && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <div className="profile-avatar-large">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="profile-name">
                  {user?.name || 'Administrador'}
                  {/* 🔥 BADGE AQUI DENTRO TAMBÉM */}
                  {getRoleBadge(user?.role)}
                </div>
                <div className="profile-email">{user?.username}</div>
              </div>
              
              <div className="profile-dropdown-item" onClick={() => navigate('/perfil')}>
                <User size={16} /> <span>Meu Perfil</span>
              </div>
              <div className="profile-dropdown-item" onClick={() => navigate('/config')}>
                <Settings size={16} /> <span>Configurações</span>
              </div>
              
              {/* Opção exclusiva para Super Admin ver no menu */}
              {(user?.role === 'SUPER_ADMIN' || user?.is_superuser) && (
                <div className="profile-dropdown-item" onClick={() => navigate('/superadmin')}>
                   <span>👑 Painel Master</span>
                </div>
              )}

              <div className="profile-dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} /> <span>Sair do Sistema</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}