import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já tem token JWT salvo
    const token = localStorage.getItem('zenyx_token');
    const savedUser = localStorage.getItem('zenyx_admin_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem('zenyx_token');
        localStorage.removeItem('zenyx_admin_user');
      }
    }
    setLoading(false);
  }, []);

  // ============================================================
  // 🔐 LOGIN COM TURNSTILE (✅ CORRIGIDO)
  // ============================================================
  const login = async (username, password, turnstileToken) => {
    try {
      console.log("🔐 Iniciando login...");
      console.log("👤 Username:", username);
      console.log("🛡️ Turnstile Token:", turnstileToken ? "✅ Presente" : "❌ Ausente");
      
      // ✅ CORRIGIDO: Passa o turnstileToken para o authService
      const data = await authService.login(username, password, turnstileToken);
      
      const { access_token, user_id, username: userName } = data;

      // Salva o token JWT
      localStorage.setItem('zenyx_token', access_token);
      
      // Cria objeto do usuário
      const userData = {
        id: user_id,
        username: userName,
        name: userName,
        role: 'admin',
        allowed_bots: []
      };

      // Salva dados do usuário
      localStorage.setItem('zenyx_admin_user', JSON.stringify(userData));
      
      // Atualiza estado
      setUser(userData);
      
      console.log("✅ Login realizado:", userName);
      return true;
      
    } catch (error) {
      console.error("❌ Erro no login:", error);
      
      // Se der 401 (credenciais inválidas)
      if (error.response?.status === 401) {
        console.error("❌ Credenciais inválidas");
        return false;
      }
      
      // Se der 400 (Turnstile falhou)
      if (error.response?.status === 400) {
        console.error("❌ Verificação de segurança falhou");
        return false;
      }
      
      // Se der erro de rede
      if (!error.response) {
        console.error("❌ Erro de conexão com o servidor");
      }
      
      return false;
    }
  };

  // ============================================================
  // 🚪 FUNÇÃO LOGOUT
  // ============================================================
  const logout = () => {
    console.log("🚪 Fazendo logout...");
    
    // Limpa estado
    setUser(null);
    
    // Limpa localStorage
    localStorage.removeItem('zenyx_token');
    localStorage.removeItem('zenyx_admin_user');
    localStorage.removeItem('zenyx_selected_bot');
    localStorage.removeItem('zenyx_theme');
    
    // Força reload da página para garantir limpeza total
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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