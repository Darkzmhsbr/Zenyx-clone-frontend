import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Bot, ShieldCheck, Fingerprint, Rocket, 
  Settings, Gem, MessageSquare, CreditCard, Zap, 
  CheckCircle2, AlertTriangle, Terminal,
  ArrowRight, ShieldAlert, Cpu, Share2, Target, MousePointer2, Clock, Trash2
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
        <div className="tut-rich-content">
          <p className="tut-text">Tudo começa no <strong>@BotFather</strong>, a ferramenta oficial do Telegram. É aqui que você gera o Token (a senha) que fará o robô funcionar.</p>
          <div className="tut-steps-v">
            <div className="tut-step-item"><span className="tut-num">01</span><p>Abra o Telegram, pesquise por <strong>@BotFather</strong> e clique em <strong>Iniciar</strong>.</p></div>
            <div className="tut-step-item"><span className="tut-num">02</span><p>Envie o comando <code>/newbot</code> para iniciar o processo.</p></div>
            <div className="tut-step-item"><span className="tut-num">03</span><p><strong>Nome:</strong> Defina o nome visível (Ex: <em>Zenyx VIP</em>).</p></div>
            <div className="tut-step-item"><span className="tut-num">04</span><p><strong>Username:</strong> O link técnico do bot. <strong>Obrigatório:</strong> Deve terminar em "bot" (Ex: <em>zenyxvipsbot</em>).</p></div>
          </div>
          <div className="tut-alert-card purple">
            <Terminal size={20} />
            <p><strong>TOKEN API:</strong> Copie o código gerado pelo BotFather (Ex: 85789...:AAHx...). Ele é a chave que você usará no painel Zenyx.</p>
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck />,
      title: "ETAPA 2 - CANAL OU GRUPO VIP (O PRODUTO)",
      content: (
        <div className="tut-rich-content">
          <p className="tut-text">Seu canal ou grupo é onde o conteúdo será entregue. O bot precisa ser o administrador para gerenciar os membros.</p>
          <div className="tut-feature-grid">
            <div className="tut-feature-item"><CheckCircle2 className="text-primary" /><span>Crie como <strong>PRIVADO</strong>.</span></div>
            <div className="tut-feature-item"><CheckCircle2 className="text-primary" /><span>Adicione seu bot como <strong>Administrador</strong>.</span></div>
            <div className="tut-feature-item"><CheckCircle2 className="text-primary" /><span>Ative "Convidar Usuários via Link".</span></div>
          </div>
          <div className="tut-info-tag"><InfoIcon size={16} /><span>O bot remove automaticamente quem não pagar se for Admin.</span></div>
        </div>
      )
    },
    {
      icon: <Fingerprint />,
      title: "ETAPA 3 - OBTENDO OS IDS DE IDENTIFICAÇÃO",
      content: (
        <div className="tut-rich-content">
          <p className="tut-text">O sistema precisa do "CPF" do seu canal para saber onde liberar os clientes.</p>
          <div className="tut-code-box">
            <p>1. Procure pelo bot <strong>@ScanIDBot</strong> ou <strong>@RawDataBot</strong>.</p>
            <p>2. Encaminhe qualquer mensagem do seu canal VIP para ele.</p>
            <p>3. Ele responderá com o ID (Ex: <code>-1002345678910</code>). Copie o número inteiro.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Rocket />,
      title: "ETAPA 4 - VINCULAR NA PLATAFORMA ZENYX",
      content: (
        <div className="tut-rich-content">
          <p className="tut-text">Integre seu robô ao painel para começar a automatizar.</p>
          <div className="tut-path-badge">Menu Lateral <ArrowRight size={14}/> Meus Bots <ArrowRight size={14}/> Novo Bot</div>
          <p className="mt-4 tut-text">Cole o <strong>Token API</strong> e o <strong>ID do Canal</strong> e clique em <strong>Salvar</strong>.</p>
        </div>
      )
    },
    {
      icon: <Settings />,
      title: "ETAPA 5 - CONFIGURAÇÃO DE SUPORTE E ADMIN",
      content: (
        <div className="tut-rich-content">
          <p className="tut-text">Defina quem recebe as notificações e quem atende os clientes.</p>
          <div className="tut-config-dual">
            <div className="tut-config-box"><strong>ID ADMIN</strong><p>Cole seu ID pessoal do Telegram para receber alertas de vendas e PIX aprovado.</p></div>
            <div className="tut-config-box"><strong>USERNAME SUPORTE</strong><p>Configure seu @ de suporte para aparecer no botão de ajuda do bot.</p></div>
          </div>
        </div>
      )
    },
    {
      icon: <Gem />,
      title: "ETAPA 6 - CRIAR PLANOS DE ACESSO",
      content: (
        <div className="tut-rich-content">
          <p className="tut-text">Monetize seu conteúdo criando planos com durações específicas.</p>
          <div className="tut-plans-showcase">
            <div className="plan-pill">Mensal: R$ 97,00 (30 dias)</div>
            <div className="plan-pill">Vitalício: R$ 497,00 (9999 dias)</div>
          </div>
          <div className="tut-alert-card orange mt-4">
            <ShieldAlert size={20} />
            <p><strong>ATENÇÃO:</strong> Se o cliente não renovar, o bot o remove do canal imediatamente.</p>
          </div>
        </div>
      )
    },
    {
      icon: <MessageSquare />,
      title: "ETAPA 7 - FLOW CHAT (FUNIL DE VENDAS COMPLETO)",
      content: (
        <div className="tut-rich-content">
          <p className="tut-text">O Flow Chat é o coração do seu bot. É aqui que você constrói a persuasão automática que vende por você.</p>
          
          <div className="tut-golden-rule">
            <div className="rule-badge"><Cpu size={16} /> REGRA DE OURO (Pág 7 do PDF)</div>
            <p>Cada passo do seu fluxo pode ter apenas <strong>UMA</strong> dessas funções ativas:</p>
            <div className="rule-comparison">
               <div className="comp-item"><MousePointer2 /> <span>Botão Embutido</span></div>
               <div className="comp-divider">OU</div>
               <div className="comp-item"><Clock /> <span>Atraso Automático</span></div>
            </div>
            <p className="rule-footer">Não é permitido usar os dois na mesma mensagem. Escolha um ou outro.</p>
          </div>

          <div className="tut-flow-features mt-6">
            <h4 className="features-title">RECURSOS DO FLUXO:</h4>
            <div className="features-list">
               <div className="f-item"><Share2 size={16}/><span><strong>Mídia:</strong> Envie imagens ou vídeos persuasivos.</span></div>
               <div className="f-item"><Target size={16}/><span><strong>CTA:</strong> Use chamadas para ação claras.</span></div>
               <div className="f-item"><Trash2 size={16}/><span><strong>Autodestruição:</strong> Apague mensagens antigas após o clique para limpar o chat.</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <CreditCard />,
      title: "ETAPA 8 - ATIVAR OFERTA E CHECKOUT",
      content: (
        <div className="tut-rich-content text-center">
          <p className="tut-text">O passo final para abrir as vendas.</p>
          <div className="tut-checkout-card">
            <p>Na sua <strong>última mensagem do fluxo</strong>, você DEVE ativar a chave:</p>
            <div className="tut-toggle-box">
              <div className="tut-toggle"><div className="tut-toggle-ball"></div></div>
              <span>Mostrar planos junto com essa mensagem</span>
            </div>
            <p className="checkout-note">Isso ativa o Checkout, Sistema de Pagamento e Liberação Automática.</p>
          </div>
          <div className="tut-final-badge">
             <Zap size={20} /> <span>OPERAÇÃO 100% AUTOMATIZADA ATIVA</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="landing-page" style={{ 
      marginTop: '70px', marginLeft: 'var(--sidebar-width)', padding: '60px 20px',
      background: '#050507', minHeight: 'calc(100vh - 70px)', color: '#fff'
    }}>
      <style>{`
        .tut-rich-content { padding-left: 10px; border-left: 1px solid rgba(255,255,255,0.05); }
        .tut-text { color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 20px; }
        .tut-steps-v { display: flex; flex-direction: column; gap: 12px; }
        .tut-step-item { display: flex; gap: 15px; align-items: flex-start; }
        .tut-num { background: var(--neon-purple); color: #fff; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 11px; font-weight: 800; flex-shrink: 0; }
        .tut-alert-card { display: flex; gap: 15px; padding: 20px; border-radius: 16px; margin-top: 20px; font-size: 0.95rem; }
        .tut-alert-card.purple { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); }
        .tut-alert-card.orange { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; }
        .tut-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .tut-feature-item { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 10px; font-size: 0.9rem; }
        .tut-info-tag { display: inline-flex; align-items: center; gap: 8px; color: var(--neon-blue); font-size: 0.85rem; margin-top: 15px; background: rgba(56, 189, 248, 0.05); padding: 5px 12px; border-radius: 20px; }
        .tut-code-box { background: #000; padding: 20px; border-radius: 12px; border: 1px solid #222; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--neon-blue); line-height: 1.8; }
        .tut-path-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(168, 85, 247, 0.1); padding: 10px 20px; border-radius: 50px; border: 1px solid var(--neon-purple); font-weight: 700; color: #fff; font-size: 0.85rem; }
        .tut-config-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .tut-config-box { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; border-bottom: 2px solid var(--neon-purple); }
        .tut-config-box strong { display: block; margin-bottom: 10px; color: var(--neon-purple); font-size: 0.8rem; }
        .tut-plans-showcase { display: flex; gap: 12px; }
        .plan-pill { background: #111; border: 1px solid #333; padding: 10px 20px; border-radius: 10px; flex: 1; text-align: center; font-weight: 700; font-size: 0.9rem; }
        .tut-golden-rule { background: rgba(0,0,0,0.4); border: 2px solid var(--neon-purple); border-radius: 20px; padding: 25px; box-shadow: 0 0 30px rgba(168, 85, 247, 0.1); }
        .rule-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--neon-purple); color: #fff; padding: 5px 15px; border-radius: 50px; font-weight: 900; font-size: 0.75rem; margin-bottom: 15px; }
        .rule-comparison { display: flex; align-items: center; justify-content: center; gap: 30px; margin: 25px 0; }
        .comp-item { display: flex; flex-direction: column; align-items: center; gap: 10px; font-weight: 700; }
        .comp-divider { color: var(--neon-purple); font-weight: 900; font-size: 1.5rem; }
        .features-list { display: grid; gap: 10px; }
        .f-item { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
        .f-item strong { color: #fff; }
        .tut-checkout-card { background: rgba(255,255,255,0.02); padding: 40px; border-radius: 24px; border: 1px dashed rgba(255,255,255,0.1); }
        .tut-toggle-box { display: inline-flex; align-items: center; gap: 15px; background: #000; padding: 12px 25px; border-radius: 50px; border: 1px solid var(--neon-purple); margin: 20px 0; font-weight: 700; }
        .tut-toggle { width: 44px; height: 22px; background: var(--neon-purple); border-radius: 50px; position: relative; }
        .tut-toggle-ball { position: absolute; right: 4px; top: 4px; width: 14px; height: 14px; background: #fff; border-radius: 50%; }
        .tut-final-badge { display: inline-flex; align-items: center; gap: 12px; margin-top: 30px; color: #10b981; font-weight: 900; letter-spacing: 1px; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> GUIA DEFINITIVO 2026</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>Manual <span className="text-gradient">Premium</span></h2>
          <p className="section-subtitle">Toda a documentação técnica da Zenyx, organizada para sua escala.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-5">
          {steps.map((step, index) => (
            <div key={index} 
              className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'var(--glass-bg)',
                border: openIndex === index ? '1px solid var(--neon-purple)' : '1px solid var(--glass-border)',
                borderRadius: '24px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: openIndex === index ? '0 15px 40px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              <div 
                className="tutorial-header p-8 flex items-center gap-6 cursor-pointer" 
                onClick={() => toggleTutorial(index)}
              >
                <div style={{
                  width: '60px', height: '60px',
                  background: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: openIndex === index ? '#fff' : 'var(--neon-purple)',
                  transition: 'all 0.3s ease',
                  boxShadow: openIndex === index ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none'
                }}>
                  {React.cloneElement(step.icon, { size: 28 })}
                </div>
                
                <h3 style={{ 
                  flex: 1, fontSize: '1.25rem', fontWeight: '900', 
                  color: openIndex === index ? '#fff' : 'rgba(255,255,255,0.7)',
                  transition: 'color 0.3s ease'
                }}>{step.title}</h3>

                <ChevronDown size={28} style={{
                    color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.2)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.5s ease'
                }}/>
              </div>

              <div style={{
                maxHeight: openIndex === index ? '1500px' : '0',
                opacity: openIndex === index ? '1' : '0',
                overflow: 'hidden',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div className="px-10 pb-12 ml-[90px] pr-12 border-l border-white/5">
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

const InfoIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);