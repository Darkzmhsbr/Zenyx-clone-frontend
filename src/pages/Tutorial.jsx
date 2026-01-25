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
  BookOpen,
  HelpCircle,
  Zap
} from 'lucide-react';

// ✅ CORREÇÃO DO CAMINHO: Saindo de pages e entrando em styles
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
      icon: <Bot size={24} />,
      title: "Etapa 1 - Criando o Bot no Telegram",
      content: "Acesse o Telegram e pesquise por @BotFather. Envie o comando /newbot, escolha o nome e o username do seu bot. Ao final, você receberá o Token API. Guarde-o com segurança."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Etapa 2 - Canal ou Grupo VIP",
      content: "Crie o canal ou grupo que será seu produto. Coloque-o como PRIVADO e adicione seu bot recém-criado como administrador com permissão total."
    },
    {
      icon: <Fingerprint size={24} />,
      title: "Etapa 3 - Obtendo IDs de Identificação",
      content: "Use o bot @ScanIDBot. Encaminhe uma mensagem do seu canal para ele para obter o ID numérico (ex: -100...). Esse ID é essencial para o sistema Zenyx gerenciar os membros."
    },
    {
      icon: <Rocket size={24} />,
      title: "Etapa 4 - Cadastro na Plataforma Zenyx",
      content: "No painel, vá em 'Meus Bots' > 'Novo Bot'. Preencha os dados e cole o Token do Telegram. Isso ativa a conexão entre a Zenyx e o seu robô."
    },
    {
      icon: <Settings size={24} />,
      title: "Etapa 5 - Configurações Gerais",
      content: "Configure seu ID de Admin Principal para receber alertas de vendas e o @ de suporte para que seus clientes possam falar com você."
    },
    {
      icon: <Gem size={24} />,
      title: "Etapa 6 - Criar Planos de Acesso",
      content: "Vá em 'Planos e Ofertas'. Crie planos semanais, mensais ou vitalícios. O sistema gerencia os prazos e remove quem não pagar automaticamente."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Etapa 7 - Fluxo de Mensagens (Flow Chat)",
      content: "Crie o funil de vendas. Lembre-se da regra de ouro: cada mensagem pode ter um Botão OU um Atraso (Delay), nunca os dois no mesmo passo."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Etapa 8 - Ativar Oferta e Checkout",
      content: "Na última mensagem do seu fluxo, ative a opção 'Mostrar planos'. Isso habilitará o botão de pagamento e automatizará toda a sua escala."
    }
  ];

  return (
    <div className="dashboard-container" style={{ marginTop: '70px', marginLeft: 'var(--sidebar-width)', padding: '40px 20px', minHeight: '100vh', background: '#050507' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho Estilo Landing Page */}
        <div className={`section-header ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(195, 51, 255, 0.1)', border: '1px solid rgba(195, 51, 255, 0.2)', color: 'var(--primary-color)', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
            <Zap size={14} /> Guia de Configuração
          </span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
            Tutoriais{' '}
            <span style={{
              background: 'linear-gradient(90deg, #c333ff 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Passo a Passo
            </span>
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>
            Aprenda a configurar sua operação profissional em poucos minutos seguindo nosso guia.
          </p>
        </div>

        {/* Lista de Tutoriais */}
        <div className="tutorials-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((tutorial, index) => (
            <div 
              key={index} 
              className={`tutorial-item ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} 
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'rgba(15, 15, 25, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div 
                className="tutorial-header" 
                onClick={() => toggleTutorial(index)}
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  cursor: 'pointer'
                }}
              >
                <div className="tutorial-icon" style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, rgba(195, 51, 255, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c333ff',
                  border: '1px solid rgba(195, 51, 255, 0.3)'
                }}>
                  {tutorial.icon}
                </div>
                <h3 className="tutorial-title" style={{
                  flex: 1,
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: openIndex === index ? '#c333ff' : '#fff'
                }}>
                  {tutorial.title}
                </h3>
                <ChevronDown 
                  size={24} 
                  style={{
                    color: openIndex === index ? '#c333ff' : 'rgba(255,255,255,0.4)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'all 0.4s ease'
                  }}
                />
              </div>
              
              <div 
                style={{
                  maxHeight: openIndex === index ? '400px' : '0',
                  opacity: openIndex === index ? '1' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ padding: '0 24px 24px 92px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {tutorial.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <div style={{ padding: '30px', borderRadius: '24px', background: 'rgba(195, 51, 255, 0.05)', border: '1px solid rgba(195, 51, 255, 0.1)' }}>
            <HelpCircle size={40} style={{ color: '#c333ff', margin: '0 auto 15px' }} />
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Dúvidas Específicas?</h4>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>Nosso suporte técnico está disponível para te ajudar em qualquer etapa.</p>
            <button style={{ padding: '12px 30px', borderRadius: '12px', background: '#c333ff', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
              Falar com Especialista
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}