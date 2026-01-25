import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowLeft, Bot, ShieldCheck, Zap, LayoutTemplate, MessageSquare, ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { botService } from '../services/api';
import { useBot } from '../context/BotContext';
import { useAuth } from '../context/AuthContext'; // 🆕 Importado para atualizar o status de onboarding
import './Bots.css';

export function NewBot() {
  const navigate = useNavigate();
  const { refreshBots } = useBot();
  const { hasBot, updateHasBotStatus } = useAuth(); // 🔑 Pegamos a trava e a função de atualização
  
  // Controle de Passos: 'selection' | 'form'
  const [step, setStep] = useState('selection');
  // Define para onde ir após criar: 'geral' ou 'miniapp'
  const [targetTab, setTargetTab] = useState('geral');

  // Estados do Formulário
  const [token, setToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [botName, setBotName] = useState('');
  const [loading, setLoading] = useState(false);

  // Seleciona o tipo e avança para o formulário
  const handleSelectType = (type) => {
    setTargetTab(type === 'custom' ? 'miniapp' : 'geral');
    setStep('form');
  };

  const handleSave = async () => {
    if (!token || !channelId || !botName) {
      return Swal.fire({
        title: 'Campos Incompletos',
        text: 'Preencha todos os campos para continuar.',
        icon: 'warning',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      });
    }

    setLoading(true);
    try {
      const response = await botService.createBot({
        nome: botName,
        token: token,
        id_canal_vip: channelId,
        admin_principal_id: null,
        suporte_username: null
      });

      console.log("✅ Bot configurado:", response);
      
      // 🛠️ ATUALIZAÇÃO CRUCIAL: Notifica o sistema que agora o usuário TEM um bot
      if (updateHasBotStatus) {
        updateHasBotStatus(true);
      }

      await refreshBots();

      Swal.fire({
        title: 'Bot Criado!',
        text: 'Seu bot foi configurado com sucesso. Agora você tem acesso total ao sistema!',
        icon: 'success',
        background: '#1b1730',
        color: '#fff',
        confirmButtonColor: '#c333ff'
      }).then(() => {
        // Após o primeiro bot, enviamos para o Dashboard já desbloqueado
        navigate('/dashboard');
      });

    } catch (error) {
      console.error("Erro ao salvar bot:", error);
      Swal.fire({
        title: 'Erro ao Criar',
        text: error.response?.data?.detail || 'Verifique os dados e tente novamente.',
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
    <div className="bots-container">
      <div className="bots-header">
        <div className="header-info">
          <h1>Criar Novo Bot</h1>
          <p>Configure sua nova operação em poucos segundos.</p>
        </div>
        
        {/* Só mostra o botão voltar se o usuário já tiver outros bots. 
            Se for o primeiro (onboarding), ele não pode voltar para a lista vazia. */}
        {hasBot && (
          <Button variant="outline" onClick={() => navigate('/bots')}>
            <ArrowLeft size={18} /> Voltar
          </Button>
        )}
      </div>

      <div className="bots-card">
        {step === 'selection' ? (
          <div className="selection-grid">
            <div className="selection-item" onClick={() => handleSelectType('standard')}>
              <div className="selection-icon">
                <LayoutTemplate size={32} />
              </div>
              <div className="selection-content">
                <h3>Template Padrão</h3>
                <p>Ideal para vendas diretas e automação simples via chat.</p>
              </div>
              <ChevronRight className="arrow" />
            </div>

            <div className="selection-item" onClick={() => handleSelectType('custom')}>
              <div className="selection-icon" style={{ background: 'rgba(195, 51, 255, 0.1)', color: '#c333ff' }}>
                <ShoppingBag size={32} />
              </div>
              <div className="selection-content">
                <h3>Bot com Loja (Mini App)</h3>
                <p>O visual mais moderno. Loja completa dentro do Telegram.</p>
              </div>
              <ChevronRight className="arrow" />
            </div>
          </div>
        ) : (
          <div className="bot-form">
            <div className="form-header-row">
              <button className="back-step" onClick={() => setStep('selection')}>
                <ArrowLeft size={16} /> Alterar tipo
              </button>
              <div style={{ 
                fontSize: '13px', 
                color: 'var(--primary)', 
                fontWeight: '600',
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                {targetTab === 'miniapp' ? <ShoppingBag size={20}/> : <MessageSquare size={20}/>}
                <span>Criando {targetTab === 'miniapp' ? 'Bot Loja' : 'Bot Tradicional'}</span>
              </div>
            </div>

            <Input 
              label="Nome Interno" 
              placeholder="Ex: Bot Principal" 
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
            />

            <Input 
              label="Token do Bot (BotFather)" 
              placeholder="Ex: 123456789:AAH..." 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              helper="Copie o token gerado pelo @BotFather no Telegram."
            />

            <Input 
              label="ID do Canal VIP" 
              placeholder="Ex: -1001234567890" 
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              helper="O bot deve ser ADMIN do canal. Pegue o ID com o @userinfobot."
            />

            <div style={{ paddingTop: '20px', marginTop: '10px' }}>
              <Button onClick={handleSave} style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Salvando...' : 'Finalizar e Ativar Bot'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}