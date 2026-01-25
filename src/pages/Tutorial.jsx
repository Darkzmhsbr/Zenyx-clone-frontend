import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Bot, ShieldCheck, Fingerprint, Rocket, 
  Settings, Gem, MessageSquare, CreditCard, Zap, 
  CheckCircle2, AlertTriangle, Terminal, ArrowRight, 
  ShieldAlert, Cpu, MousePointer2, Clock, Smartphone, 
  UserCheck, HelpCircle, ShoppingBag
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
      title: "🤖 ETAPA 1 – CRIANDO O BOT NO TELEGRAM",
      content: (
        <div className="tut-content-wrapper">
          <h4 className="tut-sub-title">Passo a passo:</h4>
          <div className="tut-step-list">
            <p>1. Acesse o Telegram e pesquise por: <strong>@BotFather</strong></p>
            <p>2. Clique em Iniciar ou envie: <code>/start</code></p>
            <p>3. Execute o comando: <code>/newbot</code></p>
          </div>
          
          <div className="tut-gray-box mt-4">
            <p>➤ <strong>Nome do bot:</strong> Ex: <em>Zenyx VIP</em></p>
            <p>➤ <strong>Username do bot:</strong> Ex: <em>zenyxVIPsbot</em></p>
            <p className="mt-2 text-primary font-bold">📌 Regra: Deve terminar com a palavra "bot"</p>
          </div>

          <div className="tut-token-card mt-6">
            <Terminal size={18} className="text-primary" />
            <div>
              <strong>🔐 TOKEN API (MUITO IMPORTANTE)</strong>
              <div className="token-code mt-2"><code>8578926133:AABxFb37Mj8gnEfnpwiijBr2VpfD6_n1Pr0</code></div>
              <p className="mt-2 text-xs opacity-70">Copie este token para conectar à Zenyx e permitir vendas.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck />,
      title: "📢 ETAPA 2 – CANAL OU GRUPO VIP",
      content: (
        <div className="tut-content-wrapper">
          <div className="strat-badge mb-4">RECOMENDAÇÃO ESTRATÉGICA</div>
          <p className="font-bold mb-4">➡️ Crie o VIP antes de cadastrar na plataforma.</p>
          
          <div className="tut-grid-3">
            <div className="tut-mini-card"><span>PASSO 1</span><p>Crie Canal/Grupo</p></div>
            <div className="tut-mini-card"><span>PASSO 2</span><p>🔒 Privado</p></div>
            <div className="tut-mini-card"><span>PASSO 3</span><p>Add Bot Admin</p></div>
          </div>

          <div className="tut-black-box mt-6">
            <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-widest">Permissões Obrigatórias:</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm opacity-80">
              <p>• Enviar mensagens</p> <p>• Apagar mensagens</p>
              <p>• Fixar mensagens</p> <p>• Gerenciar membros</p>
              <p>• Convidar usuários</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Fingerprint />,
      title: "🆔 ETAPA 3 – OBTENDO O ID DO CANAL/GRUPO VIP",
      content: (
        <div className="tut-content-wrapper">
          <p className="mb-4 opacity-70">Use o <strong>@ScanIDBot</strong> para identificar seu canal VIP.</p>
          <div className="tut-step-list">
            <p>1. Inicie o <strong>@ScanIDBot</strong> e clique no clipe 📎</p>
            <p>2. Escolha <strong>Group</strong> ou <strong>Channel</strong>.</p>
            <p>3. Selecione o seu VIP na lista mostrada.</p>
          </div>
          <div className="tut-id-box mt-6">
            <strong>ID RESULTADO:</strong> <code>-1002272430467</code>
            <p className="text-xs mt-2 opacity-60">📌 Copie e salve com seu Token API.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Rocket />,
      title: "🧩 ETAPA 4 – CRIAR BOT NA PLATAFORMA ZENYX",
      content: (
        <div className="tut-content-wrapper">
          <div className="tut-breadcrumb">Menu <ArrowRight size={14}/> Meus Bots <ArrowRight size={14}/> Novo Bot</div>
          
          <div className="tut-grid-2 mt-6">
            <div className="tut-type-card border-primary">
              <Bot size={20} className="mb-2 text-primary" />
              <strong>BOT TRADICIONAL</strong>
              <p className="text-xs opacity-60">Vendas diretas, planos e checkout no chat.</p>
            </div>
            <div className="tut-type-card border-blue">
              <Smartphone size={20} className="mb-2 text-blue-400" />
              <strong>MINI APP (LOJA)</strong>
              <p className="text-xs opacity-60">Catálogo visual e experiência de app.</p>
            </div>
          </div>
          <p className="mt-6 text-sm">Dados: <strong>Nome, Username, Token e ID do VIP.</strong></p>
        </div>
      )
    },
    {
      icon: <Settings />,
      title: "⚙️ ETAPA 5 – CONFIGURAR BOT",
      content: (
        <div className="tut-content-wrapper">
          <div className="tut-breadcrumb">Meus Bots <ArrowRight size={14}/> Gerenciar <ArrowRight size={14}/> ⚙️ Engrenagem</div>
          
          <div className="tut-grid-2 mt-6">
            <div className="tut-config-item">
              <div className="flex items-center gap-2 mb-2"><UserCheck size={18} className="text-primary"/> <strong>ID Admin</strong></div>
              <p className="text-xs opacity-70">Insira seu ID pessoal para receber notificações de vendas.</p>
            </div>
            <div className="tut-config-item">
              <div className="flex items-center gap-2 mb-2"><HelpCircle size={18} className="text-primary"/> <strong>Suporte</strong></div>
              <p className="text-xs opacity-70">Ex: @SuporteZenyx. Username para contato direto.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Gem />,
      title: "💳 ETAPA 6 – CRIAR PLANOS",
      content: (
        <div className="tut-content-wrapper">
          <div className="tut-breadcrumb">Menu <ArrowRight size={14}/> Planos e Ofertas <ArrowRight size={14}/> Planos</div>
          
          <div className="tut-plans-container mt-6">
            <div className="plan-example-row"><span>Plano 7 dias</span> <strong>R$ 19,90</strong></div>
            <div className="plan-example-row"><span>Plano 30 dias</span> <strong>R$ 49,90</strong></div>
            <div className="plan-example-row"><span>Plano Vitalício</span> <strong>R$ 197,00</strong></div>
          </div>
          <div className="tut-info-bar mt-4">
             ✔️ Você pode editar, desativar ou duplicar planos.
          </div>
        </div>
      )
    },
    {
      icon: <MessageSquare />,
      title: "💬 ETAPA 7 – FLUXO DE MENSAGENS (FLOW CHAT)",
      content: (
        <div className="tut-content-wrapper">
          <div className="tut-breadcrumb">Menu <ArrowRight size={14}/> Flow Chat (Fluxo)</div>
          
          <div className="tut-black-box mt-6 p-6">
            <h4 className="text-primary font-bold mb-4 uppercase text-xs tracking-widest">🟢 CONFIGURAÇÃO DO FLUXO PADRÃO</h4>
            <p className="text-sm mb-4"><strong>📩 Mensagem de Boas-Vindas:</strong></p>
            <div className="tut-check-grid text-xs">
              <span>✔️ Mostrar planos direto</span>
              <span>✔️ Botão “Ver Planos”</span>
              <span>✔️ Usar mídia</span>
              <span>✔️ CTA persuasivo</span>
              <span>✔️ Autodestruição</span>
            </div>
          </div>

          <div className="tut-neon-rule mt-6">
            <div className="rule-header"><Cpu size={18} /> REGRA IMPORTANTE (PÁG 7 DO PDF)</div>
            <div className="rule-body">
               <p>Escolha apenas <strong>UM</strong> por mensagem:</p>
               <div className="rule-split">
                  <div className="r-opt"><MousePointer2 size={16}/> Botão In-line</div>
                  <div className="r-sep">OU</div>
                  <div className="r-opt"><Clock size={16}/> Atraso (Delay)</div>
               </div>
            </div>
          </div>

          <div className="tut-checkout-box mt-8">
            <div className="flex items-center gap-2 mb-4"><ShoppingBag size={20} className="text-primary"/> <strong>💰 OFERTA & CHECKOUT</strong></div>
            <p className="text-sm">Ative: <strong>➡️ Mostrar planos junto com essa mensagem</strong></p>
            <div className="automation-line mt-4">
               <span>Início</span> ➔ <span>Boas-vindas</span> ➔ <span>Oferta</span> ➔ <span>Pagamento</span> ➔ <span>VIP</span>
            </div>
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
        .tut-content-wrapper { padding-left: 0; width: 100%; display: flex; flex-direction: column; align-items: flex-start; }
        .tut-sub-title { color: var(--neon-purple); font-weight: 800; font-size: 0.9rem; margin-bottom: 12px; text-align: left; }
        .tut-step-list p { margin-bottom: 8px; font-size: 0.95rem; color: rgba(255,255,255,0.8); text-align: left; }
        .tut-gray-box { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px; width: 100%; text-align: left; }
        .tut-token-card { background: #000; border: 1px solid var(--neon-purple); padding: 20px; border-radius: 15px; display: flex; gap: 15px; width: 100%; text-align: left; }
        .token-code { background: #111; padding: 10px; border-radius: 8px; font-family: monospace; color: #38bdf8; font-size: 0.75rem; word-break: break-all; }
        .strat-badge { background: #fbbf24; color: #000; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 900; }
        .tut-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; }
        .tut-mini-card { background: rgba(255,255,255,0.03); padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .tut-mini-card span { color: var(--neon-purple); font-size: 9px; font-weight: 900; display: block; margin-bottom: 4px; }
        .tut-black-box { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); border-radius: 15px; width: 100%; text-align: left; }
        .tut-id-box { background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); padding: 20px; border-radius: 15px; width: 100%; text-align: left; }
        .tut-breadcrumb { display: inline-flex; align-items: center; gap: 8px; background: rgba(168, 85, 247, 0.1); padding: 8px 16px; border-radius: 50px; font-weight: 800; font-size: 0.75rem; color: #fff; border: 1px solid var(--neon-purple); }
        .tut-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
        .tut-type-card { padding: 20px; border-radius: 15px; background: rgba(255,255,255,0.02); border-bottom: 3px solid; text-align: left; }
        .border-primary { border-color: var(--neon-purple); }
        .border-blue { border-color: #38bdf8; }
        .tut-config-item { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; text-align: left; }
        .tut-plans-container { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .plan-example-row { background: #000; padding: 12px 20px; border-radius: 10px; display: flex; justify-content: space-between; border: 1px solid #222; }
        .tut-info-bar { font-size: 0.8rem; color: #10b981; text-align: left; width: 100%; }
        .tut-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #10b981; }
        .tut-neon-rule { background: #000; border: 2px solid var(--neon-purple); border-radius: 15px; width: 100%; overflow: hidden; }
        .rule-header { background: var(--neon-purple); color: #fff; padding: 8px 15px; font-weight: 900; font-size: 0.7rem; display: flex; align-items: center; gap: 8px; }
        .rule-body { padding: 20px; text-align: center; }
        .rule-split { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 15px; font-weight: 800; font-size: 0.85rem; }
        .r-sep { color: var(--neon-purple); }
        .tut-checkout-box { background: rgba(168, 85, 247, 0.03); border: 1px dashed var(--neon-purple); padding: 30px; border-radius: 20px; width: 100%; text-align: center; }
        .automation-line { font-size: 0.7rem; font-weight: 900; color: var(--neon-purple); opacity: 0.6; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> MANUAL COMPLETO 2026</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>Tutorial <span className="text-gradient">Definitivo</span></h2>
          <p className="section-subtitle">Toda a documentação técnica da ZenyxGbot organizada por etapas.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.1}s`, background: 'var(--glass-bg)', border: openIndex === index ? '1px solid var(--neon-purple)' : '1px solid var(--glass-border)', borderRadius: '24px', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div className="tutorial-header p-8 flex items-center gap-7 cursor-pointer" onClick={() => toggleTutorial(index)}>
                <div style={{ width: '60px', height: '60px', background: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openIndex === index ? '#fff' : 'var(--neon-purple)', transition: 'all 0.3s ease' }}>
                  {React.cloneElement(step.icon, { size: 30 })}
                </div>
                <h3 style={{ flex: 1, fontSize: '1.25rem', fontWeight: '900', color: openIndex === index ? '#fff' : 'rgba(255,255,255,0.5)', textAlign: 'left' }}>{step.title}</h3>
                <ChevronDown size={28} style={{ color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.2)', transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.5s ease' }}/>
              </div>
              <div style={{ maxHeight: openIndex === index ? '2500px' : '0', opacity: openIndex === index ? '1' : '0', overflow: 'hidden', transition: 'all 0.6s ease' }}>
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