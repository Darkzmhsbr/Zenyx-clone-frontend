import React, { useState, useEffect } from 'react';
// 👇 Alterado para authService (pois é lá que adicionamos o updateProfile do membro)
import { authService, profileService } from '../services/api';
// 👇 Importante: Pegar o usuário logado para saber quem é
import { useAuth } from '../context/AuthContext';
import { User, Award, Lock, Shield, Briefcase, Star, CreditCard, Save } from 'lucide-react';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';
import './Profile.css';

export function Profile() {
  const { user, logout } = useAuth(); // Pegando dados da sessão
  const [loading, setLoading] = useState(true);
  
  // Dados do Perfil
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    pushin_pay_id: '' // 🆕 Campo novo
  });

  // Dados Estatísticos (Império)
  const [stats, setStats] = useState({
    total_bots: 0,
    total_members: 0,
    total_revenue: 0,
    total_sales: 0
  });

  // Gamificação
  const [gamification, setGamification] = useState({
    current_level: null,
    next_level: null,
    progress_percentage: 0
  });

  // Lista de Badges (Mantida original)
  const badges = [
    { name: 'Iniciante', target: 100, color: '#10b981' },
    { name: 'Empreendedor', target: 1000, color: '#3b82f6' },
    { name: 'Barão', target: 5000, color: '#8b5cf6' },
    { name: 'Magnata', target: 10000, color: '#f59e0b' },
    { name: 'Imperador', target: 50000, color: '#ef4444' },
    { name: 'Lenda', target: 100000, color: '#c333ff' }
  ];

  // Formatar Moeda
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100); // Assume valor em centavos
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carrega dados de stats do profileService e dados do usuário do authService
      const [userData, statsData] = await Promise.all([
        authService.getMe(),
        profileService.getStats()
      ]);
      
      setProfile({
        name: userData.full_name || '',
        email: userData.email || '',
        pushin_pay_id: userData.pushin_pay_id || '' // 🆕 Carrega ID
      });
      
      setStats(statsData);

      // Calcular Nível
      const revenue = statsData.total_revenue || 0;
      let current = badges[0];
      let next = badges[1];
      
      for (let i = 0; i < badges.length; i++) {
        if (revenue >= badges[i].target) {
          current = badges[i];
          next = badges[i + 1] || null;
        }
      }

      let progress = 100;
      if (next) {
        const range = next.target - current.target;
        const value = revenue - current.target;
        progress = Math.min(100, Math.max(0, (value / range) * 100));
      }

      setGamification({
        current_level: current,
        next_level: next,
        progress_percentage: progress
      });

    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 👑 LÓGICA DE CARGOS E HIERARQUIA
  // =========================================================
  const getUserRole = () => {
    const username = user?.username?.toLowerCase() || '';
    
    // 1. VERIFICAÇÃO REAL DE SUPER ADMIN (Vem do Banco de Dados)
    // Se o backend disser que é superuser, ou se for o dono do sistema
    if (user?.is_superuser || username === 'adminzenyx' || username === 'admin') {
        return {
            label: 'Administrador - Dono do Império Zenyx',
            icon: <Shield size={16} />,
            className: 'role-badge role-master'
        };
    }

    // 2. SÓCIOS (Adicione os usernames aqui no futuro)
    const socios = ['socio1', 'fulano_socio']; 
    if (socios.includes(username)) {
        return {
            label: 'Sócio do Império Zenyx',
            icon: <Star size={16} />,
            className: 'role-badge role-partner'
        };
    }

    // 3. COLABORADORES (Adicione os usernames aqui no futuro)
    const colaboradores = ['suporte', 'dev_team', 'atendente'];
    if (colaboradores.includes(username)) {
        return {
            label: 'Colaborador do Império Zenyx',
            icon: <Briefcase size={16} />,
            className: 'role-badge role-collab'
        };
    }

    // 4. PADRÃO (CLIENTES)
    return {
        label: 'Usuário',
        icon: <User size={16} />,
        className: 'role-badge role-user'
    };
  };

  const role = getUserRole();

  // 🆕 FUNÇÃO SALVAR DADOS
  const handleSaveProfile = async () => {
    try {
        await authService.updateProfile({
            full_name: profile.name,
            pushin_pay_id: profile.pushin_pay_id
        });
        Swal.fire('Sucesso', 'Perfil atualizado com sucesso!', 'success');
    } catch (error) {
        Swal.fire('Erro', 'Não foi possível salvar os dados.', 'error');
    }
  };

  if (loading) return <div className="loading">Carregando perfil...</div>;

  return (
    <div className="profile-container">
      
      {/* HEADER DO PERFIL */}
      <div className="profile-header-section">
        <div className="profile-identity">
            <div className="avatar-wrapper">
                <div className="avatar-placeholder">{profile.name.charAt(0)}</div>
            </div>
            <div>
                <h1 className="profile-name">{profile.name || user.username}</h1>
                <div className="profile-email">{profile.email}</div>
                <div className={role.className}>
                    {role.icon}
                    <span>{role.label}</span>
                </div>
            </div>
        </div>
      </div>

      {/* 🆕 CONFIGURAÇÃO FINANCEIRA (NOVO) */}
      <div className="finance-section" style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', marginBottom: '15px' }}>
            <CreditCard size={20} color="#10b981" />
            Configuração de Recebimento
        </h3>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>
            Para receber suas comissões de vendas, informe o ID da sua conta Pushin Pay. 
            Você receberá o valor das vendas descontando a taxa da plataforma.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '12px', marginBottom: '5px' }}>ID da Conta Pushin Pay</label>
                <input 
                    type="text" 
                    value={profile.pushin_pay_id}
                    onChange={(e) => setProfile({...profile, pushin_pay_id: e.target.value})}
                    placeholder="Ex: 9D4FA0F6-..."
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        background: '#222', 
                        border: '1px solid #444', 
                        color: '#fff', 
                        borderRadius: '6px' 
                    }}
                />
            </div>
            <button 
                onClick={handleSaveProfile}
                style={{ 
                    padding: '10px 20px', 
                    background: '#c333ff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 'bold'
                }}
            >
                <Save size={18} /> Salvar
            </button>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="empire-stats-section">
        <h3 className="section-title">Estatísticas do Império</h3>
        <div className="stats-grid">
          <div className="stat-card highlight">
            <span className="stat-label">Faturamento Total</span>
            <span className="stat-value">{formatMoney(stats.total_revenue)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Vendas Realizadas</span>
            <span className="stat-value">{stats.total_sales}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Bots Ativos</span>
            <span className="stat-value">{stats.total_bots}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Membros Totais</span>
            <span className="stat-value">{stats.total_members}</span>
          </div>
        </div>
      </div>

      {/* GAMIFICAÇÃO */}
      <div className="gamification-section">
        <div className="level-header">
          <div>
            <span className="current-level-label">Nível Atual</span>
            <h2 className="current-level-title">{gamification.current_level?.name || 'Iniciante'}</h2>
          </div>
          <div className="xp-badge">
            {gamification.next_level ? `Próximo: ${gamification.next_level.name}` : 'Nível Máximo'}
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-labels">
            <span>Progresso</span>
            <span>{gamification.progress_percentage.toFixed(1)}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{width: `${gamification.progress_percentage}%`}}
            ></div>
          </div>
          <p className="progress-info">
            Faturamento Atual: <strong>{formatMoney(stats.total_revenue)}</strong> 
            {gamification.next_level && ` / Meta: ${formatMoney(gamification.next_level.target)}`}
          </p>
        </div>

        {/* GALERIA DE TROFÉUS */}
        <h3 className="badges-title" style={{marginTop: '40px'}}>Galeria de Troféus</h3>
        <div className="badges-grid">
          {badges.map((badge, index) => {
            const isUnlocked = stats.total_revenue >= badge.target;
            return (
              <div key={index} className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon" style={{ borderColor: isUnlocked ? badge.color : '#333', color: isUnlocked ? badge.color : '#555' }}>
                  {isUnlocked ? <Award size={32} /> : <Lock size={32} />}
                </div>
                <h4>{badge.name}</h4>
                <p className="badge-target">{formatMoney(badge.target)}</p>
                <div className="badge-status">
                  {isUnlocked ? <span className="status-unlocked">CONQUISTADO</span> : <span className="status-locked">BLOQUEADO</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}