import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';
import './Login.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // ✅ NOVO: Estado do checkbox
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ NOVO: Passa o rememberMe como 3º parâmetro
      const success = await login(username, password, rememberMe);
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
        text: 'Ocorreu um erro ao tentar fazer login.',
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

          {/* ✅ NOVO: Checkbox "Manter Conectado" */}
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            marginBottom: 15, 
            justifyContent: 'center'
          }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              style={{
                width: 16,
                height: 16,
                cursor: 'pointer', 
                accentColor: '#c333ff'
              }} 
            />
            <label 
              htmlFor="remember" 
              style={{
                color: '#ccc', 
                cursor: 'pointer', 
                fontSize: '0.9rem'
              }}
            >
              Manter conectado por 7 dias
            </label>
          </div>

          <Button 
            type="submit" 
            style={{ width: '100%', marginTop: '10px' }} 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'} <ArrowRight size={18} />
          </Button>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
              Não tem uma conta? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Criar Conta</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}