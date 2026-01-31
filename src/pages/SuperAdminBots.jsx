import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../services/api';
import Swal from 'sweetalert2';
import { 
  Bot, Search, Trash2, ArrowLeft, RefreshCw, 
  Shield, User, DollarSign, Activity 
} from 'lucide-react';
import './SuperAdminBots.css';

export function SuperAdminBots() {
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBots, setTotalBots] = useState(0);

  useEffect(() => {
    fetchBots();
  }, [page]);

  const fetchBots = async (term = searchTerm) => {
    setLoading(true);
    try {
      const data = await superAdminService.getAllBots(page, 50, term);
      setBots(data.data);
      setTotalPages(data.total_pages);
      setTotalBots(data.total);
    } catch (error) {
      console.error("Erro ao buscar bots:", error);
      Swal.fire('Erro', 'Não foi possível carregar a lista de bots.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Volta para primeira página
    fetchBots(searchTerm);
  };

  const handleDeleteBot = async (bot) => {
    const result = await Swal.fire({
      title: '🚨 DELETAR BOT FORÇADO?',
      html: `
        Você está prestes a deletar o bot <b>${bot.nome}</b>.<br>
        O dono <b>${bot.owner.username}</b> perderá acesso imediatamente.<br>
        <br>
        ⚠️ Essa ação apaga Leads, Pedidos e Configurações deste bot.
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, Deletar Bot',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await superAdminService.deleteBotForce(bot.id);
        Swal.fire('Deletado!', 'O bot foi removido do sistema.', 'success');
        fetchBots(); // Recarrega a lista
      } catch (error) {
        Swal.fire('Erro', 'Falha ao deletar o bot.', 'error');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="super-admin-bots-container fade-in">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-title">
          <button className="back-btn" onClick={() => navigate('/superadmin')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>🤖 Bots do Sistema</h1>
            <p>Gerencie todos os robôs da plataforma ({totalBots} encontrados)</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={() => fetchBots()}>
          <RefreshCw size={18} /> Atualizar
        </button>
      </div>

      {/* FILTROS */}
      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nome do bot, dono ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {/* TABELA */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="spin" size={30} />
            <p>Carregando bots do sistema...</p>
          </div>
        ) : bots.length === 0 ? (
          <div className="empty-state">
            <Bot size={40} />
            <p>Nenhum bot encontrado com os filtros atuais.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bot / Identificação</th>
                <th>Dono (Proprietário)</th>
                <th>Faturamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => (
                <tr key={bot.id}>
                  <td className="id-col">#{bot.id}</td>
                  
                  <td className="bot-info-col">
                    <div className="bot-name">{bot.nome}</div>
                    <div className="bot-username">@{bot.username || 'sem_user'}</div>
                  </td>

                  <td className="owner-col">
                    <div className="owner-tag">
                      <User size={12} />
                      {bot.owner.username}
                    </div>
                    <div className="owner-email">{bot.owner.email}</div>
                  </td>

                  <td className="revenue-col">
                    <div className="revenue-value">
                      {formatCurrency(bot.revenue)}
                    </div>
                    <div className="sales-count">
                      {bot.sales} vendas
                    </div>
                  </td>

                  <td>
                    <span className={`status-badge ${bot.status === 'ativo' ? 'active' : 'inactive'}`}>
                      {bot.status === 'ativo' ? 'Ativo' : 'Parado'}
                    </span>
                  </td>

                  <td className="actions-col">
                    <button 
                      className="btn-icon delete" 
                      title="Deletar Bot Forçado"
                      onClick={() => handleDeleteBot(bot)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}