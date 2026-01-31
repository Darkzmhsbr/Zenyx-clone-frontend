import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService, botService } from '../services/api'; // Adicionado botService
import './SuperAdmin.css';
import Swal from 'sweetalert2';
import { 
  Search, Filter, MoreVertical, LogIn, Trash2, 
  Shield, Edit, Ban, CheckCircle, ChevronLeft, ChevronRight,
  Eye, RefreshCw, Save, X, Power, MessageSquare
} from 'lucide-react';

export function SuperAdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de Filtros (Mantido da sua versão)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    per_page: 50
  });

  // Estado de Paginação (Mantido da sua versão)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 50,
    total_pages: 0
  });

  // Estados de Controle
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'details', 'delete', 'status', 'promote'
  const [actionLoading, setActionLoading] = useState(false);

  // Estado para edição de dados extras (Adicionado Role)
  const [editData, setEditData] = useState({ 
    taxa_venda: 60, 
    pushin_pay_id: '',
    role: 'USER' 
  });

  useEffect(() => {
    loadUsers();
  }, [filters.page]);

  // =========================================================
  // 📡 CARREGAMENTO DE DADOS
  // =========================================================
  const loadUsers = async () => {
    setLoading(true);
    try {
      // Usa a função correta do api.js
      const response = await superAdminService.getUsers(
        filters.page, 
        filters.per_page, 
        filters.search, 
        filters.status
      );
      
      setUsers(response.data || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        per_page: response.per_page || 50,
        total_pages: response.total_pages || 0
      });
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      if (error.response?.status === 403) {
        Swal.fire("Acesso Negado", "Você não tem privilégios de super-administrador", "error");
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    loadUsers();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      page: 1,
      per_page: 50
    });
    setTimeout(() => loadUsers(), 100);
  };

  // =========================================================
  // ⚙️ CONTROLE DE MODAIS
  // =========================================================
  const openModal = (type, user) => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType(null);
    setActionLoading(false);
  };

  // =========================================================
  // 🕵️ LOGIN IMPERSONADO (NOVO)
  // =========================================================
  const handleImpersonate = async (user) => {
    const result = await Swal.fire({
      title: `Acessar como ${user.username}?`,
      text: "Você será desconectado da sua conta e entrará como este cliente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c333ff',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, Acessar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        Swal.showLoading();
        const data = await superAdminService.impersonateUser(user.id);
        
        localStorage.setItem('zenyx_token', data.access_token);
        localStorage.setItem('zenyx_admin_user', JSON.stringify({
            ...data, 
            is_impersonating: true
        }));
        
        Swal.close();
        window.location.href = '/'; 
      } catch (error) {
        Swal.fire('Erro', 'Falha ao realizar login impersonado.', 'error');
      }
    }
  };

  // =========================================================
  // 👁️ DETALHES + CARREGAMENTO PARA EDIÇÃO
  // =========================================================
  const handleViewDetails = async (user) => {
    setActionLoading(true);
    try {
      const details = await superAdminService.getUserDetails(user.id);
      setSelectedUser(details);
      
      // Lógica para determinar a Role Visual corretamente
      let currentRole = details.user.role || 'USER';
      if (details.user.is_superuser) currentRole = 'SUPER_ADMIN';

      setEditData({
        taxa_venda: details.user.taxa_venda || 60,
        pushin_pay_id: details.user.pushin_pay_id || '',
        role: currentRole
      });

      setModalType('details');
      setShowModal(true);
    } catch (error) {
      Swal.fire("Erro", "Erro ao carregar detalhes do usuário", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // 💾 SALVAR DADOS (FINANCEIRO + ROLE)
  // =========================================================
  const handleSaveFinancials = async () => {
    if (!selectedUser || !selectedUser.user) return;
    
    setActionLoading(true);
    try {
        // 1. Atualiza dados financeiros
        await superAdminService.updateUser(selectedUser.user.id, {
            taxa_venda: parseInt(editData.taxa_venda),
            pushin_pay_id: editData.pushin_pay_id
        });
        
        // 2. Lógica de Promoção/Rebaixamento baseada na Role selecionada
        let isNowSuper = selectedUser.user.is_superuser;
        
        if (editData.role === 'SUPER_ADMIN' && !selectedUser.user.is_superuser) {
            await superAdminService.promoteUser(selectedUser.user.id, true);
            isNowSuper = true;
        } else if (editData.role !== 'SUPER_ADMIN' && selectedUser.user.is_superuser) {
            await superAdminService.promoteUser(selectedUser.user.id, false);
            isNowSuper = false;
        }
        
        // Atualiza visualmente o objeto selecionado (para o modal não fechar ou piscar)
        setSelectedUser(prev => ({
            ...prev,
            user: {
                ...prev.user,
                taxa_venda: editData.taxa_venda,
                pushin_pay_id: editData.pushin_pay_id,
                role: editData.role,
                is_superuser: isNowSuper
            }
        }));

        // Atualiza a lista principal em segundo plano
        setUsers(prev => prev.map(u => u.id === selectedUser.user.id ? {
            ...u,
            role: editData.role,
            is_superuser: isNowSuper,
            total_revenue: u.total_revenue // Mantém dados que não mudaram
        } : u));
        
        Swal.fire('Salvo', 'Dados atualizados com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Falha ao salvar alterações.', 'error');
    } finally {
        setActionLoading(false);
    }
  };

  // =========================================================
  // 🤖 AÇÕES DE BOT (NOVO: DELETAR/PAUSAR)
  // =========================================================
  const handleDeleteBot = async (botId) => {
    const result = await Swal.fire({
      title: 'Deletar este Bot?',
      text: "Isso removerá o bot e todos os dados dele (planos, leads) permanentemente.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sim, Deletar'
    });

    if (result.isConfirmed) {
      try {
        await botService.deleteBot(botId);
        
        // Remove da lista visualmente
        setSelectedUser(prev => ({
          ...prev,
          bots: prev.bots.filter(b => b.id !== botId)
        }));
        
        Swal.fire('Deletado', 'Bot removido com sucesso.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível deletar o bot.', 'error');
      }
    }
  };

  const handleToggleBot = async (botId) => {
    try {
      await botService.toggleBot(botId);
      // Atualiza status visualmente
      setSelectedUser(prev => ({
        ...prev,
        bots: prev.bots.map(b => b.id === botId ? { ...b, status: b.status === 'ativo' ? 'pausado' : 'ativo' } : b)
      }));
    } catch (error) {
      Swal.fire('Erro', 'Erro ao alterar status do bot.', 'error');
    }
  };

  // =========================================================
  // 🔒 AÇÕES DE USUÁRIO (STATUS/DELETE/PROMOTE)
  // =========================================================
  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const newStatus = !selectedUser.is_active;
      await superAdminService.updateUserStatus(selectedUser.id, newStatus);
      Swal.fire('Sucesso', `Usuário ${newStatus ? 'ativado' : 'bloqueado'}!`, 'success');
      closeModal();
      loadUsers();
    } catch (error) {
      Swal.fire('Erro', error.response?.data?.detail || "Erro ao atualizar status", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await superAdminService.deleteUser(selectedUser.id);
      Swal.fire('Deletado', `Usuário deletado com sucesso!`, 'success');
      closeModal();
      loadUsers();
    } catch (error) {
      Swal.fire('Erro', error.response?.data?.detail || "Erro ao deletar usuário", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const newStatus = !selectedUser.is_superuser;
      await superAdminService.promoteUser(selectedUser.id, newStatus);
      Swal.fire('Sucesso', `Privilégios alterados com sucesso!`, 'success');
      closeModal();
      loadUsers();
    } catch (error) {
      Swal.fire('Erro', "Erro ao alterar privilégios", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // 🛠️ FORMATADORES
  // =========================================================
  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
  };

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Helper visual para exibir o cargo correto na tabela
  const getDisplayRole = (user) => {
    if (user.is_superuser) return 'SUPER_ADMIN';
    return user.role || 'USER';
  };

  return (
    <div className="super-admin-container fade-in">
      <div className="super-admin-header">
        <div className="header-left">
          <button onClick={() => navigate('/superadmin')} className="btn-back">
            <ChevronLeft size={18} /> Voltar
          </button>
          <div>
            <h1>👥 Gerenciar Usuários</h1>
            <p className="superadmin-subtitle">Visualizar e gerenciar todos os usuários do sistema</p>
          </div>
        </div>
        <div className="header-right">
          <button onClick={loadUsers} className="btn-refresh">
            <RefreshCw size={18} /> Atualizar
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="users-filters">
        <div className="filter-row">
          <div className="filter-group search-group">
            <label>🔍 Buscar</label>
            <input
              type="text"
              placeholder="Username, email ou nome..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn-apply" onClick={handleSearch}>
              Aplicar
            </button>
            <button className="btn-clear" onClick={handleClearFilters}>
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="users-stats">
        <span>Total de usuários: <strong>{pagination.total}</strong></span>
        <span>Página {pagination.page} de {pagination.total_pages}</span>
      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className="users-table-wrapper">
        {loading ? (
          <div className="users-loading">
            <div className="spinner"></div>
            <p>Carregando usuários...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="users-empty">
            <p>📭 Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuário / Email</th>
                <th>Cargo</th>
                <th>Bots</th>
                <th>Receita</th>
                <th>Vendas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={!user.is_active ? 'user-inactive' : ''}>
                  <td>
                    <div className="user-username">
                      <strong>{user.username}</strong>
                      {user.is_superuser && <span className="badge-superadmin">MASTER</span>}
                    </div>
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td>
                    <span className="role-badge">{getDisplayRole(user)}</span>
                  </td>
                  <td className="user-bots">{user.total_bots || 0}</td>
                  <td className="user-revenue">{formatCurrency(user.total_revenue)}</td>
                  <td className="user-sales">{user.total_sales || 0}</td>
                  <td>
                    {user.is_active ? (
                      <span className="status-badge active">✅ Ativo</span>
                    ) : (
                      <span className="status-badge inactive">❌ Bloqueado</span>
                    )}
                  </td>
                  <td>
                    <div className="user-actions">
                      {/* BOTÃO ESPIÃO (Impersonate) */}
                      <button 
                        className="btn-action promote" 
                        title="Entrar na conta (Login Como)"
                        onClick={() => handleImpersonate(user)}
                      >
                        <LogIn size={16} />
                      </button>

                      {/* BOTÃO DETALHES/EDITAR */}
                      <button 
                        className="btn-action view" 
                        title="Ver Detalhes, Bots e Editar"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Eye size={16} />
                      </button>

                      {/* BOTÃO STATUS */}
                      <button 
                        className={`btn-action status ${user.is_active ? 'warning' : 'success'}`} 
                        title={user.is_active ? "Bloquear" : "Ativar"}
                        onClick={() => openModal('status', user)}
                      >
                        {user.is_active ? <Ban size={16} /> : <CheckCircle size={16} />}
                      </button>

                      {/* BOTÃO DELETAR */}
                      <button 
                        className="btn-action delete" 
                        title="Deletar Usuário"
                        onClick={() => openModal('delete', user)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {pagination.total_pages > 1 && (
        <div className="users-pagination">
          <button 
            className="btn-page" 
            disabled={pagination.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="page-info">
            Página <strong>{pagination.page}</strong> de {pagination.total_pages}
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

      {/* ======================================================== */}
      {/* MODAL GERAL (GERENCIA TODOS OS TIPOS) */}
      {/* ======================================================== */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* --- MODAL TIPO: DETALHES E EDIÇÃO COMPLETA --- */}
            {modalType === 'details' && selectedUser.user && (
              <>
                <div className="modal-header">
                  <h2>👤 Gerenciar: {selectedUser.user.username}</h2>
                  <button className="modal-close" onClick={closeModal}> <X size={20} /> </button>
                </div>
                <div className="modal-body">
                  <div className="user-details">
                    
                    {/* Seção 1: Dados Básicos */}
                    <div className="detail-section">
                      <h3>Informações Básicas</h3>
                      <p><strong>ID:</strong> {selectedUser.user.id}</p>
                      <p><strong>Email:</strong> {selectedUser.user.email}</p>
                      <p><strong>Nome Completo:</strong> {selectedUser.user.full_name || '-'}</p>
                      <p><strong>Status:</strong> {selectedUser.user.is_active ? '✅ Ativo' : '❌ Inativo'}</p>
                      <p><strong>Cadastro:</strong> {formatDate(selectedUser.user.created_at)}</p>
                    </div>

                    {/* Seção 2: Edição Financeira e de Cargo */}
                    <div className="detail-section" style={{ border: '1px solid #c333ff', background: 'rgba(195, 51, 255, 0.03)' }}>
                        <h3 style={{ color: '#c333ff', borderBottomColor: '#c333ff' }}>💰 Financeiro & Permissões</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: '#ccc' }}>Cargo (Role)</label>
                                <select 
                                    className="form-control"
                                    value={editData.role}
                                    onChange={(e) => setEditData({...editData, role: e.target.value})}
                                    style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="USER">Usuário (Padrão)</option>
                                    <option value="ADMIN">Admin (Suporte)</option>
                                    <option value="PARTNER">Parceiro</option>
                                    <option value="SUPER_ADMIN">👑 MASTER</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#ccc' }}>Taxa Venda (cents)</label>
                                <input 
                                    type="number" 
                                    value={editData.taxa_venda}
                                    onChange={(e) => setEditData({...editData, taxa_venda: e.target.value})}
                                    style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <label style={{ fontSize: '12px', color: '#ccc' }}>Pushin Pay ID</label>
                            <input 
                                type="text" 
                                value={editData.pushin_pay_id}
                                onChange={(e) => setEditData({...editData, pushin_pay_id: e.target.value})}
                                placeholder="ID da conta Pushin Pay"
                                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                            />
                        </div>
                        <button 
                            onClick={handleSaveFinancials}
                            disabled={actionLoading}
                            style={{ 
                                marginTop: '15px', width: '100%', padding: '10px', background: '#c333ff', color: '#fff', 
                                border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            <Save size={16} /> {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>

                    {/* Seção 3: Estatísticas */}
                    <div className="detail-section">
                      <h3>Estatísticas Gerais</h3>
                      <p><strong>Total de Bots:</strong> {selectedUser.stats.total_bots}</p>
                      <p><strong>Receita Total:</strong> {formatCurrency(selectedUser.stats.total_revenue)}</p>
                      <p><strong>Total de Vendas:</strong> {selectedUser.stats.total_sales}</p>
                      <p><strong>Total de Leads:</strong> {selectedUser.stats.total_leads}</p>
                    </div>

                    {/* Seção 4: Bots (COM AÇÕES NOVAS) */}
                    {selectedUser.bots && selectedUser.bots.length > 0 ? (
                      <div className="detail-section">
                        <h3>🤖 Bots do Usuário ({selectedUser.bots.length})</h3>
                        <div className="bots-list">
                          {selectedUser.bots.map((bot) => (
                            <div key={bot.id} className="bot-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                <p style={{margin: 0}}><strong>{bot.nome}</strong> (@{bot.username})</p>
                                <p style={{margin: 0, fontSize: '12px', color: '#888'}}>
                                  Status: <span style={{color: bot.status === 'ativo' ? '#10b981' : '#ef4444'}}>{bot.status}</span> | Vendas: {bot.sales}
                                </p>
                              </div>
                              <div style={{display: 'flex', gap: '8px'}}>
                                <button 
                                  title={bot.status === 'ativo' ? "Pausar" : "Ativar"}
                                  onClick={() => handleToggleBot(bot.id)}
                                  style={{background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '4px', padding: '6px', cursor: 'pointer'}}
                                >
                                  <Power size={14} />
                                </button>
                                <button 
                                  title="Deletar Bot"
                                  onClick={() => handleDeleteBot(bot.id)}
                                  style={{background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', padding: '6px', cursor: 'pointer'}}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="detail-section">
                        <h3>🤖 Bots</h3>
                        <p style={{color: '#888', fontStyle: 'italic'}}>Este usuário não possui bots.</p>
                      </div>
                    )}

                    {/* Seção 5: Logs */}
                    {selectedUser.recent_activity && selectedUser.recent_activity.length > 0 && (
                      <div className="detail-section">
                        <h3>Atividade Recente</h3>
                        <div className="activity-list">
                          {selectedUser.recent_activity.map((log) => (
                            <div key={log.id} className="activity-item">
                              <p>{log.success ? '✅' : '❌'} {log.description}</p>
                              <span className="activity-date">{formatDate(log.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* --- MODAL TIPO: ALTERAR STATUS --- */}
            {modalType === 'status' && (
              <>
                <div className="modal-header">
                  <h2>{selectedUser.is_active ? '🔒 Bloquear' : '🔓 Ativar'} Usuário</h2>
                  <button className="modal-close" onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja alterar o status de <strong>{selectedUser.username}</strong>?</p>
                  {selectedUser.is_active && <p className="warning-text">⚠️ O usuário será desconectado imediatamente.</p>}
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                  <button className="btn-confirm" onClick={handleToggleStatus} disabled={actionLoading}>Confirmar</button>
                </div>
              </>
            )}

            {/* --- MODAL TIPO: DELETAR --- */}
            {modalType === 'delete' && (
              <>
                <div className="modal-header">
                  <h2>🗑️ Deletar Usuário</h2>
                  <button className="modal-close" onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="modal-body">
                  <p className="danger-text">⚠️ <strong>AÇÃO IRREVERSÍVEL!</strong></p>
                  <p>Isso apagará o usuário <strong>{selectedUser.username}</strong>, seus bots, leads e histórico.</p>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                  <button className="btn-danger" onClick={handleDeleteUser} disabled={actionLoading}>Deletar Tudo</button>
                </div>
              </>
            )}

            {/* --- MODAL TIPO: PROMOVER (Legado, mantido por segurança) --- */}
            {modalType === 'promote' && (
              <>
                <div className="modal-header">
                  <h2>👑 Alterar Privilégios</h2>
                  <button className="modal-close" onClick={closeModal}><X size={20}/></button>
                </div>
                <div className="modal-body">
                  <p>Deseja {selectedUser.is_superuser ? 'REBAIXAR' : 'PROMOVER'} este usuário a Super Admin?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                  <button className="btn-confirm" onClick={handlePromoteUser} disabled={actionLoading}>Confirmar</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}