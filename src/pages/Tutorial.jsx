import React, { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';
import './Dashboard.css'; // Reutilizando os estilos base de layout

export function Tutorial() {
  // Estado para controlar qual seletor está aberto (null = todos fechados)
  const [openStep, setOpenStep] = useState(null);

  // Função para abrir/fechar o seletor (Lógica: se clica no que já está aberto, ele fecha)
  const toggleStep = (index) => {
    setOpenStep(openStep === index ? null : index);
  };

  // Dados extraídos do seu PDF "Guia Definitivo 2026"
  const steps = [
    {
      icon: <Bot size={24} className="text-primary" />,
      title: "Etapa 1 - Criando o Bot no Telegram",
      content: (
        <div className="space-y-3">
          <p>Acesse o Telegram e pesquise por <strong>@BotFather</strong>. Clique em Iniciar e execute o comando <code>/newbot</code>.</p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
            <li>Defina o <strong>Nome do Bot</strong> (ex: Zenyx VIP).</li>
            <li>Defina o <strong>Username</strong> (ex: zenyxVIPsbot) - Deve terminar obrigatoriamente em "bot".</li>
            <li><strong>Importante:</strong> Copie o Token API fornecido (aquela sequência longa de números e letras).</li>
          </ul>
        </div>
      )
    },
    {
      icon: <ShieldCheck size={24} className="text-primary" />,
      title: "Etapa 2 - Canal ou Grupo VIP",
      content: (
        <div className="space-y-3">
          <p>Crie o Canal ou Grupo que será o seu produto VIP.</p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
            <li>Configure o canal/grupo como <strong>PRIVADO</strong>.</li>
            <li>Adicione o seu Bot recém-criado como <strong>Administrador</strong>.</li>
            <li>Garanta que o bot tenha permissões para: Convidar usuários e Gerenciar mensagens.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Fingerprint size={24} className="text-primary" />,
      title: "Etapa 3 - Obtendo IDs de Identificação",
      content: (
        <div className="space-y-3">
          <p>Você precisa do ID numérico do seu canal para o sistema saber onde liberar os membros.</p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
            <li>Use o bot <strong>@ScanIDBot</strong> ou <strong>@RawDataBot</strong>.</li>
            <li>Encaminhe uma mensagem do seu canal VIP para ele ou adicione-o temporariamente ao grupo.</li>
            <li>O ID geralmente começa com <code>-100</code> (ex: -100123456789). Copie este número.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Rocket size={24} className="text-primary" />,
      title: "Etapa 4 - Cadastro na Plataforma Zenyx",
      content: (
        <div className="space-y-3">
          <p>Vincule seu robô ao nosso sistema:</p>
          <p className="text-sm text-muted-foreground">No menu lateral, vá em <strong>"Meus Bots"</strong> &gt; <strong>"Novo Bot"</strong> e preencha o Nome, Username, Token API e o ID do Canal capturado na etapa anterior.</p>
        </div>
      )
    },
    {
      icon: <Settings size={24} className="text-primary" />,
      title: "Etapa 5 - Configurações Gerais",
      content: (
        <div className="space-y-3">
          <p>Em <strong>"Gerenciar Bots"</strong>, ajuste os detalhes operacionais:</p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
            <li><strong>Admin Principal:</strong> Insira seu ID pessoal do Telegram para receber notificações de vendas.</li>
            <li><strong>Suporte:</strong> Coloque o @ do seu perfil de atendimento para os clientes tirarem dúvidas.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Gem size={24} className="text-primary" />,
      title: "Etapa 6 - Criar Planos de Acesso",
      content: (
        <div className="space-y-3">
          <p>Defina como você vai cobrar pelo seu conteúdo:</p>
          <p className="text-sm text-muted-foreground">Vá em <strong>"Planos e Ofertas"</strong>. Crie planos como "Semanal", "Mensal" ou "Vitalício". Defina o valor e o tempo de permanência automática no grupo.</p>
        </div>
      )
    },
    {
      icon: <MessageSquare size={24} className="text-primary" />,
      title: "Etapa 7 - Fluxo de Mensagens (Flow Chat)",
      content: (
        <div className="space-y-3">
          <p>Configure o funil automático que o cliente verá ao iniciar o bot:</p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
            <li><strong>Mensagem 1:</strong> Boas-vindas.</li>
            <li><strong>Mensagem 2:</strong> Prova social ou benefícios.</li>
            <li><strong>Regra de Ouro:</strong> Cada mensagem pode ter um Botão OU um Atraso (Delay), nunca os dois ao mesmo tempo.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <CreditCard size={24} className="text-primary" />,
      title: "Etapa 8 - Ativar Oferta e Checkout",
      content: (
        <div className="space-y-3">
          <p>Para o cliente conseguir pagar, a última mensagem do seu fluxo deve ter a opção <strong>"Mostrar planos junto com essa mensagem"</strong> ativada.</p>
          <p className="font-semibold text-primary mt-2">Pronto! Seu sistema agora operará em escala 100% automática.</p>
        </div>
      )
    }
  ];

  return (
    <div className="dashboard-container" style={{ marginTop: '70px', marginLeft: 'var(--sidebar-width)', padding: '20px' }}>
      <div className="dashboard-content max-w-4xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BookOpen className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Central de Tutoriais</h1>
            <p className="text-muted-foreground">Siga o passo a passo para configurar sua operação Zenyx.</p>
          </div>
        </div>

        {/* Lista de Seletores (Accordion) */}
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`tutorial-card border rounded-2xl overflow-hidden transition-all duration-300 ${openStep === index ? 'bg-card ring-1 ring-primary/30' : 'bg-card/50 hover:bg-card'}`}
              style={{ borderColor: 'var(--border)' }}
            >
              <button 
                onClick={() => toggleStep(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-colors ${openStep === index ? 'bg-primary text-white' : 'bg-secondary'}`}>
                    {step.icon}
                  </div>
                  <span className={`font-semibold text-lg ${openStep === index ? 'text-primary' : ''}`}>
                    {step.title}
                  </span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 ${openStep === index ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} 
                />
              </button>

              {/* Conteúdo Expansível */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openStep === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-5 pt-0 border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
                  <div className="mt-4 leading-relaxed text-sm md:text-base">
                    {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé de Suporte */}
        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle size={24} className="text-primary" />
            <p className="text-sm font-medium">Ainda precisa de ajuda com a configuração?</p>
          </div>
          <button className="px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Falar com Suporte
          </button>
        </div>

      </div>
    </div>
  );
}