import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { authService } from '../services/api'; 
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Login.css';

export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  
  const [turnstileToken, setTurnstileToken] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const turnstileRef = useRef(null);
  const widgetId = useRef(null); 

  // 🔍 DEBUG: Verificar se a chave está lendo
  useEffect(() => {
    const key = import.meta.env.VITE_TURNSTILE_SITEKEY;
    console.log("🔑 [DEBUG] Chave Cloudflare lida:", key ? "OK (Inicia com " + key.substring(0,5) + ")" : "VAZIA/UNDEFINED");
    if (!key) {
        Swal.fire('Erro de Configuração', 'A Chave do Cloudflare (VITE_TURNSTILE_SITEKEY) não foi encontrada no .env', 'error');
    }
  }, []);

  // 🛡️ Lógica de Renderização do Widget com Injeção de Script
  useEffect(() => {
    // Função para renderizar
    const renderWidget = () => {
        if (!turnstileRef.current) return;
        
        // Limpa anterior se existir
        if (widgetId.current) {
            try { window.turnstile.remove(widgetId.current); } catch(e){}
        }

        try {
            console.log("🔄 [DEBUG] Tentando renderizar widget Cloudflare...");
            const id = window.turnstile.render(turnstileRef.current, {
                sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
                theme: 'dark',
                callback: (token) => {
                    console.log('✅ [DEBUG] Token capturado com sucesso:', token);
                    setTurnstileToken(token);
                },
                'expired-callback': () => {
                    console.warn('⚠️ [DEBUG] Token expirou');
                    setTurnstileToken('');
                },
                'error-callback': () => {
                    console.error('❌ [DEBUG] Erro interno do Cloudflare Widget');
                    setTurnstileToken('');
                }
            });
            widgetId.current = id;
        } catch (err) {
            console.error("❌ [DEBUG] Falha fatal ao renderizar widget:", err);
        }
    };

    // Verifica se o script já existe ou precisa injetar
    if (!window.turnstile) {
        console.log("📥 [DEBUG] Script Cloudflare não detectado. Injetando...");
        const script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log("📥 [DEBUG] Script carregado via Injeção.");
            renderWidget();
        };
        document.body.appendChild(script);
    } else {
        // Se já existe, renderiza direto
        console.log("⚡ [DEBUG] Script Cloudflare já existente. Renderizando...");
        renderWidget();
    }

    // Cleanup
    return () => {
        if (widgetId.current && window.turnstile) {
            try { window.turnstile.remove(widgetId.current); } catch(e){}
            widgetId.current = null;
        }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🖱️ [DEBUG] Botão Clicado. Iniciando validação...");

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Erro', 'As senhas não coincidem.', 'error');
      return;
    }

    // 🔒 TRAVA DE SEGURANÇA COM LOG
    if (!turnstileToken) {
      console.warn("⛔ [DEBUG] Bloqueado: Token Turnstile está vazio.");
      Swal.fire({
        title: 'Verificação Necessária',
        text: 'Por favor, aguarde o "check" verde do robô.',
        icon: 'warning',
        confirmButtonColor: '#c333ff'
      });
      return;
    }

    setLoading(true);
    console.log("🚀 [DEBUG] Enviando dados para API...");

    try {
      await authService.register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName,
        turnstileToken 
      );
      
      console.log("✅ [DEBUG] Registro sucesso. Tentando auto-login...");
      
      try {
        await login(formData.email, formData.password);
        Swal.fire({
          icon: 'success',
          title: 'Conta Criada!',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/dashboard');
        });
      } catch (loginError) {
        navigate('/login');
      }

    } catch (error) {
      console.error("❌ [DEBUG] Erro na API de Registro:", error);
      const msg = error.response?.data?.detail || 'Erro ao criar conta.';
      Swal.fire('Erro', msg, 'error');
      
      if (window.turnstile && widgetId.current) {
        window.turnstile.reset(widgetId.current);
        setTurnstileToken('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <UserPlus size={32} color="white" />
            </div>
          </div>
          <h2>Zenyx</h2>
          <p>Criar Nova Conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* USUÁRIO */}
          <div className="input-group-login">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              name="username"
              placeholder="Usuário" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* NOME COMPLETO */}
          <div className="input-group-login">
             <User size={20} className="input-icon" />
            <input 
              type="text" 
              name="fullName"
              placeholder="Nome Completo (opcional)" 
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="input-group-login">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              name="email"
              placeholder="Email *" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* SENHA */}
          <div className="input-group-login">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              name="password"
              placeholder="Senha *" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="input-group-login">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirmar Senha *" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🛡️ WIDGET CLOUDFLARE TURNSTILE */}
          {/* Renderiza um container vazio com altura fixa para evitar layout shift */}
          <div 
            ref={turnstileRef} 
            className="turnstile-container" 
            style={{ minHeight: '65px', margin: '15px 0', display: 'flex', justifyContent: 'center' }}
          ></div>

          <Button 
            type="submit" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'} <ArrowRight size={18} />
          </Button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}