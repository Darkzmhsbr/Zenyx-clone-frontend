import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ LOGIN NORMAL (mantém funcionando do jeito que está)
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
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

  // 🆕 NOVO: LOGIN COM GOOGLE
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      
      // URL do seu backend
      const API_URL = 'https://zenyx-gbs-testesv1-production.up.railway.app';
      
      // Envia o token do Google para seu backend
      const response = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential
      });

      if (response.data.access_token) {
        // Salva token e dados do usuário no localStorage
        localStorage.setItem('zenyx_token', response.data.access_token);
        localStorage.setItem('zenyx_admin_user', JSON.stringify({
          id: response.data.user_id,
          username: response.data.username,
          name: response.data.full_name,
          email: response.data.email,
          role: 'admin',
          allowed_bots: []
        }));
        
        // Configura header do Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        // Redireciona para o dashboard
        window.location.href = '/';
      }
    } catch (error) {
      console.error("❌ Erro no Google Login:", error);
      Swal.fire({
        title: 'Erro no Google Login',
        text: error.response?.data?.detail || 'Não foi possível fazer login com Google',
        icon: 'error',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google Login Failed');
    Swal.fire({
      title: 'Erro',
      text: 'Não foi possível conectar com o Google',
      icon: 'error',
      background: '#1b1730',
      color: '#fff',
      confirmButtonColor: '#c333ff'
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-glow">Zenyx</div>
          <p>Painel Administrativo</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {/* ✅ CAMPOS NORMAIS (mantém igual) */}
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

          {/* ✅ BOTÃO DE LOGIN NORMAL (mantém igual) */}
          <Button 
            type="submit" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'} <ArrowRight size={18} />
          </Button>

          {/* 🆕 NOVO: Divisor "OU" */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '25px 0',
            color: '#555'
          }}>
            <div style={{ flex: 1, height: 1, background: '#333' }}></div>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>OU</span>
            <div style={{ flex: 1, height: 1, background: '#333' }}></div>
          </div>

          {/* 🆕 NOVO: Botão do Google */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              text="continue_with"
              width="100%"
            />
          </div>

          {/* ✅ Link para registro (mantém igual) */}
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