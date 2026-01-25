import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Bot, ShieldCheck, Fingerprint, Rocket, 
  Settings, Gem, MessageSquare, CreditCard, Zap, 
  CheckCircle2, AlertTriangle, Terminal, Info, 
  ArrowRight, ShieldAlert, Cpu, Share2, Target, 
  MousePointer2, Clock, Trash2, Smartphone, 
  PlusCircle, UserCheck, HelpCircle, ShoppingBag
} from 'lucide-react';

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
            <strong>🔑 TOKEN API (MUITO IMPORTANTE)</strong>
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
                <span>✔️ Botão "Ver Planos"</span>
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
        .tut-rich-content { padding: 0; }
        .tut-sub { color: var(--neon-purple); font-weight: 800; font-size: 0.95rem; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tut-list-v { margin: 20px 0; }
        .tut-list-v p { margin-bottom: 12px; font-size: 0.95rem; color: rgba(255,255,255,0.85); line-height: 1.7; }
        .tut-info-box { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); margin: 20px 0; }
        .tut-box-purple { background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.3); padding: 24px; border-radius: 16px; display: flex; align-items: start; gap: 16px; margin: 24px 0; }
        .token-display { background: #0a0a0f; padding: 14px; border-radius: 10px; border: 1px solid #1a1a2e; font-family: monospace; font-size: 0.8rem; color: #38bdf8; overflow-x: auto; margin-top: 12px; }
        .tut-highlight { background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(56, 189, 248, 0.05)); border: 2px solid var(--neon-purple); padding: 24px; border-radius: 16px; margin: 24px 0; }
        .tut-box-error { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); padding: 18px; border-radius: 14px; color: #fca5a5; display: flex; gap: 14px; align-items: start; margin: 20px 0; }
        .strat-badge { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; padding: 6px 16px; border-radius: 6px; font-size: 11px; font-weight: 900; display: inline-block; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3); }
        .tut-steps-horizontal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 28px 0; }
        .tut-h-item { background: rgba(255,255,255,0.04); padding: 20px; border-radius: 14px; text-align: center; border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s ease; }
        .tut-h-item:hover { background: rgba(255,255,255,0.06); border-color: var(--neon-purple); }
        .tut-h-item span { color: var(--neon-purple); font-size: 11px; font-weight: 900; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .tut-h-item p { font-size: 0.9rem; line-height: 1.5; }
        .tut-box-dark { background: rgba(0,0,0,0.4); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); margin: 20px 0; }
        .tut-box-blue { background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); padding: 24px; border-radius: 16px; margin: 24px 0; }
        .id-code { background: #0a0a0f; padding: 14px; border-radius: 10px; color: var(--neon-blue); font-family: monospace; border: 1px solid rgba(56, 189, 248, 0.2); font-size: 0.85rem; }
        .path-display { display: inline-flex; align-items: center; gap: 8px; background: rgba(168, 85, 247, 0.15); padding: 12px 24px; border-radius: 50px; font-weight: 800; font-size: 0.75rem; color: #fff; border: 1px solid var(--neon-purple); margin-bottom: 24px; }
        .tut-types { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 28px 0; }
        .type-card { padding: 24px; border-radius: 16px; border: 2px solid; transition: all 0.3s ease; }
        .type-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .traditional { background: rgba(168, 85, 247, 0.08); border-color: var(--neon-purple); }
        .custom { background: rgba(56, 189, 248, 0.08); border-color: var(--neon-blue); }
        .type-card p { margin-top: 12px; font-size: 0.85rem; opacity: 0.8; line-height: 1.6; }
        .tut-data-box { background: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
        .tut-btn-fake { background: linear-gradient(135deg, var(--neon-purple), #6366f1); color: #fff; border: none; padding: 12px 28px; border-radius: 10px; font-weight: 900; font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(168, 85, 247, 0.3); }
        .tut-btn-fake:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(168, 85, 247, 0.4); }
        .tut-config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 28px 0; }
        .config-c { background: rgba(255,255,255,0.04); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); }
        .plan-pill-v { background: rgba(0,0,0,0.5); border: 2px solid #2a2a3e; padding: 20px; border-radius: 14px; text-align: center; transition: all 0.3s ease; }
        .plan-pill-v:hover { border-color: var(--neon-purple); background: rgba(168, 85, 247, 0.05); }
        .plan-fields { background: rgba(255,255,255,0.03); padding: 16px; border-radius: 10px; font-size: 0.9rem; opacity: 0.8; margin-bottom: 20px; }
        .flow-types-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 28px 0; }
        .f-type { background: rgba(255,255,255,0.04); padding: 18px; border-radius: 12px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.06); }
        .tut-options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 0.85rem; color: #10b981; margin-top: 16px; }
        .tut-rule-card { background: #000; border: 2px solid var(--neon-purple); border-radius: 16px; overflow: hidden; margin: 28px 0; }
        .rule-h { background: var(--neon-purple); color: #fff; padding: 12px 20px; font-weight: 900; font-size: 0.75rem; display: flex; align-items: center; gap: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .tut-checkout-logic { margin: 28px 0; padding: 24px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); }
        .tut-final-flow { margin: 36px 0; padding: 28px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(56, 189, 248, 0.05)); border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.2); }
        .flow-line { display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 0.75rem; font-weight: 800; color: var(--neon-purple); flex-wrap: wrap; margin-top: 16px; }
        .flow-line span { background: rgba(168, 85, 247, 0.1); padding: 8px 16px; border-radius: 8px; border: 1px solid var(--neon-purple); }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> MANUAL COMPLETO 2026</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>Guia <span className="text-gradient">Definitivo</span></h2>
          <p className="section-subtitle">Tudo o que você precisa para configurar sua estrutura profissional.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.1}s`, background: 'var(--glass-bg)', border: openIndex === index ? '2px solid var(--neon-purple)' : '1px solid var(--glass-border)', borderRadius: '24px', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: openIndex === index ? '0 8px 32px rgba(168, 85, 247, 0.2)' : 'none' }}>
              <div className="tutorial-header p-8 flex items-center gap-7 cursor-pointer" onClick={() => toggleTutorial(index)}>
                <div style={{ width: '70px', height: '70px', background: openIndex === index ? 'linear-gradient(135deg, var(--neon-purple), #6366f1)' : 'rgba(255,255,255,0.04)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openIndex === index ? '#fff' : 'var(--neon-purple)', transition: 'all 0.3s ease', border: openIndex === index ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                <h3 style={{ flex: 1, fontSize: '1.15rem', fontWeight: '900', color: openIndex === index ? '#fff' : 'rgba(255,255,255,0.6)', letterSpacing: '-0.5px' }}>{step.title}</h3>
                <ChevronDown size={28} style={{ color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.3)', transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.5s ease' }}/>
              </div>
              <div style={{ maxHeight: openIndex === index ? '3500px' : '0', opacity: openIndex === index ? '1' : '0', overflow: 'hidden', transition: 'all 0.7s ease' }}>
                <div className="px-12 pb-16 pt-4">
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