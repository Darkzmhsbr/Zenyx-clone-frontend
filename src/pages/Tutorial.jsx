import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Bot, ShieldCheck, Fingerprint, Rocket, 
  Settings, Gem, MessageSquare, CreditCard, Zap, 
  CheckCircle2, AlertTriangle, Terminal, Info, 
  ArrowRight, ShieldAlert, Cpu, Share2, Target, 
  MousePointer2, Clock, Trash2, Layout, UserCheck, Smartphone
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
      title: "ETAPA 1 – CRIANDO O BOT NO TELEGRAM",
      content: (
        <div className="tut-container">
          <p className="tut-intro">Acesse o <strong>@BotFather</strong>. Ele é a ferramenta oficial para criar a identidade do seu robô.</p>
          <div className="tut-steps-list">
            <div className="tut-step"><span className="step-n">1</span><p>Pesquise por <strong>@BotFather</strong> e clique em <strong>Iniciar</strong> ou envie <code>/start</code>.</p></div>
            <div className="tut-step"><span className="step-n">2</span><p>Execute o comando <code>/newbot</code>.</p></div>
            <div className="tut-step"><span className="step-n">3</span><p><strong>Nome do bot:</strong> Defina o nome visível (Ex: <em>Zenyx VIP</em>).</p></div>
            <div className="tut-step"><span className="step-n">4</span><p><strong>Username:</strong> Nome técnico. <strong>Regra:</strong> Deve terminar em "bot" (Ex: <em>zenyxVIPsbot</em>).</p></div>
          </div>
          
          <div className="tut-box-purple">
            <Terminal size={20} className="text-primary" />
            <div>
              <strong>🔐 TOKEN API (MUITO IMPORTANTE)</strong>
              <p>Copie o código enviado (Ex: <code>8578926133:AABxF...</code>). Ele conecta o bot à Zenyx, permite automações e vendas.</p>
            </div>
          </div>

          <div className="tut-box-error mt-4">
            <AlertTriangle size={20} />
            <div>
              <strong>PROBLEMA COM USERNAME?</strong>
              <p>Se aparecer "Taken", use variações: <em>zenyxOficialbot, zenyxPaybot, zenyxStorebot.</em></p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck />,
      title: "ETAPA 2 – CRIAÇÃO DO CANAL OU GRUPO VIP",
      content: (
        <div className="tut-container">
          <p className="tut-intro">Crie seu VIP antes de configurar na plataforma. O bot será o "porteiro" do acesso.</p>
          <div className="tut-grid-cards">
            <div className="tut-card-mini"><strong>PASSO 1</strong><p>Crie o Canal ou Grupo.</p></div>
            <div className="tut-card-mini"><strong>PASSO 2</strong><p>Privacidade: 🔒 <strong>Privado</strong>.</p></div>
            <div className="tut-card-mini"><strong>PASSO 3</strong><p>Adicione o bot como <strong>Admin</strong>.</p></div>
          </div>
          <div className="tut-permissions mt-4">
            <h4 className="text-sm font-bold text-primary mb-2 tracking-widest">PERMISSÕES OBRIGATÓRIAS:</h4>
            <div className="tut-check-grid">
               <span><CheckCircle2 size={14}/> Enviar/Apagar mensagens</span>
               <span><CheckCircle2 size={14}/> Fixar mensagens</span>
               <span><CheckCircle2 size={14}/> Gerenciar membros/Convidar</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Fingerprint />,
      title: "ETAPA 3 – OBTENDO O ID DO CANAL/GRUPO VIP",
      content: (
        <div className="tut-container">
          <p className="tut-intro">O ID é o endereço digital que a Zenyx usa para liberar os clientes.</p>
          <div className="tut-scan-box">
            <p>1. Pesquise por <strong>@ScanIDBot</strong> e dê <code>/start</code>.</p>
            <p>2. Clique no clipe 📎 e escolha <strong>Channel</strong> ou <strong>Group</strong>.</p>
            <p>3. Selecione seu VIP na lista.</p>
            <div className="id-result mt-4">
              <strong>RESULTADO:</strong> <code>-1002272430467</code> (Copie o número completo)
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Rocket />,
      title: "ETAPA 4 – CRIAR BOT NA PLATAFORMA ZENYX",
      content: (
        <div className="tut-container">
          <div className="tut-path">Menu <ArrowRight size={14}/> Meus Bots <ArrowRight size={14}/> Novo Bot</div>
          <div className="tut-grid-dual mt-6">
            <div className="type-box">
              <Bot size={20} className="text-primary"/>
              <strong>BOT TRADICIONAL</strong>
              <p>Focado em vendas diretas, planos e assinaturas via chat.</p>
            </div>
            <div className="type-box">
              <Smartphone size={20} className="text-blue-400"/>
              <strong>BOT PERSONALIZADO (Mini App)</strong>
              <p>Loja visual, catálogo e experiência de aplicativo.</p>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-60 italic">*Dados necessários: Nome, Username, Token e ID do VIP.</p>
        </div>
      )
    },
    {
      icon: <Settings />,
      title: "ETAPA 5 – CONFIGURAR BOT",
      content: (
        <div className="tut-container">
          <div className="tut-path">Meus Bots <ArrowRight size={14}/> Gerenciar Bots <ArrowRight size={14}/> ⚙️ Engrenagem</div>
          <div className="tut-grid-dual mt-6">
            <div className="tut-config-card">
               <strong>ID DO ADMIN PRINCIPAL</strong>
               <p>Receba alertas de vendas e notificações do sistema em tempo real.</p>
            </div>
            <div className="tut-config-card">
               <strong>USERNAME DO SUPORTE</strong>
               <p>Ex: @SuporteZenyx. Atendimento manual e contato direto.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Gem />,
      title: "ETAPA 6 – CRIAR PLANOS",
      content: (
        <div className="tut-container">
          <div className="tut-path">Menu <ArrowRight size={14}/> Planos e Ofertas <ArrowRight size={14}/> Planos de Acesso</div>
          <div className="plan-examples mt-6">
            <div className="p-item"><span>7 dias</span> <strong>R$ 19,90</strong></div>
            <div className="p-item"><span>30 dias</span> <strong>R$ 49,90</strong></div>
            <div className="p-item"><span>Vitalício</span> <strong>R$ 197,00</strong></div>
          </div>
          <p className="text-center mt-4 text-xs opacity-50">Você pode editar, remover ou duplicar planos a qualquer momento.</p>
        </div>
      )
    },
    {
      icon: <MessageSquare />,
      title: "ETAPA 7 – FLUXO DE MENSAGENS (FLOW CHAT)",
      content: (
        <div className="tut-container">
          <p className="tut-intro">O Flow Chat é o seu funil de vendas automático.</p>
          <div className="golden-rule-v2">
            <div className="rule-h"><Cpu size={18}/> REGRA DE OURO (OBRIGATÓRIO)</div>
            <p>Você só pode escolher <strong>UM</strong> por mensagem:</p>
            <div className="rule-split">
              <div className="r-box"><MousePointer2 size={20}/> Botão Embutido</div>
              <div className="r-or">OU</div>
              <div className="r-box"><Clock size={20}/> Atraso de Tempo</div>
            </div>
          </div>
          <div className="tut-content-grid mt-6">
            <div className="c-item"><strong>BOAS-VINDAS:</strong> Texto, Mídia, Botão ou Planos automáticos.</div>
            <div className="c-item"><strong>NOVAS MENSAGENS:</strong> Use CTA persuasivo e autodestruição após clique.</div>
          </div>
        </div>
      )
    },
    {
      icon: <CreditCard />,
      title: "ETAPA 8 – ATIVAR OFERTA E CHECKOUT",
      content: (
        <div className="tut-container">
          <div className="checkout-master-card">
            <p className="mb-4">Para ativar as vendas, na última mensagem do fluxo, ative:</p>
            <div className="checkout-toggle">
               <div className="toggle-ui"></div>
               <span>Mostrar planos junto com essa mensagem</span>
            </div>
            <div className="automation-flow mt-6">
              <div className="flow-step">Início <ArrowRight size={12}/> Boas-vindas <ArrowRight size={12}/> Oferta <ArrowRight size={12}/> Pagamento <ArrowRight size={12}/> VIP</div>
            </div>
            <p className="mt-4 text-success font-bold tracking-tighter uppercase">Checkout • Pagamento • Liberação Automática Ativados</p>
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
        .tut-container { padding-left: 20px; }
        .tut-intro { color: rgba(255,255,255,0.6); margin-bottom: 25px; line-height: 1.6; }
        .tut-steps-list { display: flex; flex-direction: column; gap: 15px; }
        .tut-step { display: flex; gap: 15px; align-items: flex-start; }
        .step-n { background: var(--neon-purple); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; flex-shrink: 0; margin-top: 2px; }
        .tut-box-purple { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); padding: 20px; border-radius: 16px; display: flex; gap: 15px; margin-top: 25px; }
        .tut-box-error { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 12px; display: flex; gap: 12px; font-size: 0.9rem; }
        .tut-grid-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .tut-card-mini { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .tut-card-mini strong { display: block; color: var(--neon-purple); font-size: 0.7rem; margin-bottom: 5px; }
        .tut-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
        .tut-check-grid span { display: flex; align-items: center; gap: 8px; }
        .tut-scan-box { background: #000; padding: 25px; border-radius: 15px; border: 1px solid #222; font-family: 'JetBrains Mono', monospace; }
        .id-result { border-top: 1px solid #333; pt-4; color: var(--neon-blue); }
        .tut-path { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); padding: 10px 20px; border-radius: 50px; font-weight: 800; font-size: 0.8rem; color: var(--neon-purple); border: 1px solid rgba(168, 85, 247, 0.2); }
        .tut-grid-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .type-box, .tut-config-card { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border-bottom: 3px solid var(--neon-purple); }
        .type-box strong, .tut-config-card strong { display: block; margin: 10px 0; font-size: 0.9rem; }
        .plan-examples { display: flex; flex-direction: column; gap: 10px; }
        .p-item { background: #111; padding: 15px 25px; border-radius: 12px; display: flex; justify-content: space-between; border: 1px solid #222; }
        .golden-rule-v2 { background: #000; border: 2px solid var(--neon-purple); border-radius: 20px; padding: 25px; }
        .rule-h { color: var(--neon-purple); font-weight: 900; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .rule-split { display: flex; align-items: center; justify-content: space-around; }
        .r-box { text-align: center; font-weight: 800; }
        .r-or { font-weight: 900; color: var(--neon-purple); }
        .checkout-master-card { background: rgba(168, 85, 247, 0.03); border: 1px dashed var(--neon-purple); padding: 40px; border-radius: 25px; text-align: center; }
        .checkout-toggle { display: inline-flex; align-items: center; gap: 15px; background: #000; padding: 12px 30px; border-radius: 50px; border: 1px solid var(--neon-purple); font-weight: 900; }
        .toggle-ui { width: 40px; height: 20px; background: var(--neon-purple); border-radius: 20px; position: relative; }
        .toggle-ui::after { content: ""; position: absolute; right: 3px; top: 3px; width: 14px; height: 14px; background: #fff; border-radius: 50%; }
        .flow-step { font-size: 0.7rem; opacity: 0.4; letter-spacing: 2px; text-transform: uppercase; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> GUIA DEFINITIVO ZENYX</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>Tutorial <span className="text-gradient">Completo</span></h2>
          <p className="section-subtitle">Configuração passo a passo para escala automática de vendas.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} 
              className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'var(--glass-bg)',
                border: openIndex === index ? '1px solid var(--neon-purple)' : '1px solid var(--glass-border)',
                borderRadius: '24px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div 
                className="tutorial-header p-8 flex items-center gap-7 cursor-pointer" 
                onClick={() => toggleTutorial(index)}
              >
                <div style={{
                  width: '64px', height: '64px',
                  background: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: openIndex === index ? '#fff' : 'var(--neon-purple)',
                  transition: 'all 0.3s ease'
                }}>
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                
                <h3 style={{ 
                  flex: 1, fontSize: '1.3rem', fontWeight: '900', 
                  color: openIndex === index ? '#fff' : 'rgba(255,255,255,0.6)'
                }}>{step.title}</h3>

                <ChevronDown size={28} style={{
                    color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.2)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.5s ease'
                }}/>
              </div>

              <div style={{
                maxHeight: openIndex === index ? '2000px' : '0',
                opacity: openIndex === index ? '1' : '0',
                overflow: 'hidden',
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div className="px-10 pb-12 ml-[94px] pr-12 border-l border-white/5">
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