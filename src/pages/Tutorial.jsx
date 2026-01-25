import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Bot, ShieldCheck, Fingerprint, Rocket, 
  Settings, Gem, MessageSquare, CreditCard, Zap, 
  CheckCircle2, AlertTriangle, Terminal, Info, 
  ArrowRight, ShieldAlert, Cpu, Share2, Target, 
  MousePointer2, Clock, Trash2, Smartphone, 
  PlusCircle, UserCheck, HelpCircle, ShoppingBag
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
        <div className="tut-rich-content">
          <h4 className="tut-sub">Passo a passo:</h4>
          <div className="tut-list-v">
            <p>1. Acesse o Telegram e pesquise por: <strong>@BotFather</strong></p>
            <p>2. Clique em Iniciar ou execute o comando: <code>/start</code></p>
            <p>3. Execute o comando: <code>/newbot</code></p>
          </div>
          
          <div className="tut-info-box mt-4">
            <p>O BotFather vai pedir duas informações:</p>
            <ul className="ml-4 mt-2 space-y-2">
              <li>➤ <strong>Nome do bot:</strong> (Nome visível) Ex: <em>Zenyx VIP</em></li>
              <li>➤ <strong>Username do bot:</strong> (Nome técnico) Ex: <em>zenyxVIPsbot</em></li>
            </ul>
            <p className="mt-3 text-primary font-bold">📌 Regra obrigatória: Todo username deve terminar com a palavra "bot"</p>
          </div>

          <div className="tut-box-purple mt-6">
            <CheckCircle2 size={20} className="text-primary" />
            <div>
              <strong>✅ Confirmação de criação</strong>
              <p className="text-xs mt-1 opacity-70">Mensagem recebida: "Done! Congratulations on your new bot..."</p>
              <div className="token-display mt-2">
                <code>8578926133:AABxFb37Mj8gnEfnpwiijBr2VpfD6_n1Pr0</code>
              </div>
            </div>
          </div>

          <div className="tut-highlight mt-6">
            <Terminal size={18} />
            <strong>🔐 TOKEN API (MUITO IMPORTANTE)</strong>
            <p className="text-sm mt-2">Função: Conectar à Zenyx, permitir automações, controle do bot, vendas e envio de mensagens.</p>
            <p className="mt-2 font-bold text-primary">➡️ Copie esse token e salve em um bloco de notas.</p>
          </div>

          <div className="tut-box-error mt-4">
            <AlertTriangle size={18} />
            <div>
              <strong>⚠️ PROBLEMA COM USERNAME</strong>
              <p className="text-sm">Se aparecer "already taken", crie outro: <em>zenyxOficialbot, zenyxPaybot, zenyxAcessobot, zenyxStorebot.</em></p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck />,
      title: "📢 ETAPA 2 – CRIAÇÃO DO CANAL OU GRUPO VIP",
      content: (
        <div className="tut-rich-content">
          <div className="strat-badge">RECOMENDAÇÃO ESTRATÉGICA</div>
          <p className="mt-2 font-bold">➡️ Crie o canal/grupo VIP antes de criar o bot na plataforma.</p>
          
          <div className="tut-steps-horizontal mt-6">
            <div className="tut-h-item"><span>PASSO 1</span><p>Crie canal ou grupo</p></div>
            <div className="tut-h-item"><span>PASSO 2</span><p>Configure como 🔒 <strong>Privado</strong></p></div>
            <div className="tut-h-item"><span>PASSO 3</span><p>Adicione bot como <strong>Admin</strong></p></div>
          </div>

          <div className="tut-box-dark mt-6">
            <h4 className="text-xs font-black tracking-widest text-primary mb-3">PERMISSÕES OBRIGATÓRIAS:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>• Enviar mensagens</p>
              <p>• Apagar mensagens</p>
              <p>• Fixar mensagens</p>
              <p>• Gerenciar membros</p>
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
        <div className="tut-rich-content">
          <h4 className="tut-sub">Usando o @ScanIDBot</h4>
          <div className="tut-list-v">
            <p>1. Pesquise por: <strong>@ScanIDBot</strong> e execute <code>/start</code></p>
            <p>2. Clique no ícone de clipe 📎</p>
            <p>3. Escolha <strong>Group</strong> (se VIP for grupo) ou <strong>Channel</strong> (se VIP for canal).</p>
          </div>
          
          <div className="tut-box-blue mt-6">
             <p>O bot mostrará a lista. Selecione o seu VIP.</p>
             <div className="id-code mt-3">
               <strong>RESULTADO:</strong> <code>-1002272430467</code>
             </div>
             <p className="mt-3 text-xs opacity-70">📌 Esse é o ID do VIP. Copie e salve com seu Token API.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Rocket />,
      title: "🧩 ETAPA 4 – CRIAR BOT NA PLATAFORMA ZENYX",
      content: (
        <div className="tut-rich-content">
          <div className="path-display">Menu <ArrowRight size={14}/> Meus Bots <ArrowRight size={14}/> Novo Bot</div>
          
          <div className="tut-types mt-6">
            <div className="type-card traditional">
              <Bot size={20} />
              <strong>🔹 BOT TRADICIONAL</strong>
              <p>Atendimento, Vendas diretas, Planos, Assinaturas, Checkout e Remarketing.</p>
            </div>
            <div className="type-card custom">
              <Smartphone size={20} />
              <strong>🔹 BOT PERSONALIZADO (Mini App)</strong>
              <p>Loja visual, Interface gráfica, Catálogo, Produtos e Banners.</p>
            </div>
          </div>

          <div className="tut-data-box mt-6">
            <h4 className="text-xs font-bold mb-3 opacity-50">DADOS NECESSÁRIOS:</h4>
            <div className="grid grid-cols-2 gap-2 font-bold text-sm">
              <span>• Nome do bot</span>
              <span>• Username</span>
              <span>• Token API</span>
              <span>• ID do VIP</span>
            </div>
            <button className="mt-4 tut-btn-fake">➡️ Salvar e continuar</button>
          </div>
        </div>
      )
    },
    {
      icon: <Settings />,
      title: "⚙️ ETAPA 5 – CONFIGURAR BOT",
      content: (
        <div className="tut-rich-content">
          <div className="path-display">Menu <ArrowRight size={14}/> Meus Bots <ArrowRight size={14}/> Gerenciar <ArrowRight size={14}/> ⚙️ Engrenagem</div>
          
          <div className="tut-config-grid mt-6">
            <div className="config-c">
              <div className="flex items-center gap-2 mb-2"><UserCheck size={18} className="text-primary"/> <strong>ID Admin Principal</strong></div>
              <p className="text-sm opacity-70">Receba notificações, alertas de vendas e eventos do sistema. Insira seu ID pessoal.</p>
            </div>
            <div className="config-c">
              <div className="flex items-center gap-2 mb-2"><HelpCircle size={18} className="text-primary"/> <strong>Username Suporte</strong></div>
              <p className="text-sm opacity-70">Atendimento humano e suporte manual. Ex: <strong>@SuporteZenyx</strong></p>
            </div>
          </div>
          <button className="mt-6 tut-btn-fake">➡️ Salvar e avançar</button>
        </div>
      )
    },
    {
      icon: <Gem />,
      title: "💳 ETAPA 6 – CRIAR PLANOS",
      content: (
        <div className="tut-rich-content">
          <div className="path-display">Menu <ArrowRight size={14}/> Planos e Ofertas <ArrowRight size={14}/> Planos de Acesso</div>
          
          <div className="tut-plan-setup mt-6">
            <h4 className="text-sm font-bold opacity-50 mb-4">CONFIGURAÇÃO DE PLANO:</h4>
            <div className="plan-fields mb-6">Campos: Nome do plano, Preço e Duração.</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="plan-pill-v">7 dias <br/><strong>R$ 19,90</strong></div>
              <div className="plan-pill-v">30 dias <br/><strong>R$ 49,90</strong></div>
              <div className="plan-pill-v">Vitalício <br/><strong>R$ 197,00</strong></div>
            </div>
          </div>
          <div className="tut-box-dark mt-6 flex items-center justify-between">
            <span className="text-sm opacity-70">✔️ Após criar, você pode editar, desativar ou duplicar.</span>
            <button className="tut-btn-fake px-4 py-2">➡️ Criar</button>
          </div>
        </div>
      )
    },
    {
      icon: <MessageSquare />,
      title: "💬 ETAPA 7 – FLUXO DE MENSAGENS (FLOW CHAT)",
      content: (
        <div className="tut-rich-content">
          <div className="path-display">Menu <ArrowRight size={14}/> Flow Chat (Fluxo)</div>
          
          <div className="flow-types-grid mt-6">
             <div className="f-type"><strong>PARA BOT TRADICIONAL:</strong> ➡️ Fluxo Padrão</div>
             <div className="f-type"><strong>PARA BOT PERSONALIZADO:</strong> ➡️ Mini App / Loja</div>
          </div>

          <div className="tut-sub-section mt-8">
            <h4 className="text-primary font-black text-xs tracking-tighter mb-4 uppercase">🟢 CONFIGURAÇÃO DO FLUXO PADRÃO</h4>
            <div className="tut-box-dark p-6">
              <strong>📩 Mensagem de Boas-Vindas</strong>
              <p className="text-sm opacity-70 mt-2">Configure: Texto, Foto/Vídeo, Botão e Autodestruição.</p>
              <div className="tut-options-grid mt-4">
                <span>✔️ Mostrar planos direto</span>
                <span>✔️ Botão “Ver Planos”</span>
                <span>✔️ Usar mídia</span>
                <span>✔️ CTA persuasivo</span>
                <span>✔️ Autodestruição</span>
              </div>
            </div>
          </div>

          <div className="tut-rule-card mt-8">
            <div className="rule-h"><Cpu size={18} /> REGRA IMPORTANTE</div>
            <p className="p-4 text-sm">Você só pode escolher <strong>UM</strong> por mensagem: <br/><strong>Botão embutido OU Atraso de tempo.</strong> <br/>Não é possível usar os dois juntos.</p>
          </div>

          <div className="tut-checkout-logic mt-8">
            <div className="flex items-center gap-2 mb-3"><ShoppingBag size={20} className="text-primary"/> <strong>💰 MENSAGEM DE OFERTA & CHECKOUT</strong></div>
            <p className="text-sm mb-4">Ative a opção: <strong>➡️ Mostrar planos junto com essa mensagem</strong></p>
            <div className="tut-box-blue p-4 text-xs grid grid-cols-2 gap-2">
              <span>• Ativa Checkout</span>
              <span>• Sistema de pagamento</span>
              <span>• Geração de acesso</span>
              <span>• Liberação no VIP</span>
            </div>
          </div>

          <div className="tut-final-flow mt-10">
             <h4 className="text-center text-xs opacity-50 mb-6 uppercase tracking-widest">✅ FLUXO FINAL AUTOMATIZADO</h4>
             <div className="flow-line">
                <span>Início</span> <ArrowRight size={12}/> 
                <span>Boas-vindas</span> <ArrowRight size={12}/> 
                <span>Oferta</span> <ArrowRight size={12}/> 
                <span>Pagamento</span> <ArrowRight size={12}/> 
                <span>VIP</span>
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
        .tut-rich-content { padding-left: 20px; border-left: 1px solid rgba(255,255,255,0.05); }
        .tut-sub { color: var(--neon-purple); font-weight: 800; font-size: 0.9rem; margin-bottom: 15px; }
        .tut-list-v p { margin-bottom: 8px; font-size: 0.95rem; color: rgba(255,255,255,0.8); }
        .tut-info-box { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .tut-box-purple { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); padding: 20px; border-radius: 15px; }
        .token-display { background: #000; padding: 10px; border-radius: 8px; border: 1px solid #333; font-family: monospace; font-size: 0.75rem; color: #38bdf8; overflow-x: auto; }
        .tut-highlight { background: #000; border: 1px solid var(--neon-purple); padding: 20px; border-radius: 15px; }
        .tut-box-error { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 12px; color: #fca5a5; display: flex; gap: 12px; }
        .strat-badge { background: #fbbf24; color: #000; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 900; display: inline-block; }
        .tut-steps-horizontal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .tut-h-item { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; text-align: center; }
        .tut-h-item span { color: var(--neon-purple); font-size: 10px; font-weight: 900; display: block; margin-bottom: 5px; }
        .tut-box-dark { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05); }
        .tut-box-blue { background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); padding: 20px; border-radius: 15px; }
        .id-code { background: #000; padding: 10px; border-radius: 8px; color: var(--neon-blue); font-family: monospace; }
        .path-display { display: inline-flex; align-items: center; gap: 8px; background: rgba(168, 85, 247, 0.1); padding: 10px 20px; border-radius: 50px; font-weight: 800; font-size: 0.75rem; color: #fff; border: 1px solid var(--neon-purple); }
        .tut-types { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .type-card { padding: 20px; border-radius: 15px; border-bottom: 3px solid; }
        .traditional { background: rgba(168, 85, 247, 0.05); border-color: var(--neon-purple); }
        .custom { background: rgba(56, 189, 248, 0.05); border-color: var(--neon-blue); }
        .tut-data-box { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; }
        .tut-btn-fake { background: var(--neon-purple); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 900; font-size: 0.8rem; cursor: pointer; }
        .tut-config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .config-c { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; }
        .plan-pill-v { background: #000; border: 1px solid #333; padding: 15px; border-radius: 12px; text-align: center; }
        .flow-types-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .f-type { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; font-size: 0.8rem; }
        .tut-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.8rem; color: #10b981; }
        .tut-rule-card { background: #000; border: 2px solid var(--neon-purple); border-radius: 15px; overflow: hidden; }
        .rule-h { background: var(--neon-purple); color: #fff; padding: 8px 15px; font-weight: 900; font-size: 0.7rem; display: flex; align-items: center; gap: 8px; }
        .flow-line { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.7rem; font-weight: 900; color: var(--neon-purple); opacity: 0.6; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> MANUAL COMPLETO 2026</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>Guia <span className="text-gradient">Definitivo</span></h2>
          <p className="section-subtitle">Tudo o que você precisa para configurar sua estrutura profissional.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.1}s`, background: 'var(--glass-bg)', border: openIndex === index ? '1px solid var(--neon-purple)' : '1px solid var(--glass-border)', borderRadius: '24px', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div className="tutorial-header p-8 flex items-center gap-7 cursor-pointer" onClick={() => toggleTutorial(index)}>
                <div style={{ width: '60px', height: '60px', background: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openIndex === index ? '#fff' : 'var(--neon-purple)', transition: 'all 0.3s ease' }}>
                  {React.cloneElement(step.icon, { size: 30 })}
                </div>
                <h3 style={{ flex: 1, fontSize: '1.2rem', fontWeight: '900', color: openIndex === index ? '#fff' : 'rgba(255,255,255,0.5)' }}>{step.title}</h3>
                <ChevronDown size={28} style={{ color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.2)', transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.5s ease' }}/>
              </div>
              <div style={{ maxHeight: openIndex === index ? '2500px' : '0', opacity: openIndex === index ? '1' : '0', overflow: 'hidden', transition: 'all 0.7s ease' }}>
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