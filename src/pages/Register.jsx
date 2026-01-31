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

  // 🛡️ Lógica Simplificada: O script já está no index.html
  useEffect(() => {
    // Função para renderizar
    const renderWidget = () => {
        if (window.turnstile && turnstileRef.current) {
            // Limpa se já existir
            if (widgetId.current) {
                try { window.turnstile.remove(widgetId.current); } catch(e){}
            }

            try {
                const id = window.turnstile.render(turnstileRef.current, {
                    sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY, // Tenha certeza que esta variável está no .env da Vercel
                    theme: 'dark',
                    callback: (token) => {
                        console.log('✅ Token Capturado:', token);
                        setTurnstileToken(token);
                    },
                    'expired-callback': () => setTurnstileToken(''),
                    'error-callback': () => {
                        console.error('❌ Erro Cloudflare');
                        setTurnstileToken('');
                    }
                });
                widgetId.current = id;
            } catch (err) {
                console.error("Erro ao renderizar:", err);
            }
        }
    };

    // Tenta renderizar imediatamente
    if (window.turnstile) {
        renderWidget();
    } else {
        // Se por acaso o script do index.html atrasar 1ms
        const check = setInterval(() => {
            if (window.turnstile) {
                clearInterval(check);
                renderWidget();
            }
        }, 100);
    }

    return () => {
        if (widgetId.current && window.turnstile) {
            try { window.turnstile.remove(widgetId.current); } catch(e){}
        }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Erro', 'As senhas não coincidem.', 'error');
      return;
    }

    // TRAVA VISUAL
    if (!turnstileToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Verificação Necessária',
        text: 'Aguarde o robô validar (Check Verde). Se não aparecer, recarregue a página.'
      });
      return;
    }

    setLoading(true);

    try {
      await authService.register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName,
        turnstileToken 
      );
      
      try {
        await login(formData.email, formData.password);
        Swal.fire({
          icon: 'success', title: 'Sucesso!', timer: 1500, showConfirmButton: false
        }).then(() => navigate('/dashboard'));
      } catch (loginError) {
        navigate('/login');
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Erro ao criar conta.';
      Swal.fire('Erro', msg, 'error');
      // Reseta widget
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
            <div className="logo-icon"><UserPlus size={32} color="white" /></div>
          </div>
          <h2>Zenyx</h2>
          <p>Criar Nova Conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-login">
            <User size={20} className="input-icon" />
            <input type="text" name="username" placeholder="Usuário" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="input-group-login">
             <User size={20} className="input-icon" />
            <input type="text" name="fullName" placeholder="Nome Completo" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="input-group-login">
            <Mail size={20} className="input-icon" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group-login">
            <Lock size={20} className="input-icon" />
            <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group-login">
            <Lock size={20} className="input-icon" />
            <input type="password" name="confirmPassword" placeholder="Confirmar Senha" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          {/* ÁREA DO CAPTCHA - Com estilo explícito para garantir visibilidade */}
          <div 
            ref={turnstileRef} 
            className="turnstile-wrapper"
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                margin: '20px 0', 
                minHeight: '65px',
                width: '100%' 
            }}
          >
            {/* O widget será desenhado aqui */}
          </div>

          <Button type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processando...' : 'Criar Conta'} <ArrowRight size={18} />
          </Button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
              Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Fazer Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}