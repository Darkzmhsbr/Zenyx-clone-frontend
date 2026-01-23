import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Mail, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { authService } from '../services/api';
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

  // 🛡️ Carrega o Script do Turnstile e Renderiza o Widget
  useEffect(() => {
    const initTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        if (widgetId.current) window.turnstile.remove(widgetId.current);

        try {
          const id = window.turnstile.render(turnstileRef.current, {
            sitekey: '0x4AAAAAACOaNAV9wTIXZkZy',
            theme: 'dark',
            callback: (token) => {
              setTurnstileToken(token);
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
            'error-callback': () => {
              console.error('❌ Erro no widget Turnstile');
            }
          });
          widgetId.current = id;
        } catch (e) {
          console.error("Erro ao renderizar Turnstile:", e);
        }
      }
    };

    if (!document.getElementById('cf-turnstile')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = initTurnstile;
      document.body.appendChild(script);
    } else {
      setTimeout(initTurnstile, 100);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.username || !formData.email || !formData.password) {
      Swal.fire({
        title: 'Campos Obrigatórios',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        icon: 'warning',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Senhas Não Coincidem',
        text: 'As senhas digitadas não são iguais.',
        icon: 'error',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        title: 'Senha Fraca',
        text: 'A senha deve ter pelo menos 6 caracteres.',
        icon: 'warning',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
      return;
    }

    // 🛡️ Validação do Turnstile
    if (!turnstileToken) {
      Swal.fire({
        title: 'Verificação Necessária',
        text: 'Por favor, confirme que você é humano clicando na caixa de verificação.',
        icon: 'warning',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ REGISTRAR O USUÁRIO
      const response = await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName || formData.username,
        turnstileToken
      );

      console.log("✅ Cadastro realizado:", response);

      // 2️⃣ FAZER LOGIN AUTOMÁTICO APÓS REGISTRO
      await login(formData.username, formData.password, turnstileToken);

      // 3️⃣ MOSTRAR MENSAGEM DE SUCESSO
      Swal.fire({
        title: 'Bem-vindo ao Zenyx! 🎉',
        html: `
          <p style="margin-bottom: 15px;">Sua conta foi criada com sucesso!</p>
          <p style="color: #888; font-size: 0.9rem;">Vamos configurar seu primeiro bot em 4 passos simples:</p>
          <div style="text-align: left; margin: 20px auto; max-width: 300px;">
            <p>✅ 1. Criar Bot</p>
            <p>⚙️ 2. Configurar Bot</p>
            <p>💰 3. Criar Planos</p>
            <p>💬 4. Configurar Fluxo</p>
          </div>
        `,
        icon: 'success',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff',
        confirmButtonText: 'Começar Passo 1',
        timer: 5000,
        timerProgressBar: true
      }).then(() => {
        // 4️⃣ 🔥 REDIRECIONA PARA ONBOARDING (PASSO 1: CRIAR BOT)
        navigate('/bots/new');
      });

    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.detail || 'Usuário ou email já cadastrado.';
      } else if (!error.response) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      Swal.fire({
        title: 'Erro no Cadastro',
        text: errorMessage,
        icon: 'error',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });

      // Reseta o Turnstile
      if (window.turnstile && widgetId.current) {
        window.turnstile.reset(widgetId.current);
      }
      setTurnstileToken('');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-glow">Zenyx</div>
          <p>Criar Nova Conta</p>
        </div>
        
        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group-login">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              name="username"
              placeholder="Usuário *" 
              value={formData.username}
              onChange={handleChange}
              required
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
            <UserPlus size={20} className="input-icon" />
            <input 
              type="text" 
              name="fullName"
              placeholder="Nome Completo (opcional)" 
              value={formData.fullName}
              onChange={handleChange}
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

          {/* 🛡️ WIDGET CLOUDFLARE TURNSTILE */}
          <div 
            ref={turnstileRef} 
            style={{ 
              minHeight: '65px',
              margin: '15px 0', 
              display: 'flex', 
              justifyContent: 'center' 
            }}
          />

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