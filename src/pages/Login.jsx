import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Login.css';

// 👇 BIBLIOTECAS DO GOOGLE
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// 👇 SEU CLIENT ID
const GOOGLE_CLIENT_ID = "851618246810-npe0qg47u8stb2s269n0g5bfbr4e0lo1.apps.googleusercontent.com";

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // Checkbox estado
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Sua função de login normal
  const navigate = useNavigate();

  // --- LOGIN TRADICIONAL ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Passamos o rememberMe para o contexto (você precisa ajustar o AuthContext se quiser usar isso no back)
      const success = await login(username, password);
      
      if (success) {
        navigate('/');
      } else {
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
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN COM GOOGLE ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const token = credentialResponse.credential;

      // Chama seu Backend Python
      const API_URL = 'https://zenyx-gbs-testesv1-production.up.railway.app';
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        credential: token
      });

      if (res.data.access_token) {
        // Salva manualmente pois estamos bypassando o AuthContext por um momento
        localStorage.setItem('zenyx_token', res.data.access_token);
        localStorage.setItem('zenyx_admin_user', JSON.stringify(res.data));
        
        // Configura o Axios global
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
        
        // Força recarregamento para o AuthContext pegar o novo usuário
        window.location.href = '/'; 
      }

    } catch (error) {
      console.error("Erro Google:", error);
      Swal.fire({
        title: 'Erro no Google',
        text: 'Não foi possível autenticar com o Google.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-glow">Zenyx</div>
            <p style={{color: '#888'}}>Gestão de Bots & Vendas</p>
          </div>

          <form onSubmit={handleLogin}>
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

            {/* CHECKBOX MANTER CONECTADO */}
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:15, justifyContent:'center'}}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{cursor:'pointer', accentColor:'#c333ff'}}
                />
                <label htmlFor="remember" style={{color:'#ccc', cursor:'pointer', fontSize:'0.9rem'}}>
                    Manter-me conectado por 7 dias
                </label>
            </div>

            <Button 
              type="submit" 
              style={{ width: '100%', marginTop: '10px', marginBottom: '20px' }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'} <ArrowRight size={18} />
            </Button>

            {/* DIVISOR */}
            <div style={{display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', color: '#555'}}>
                <div style={{flex:1, height:1, background:'#333'}}></div>
                <span style={{fontSize:'0.8rem'}}>OU</span>
                <div style={{flex:1, height:1, background:'#333'}}></div>
            </div>

            {/* BOTÃO GOOGLE */}
            <div style={{display:'flex', justifyContent:'center'}}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    width="100%"
                />
            </div>

            <div style={{ marginTop: '25px', textAlign: 'center' }}>
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
    </GoogleOAuthProvider>
  );
}