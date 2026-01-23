import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';
import './Login.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(''); // Estado para o token
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const turnstileRef = useRef(null);

  // 🛡️ Carrega o Script do Turnstile e Renderiza o Widget
  useEffect(() => {
    const scriptId = 'cloudflare-turnstile-script';
    
    // Função para renderizar o widget
    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: '0x4AAAAAACOaNAV9wTIXZkZy', // 🔑 SU SITE KEY DA IMAGEM
          callback: (token) => {
            console.log('Turnstile resolvido:', token);
            setTurnstileToken(token);
          },
          'expired-callback': () => {
            setTurnstileToken(''); // Limpa se expirar
          },
        });
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    } else {
      // Se já existe, tenta renderizar com um pequeno delay para garantir
      setTimeout(renderWidget, 500);
    }

    // Cleanup: remove o widget se sair da tela (opcional, mas boa prática)
    return () => {
      // window.turnstile?.remove(); // API do turnstile pode variar, deixamos simples
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
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
      // Passa o token junto com usuário e senha
      await login(username, password, turnstileToken);
      navigate('/');
    } catch (error) {
      console.error("Erro no login:", error);
      
      let msg = 'Erro ao conectar com o servidor.';
      if (error.response?.status === 400) {
        msg = error.response.data.detail || 'Verificação de segurança falhou.';
      } else if (error.response?.status === 401) {
        msg = 'Usuário ou senha incorretos.';
      }

      Swal.fire({
        title: 'Erro no Login',
        text: msg,
        icon: 'error',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
      
      // Reseta o widget do Turnstile em caso de erro
      if (window.turnstile) window.turnstile.reset();
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
          <p>Painel Administrativo</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group-login">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Usuário" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group-login">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 🛡️ WIDGET CLOUDFLARE TURNSTILE */}
          <div 
            ref={turnstileRef} 
            className="turnstile-container" 
            style={{ margin: '15px 0', display: 'flex', justifyContent: 'center' }}
          ></div>

          <Button 
            type="submit" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'} <ArrowRight size={18} />
          </Button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Criar Conta
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}