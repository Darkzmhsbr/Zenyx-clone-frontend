import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🎯 NOVO: Estado de Onboarding
  const [onboarding, setOnboarding] = useState({
    isComplete: false,
    currentStep: 1,
    steps: {
      botCreated: false,      // Etapa 1: Criar bot
      botConfigured: false,   // Etapa 2: Configurar bot
      plansCreated: false,    // Etapa 3: Criar planos
      flowConfigured: false   // Etapa 4: Configurar fluxo
    }
  });

  useEffect(() => {
    // Verifica se já tem token JWT salvo
    const token = localStorage.getItem('zenyx_token');
    const savedUser = localStorage.getItem('zenyx_admin_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Configura o token no axios globalmente
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem('zenyx_token');
        localStorage.removeItem('zenyx_admin_user');
      }
    }
    
    // 🎯 NOVO: Carrega progresso do onboarding
    loadOnboardingProgress();
    
    setLoading(false);
  }, []);

  // 🎯 NOVO: Carrega progresso salvo do onboarding
  const loadOnboardingProgress = () => {
    try {
      const saved = localStorage.getItem('zenyx_onboarding');
      if (saved) {
        const progress = JSON.parse(saved);
        setOnboarding(progress);
      }
    } catch (error) {
      console.error("Erro ao carregar onboarding:", error);
    }
  };

  // 🎯 NOVO: Salva progresso do onboarding
  const saveOnboardingProgress = (newProgress) => {
    try {
      localStorage.setItem('zenyx_onboarding', JSON.stringify(newProgress));
      setOnboarding(newProgress);
    } catch (error) {
      console.error("Erro ao salvar onboarding:", error);
    }
  };

  // 🎯 NOVO: Marca etapa como completa
  const completeOnboardingStep = (step) => {
    const newSteps = { ...onboarding.steps };
    let newCurrentStep = onboarding.currentStep;
    let isComplete = false;

    switch(step) {
      case 'botCreated':
        newSteps.botCreated = true;
        newCurrentStep = 2;
        break;
      case 'botConfigured':
        newSteps.botConfigured = true;
        newCurrentStep = 3;
        break;
      case 'plansCreated':
        newSteps.plansCreated = true;
        newCurrentStep = 4;
        break;
      case 'flowConfigured':
        newSteps.flowConfigured = true;
        isComplete = true;
        break;
      default:
        break;
    }

    const newProgress = {
      isComplete,
      currentStep: isComplete ? 5 : newCurrentStep,
      steps: newSteps
    };

    saveOnboardingProgress(newProgress);
    
    console.log(`✅ Onboarding: ${step} completo! Próximo passo: ${newCurrentStep}`);
  };

  // 🎯 NOVO: Reseta onboarding (útil para testes)
  const resetOnboarding = () => {
    const initialState = {
      isComplete: false,
      currentStep: 1,
      steps: {
        botCreated: false,
        botConfigured: false,
        plansCreated: false,
        flowConfigured: false
      }
    };
    saveOnboardingProgress(initialState);
  };

  // ============================================================
  // 🔐 LOGIN COM API REAL E TURNSTILE
  // ============================================================
  const login = async (username, password, turnstileToken) => {
    try {
      const API_URL = 'https://zenyx-gbs-testesv1-production.up.railway.app';
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username: username,
        password: password,
        turnstile_token: turnstileToken
      });

      const { access_token, user_id, username: userName } = response.data;

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
      
      // Configura token no axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Atualiza estado
      setUser(userData);
      
      // 🎯 NOVO: Carrega onboarding após login
      loadOnboardingProgress();
      
      console.log("✅ Login realizado:", userName);
      return true;
      
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error; 
    }
  };

  // ============================================================
  // 🔥 FUNÇÃO LOGOUT
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
    // 🎯 NÃO limpa onboarding no logout (mantém progresso)
    
    // Remove token do axios
    delete axios.defaults.headers.common['Authorization'];
    
    // Força reload da página para garantir limpeza total
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      // 🎯 NOVO: Expõe funções e estado de onboarding
      onboarding,
      completeOnboardingStep,
      resetOnboarding
    }}>
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