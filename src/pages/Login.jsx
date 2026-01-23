import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';
import './Login.css';

// Sua chave do Cloudflare
const TURNSTILE_SITE_KEY = '0x4AAAAAACOUmpPNTu0O44Tfoa_r8qOZzJs';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Referência para o elemento onde o widget vai ser desenhado
  const turnstileContainer = useRef(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ EFEITO MÁGICO: Força o widget a aparecer assim que a tela carrega
  useEffect(() => {
    // Função para renderizar o widget
    const renderTurnstile = () => {
      if (window.turnstile && turnstileContainer.current) {
        // Limpa qualquer instância anterior para não duplicar
        turnstileContainer.current.innerHTML = ''; 
        
        window.turnstile.render(turnstileContainer.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark', // Tema escuro para combinar com seu site
          callback: function(token) {
            console.log('Token recebido:', token);
            setTurnstileToken(token);
          },
          'expired-callback': function() {
            setTurnstileToken(''); // Reseta se expirar
          }
        });
      }
    };

    // Tenta renderizar imediatamente
    renderTurnstile();

    // Segurança extra: Se o script demorar um pouco, tenta de novo em 1 segundo
    const timer = setTimeout(renderTurnstile, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Trava de segurança: Se não clicou no "não sou robô"
    if (!turnstileToken) {
      Swal.fire({
        title: 'Verificação Necessária',
        text: 'Por favor, complete a verificação de segurança (Não sou um robô).',
        icon: 'warning',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Passamos o token junto (mesmo que seu backend ainda não use, o front valida)
      const success = await login(username, password, turnstileToken);
      
      if (success) {
        navigate('/');
      } else {
        // Se errar a senha, reseta o token para forçar nova verificação
        if (window.turnstile) window.turnstile.reset();
        setTurnstileToken('');
        
        Swal.fire({
          title: 'Acesso Negado',
          text: 'Usuário ou senha incorretos.',
          icon: 'error',
          background: '#1b1730',
          color: '#fff',
          confirmButtonColor: '#c333ff'
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao conectar com o servidor.',
        icon: 'error',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
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

          {/* ONDE O CLOUDFLARE VAI APARECER */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              margin: '20px 0', 
              minHeight: '65px' 
            }}
          >
            <div ref={turnstileContainer}></div> 
          </div>

          <Button 
            type="submit" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading || !turnstileToken} 
            title={!turnstileToken ? "Complete o desafio acima primeiro" : ""}
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