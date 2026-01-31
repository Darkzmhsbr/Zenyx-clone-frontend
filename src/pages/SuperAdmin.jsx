import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../services/api';
import './SuperAdmin.css';
import { 
  Users, Bot, DollarSign, TrendingUp, AlertCircle, RefreshCw, 
  Settings, ClipboardList, LayoutDashboard 
} from 'lucide-react';

export function SuperAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await superAdminService.getStats();
      
      // ✅ TRANSFORMA OS DADOS DO BACKEND PARA O FORMATO ESPERADO
      // Mantendo sua estrutura original completa
      const transformedData = {
        users: {
          total: data.total_users || 0,
          active: data.active_users || 0,
          inactive: data.inactive_users || 0,
          new_last_30_days: data.new_users_30d || 0,
          growth_percentage: data.growth_percentage || 0
        },
        bots: {
          total: data.total_bots || 0,
          active: data.active_bots || 0,
          inactive: data.inactive_bots || 0
        },
        revenue: {
          total: (data.super_admin_revenue || 0) / 100, // ✅ Converte centavos → reais
          last_30_days: 0, // Backend não retorna isso ainda (Mantido conforme original)
          // Mantendo seu cálculo original de média por usuário
          average_per_user: data.total_users > 0 
            ? ((data.super_admin_revenue || 0) / 100) / data.total_users 
            : 0,
          total_sales: data.super_admin_sales || 0 // Adicionado para exibir vendas no card de receita
        },
        sales: {
          total: data.super_admin_sales || data.total_sales || 0,
          last_30_days: 0 // Backend não retorna isso ainda
        }
      };
      
      console.log("📊 Stats transformados:", transformedData);
      setStats(transformedData);
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
      
      // Se erro 403, não é super-admin
      if (err.response?.status === 403) {
        setError("Acesso negado: você não tem privilégios de super-administrador");
      } else {
        setError("Erro ao carregar estatísticas do sistema");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="super-admin-container">
        <div className="super-admin-loading">
          <div className="spinner"></div>
          <p>Carregando painel super admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="super-admin-container">
        <div className="super-admin-error">
          <AlertCircle size={48} color="#ef4444" />
          <h2>Ops! Algo deu errado.</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={loadStats} className="btn-retry">
              <RefreshCw size={16} /> Tentar Novamente
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary" style={{marginTop: 10, marginLeft: 10}}>
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="super-admin-container fade-in">
      <div className="super-admin-header">
        <div className="header-left">
          <h1>👑 Painel Super Admin</h1>
          <p className="superadmin-subtitle">Gerenciamento global do sistema</p>
        </div>
        <div className="header-right">
          <button onClick={loadStats} className="btn-refresh">
            <RefreshCw size={18} /> Atualizar
          </button>
        </div>
      </div>

      {/* Estatísticas Globais */}
      <div className="stats-grid">
        {/* Card: Usuários */}
        <div className="stat-card users">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Usuários</h3>
            <div className="stat-number">{stats?.users?.total || 0}</div>
            <div className="stat-details">
              <span className="stat-detail-item active">
                ✅ {stats?.users?.active || 0} ativos
              </span>
              <span className="stat-detail-item inactive">
                ❌ {stats?.users?.inactive || 0} inativos
              </span>
            </div>
            <div className="stat-growth">
              +{stats?.users?.new_last_30_days || 0} novos (30 dias)
              <span className="growth-badge">
                +{stats?.users?.growth_percentage || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Card: Bots */}
        <div className="stat-card bots">
          <div className="stat-icon">
            <Bot size={24} />
          </div>
          <div className="stat-content">
            <h3>Bots</h3>
            <div className="stat-number">{stats?.bots?.total || 0}</div>
            <div className="stat-details">
              <span className="stat-detail-item active">
                ✅ {stats?.bots?.active || 0} ativos
              </span>
              <span className="stat-detail-item inactive">
                ❌ {stats?.bots?.inactive || 0} inativos
              </span>
            </div>
            <div className="stat-info">
              Média: {stats?.users?.total > 0 
                ? (stats.bots.total / stats.users.total).toFixed(1) 
                : 0} bots/usuário
            </div>
          </div>
        </div>

        {/* Card: Receita Total (SUPER ADMIN) */}
        <div className="stat-card revenue">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Receita Total (Super Admin)</h3>
            <div className="stat-number">
              R$ {(stats?.revenue?.total || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <div className="stat-details">
              <span className="stat-detail-item">
                💸 Splits recebidos das vendas
              </span>
            </div>
            <div className="stat-info">
              Média: R$ {(stats?.revenue?.average_per_user || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2 
              })} /usuário
            </div>
          </div>
        </div>

        {/* Card: Vendas */}
        <div className="stat-card sales">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Vendas (Sistema)</h3>
            <div className="stat-number">{stats?.sales?.total || 0}</div>
            <div className="stat-details">
              <span className="stat-detail-item">
                🎯 Todas as vendas do sistema
              </span>
            </div>
            <div className="stat-info">
              Ticket médio: R$ {stats?.sales?.total > 0 && stats?.revenue?.total > 0
                ? ((stats.revenue.total / stats.sales.total)).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2 
                  })
                : '0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions-section">
        <h2>⚡ Acesso Rápido</h2>
        <div className="actions-grid">
          
          <button 
            className="action-card"
            onClick={() => navigate('/superadmin/users')}
          >
            <div className="action-icon"><Users size={24} /></div>
            <div className="action-content">
              <h3>Gerenciar Usuários</h3>
              <p>Ver, editar, banir e entrar na conta de usuários</p>
            </div>
          </button>

          {/* 🆕 NOVO BOTÃO: BOTS DO SISTEMA */}
          <button 
            className="action-card"
            onClick={() => navigate('/superadmin/bots')}
          >
            <div className="action-icon"><Bot size={24} /></div>
            <div className="action-content">
              <h3>Bots do Sistema</h3>
              <p>Visão global de todos os robôs da plataforma</p>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/audit-logs')}
          >
            <div className="action-icon"><ClipboardList size={24} /></div>
            <div className="action-content">
              <h3>Logs de Auditoria</h3>
              <p>Ver histórico completo de quem fez o quê</p>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/config')}
          >
            <div className="action-icon"><Settings size={24} /></div>
            <div className="action-content">
              <h3>Config. Globais</h3>
              <p>Taxas, Webhooks e integrações do sistema</p>
            </div>
          </button>

          <button 
            className="action-card secondary"
            onClick={() => navigate('/')}
          >
            <div className="action-icon"><LayoutDashboard size={24} /></div>
            <div className="action-content">
              <h3>Ir para Dashboard</h3>
              <p>Voltar para a visão do usuário comum</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}