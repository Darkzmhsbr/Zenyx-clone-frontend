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
  
  // Adicionado estado para o token do Cloudflare
  const [turnstileToken, setTurnstileToken] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Refs para o widget (Igual ao Login.jsx)
  const turnstileRef = useRef(null);
  const widgetId = useRef(null); 

  // 🛡️ Lógica Blindada do Cloudflare (Cópia fiel do Login.jsx que funciona)
  useEffect(() => {
    const initTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        // Se já existir um widget, limpa antes de criar outro
        if (widgetId.current) {
            try {
                window.turnstile.remove(widgetId.current);
            } catch (e) {
                console.warn("Widget cleanup error", e);
            }
        }

        try {
          // Renderiza o widget
          const id = window.turnstile.render(turnstileRef.current, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
            theme: 'dark',
            callback: (token) => {
              console.log('✅ Token gerado:', token);
              setTurnstileToken(token);
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
            'error-callback': () => {
              console.error('❌ Erro Cloudflare');
              setTurnstileToken('');
            }
          });
          widgetId.current = id;
        } catch (error) {
          console.error('Turnstile render error:', error);
        }
      }
    };

    // Tenta iniciar imediatamente se o script já estiver carregado
    if (window.turnstile) {
        initTurnstile();
    } else {
        // Se não, aguarda um pouco (fallback)
        const checkInterval = setInterval(() => {
            if (window.turnstile) {
                clearInterval(checkInterval);
                initTurnstile();
            }
        }, 100);
    }

    // Limpeza ao sair da página
    return () => {
      if (widgetId.current && window.turnstile) {
        try {
            window.turnstile.remove(widgetId.current);
        } catch (e) {}
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

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Erro', 'As senhas não coincidem.', 'error');
      return;
    }

    // 🔒 TRAVA DE SEGURANÇA
    if (!turnstileToken) {
      Swal.fire('Atenção', 'Aguarde a verificação "Não sou um robô".', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Envia o token junto com os dados
      await authService.register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName,
        turnstileToken 
      );
      
      // Auto-login após registro
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
      console.error("Register error:", error);
      const msg = error.response?.data?.detail || 'Erro ao criar conta.';
      Swal.fire('Erro', msg, 'error');
      
      // Reseta o captcha em caso de erro
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

          {/* Container do Cloudflare */}
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