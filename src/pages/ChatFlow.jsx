import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Save, MessageSquare, ArrowDown, Zap, Image as ImageIcon, Video, Plus, Trash2, Edit, Clock, Layout, Globe, Smartphone, ShoppingBag } from 'lucide-react';
import { flowService } from '../services/api';
import { useBot } from '../context/BotContext';
import { useAuth } from '../context/AuthContext'; // 🔥 NOVO
import { useNavigate } from 'react-router-dom'; // 🔥 NOVO
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Input } from '../components/Input';
import { RichInput } from '../components/RichInput';
import './ChatFlow.css';

export function ChatFlow() {
  const { selectedBot } = useBot();
  const { updateOnboarding, onboarding } = useAuth(); // 🔥 NOVO
  const navigate = useNavigate(); // 🔥 NOVO
  const [loading, setLoading] = useState(false);
  
  // Estado do Fluxo
  const [flow, setFlow] = useState({
    start_mode: 'padrao',
    miniapp_url: '',
    miniapp_btn_text: 'ABRIR LOJA 🛍️',
    msg_boas_vindas: '',
    media_url: '',
    btn_text_1: '',
    autodestruir_1: false,
    msg_2_texto: '',
    msg_2_media: '',
    mostrar_planos_2: true,
    mostrar_planos_1: false 
  });

  // Estado dos Passos Dinâmicos (Lista)
  const [steps, setSteps] = useState([]);
  
  // Estado do Modal
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [modalData, setModalData] = useState({
    msg_texto: '',
    msg_media: '',
    btn_texto: 'Próximo ▶️',
    autodestruir: false,
    mostrar_botao: true,
    delay_seconds: 0 
  });

  // Carrega tudo ao mudar o bot
  useEffect(() => {
    if (selectedBot) {
      carregarTudo();
    }
  }, [selectedBot]);

  const carregarTudo = async () => {
    setLoading(true);
    try {
        const flowData = await flowService.getFlow(selectedBot.id);
        if (flowData) {
            setFlow({
                ...flowData,
                start_mode: flowData.start_mode || 'padrao',
                miniapp_btn_text: flowData.miniapp_btn_text || 'ABRIR LOJA 🛍️',
                msg_boas_vindas: flowData.msg_boas_vindas || '',
                media_url: flowData.media_url || '',
                btn_text_1: flowData.btn_text_1 || '🔓 DESBLOQUEAR ACESSO',
                autodestruir_1: flowData.autodestruir_1 || false,
                msg_2_texto: flowData.msg_2_texto || '',
                msg_2_media: flowData.msg_2_media || '',
                mostrar_planos_2: flowData.mostrar_planos_2 !== false,
                mostrar_planos_1: flowData.mostrar_planos_1 || false
            });
        }
        const stepsData = await flowService.getSteps(selectedBot.id);
        setSteps(stepsData || []);
    } catch (error) {
        console.error("Erro ao carregar fluxo:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveFixed = async () => {
    if (flow.start_mode === 'miniapp' && !flow.miniapp_url) {
        return Swal.fire('Atenção', 'Cole o link do seu Mini App para salvar.', 'warning');
    }
    try {
      await flowService.saveFlow(selectedBot.id, flow);
      
      // 🔥 NOVO: Marca ETAPA 4 como completa (ÚLTIMA ETAPA!)
      updateOnboarding('flowConfigured', true);

      Swal.fire({
        icon: 'success',
        title: 'Fluxo Salvo!',
        toast: true, 
        position: 'top-end', 
        showConfirmButton: false, 
        timer: 3000,
        background: '#151515', 
        color: '#fff'
      });

      // 🔥 NOVO: Se acabou de completar onboarding, mostra mensagem especial
      if (!onboarding?.completed && onboarding?.steps.plansCreated) {
        setTimeout(() => {
          Swal.fire({
            title: '🎉 Parabéns! Setup Completo!',
            html: `
              <div style="text-align: center;">
                <p style="font-size: 1.1rem; margin-bottom: 15px;">
                  Seu bot está 100% configurado e pronto para vender!
                </p>
                <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #10b981; font-weight: bold; margin-bottom: 10px;">✅ Todas as etapas concluídas:</p>
                  <p style="font-size: 0.9rem; color: #888;">
                    ✓ Bot Criado<br>
                    ✓ Bot Configurado<br>
                    ✓ Planos Criados<br>
                    ✓ Fluxo Configurado
                  </p>
                </div>
                <p style="color: #888; font-size: 0.9rem;">
                  Agora você tem acesso completo a todas as funcionalidades!
                </p>
              </div>
            `,
            icon: 'success',
            background: '#1b1730',
            color: '#fff',
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Ir para Dashboard 🚀',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(() => {
            navigate('/dashboard');
          });
        }, 3500);
      }

    } catch (error) {
      Swal.fire('Erro', 'Falha ao salvar.', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingStep(null);
    setModalData({ msg_texto: '', msg_media: '', btn_texto: 'Próximo ▶️', autodestruir: false, mostrar_botao: true, delay_seconds: 0 });
    setShowModal(true);
  };

  const handleOpenEditModal = (step) => {
    setEditingStep(step);
    setModalData({
      msg_texto: step.msg_texto || '',
      msg_media: step.msg_media || '',
      btn_texto: step.btn_texto || 'Próximo ▶️',
      autodestruir: step.autodestruir || false,
      mostrar_botao: step.mostrar_botao !== false,
      delay_seconds: step.delay_seconds || 0
    });
    setShowModal(true);
  };

  const handleSaveStep = async () => {
    try {
      if (editingStep) {
        await flowService.updateStep(selectedBot.id, editingStep.id, modalData);
        Swal.fire('Sucesso', 'Passo atualizado', 'success');
      } else {
        await flowService.createStep(selectedBot.id, modalData);
        Swal.fire('Sucesso', 'Passo adicionado', 'success');
      }
      setShowModal(false);
      carregarTudo();
    } catch (error) {
      Swal.fire('Erro', 'Falha ao salvar passo', 'error');
    }
  };

  const handleDeleteStep = async (stepId) => {
    const result = await Swal.fire({
      title: 'Excluir passo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir'
    });

    if (result.isConfirmed) {
      try {
        await flowService.deleteStep(selectedBot.id, stepId);
        Swal.fire('Deletado!', '', 'success');
        carregarTudo();
      } catch (error) {
        Swal.fire('Erro', 'Falha ao deletar', 'error');
      }
    }
  };

  if (!selectedBot) {
    return (
      <div className="empty-state" style={{ padding: '50px', textAlign: 'center' }}>
        <h2>👈 Selecione um bot no menu lateral para configurar o fluxo.</h2>
      </div>
    );
  }

  return (
    <div className="chatflow-container">
      <div className="header-section">
        <div>
          <h1>Configurar Fluxo de Chat</h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '8px' }}>
            Personalize as mensagens que seu bot envia aos clientes.
          </p>
        </div>
      </div>

      {/* CARD: MODO DE ENTRADA */}
      <Card style={{ marginBottom: '20px' }}>
        <CardContent style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layout size={20} />
            Modo de Entrada do Bot
          </h3>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <label style={{ 
              flex: 1, 
              padding: '20px', 
              border: flow.start_mode === 'padrao' ? '2px solid #c333ff' : '1px solid #333',
              borderRadius: '10px',
              cursor: 'pointer',
              background: flow.start_mode === 'padrao' ? 'rgba(195, 51, 255, 0.05)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              <input 
                type="radio" 
                name="start_mode" 
                value="padrao"
                checked={flow.start_mode === 'padrao'}
                onChange={(e) => setFlow({...flow, start_mode: e.target.value})}
                style={{ marginRight: '10px' }}
              />
              <MessageSquare size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <strong>Chat Tradicional</strong>
              <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px', marginLeft: '28px' }}>
                Usuário começa pelo chat normal e vê mensagens de boas-vindas.
              </p>
            </label>

            <label style={{ 
              flex: 1, 
              padding: '20px', 
              border: flow.start_mode === 'miniapp' ? '2px solid #10b981' : '1px solid #333',
              borderRadius: '10px',
              cursor: 'pointer',
              background: flow.start_mode === 'miniapp' ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              <input 
                type="radio" 
                name="start_mode" 
                value="miniapp"
                checked={flow.start_mode === 'miniapp'}
                onChange={(e) => setFlow({...flow, start_mode: e.target.value})}
                style={{ marginRight: '10px' }}
              />
              <ShoppingBag size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <strong>Mini App (Loja)</strong>
              <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px', marginLeft: '28px' }}>
                Bot abre direto na loja visual. Mensagens aparecem depois da compra.
              </p>
            </label>
          </div>

          {flow.start_mode === 'miniapp' && (
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc', fontWeight: 'bold' }}>
                <Globe size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                URL do Mini App
              </label>
              <Input 
                value={flow.miniapp_url}
                onChange={(e) => setFlow({...flow, miniapp_url: e.target.value})}
                placeholder="https://zenyxvips.com/loja/123"
                style={{ marginBottom: '15px' }}
              />
              
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>Texto do Botão de Abertura</label>
              <Input 
                value={flow.miniapp_btn_text}
                onChange={(e) => setFlow({...flow, miniapp_btn_text: e.target.value})}
                placeholder="ABRIR LOJA 🛍️"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* CARD: MENSAGEM 1 (BOAS-VINDAS) */}
      <Card style={{ marginBottom: '20px' }}>
        <CardContent style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="#c333ff" />
            Mensagem 1: Boas-Vindas
          </h3>

          <RichInput
            label="Texto da Mensagem"
            value={flow.msg_boas_vindas}
            onChange={(val) => setFlow({...flow, msg_boas_vindas: val})}
            placeholder="Olá! Bem-vindo ao nosso canal VIP..."
          />

          <Input 
            label="URL da Mídia (opcional)"
            icon={<ImageIcon size={18} />}
            value={flow.media_url}
            onChange={(e) => setFlow({...flow, media_url: e.target.value})}
            placeholder="https://exemplo.com/imagem.jpg"
            helper="Link de uma foto ou vídeo para enviar junto"
          />

          <Input 
            label="Texto do Botão Principal"
            value={flow.btn_text_1}
            onChange={(e) => setFlow({...flow, btn_text_1: e.target.value})}
            placeholder="🔓 DESBLOQUEAR ACESSO"
          />

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={flow.mostrar_planos_1}
                onChange={(e) => setFlow({...flow, mostrar_planos_1: e.target.checked})}
              />
              <span style={{ color: '#ccc' }}>Mostrar planos nesta mensagem</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={flow.autodestruir_1}
                onChange={(e) => setFlow({...flow, autodestruir_1: e.target.checked})}
              />
              <span style={{ color: '#ccc' }}>Auto-destruir após 30s</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* CARD: MENSAGEM 2 */}
      <Card style={{ marginBottom: '20px' }}>
        <CardContent style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowDown size={20} color="#10b981" />
            Mensagem 2: Apresentação dos Planos
          </h3>

          <RichInput
            label="Texto da Mensagem 2"
            value={flow.msg_2_texto}
            onChange={(val) => setFlow({...flow, msg_2_texto: val})}
            placeholder="Escolha o plano ideal para você..."
          />

          <Input 
            label="URL da Mídia (opcional)"
            icon={<Video size={18} />}
            value={flow.msg_2_media}
            onChange={(e) => setFlow({...flow, msg_2_media: e.target.value})}
            placeholder="https://exemplo.com/video.mp4"
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '15px' }}>
            <input 
              type="checkbox"
              checked={flow.mostrar_planos_2}
              onChange={(e) => setFlow({...flow, mostrar_planos_2: e.target.checked})}
            />
            <span style={{ color: '#ccc' }}>Mostrar planos disponíveis</span>
          </label>
        </CardContent>
      </Card>

      {/* BOTÃO SALVAR FIXO */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <Button onClick={handleSaveFixed} disabled={loading}>
          <Save size={18} /> Salvar Fluxo Fixo
        </Button>
      </div>

      {/* PASSOS DINÂMICOS */}
      <Card>
        <CardContent style={{ padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} />
              Passos Extras (Opcionais)
            </h3>
            <Button onClick={handleOpenCreateModal}>
              <Plus size={18} /> Adicionar Passo
            </Button>
          </div>

          {steps.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '30px' }}>
              Nenhum passo extra criado ainda.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {steps.map((step, idx) => (
                <div key={step.id} style={{
                  padding: '20px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ 
                        background: '#c333ff', 
                        color: '#fff', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PASSO {idx + 1}
                      </span>
                      {step.delay_seconds > 0 && (
                        <span style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> Aguarda {step.delay_seconds}s
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
                      {step.msg_texto ? step.msg_texto.substring(0, 100) : '(Sem texto)'}...
                    </p>
                    {step.msg_media && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        📎 Mídia anexada
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleOpenEditModal(step)}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid #10b981',
                        borderRadius: '6px',
                        color: '#10b981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit size={16} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteStep(step.id)}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL DE CRIAR/EDITAR PASSO */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#151515',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            border: '1px solid #333',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px' }}>
              {editingStep ? 'Editar Passo' : 'Novo Passo Extra'}
            </h3>

            <RichInput 
              label="Texto da Mensagem"
              value={modalData.msg_texto}
              onChange={(val) => setModalData({...modalData, msg_texto: val})}
              placeholder="Digite a mensagem..."
            />

            <Input 
              label="URL da Mídia (opcional)"
              value={modalData.msg_media}
              onChange={(e) => setModalData({...modalData, msg_media: e.target.value})}
              placeholder="https://exemplo.com/imagem.jpg"
              icon={<ImageIcon size={18} />}
            />

            <Input 
              label="Texto do Botão"
              value={modalData.btn_texto}
              onChange={(e) => setModalData({...modalData, btn_texto: e.target.value})}
              placeholder="Próximo ▶️"
            />

            <Input 
              label="Delay (segundos)"
              type="number"
              value={modalData.delay_seconds}
              onChange={(e) => setModalData({...modalData, delay_seconds: parseInt(e.target.value) || 0})}
              placeholder="0"
              icon={<Clock size={18} />}
              helper="Tempo de espera antes de enviar esta mensagem"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={modalData.mostrar_botao}
                  onChange={(e) => setModalData({...modalData, mostrar_botao: e.target.checked})}
                />
                <span style={{ color: '#ccc' }}>Mostrar botão de navegação</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={modalData.autodestruir}
                  onChange={(e) => setModalData({...modalData, autodestruir: e.target.checked})}
                />
                <span style={{ color: '#ccc' }}>Auto-destruir após 30s</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveStep}>
                <Save size={16} /> Salvar Passo
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}