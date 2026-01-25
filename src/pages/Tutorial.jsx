import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Bot, ShieldCheck, Fingerprint, Rocket, 
  Settings, Gem, MessageSquare, CreditCard, Zap, 
  HelpCircle, CheckCircle2, AlertTriangle, Terminal,
  Info, ArrowRight, ShieldAlert, Cpu
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
        <div className="tutorial-container-detailed">
          <p className="description-text">O processo começa no <strong>@BotFather</strong>. Ele é a ferramenta oficial do Telegram para gerar o "cérebro" do seu robô.</p>
          
          <div className="tutorial-grid">
            <div className="instruction-step">
              <span className="step-number">01</span>
              <div>
                <p>Abra o Telegram e pesquise por <strong>@BotFather</strong>. Clique em <strong>Iniciar</strong>.</p>
              </div>
            </div>
            <div className="instruction-step">
              <span className="step-number">02</span>
              <div>
                <p>Envie o comando <code>/newbot</code> para iniciar a criação.</p>
              </div>
            </div>
            <div className="instruction-step">
              <span className="step-number">03</span>
              <div>
                <p><strong>Nome do Bot:</strong> Defina o nome visível (Ex: Zenyx VIP). Pode ser alterado depois.</p>
              </div>
            </div>
            <div className="instruction-step">
              <span className="step-number">04</span>
              <div>
                <p><strong>Username:</strong> O link técnico do bot. <strong>Regra Obrigatória:</strong> Deve terminar com a palavra "bot" (Ex: zenyxVIPsbot).</p>
              </div>
            </div>
          </div>

          <div className="highlight-card purple">
            <Terminal size={20} />
            <div>
              <strong>TOKEN API (Sua Chave Mestra)</strong>
              <p>O BotFather enviará um código (Ex: 8578926133:AABxF...). Este código é o que conecta o Telegram à Zenyx. <strong>Nunca compartilhe este token.</strong></p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <ShieldCheck />,
      title: "ETAPA 2 - CANAL OU GRUPO VIP (PRODUTO)",
      content: (
        <div className="tutorial-container-detailed">
          <p className="description-text">Seu Canal ou Grupo é o produto final. O bot precisa ter poder total sobre ele para gerenciar os acessos.</p>
          
          <div className="tutorial-checklist">
            <div className="check-item">
              <CheckCircle2 className="text-primary" size={20} />
              <p>Crie o Canal/Grupo e mude a privacidade para <strong>PRIVADO</strong>.</p>
            </div>
            <div className="check-item">
              <CheckCircle2 className="text-primary" size={20} />
              <p>Adicione o seu Bot como <strong>Administrador</strong> do canal.</p>
            </div>
            <div className="check-item">
              <CheckCircle2 className="text-primary" size={20} />
              <p><strong>Permissões:</strong> Ative "Convidar Usuários via Link" e "Gerenciar Mensagens".</p>
            </div>
          </div>

          <div className="info-box-glass">
            <Info size={18} />
            <p>O bot só consegue remover usuários expirados se ele for Administrador.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Fingerprint />,
      title: "ETAPA 3 - OBTENDO OS IDS DE IDENTIFICAÇÃO",
      content: (
        <div className="tutorial-container-detailed">
          <p className="description-text">O sistema Zenyx precisa do "endereço digital" do seu canal para entregar o acesso aos clientes.</p>
          
          <div className="tutorial-steps-list">
            <div className="list-step-item">
              <ArrowRight size={16} className="text-primary" />
              <p>Acesse o bot <strong>@ScanIDBot</strong> no Telegram.</p>
            </div>
            <div className="list-step-item">
              <ArrowRight size={16} className="text-primary" />
              <p>Encaminhe qualquer mensagem do seu <strong>Canal VIP</strong> para ele.</p>
            </div>
            <div className="list-step-item">
              <ArrowRight size={16} className="text-primary" />
              <p>Ele retornará o <strong>ID do Canal</strong> (Ex: <code>-1002345678910</code>). Copie o número completo, incluindo o sinal de menos.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Rocket />,
      title: "ETAPA 4 - VINCULAR BOT NA PLATAFORMA",
      content: (
        <div className="tutorial-container-detailed">
          <p className="description-text">Agora vamos integrar o robô ao seu painel administrativo para ele começar a trabalhar.</p>
          
          <div className="action-path">
            <span>Meus Bots</span>
            <ChevronDown size={14} className="-rotate-90" />
            <span>Novo Bot</span>
          </div>

          <div className="instruction-card mt-6">
            <p>Preencha o <strong>Nome</strong>, o <strong>Username</strong>, o <strong>Token API</strong> (Etapa 1) e o <strong>ID do Canal</strong> (Etapa 3). Clique em <strong>Salvar</strong>.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Settings />,
      title: "ETAPA 5 - CONFIGURAÇÕES E ATENDIMENTO",
      content: (
        <div className="tutorial-rich-content">
          <p className="description-text">Configure quem manda e para onde as dúvidas dos clientes vão.</p>
          <div className="tutorial-grid">
            <div className="config-item">
              <strong>ID DO ADMIN</strong>
              <p>Use o @userinfobot para descobrir seu ID numérico e cole no campo "Admin Principal" para receber alertas de vendas.</p>
            </div>
            <div className="config-item">
              <strong>USERNAME SUPORTE</strong>
              <p>Coloque seu @ de atendimento para que os usuários vejam um botão de "Suporte" dentro do bot.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Gem />,
      title: "ETAPA 6 - CRIAR PLANOS DE ACESSO",
      content: (
        <div className="tutorial-container-detailed">
          <p className="description-text">Defina os valores e a duração do acesso ao seu conteúdo VIP.</p>
          
          <div className="plans-grid">
            <div className="plan-visual-card">
              <span className="badge">Exemplo 1</span>
              <h4>Plano Mensal</h4>
              <p>Preço: R$ 97,00 | Duração: 30 dias</p>
            </div>
            <div className="plan-visual-card">
              <span className="badge">Exemplo 2</span>
              <h4>Plano Vitalício</h4>
              <p>Preço: R$ 497,00 | Duração: 9999 dias</p>
            </div>
          </div>

          <div className="highlight-card orange mt-6">
            <ShieldAlert size={20} />
            <p>O bot remove automaticamente o membro do canal assim que o plano expira.</p>
          </div>
        </div>
      )
    },
    {
      icon: <MessageSquare />,
      title: "ETAPA 7 - FLOW CHAT (FUNIL DE VENDAS)",
      content: (
        <div className="tutorial-container-detailed">
          <p className="description-text">O Flow Chat é o vendedor automático que converte seus leads em clientes pagantes.</p>
          
          <div className="golden-rule-container">
            <div className="rule-header">
              <Cpu size={20} />
              <span>REGRA DE OURO (Pág 7 do PDF)</span>
            </div>
            <div className="rule-body">
              <p>Cada mensagem do fluxo pode ter apenas <strong>UMA</strong> dessas opções:</p>
              <ul>
                <li>Botão Embutido (In-line)</li>
                <li className="or-divider">OU</li>
                <li>Atraso de Tempo (Delay automático)</li>
              </ul>
              <p className="footer-note">Não é permitido usar os dois na mesma mensagem.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <CreditCard />,
      title: "ETAPA 8 - ATIVAR OFERTA E CHECKOUT",
      content: (
        <div className="tutorial-container-detailed">
          <p className="description-text">O passo final para abrir o carrinho e começar a receber pagamentos via PIX.</p>
          
          <div className="checkout-instruction">
            <p>Na sua <strong>última mensagem</strong> do Flow Chat, você deve ativar obrigatoriamente a opção:</p>
            <div className="fake-toggle-item">
              <div className="toggle-switch"></div>
              <span>Mostrar planos junto com essa mensagem</span>
            </div>
            <p className="explanation">Isso habilitará o sistema de pagamento e a liberação automática no VIP após a confirmação.</p>
          </div>

          <div className="success-banner-tutorial">
            <CheckCircle2 size={24} />
            <p>Parabéns! Sua operação profissional Zenyx está ativa e escalável.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="landing-page" style={{ 
      marginTop: '70px', marginLeft: 'var(--sidebar-width)', padding: '60px 20px',
      background: '#050507', minHeight: 'calc(100vh - 70px)', color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`
        .tutorial-container-detailed { padding-left: 20px; }
        .description-text { color: rgba(255,255,255,0.6); margin-bottom: 25px; line-height: 1.6; font-size: 1.05rem; }
        .tutorial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px; }
        .instruction-step { display: flex; gap: 15px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .step-number { font-size: 1.5rem; font-weight: 900; color: var(--neon-purple); opacity: 0.5; font-family: 'JetBrains Mono', monospace; }
        .highlight-card { display: flex; gap: 15px; padding: 20px; border-radius: 16px; align-items: flex-start; margin-top: 20px; }
        .highlight-card.purple { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); }
        .highlight-card.orange { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; }
        .tutorial-checklist { display: flex; flex-direction: column; gap: 12px; }
        .check-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.02); padding: 12px 20px; border-radius: 10px; }
        .info-box-glass { display: flex; align-items: center; gap: 10px; margin-top: 20px; padding: 12px; background: rgba(56, 189, 248, 0.05); border-radius: 8px; color: #38bdf8; font-size: 0.9rem; }
        .tutorial-steps-list { display: flex; flex-direction: column; gap: 15px; }
        .list-step-item { display: flex; gap: 12px; align-items: flex-start; font-size: 1rem; color: rgba(255,255,255,0.8); }
        .action-path { display: inline-flex; align-items: center; gap: 10px; background: #000; padding: 10px 20px; border-radius: 50px; border: 1px solid var(--neon-purple); font-weight: 700; font-size: 0.9rem; color: var(--neon-purple); }
        .instruction-card { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }
        .config-item { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; border-bottom: 3px solid var(--neon-purple); }
        .plans-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .plan-visual-card { background: #0c0c14; padding: 20px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05); text-align: center; }
        .plan-visual-card h4 { margin: 10px 0 5px; color: var(--neon-purple); }
        .badge { font-size: 10px; background: var(--neon-purple); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
        .golden-rule-container { background: #000; border: 1px solid var(--neon-purple); border-radius: 20px; overflow: hidden; }
        .rule-header { background: var(--neon-purple); color: #fff; padding: 12px 20px; display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 0.9rem; }
        .rule-body { padding: 30px; text-align: center; }
        .rule-body ul { list-style: none; padding: 0; margin: 20px 0; display: flex; flex-direction: column; gap: 10px; }
        .or-divider { font-weight: 900; color: var(--neon-purple); font-size: 1.2rem; }
        .checkout-instruction { text-align: center; background: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; }
        .fake-toggle-item { display: inline-flex; align-items: center; gap: 15px; background: #111; padding: 12px 25px; border-radius: 50px; border: 1px solid #333; margin: 20px 0; }
        .toggle-switch { width: 40px; height: 20px; background: var(--neon-purple); border-radius: 20px; position: relative; }
        .toggle-switch::after { content: ""; position: absolute; right: 3px; top: 3px; width: 14px; height: 14px; background: #fff; border-radius: 50%; }
        .success-banner-tutorial { margin-top: 30px; display: flex; align-items: center; gap: 15px; color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className={`section-header text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <span className="section-badge"><Zap size={14} /> MANUAL TÉCNICO COMPLETO</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>Guia <span className="text-gradient">Zenyx 2026</span></h2>
          <p className="section-subtitle">Aprenda a configurar cada detalhe da sua operação profissional.</p>
        </div>

        <div className="tutorials-list flex flex-col gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'var(--glass-bg)',
                border: openIndex === index ? '1px solid var(--neon-purple)' : '1px solid var(--glass-border)',
                borderRadius: '24px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: openIndex === index ? '0 20px 40px rgba(0,0,0,0.4)' : 'none'
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
                  border: openIndex === index ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  boxShadow: openIndex === index ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none'
                }}>
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                
                <h3 style={{ 
                  flex: 1, fontSize: '1.35rem', fontWeight: '900', 
                  color: openIndex === index ? '#fff' : 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.5px'
                }}>
                  {step.title}
                </h3>

                <ChevronDown 
                  size={28} 
                  style={{
                    color: openIndex === index ? 'var(--neon-purple)' : 'rgba(255,255,255,0.2)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.5s ease'
                  }}
                />
              </div>

              <div style={{
                maxHeight: openIndex === index ? '1500px' : '0',
                opacity: openIndex === index ? '1' : '0',
                overflow: 'hidden',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div className="px-10 pb-12 ml-[94px] pr-12 border-l border-dashed border-white/5">
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