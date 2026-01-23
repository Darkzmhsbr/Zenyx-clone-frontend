import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 🔥 NOVO
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  RefreshCw, 
  Activity,
  UserPlus,
  Percent,
  CreditCard,
  Calendar as CalendarIcon, 
  ChevronDown,
  LayoutGrid,
  Bot,
  X, // 🔥 NOVO
  CheckCircle // 🔥 NOVO
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';

import { dashboardService } from '../services/api';
import { useBot } from '../context/BotContext';
import { Button } from '../components/Button';
import './Dashboard.css';

registerLocale('pt-BR', ptBR);

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedBot } = useBot();
  const { onboarding } = useAuth(); // 🔥 NOVO
  const [loading, setLoading] = useState(true);
  
  // 🔥 NOVO: Estado para controlar banner de conclusão
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // Estado de visão
  const [isGlobalView, setIsGlobalView] = useState(false);

  // Estado de data
  const [dateRange, setDateRange] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date()
  ]);
  const [startDate, endDate] = dateRange;

  // Estado das métricas
  const [metrics, setMetrics] = useState({
    total_revenue: 0,
    active_users: 0,
    sales_today: 0,
    leads_mes: 0,
    leads_hoje: 0,
    ticket_medio: 0,
    total_transacoes: 0,
    reembolsos: 0,
    taxa_conversao: 0,
    chart_data: [] 
  });

  // 🔥 NOVO: Verifica se acabou de completar onboarding
  useEffect(() => {
    // Se acabou de completar (completed = true e nunca mostrou o banner)
    const hasSeenWelcome = localStorage.getItem('zenyx_welcome_shown');
    if (onboarding?.completed && !hasSeenWelcome) {
      setShowWelcomeBanner(true);
      localStorage.setItem('zenyx_welcome_shown', 'true');
    }
  }, [onboarding]);

  useEffect(() => {
    carregarDados();
  }, [selectedBot, endDate, isGlobalView]);

  const carregarDados = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      
      const botId = isGlobalView ? null : (selectedBot ? selectedBot.id : null);
      
      const data = await dashboardService.getStats(botId, startDate, endDate);
      
      if (!data.chart_data) data.chart_data = [];
      
      setMetrics(data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((value || 0) / 100);
  };

  const toggleViewMode = () => {
    setIsGlobalView(!isGlobalView);
  };

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="date-filter-btn" onClick={onClick} ref={ref}>
      <CalendarIcon size={16} />
      <span>{value || "Filtrar Data"}</span>
      <ChevronDown size={14} />
    </button>
  ));

  return (
    <div className="dashboard-container fade-in">
      
      {/* 🔥 NOVO: Banner de Boas-Vindas após completar onboarding */}
      {showWelcomeBanner && (
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '20px 30px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
        }}>
          <button
            onClick={() => setShowWelcomeBanner(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={40} color="#fff" />
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ 
                color: '#fff', 
                fontSize: '1.5rem', 
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                🎉 Parabéns! Seu bot está pronto para vender!
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1rem',
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                Você completou com sucesso todas as etapas de configuração. Agora você tem acesso completo a todas as funcionalidades da plataforma!
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginTop: '20px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>✓ Bot Criado</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>Conectado e ativo</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>✓ Configurado</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>Todos os dados salvos</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>✓ Planos Criados</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>Pronto para vendas</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>✓ Fluxo Configurado</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>Mensagens prontas</div>
                </div>
              </div>

              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '0.9rem',
                marginTop: '20px',
                fontStyle: 'italic'
              }}>
                💡 Dica: Explore o menu lateral para acessar recursos avançados como Remarketing, Funil de Vendas e Integrações!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CABEÇALHO DA PÁGINA */}
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">
            {isGlobalView ? (
              <>Resumo analítico de <span className="highlight-text">todos os bots</span></>
            ) : (
              <>Resumo analítico de bot selecionado: <span className="highlight-text">{selectedBot ? selectedBot.nome : "Selecione um Bot"}</span></>
            )}
          </h2>
          <p className="page-subtitle">Gerencie, acompanhe e tome decisões com mais clareza.</p>
        </div>
        
        <div className="header-actions">
           <Button variant="ghost" size="icon" onClick={carregarDados} title="Atualizar Dados">
            <RefreshCw size={20} className={loading ? "spin" : ""} />
          </Button>

          <Button onClick={toggleViewMode} style={{ minWidth: '180px' }}>
            {isGlobalView ? (
              <>
                <Bot size={18} style={{ marginRight: '8px' }} />
                Ver bot selecionado
              </>
            ) : (
              <>
                <LayoutGrid size={18} style={{ marginRight: '8px' }} />
                Ver todos os bots
              </>
            )}
          </Button>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="top-cards-grid">
        
        <div className="analytic-card">
          <div className="card-header-row">
            <span className="card-label">LEADS (NO PERÍODO)</span>
            <Users size={18} className="card-icon-muted" />
          </div>
          <div className="card-main-value">
            {loading ? "..." : metrics.leads_mes}
          </div>
        </div>

        <div className="analytic-card">
          <div className="card-header-row">
            <span className="card-label">NOVOS LEADS HOJE</span>
            <UserPlus size={18} className="card-icon-muted" />
          </div>
          <div className="card-main-value">
            {loading ? "..." : metrics.leads_hoje}
          </div>
        </div>

        <div className="analytic-card">
          <div className="card-header-row">
            <span className="card-label">ASSINANTES ATIVOS</span>
            <Activity size={18} className="card-icon-muted" />
          </div>
          <div className="card-main-value">
            {loading ? "..." : metrics.active_users}
          </div>
        </div>

      </div>

      {/* GRID PRINCIPAL */}
      <div className="main-analytic-grid">
        
        {/* COLUNA ESQUERDA: GRÁFICO */}
        <div className="chart-section card-box">
          <div className="chart-header">
             
             <div className="chart-info">
               <div className="icon-circle">
                 <ShoppingBag size={20} />
               </div>
               <div>
                 <span className="chart-label">FATURAMENTO (PERÍODO)</span>
                 <div className="chart-big-number">
                    {loading ? "..." : formatMoney(metrics.total_revenue)}
                 </div>
               </div>
             </div>

             <div className="chart-filter-wrapper">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomDateInput />}
                  withPortal
                />
             </div>

          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.chart_data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c333ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#c333ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2647" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#b9b6c9', fontSize: 12}} 
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#b9b6c9', fontSize: 12}} 
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1b1730', border: '1px solid #2d2647', borderRadius: '8px', color: '#fff'}}
                  itemStyle={{color: '#c333ff'}}
                  formatter={(value) => [`R$ ${value.toFixed(2)}`, "Faturamento"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#c333ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COLUNA DIREITA: LISTA DE KPIs */}
        <div className="side-stats-column">
          
          <div className="side-stat-card">
             <div className="side-stat-header">
               <span>TICKET MÉDIO</span>
               <ShoppingBag size={16} />
             </div>
             <div className="side-stat-value">
               {loading ? "..." : formatMoney(metrics.ticket_medio)}
             </div>
          </div>

          <div className="side-stat-card">
             <div className="side-stat-header">
               <span>VENDAS HOJE</span>
               <DollarSign size={16} />
             </div>
             <div className="side-stat-value">
               {loading ? "..." : formatMoney(metrics.sales_today)}
             </div>
          </div>

          <div className="side-stat-card">
             <div className="side-stat-header">
               <span>TRANSAÇÕES (Período)</span>
               <RefreshCw size={16} />
             </div>
             <div className="side-stat-value">
               {loading ? "..." : metrics.total_transacoes}
             </div>
          </div>

           <div className="side-stat-card">
             <div className="side-stat-header">
               <span>REEMBOLSOS</span>
               <CreditCard size={16} />
             </div>
             <div className="side-stat-value text-danger">
               {loading ? "..." : formatMoney(metrics.reembolsos)}
             </div>
          </div>

          <div className="side-stat-card">
             <div className="side-stat-header">
               <span>CONVERSÃO</span>
               <Percent size={16} />
             </div>
             <div className="side-stat-value highlight-text">
               {loading ? "..." : `${metrics.taxa_conversao}%`}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}