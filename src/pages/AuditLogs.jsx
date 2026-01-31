import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditService } from '../services/api';
import './AuditLogs.css';
import { 
  Search, Filter, ChevronLeft, ChevronRight, RefreshCw, 
  Shield, User, Database, CreditCard, Activity, Globe,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

export function AuditLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado dos Filtros
  const [filters, setFilters] = useState({
    action: '',
    resource_type: '',
    success: '',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 50
  });

  // Estado da Paginação
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 50,
    total_pages: 0
  });

  // Busca logs quando a página do filtro muda
  useEffect(() => {
    loadLogs();
  }, [filters.page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const filtersToSend = {};
      
      if (filters.action) filtersToSend.action = filters.action;
      if (filters.resource_type) filtersToSend.resource_type = filters.resource_type;
      if (filters.success !== '') filtersToSend.success = filters.success === 'true';
      if (filters.start_date) filtersToSend.start_date = new Date(filters.start_date).toISOString();
      if (filters.end_date) filtersToSend.end_date = new Date(filters.end_date).toISOString();
      
      filtersToSend.page = filters.page;
      filtersToSend.per_page = filters.per_page;

      const response = await auditService.getLogs(filtersToSend);
      
      setLogs(response.data || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        per_page: response.per_page || 50,
        total_pages: response.total_pages || 0
      });
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleApplyFilters = () => {
    loadLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      action: '',
      resource_type: '',
      success: '',
      start_date: '',
      end_date: '',
      page: 1,
      per_page: 50
    });
    setTimeout(() => loadLogs(), 100);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Helper para renderizar Badge de Ação
  const getActionBadge = (action) => {
    const badges = {
      // Autenticação
      'login_success': { color: '#10b981', icon: <User size={12} />, label: 'Login' },
      'login_failed': { color: '#ef4444', icon: <AlertTriangle size={12} />, label: 'Login Falhou' },
      'user_registered': { color: '#3b82f6', icon: <User size={12} />, label: 'Registro' },
      'impersonation': { color: '#8b5cf6', icon: <Shield size={12} />, label: 'Acesso Espião' },
      
      // Bots
      'bot_created': { color: '#8b5cf6', icon: <Database size={12} />, label: 'Bot Criado' },
      'bot_updated': { color: '#f59e0b', icon: <Activity size={12} />, label: 'Bot Editado' },
      'bot_deleted': { color: '#ef4444', icon: <XCircle size={12} />, label: 'Bot Deletado' },
      
      // Admin
      'user_promoted_superadmin': { color: '#eab308', icon: <Shield size={12} />, label: 'Promovido' },
      'user_demoted_superadmin': { color: '#ef4444', icon: <Shield size={12} />, label: 'Rebaixado' },
      'user_activated': { color: '#10b981', icon: <CheckCircle size={12} />, label: 'Usuário Ativado' },
      'user_deactivated': { color: '#ef4444', icon: <XCircle size={12} />, label: 'Usuário Bloq.' },
      
      // Padrão
      'default': { color: '#6b7280', icon: <Activity size={12} />, label: action }
    };

    const badge = badges[action] || badges['default'];
    
    return (
      <span className="audit-badge" style={{ backgroundColor: badge.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  // Helper para renderizar Badge de Recurso
  const getResourceBadge = (type) => {
    const colors = {
      'auth': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
      'bot': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
      'user': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      'plano': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
      'remarketing': { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' },
      'payment': { bg: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }
    };

    const style = colors[type] || { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' };

    return (
      <span className="resource-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {type?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="audit-logs-container fade-in">
      <div className="audit-header">
        <div className="header-left">
          <button onClick={() => navigate('/superadmin')} className="btn-back">
            <ChevronLeft size={18} /> Voltar
          </button>
          <div>
            <h1>📋 Logs de Auditoria</h1>
            <p className="audit-subtitle">Rastreabilidade completa de todas as ações no sistema</p>
          </div>
        </div>
        <div className="header-right">
          <button onClick={loadLogs} className="btn-refresh">
            <RefreshCw size={18} /> Atualizar
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="audit-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Ação</label>
            <select name="action" value={filters.action} onChange={handleFilterChange}>
              <option value="">Todas as ações</option>
              <option value="login_success">Login Sucesso</option>
              <option value="login_failed">Login Falha</option>
              <option value="impersonation">Acesso Espião</option>
              <option value="bot_created">Criou Bot</option>
              <option value="bot_deleted">Deletou Bot</option>
              <option value="user_activated">Ativou Usuário</option>
              <option value="user_deactivated">Bloqueou Usuário</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Recurso</label>
            <select name="resource_type" value={filters.resource_type} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="auth">Autenticação</option>
              <option value="user">Usuário</option>
              <option value="bot">Bot</option>
              <option value="plano">Plano</option>
              <option value="payment">Pagamento</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select name="success" value={filters.success} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="true">✅ Sucesso</option>
              <option value="false">❌ Falha</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Data Inicial</label>
            <input 
              type="date" 
              name="start_date" 
              value={filters.start_date} 
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Data Final</label>
            <input 
              type="date" 
              name="end_date" 
              value={filters.end_date} 
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn-apply" onClick={handleApplyFilters}>
            <Search size={16} style={{marginRight: 5}}/> Filtrar
          </button>
          <button className="btn-clear" onClick={handleClearFilters}>
            Limpar
          </button>
        </div>
      </div>

      {/* TABELA DE LOGS */}
      {loading ? (
        <div className="audit-loading">
          <div className="spinner"></div>
          <p>Carregando histórico...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="audit-empty">
          <p>📭 Nenhum registro encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <>
          <div className="audit-stats">
            <span>Total de registros: <strong>{pagination.total}</strong></span>
            <span>Página {pagination.page} de {pagination.total_pages}</span>
          </div>

          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Usuário</th>
                  <th>Ação</th>
                  <th>Recurso</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className={log.success ? '' : 'log-failed'}>
                    <td className="log-date">{formatDate(log.created_at)}</td>
                    <td className="log-user">
                      <strong>{log.username}</strong>
                      <span className="user-id">ID: {log.user_id}</span>
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>{getResourceBadge(log.resource_type)}</td>
                    <td className="log-description">
                      {log.description}
                      {log.error_message && (
                        <div className="error-msg">⚠️ {log.error_message}</div>
                      )}
                    </td>
                    <td className="log-status">
                      {log.success ? (
                        <span className="status-success">Sucesso</span>
                      ) : (
                        <span className="status-failed">Falha</span>
                      )}
                    </td>
                    <td className="log-ip">{log.ip_address || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.total_pages > 1 && (
            <div className="audit-pagination">
              <button 
                className="btn-page"
                disabled={pagination.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              
              <span className="page-info">
                {pagination.page} / {pagination.total_pages}
              </span>
              
              <button 
                className="btn-page"
                disabled={pagination.page === pagination.total_pages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}