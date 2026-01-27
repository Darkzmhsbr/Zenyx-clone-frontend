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

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, onboarding } = useAuth();
  const { selectedBot } = useBot();
  
  const [loading, setLoading] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [isGlobalView, setIsGlobalView] = useState(true);
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date()
  ]);
  const [startDate, endDate] = dateRange;
  
  const [metrics, setMetrics] = useState({
    leadsNoPeriodo: 0,
    leadsHoje: 0,
    assinantesAtivos: 0,
    ticketMedio: 0,
    vendasHoje: 0,
    totalTransacoes: 0,
    reembolsos: 0,
    taxaConversao: 0,
    chartData: []
  });

  // Verificar banner de boas-vindas
  useEffect(() => {
    if (onboarding?.completed && !localStorage.getItem('welcomeBannerDismissed')) {
      setShowWelcomeBanner(true);
    }
  }, [onboarding]);

  // Carregar métricas
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const params = {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          botId: isGlobalView ? null : selectedBot?.id
        };
        
        const response = await dashboardService.getMetrics(params);
        
        if (response?.data) {
          setMetrics({
            leadsNoPeriodo: response.data.leadsNoPeriodo || 0,
            leadsHoje: response.data.leadsHoje || 0,
            assinantesAtivos: response.data.assinantesAtivos || 0,
            ticketMedio: response.data.ticketMedio || 0,
            vendasHoje: response.data.vendasHoje || 0,
            totalTransacoes: response.data.totalTransacoes || 0,
            reembolsos: response.data.reembolsos || 0,
            taxaConversao: response.data.taxaConversao || 0,
            chartData: response.data.chartData || []
          });
        }
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [startDate, endDate, isGlobalView, selectedBot]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        botId: isGlobalView ? null : selectedBot?.id
      };
      
      const response = await dashboardService.getMetrics(params);
      
      if (response?.data) {
        setMetrics({
          leadsNoPeriodo: response.data.leadsNoPeriodo || 0,
          leadsHoje: response.data.leadsHoje || 0,
          assinantesAtivos: response.data.assinantesAtivos || 0,
          ticketMedio: response.data.ticketMedio || 0,
          vendasHoje: response.data.vendasHoje || 0,
          totalTransacoes: response.data.totalTransacoes || 0,
          reembolsos: response.data.reembolsos || 0,
          taxaConversao: response.data.taxaConversao || 0,
          chartData: response.data.chartData || []
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissWelcomeBanner = () => {
    setShowWelcomeBanner(false);
    localStorage.setItem('welcomeBannerDismissed', 'true');
  };

  const toggleViewMode = () => {
    setIsGlobalView(!isGlobalView);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-label">{label}</p>
          <p className="chart-tooltip-value">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Banner de Boas-Vindas */}
      {showWelcomeBanner && (
        <div className="welcome-banner">
          <div className="welcome-banner-content">
            <div className="welcome-banner-header">
              <div className="welcome-banner-icon">
                <CheckCircle size={28} />
              </div>
              <div className="welcome-banner-text">
                <h2>Parabéns! Seu bot está pronto para uso</h2>
                <p>Você concluiu todas as etapas de configuração com sucesso.</p>
              </div>
              <button 
                className="welcome-banner-close"
                onClick={dismissWelcomeBanner}
                aria-label="Fechar banner"
              >
                <X size={20} />
              </button>
            </div>
            <div className="welcome-banner-status">
              <div className="status-item">
                <div className="status-icon completed">
                  <CheckCircle size={16} />
                </div>
                <span>Bot criado</span>
              </div>
              <div className="status-item">
                <div className="status-icon completed">
                  <CheckCircle size={16} />
                </div>
                <span>Configurado</span>
              </div>
              <div className="status-item">
                <div className="status-icon completed">
                  <CheckCircle size={16} />
                </div>
                <span>Planos criados</span>
              </div>
              <div className="status-item">
                <div className="status-icon completed">
                  <CheckCircle size={16} />
                </div>
                <span>Fluxo configurado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header do Dashboard */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">
              {isGlobalView ? 'Dashboard' : selectedBot?.name || 'Dashboard'}
            </h1>
            <p className="dashboard-subtitle">
              {isGlobalView 
                ? 'Resumo analítico de todos os bots' 
                : `Métricas do bot selecionado`
              }
            </p>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <Button
            variant="secondary"
            onClick={toggleViewMode}
            className="view-toggle-btn"
          >
            {isGlobalView ? <Bot size={18} /> : <LayoutGrid size={18} />}
            <span>{isGlobalView ? 'Ver por Bot' : 'Visão Global'}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={loading}
            className="refresh-btn"
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            <span>Atualizar</span>
          </Button>
        </div>
      </header>

      {/* Top Cards - Métricas Principais */}
      <section className="top-cards-section">
        <div className="top-cards-grid">
          <div className="metric-card metric-card-primary">
            <div className="metric-card-header">
              <span className="metric-label">Leads no período</span>
              <div className="metric-icon-wrapper">
                <UserPlus size={18} />
              </div>
            </div>
            <div className="metric-value-large">
              {loading ? <span className="skeleton-value" /> : formatNumber(metrics.leadsNoPeriodo)}
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              <span>vs. período anterior</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-label">Leads hoje</span>
              <div className="metric-icon-wrapper accent">
                <Users size={18} />
              </div>
            </div>
            <div className="metric-value-large">
              {loading ? <span className="skeleton-value" /> : formatNumber(metrics.leadsHoje)}
            </div>
            <div className="metric-footer">
              <span className="metric-footer-text">Últimas 24 horas</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-label">Assinantes ativos</span>
              <div className="metric-icon-wrapper success">
                <Activity size={18} />
              </div>
            </div>
            <div className="metric-value-large">
              {loading ? <span className="skeleton-value" /> : formatNumber(metrics.assinantesAtivos)}
            </div>
            <div className="metric-footer">
              <span className="metric-footer-text">Planos ativos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid - Gráfico e KPIs */}
      <section className="main-analytics-section">
        <div className="main-analytics-grid">
          {/* Coluna do Gráfico */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-header-left">
                <div className="chart-icon-wrapper">
                  <TrendingUp size={20} />
                </div>
                <div className="chart-header-info">
                  <span className="chart-label">Faturamento</span>
                  <span className="chart-value">
                    {loading ? <span className="skeleton-value-sm" /> : formatCurrency(metrics.vendasHoje)}
                  </span>
                </div>
              </div>
              <div className="chart-header-right">
                <div className="date-picker-wrapper">
                  <CalendarIcon size={16} className="date-picker-icon" />
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecionar período"
                    className="date-picker-input"
                    popperPlacement="bottom-end"
                  />
                  <ChevronDown size={16} className="date-picker-chevron" />
                </div>
              </div>
            </div>
            <div className="chart-container">
              {loading ? (
                <div className="chart-skeleton">
                  <div className="chart-skeleton-bar" style={{ height: '60%' }} />
                  <div className="chart-skeleton-bar" style={{ height: '80%' }} />
                  <div className="chart-skeleton-bar" style={{ height: '45%' }} />
                  <div className="chart-skeleton-bar" style={{ height: '70%' }} />
                  <div className="chart-skeleton-bar" style={{ height: '55%' }} />
                  <div className="chart-skeleton-bar" style={{ height: '90%' }} />
                  <div className="chart-skeleton-bar" style={{ height: '65%' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={metrics.chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="var(--chart-grid)" 
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      tickFormatter={(value) => `R$${value}`}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--chart-primary)"
                      strokeWidth={2.5}
                      fill="url(#chartGradient)"
                      dot={false}
                      activeDot={{ r: 6, fill: 'var(--chart-primary)', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Coluna de KPIs */}
          <div className="kpi-column">
            <div className="kpi-card">
              <div className="kpi-icon-wrapper">
                <DollarSign size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Ticket médio</span>
                <span className="kpi-value">
                  {loading ? <span className="skeleton-value-sm" /> : formatCurrency(metrics.ticketMedio)}
                </span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrapper accent">
                <ShoppingBag size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Vendas hoje</span>
                <span className="kpi-value">
                  {loading ? <span className="skeleton-value-sm" /> : formatCurrency(metrics.vendasHoje)}
                </span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrapper info">
                <CreditCard size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Transações</span>
                <span className="kpi-value">
                  {loading ? <span className="skeleton-value-sm" /> : formatNumber(metrics.totalTransacoes)}
                </span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrapper warning">
                <RefreshCw size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Reembolsos</span>
                <span className="kpi-value">
                  {loading ? <span className="skeleton-value-sm" /> : formatNumber(metrics.reembolsos)}
                </span>
              </div>
            </div>

            <div className="kpi-card kpi-card-highlight">
              <div className="kpi-icon-wrapper success">
                <Percent size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Taxa de conversão</span>
                <span className="kpi-value">
                  {loading ? <span className="skeleton-value-sm" /> : `${metrics.taxaConversao.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
