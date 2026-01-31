import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/api'; // Importando o service centralizado

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // 🆕 ESTADO DE ONBOARDING: Adicionado para controlar a trava do menu
  const [hasBot, setHasBot] = useState(false);

  useEffect(() => {
    // Verifica se já tem token JWT salvo
    const token = localStorage.getItem('zenyx_token');
    const savedUser = localStorage.getItem('zenyx_admin_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        
        // 🛡️ GARANTIA DE ROLE: Se o usuário salvo for antigo e não tiver role, define como USER
        if (!userData.role) userData.role = 'USER';
        
        setUser(userData);
        
        // Configura o token no axios globalmente assim que carrega
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 🛡️ Sincroniza o status do bot ao recarregar a página
        // Verifica se o token ainda é válido chamando /me
        authService.getMe()
          .then(response => {
            setHasBot(response.has_bots || false);
            // Opcional: Atualizar a role vinda do backend para garantir sincronia
            if (response.role && response.role !== userData.role) {
                const updatedUser = { ...userData, role: response.role };
                setUser(updatedUser);
                localStorage.setItem('zenyx_admin_user', JSON.stringify(updatedUser));
            }
          })
          .catch(err => {
            console.error("Erro ao validar sessão:", err);
            // Se der erro (ex: 401), limpa tudo
            logout();
          });

      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem('zenyx_token');
        localStorage.removeItem('zenyx_admin_user');
      }
    }
    setLoading(false);
  }, []);

  // ============================================================
  // 🔑 LOGIN CENTRALIZADO (COM TURNSTILE E ROLES)
  // ============================================================
  const login = async (username, password, turnstileToken) => {
    try {
      console.log("🔐 Iniciando login via AuthContext...");

      // 🔥 CHAMA O SERVICE (api.js)
      // Isso garante que a URL correta (do .env) seja usada e o token seja enviado
      const data = await authService.login(username, password, turnstileToken);

      // O authService.login já salva no localStorage, aqui atualizamos o ESTADO do React
      
      const userData = {
        id: data.user_id,
        username: data.username,
        name: data.username,
        // 🆕 CAPTURA A ROLE VINDA DO BACKEND
        role: data.role || 'USER', 
        allowed_bots: [] 
      };

      // Configura o header do axios para as próximas requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      // Atualiza os estados da aplicação
      setUser(userData);
      setHasBot(data.has_bots || false); // Libera ou bloqueia o menu
      
      // Atualiza o localStorage com a role nova
      localStorage.setItem('zenyx_admin_user', JSON.stringify(userData));

      console.log(`✅ Login realizado: ${data.username} [${userData.role}]`);
      return true;
      
    } catch (error) {
      console.error("❌ Erro no login (AuthContext):", error);
      throw error; // Joga o erro para a tela de Login exibir o alerta
    }
  };

  // ============================================================
  // 🔥 FUNÇÃO LOGOUT
  // ============================================================
  const logout = () => {
    console.log("🚪 Fazendo logout...");
    
    // Limpa estado do React
    setUser(null);
    setHasBot(false);
    
    // Limpa localStorage
    localStorage.removeItem('zenyx_token');
    localStorage.removeItem('zenyx_admin_user');
    localStorage.removeItem('zenyx_selected_bot');
    localStorage.removeItem('zenyx_theme');
    
    // Remove token do axios global
    delete axios.defaults.headers.common['Authorization'];
    
    // Força reload da página para garantir limpeza total e redirecionar
    window.location.href = '/login';
  };

  // 🆕 Função para atualizar o status do bot externamente (ex: ao criar o primeiro bot)
  const updateHasBotStatus = (status) => {
    setHasBot(status);
  };

  // 🛡️ HELPER: Verifica se o usuário tem permissão
  const checkRole = (allowedRoles) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true; // Super Admin pode tudo
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasBot, updateHasBotStatus, checkRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}