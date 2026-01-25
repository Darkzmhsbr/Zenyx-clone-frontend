import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Bot, 
  ShieldCheck, 
  Fingerprint, 
  Rocket, 
  Settings, 
  Gem, 
  MessageSquare, 
  CreditCard,
  Zap,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

import '../styles/LandingPage.css';

export function Tutorial() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleTutorial = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const steps = [
    {
      icon: <Bot />,
      title: "ETAPA 1 - CRIANDO O BOT NO TELEGRAM",
      content: (
        <div className="space-y-4">
          <p>O primeiro passo é criar a identidade do seu robô através do pai de todos os bots.</p>
          <div className="tutorial-step-box">
            <span className="step-badge">1</span> Acesse o <strong>@BotFather</strong> no Telegram.
            <br /><span className="step-badge">2</span> Clique em <strong>Iniciar</strong> e envie o comando <code>/newbot</code>.
            <br /><span className="step-badge">3</span> Escolha um <strong>Nome</strong> (Ex: Zenyx VIP).
            <br /><span className="step-badge">4</span> Escolha um <strong>Username</strong> terminando obrigatoriamente em "bot" (Ex: zenyxvipsbot).
            <br /><span className="step-badge">5</span> <strong>IMPORTANTE:</strong> O BotFather enviará um Token API. Copie e guarde esse código.
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck />,
      title: "ETAPA 2 - CANAL OU GRUPO VIP",
      content: (
        <div className="space-y-4">
          <p>Aqui é onde seu conteúdo será entregue. O bot precisa ser o "porteiro" deste local.</p>
          <ul className="tutorial-list">
            <li><CheckCircle2 size={16} /> Crie um Canal ou Grupo e defina como <strong>PRIVADO</strong>.</li>
            <li><CheckCircle2 size={16} /> Vá em Administradores e adicione o seu bot.</li>
            <li><CheckCircle2 size={16} /> Dê todas as permissões (especialmente convidar usuários).</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Fingerprint />,
      title: "ETAPA 3 - OBTENDO IDS (BOT + CANAL)",
      content: (
        <div className="space-y-4">
          <p>O sistema precisa do "CPF" do seu canal para funcionar.</p>
          <div className="tutorial-step-box">
            Use o bot <strong>@ScanIDBot</strong>. Encaminhe qualquer mensagem do seu canal VIP para ele. Ele responderá com um ID que começa com <code>-100</code>. Copie esse número inteiro.
          </div>
        </div>
      )
    },
    {
      icon: <Rocket />,
      title: "ETAPA 4 - VINCULAR NA ZENYX",
      content: (
        <div className="space-y-4">
          <p>Agora vamos dar vida ao seu bot dentro do nosso painel.</p>
          <p>Vá em <strong>Meus Bots &gt; Novo Bot</strong> e preencha:</p>
          <ul className="tutorial-list">
            <li><strong>Token API:</strong> O código que você pegou no Passo 1.</li>
            <li><strong>ID do Canal:</strong> O número <code>-100...</code> do Passo 3.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Settings />,
      title: "ETAPA 5 - CONFIGURAÇÃO DE SUPORTE",
      content: (
        <div className="space-y-4">
          <p>Evite perder vendas por falta de atendimento.</p>
          <p>Em <strong>Gerenciar Bots</strong>, insira seu ID de Telegram pessoal para receber notificações de vendas em tempo real e configure o @ de suporte para seus clientes.</p>
        </div>
      )
    },
    {
      icon: <Gem />,
      title: "ETAPA 6 - CRIAR PLANOS",
      content: (
        <div className="space-y-4">
          <p>Defina seus preços e prazos em <strong>Planos e Ofertas</strong>.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="plan-example">Ex: Mensal - R$ 97,00</div>
            <div className="plan-example">Ex: Vitalício - R$ 497,00</div>
          </div>
          <p className="text-sm italic">O sistema removerá automaticamente do VIP quem não renovar.</p>
        </div>
      )
    },
    {
      icon: <MessageSquare />,
      title: "ETAPA 7 - FLOW CHAT (FUNIL)",
      content: (
        <div className="space-y-4">
          <p>Monte sua sequência de vendas automática.</p>
          <div className="warning-box">
            <strong>REGRA DE OURO:</strong> Cada mensagem pode ter um Botão OU um Atraso (Delay). Nunca os dois juntos no mesmo passo.
          </div>
          <p>Adicione provas sociais e textos persuasivos antes de enviar o preço.</p>
        </div>
      )
    },
    {
      icon: <CreditCard />,
      title: "ETAPA 8 - ATIVAR CHECKOUT",
      content: (
        <div className="space-y-4">
          <p>O momento de colher os frutos!</p>
          <p>Na última mensagem do seu Flow Chat, ative a chave: <strong>"Mostrar planos junto com essa mensagem"</strong>.</p>
          <p className="text-success font-bold">Isso ativa o botão de pagamento automático e a liberação imediata do acesso.</p>
        </div>
      )
    }
  ];

  return (
    <div className="landing-page" style={{ 
      marginTop: '70px', 
      marginLeft: 'var(--sidebar-width)', 
      padding: '60px 20px',
      background: '#050507',
      minHeight: 'calc(100vh - 70px)',
      color: '#fff'
    }}>
      <style>{`
        .tutorial-step-box { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); line-height: 2; }
        .step-badge { background: var(--neon-purple); color: #fff; padding: 2px 8px; border-radius: 6px; font-weight: bold; margin-right: 8px; font-size: 12px; }
        .tutorial-list { list-style: none; padding: 0; }
        .tutorial-list li { display: flex; alignItems: center; gap: 10px; margin-bottom: 10px; color: rgba(255,255,255,0.8); }
        .warning-box { border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 12px; border-radius: 4px; font-size: 0.9rem; }
        .plan-example { background: rgba(168, 85, 247, 0.1); border: 1px dashed var(--neon-purple); padding: 10px; border-radius: 8px; text-align: center; font-size: 0.85rem; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-12 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> CONFIGURAÇÃO MESTRE</span>
          <h2 className="section-title" style={{ fontSize: '3rem' }}>Tutoriais <span className="text-gradient">Completos</span></h2>
          <p className="section-subtitle">O guia definitivo para deixar sua operação no 100% automático.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'var(--glass-bg)',
                border: openIndex === index ? '1px solid var(--neon-purple)' : '1px solid var(--glass-border)',
                borderRadius: '20px',
                backdropFilter: 'blur(var(--glass-blur))',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                className="tutorial-header p-6 flex items-center gap-5 cursor-pointer" 
                onClick={() => toggleTutorial(index)}
              >
                <div style={{
                  width: '50px', height: '50px',
                  background: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: openIndex === index ? '#fff' : 'var(--neon-purple)',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }}>
                  {React.cloneElement(step.icon, { size: 24 })}
                </div>
                
                <h3 className="flex-1 text-lg font-bold tracking-wider">{step.title}</h3>

                <ChevronDown 
                  size={24} 
                  style={{
                    color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.3)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.5s ease'
                  }}
                />
              </div>

              <div style={{
                maxHeight: openIndex === index ? '800px' : '0',
                opacity: openIndex === index ? '1' : '0',
                overflow: 'hidden',
                transition: 'all 0.5s ease'
              }}>
                <div className="px-6 pb-8 ml-16 pr-12">
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}