import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Save, ArrowLeft, MessageSquare, Key, Headphones, 
  Smartphone, Layout, PlayCircle, Type, Plus, Trash2, Edit, Image as ImageIcon, Link, User, Palette, Shield, Radio
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { botService, miniappService } from '../services/api';
import { useAuth } from '../context/AuthContext'; // 🔥 NOVO: Import do useAuth
import Swal from 'sweetalert2';
import './Bots.css';

export function BotConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateOnboarding, onboarding } = useAuth(); // 🔥 NOVO: Hook de onboarding
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('geral');
  
  // --- CONFIGURAÇÃO GERAL ---
  const [config, setConfig] = useState({
    nome: '', 
    token: '', 
    id_canal_vip: '', 
    admin_principal_id: '',
    suporte_username: '', 
    status: 'desconectado'
  });

  // --- CONFIGURAÇÃO MINI APP (COMPLETA) ---
  const [miniAppConfig, setMiniAppConfig] = useState({
    hero_title: 'ACERVO PREMIUM',
    hero_subtitle: 'O maior acervo da internet.',
    hero_btn_text: 'LIBERAR CONTEÚDO 🔓',
    hero_video_url: '',
    background_value: '#000000',
    background_type: 'solid',
    enable_popup: false,
    popup_text: 'VOCÊ GANHOU UM PRESENTE!',
    popup_video_url: '',
    footer_text: '© 2026 Premium Club.'
  });

  // --- CATEGORIAS ---
  const [categories, setCategories] = useState([]);
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [currentCat, setCurrentCat] = useState(null);

  useEffect(() => {
    // 🔥 Verifica se veio algum comando de aba do NewBot.jsx
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
    
    carregarConfig();
    carregarMiniAppConfig();
    carregarCategorias();
  }, [id, location.state]);

  const carregarConfig = async () => {
    try {
      setLoading(true);
      const dados = await botService.getBot(id);
      setConfig(dados);
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Falha ao carregar configurações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarMiniAppConfig = async () => {
    try {
      const dados = await miniappService.getMiniAppConfig(id);
      if (dados) {
        setMiniAppConfig(dados);
      }
    } catch (error) {
      console.error('Erro ao carregar MiniApp config:', error);
    }
  };

  const carregarCategorias = async () => {
    try {
      const lista = await miniappService.getCategories(id);
      setCategories(lista || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const salvarConfigGeral = async () => {
    try {
      await botService.updateBot(id, {
        nome: config.nome,
        token: config.token,
        id_canal_vip: config.id_canal_vip,
        admin_principal_id: config.admin_principal_id,
        suporte_username: config.suporte_username
      });

      // 🔥 NOVO: Marca ETAPA 2 como completa
      updateOnboarding('botConfigured', true);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#151515',
        color: '#fff'
      });

      Toast.fire({
        icon: 'success',
        title: '✅ Configuração salva!'
      });

      // 🔥 NOVO: Se está em onboarding, redireciona para próximo passo
      if (!onboarding?.completed && onboarding?.steps.botCreated && !onboarding?.steps.plansCreated) {
        setTimeout(() => {
          Swal.fire({
            title: 'Ótimo! 🎉',
            html: `
              <p>Bot configurado com sucesso!</p>
              <p style="color: #888; font-size: 0.9rem; margin-top: 10px;">Próximo passo: Criar seus planos de acesso</p>
            `,
            icon: 'success',
            background: '#151515',
            color: '#fff',
            confirmButtonColor: '#c333ff',
            confirmButtonText: 'Ir para Planos'
          }).then(() => {
            navigate('/planos');
          });
        }, 2500);
      }

    } catch (error) {
      Swal.fire('Erro', 'Falha ao salvar configurações', 'error');
    }
  };

  const salvarMiniAppConfig = async () => {
    try {
      await miniappService.updateMiniAppConfig(id, miniAppConfig);
      
      Swal.fire({
        title: 'Sucesso!',
        text: 'Configurações do MiniApp salvas.',
        icon: 'success',
        background: '#151515',
        color: '#fff'
      });

      // 🔥 NOVO: Também marca etapa 2 como completa
      updateOnboarding('botConfigured', true);

      // 🔥 NOVO: Se está em onboarding, redireciona
      if (!onboarding?.completed && onboarding?.steps.botCreated && !onboarding?.steps.plansCreated) {
        setTimeout(() => {
          Swal.fire({
            title: 'MiniApp Configurado! 🎉',
            html: `
              <p>Sua loja está pronta!</p>
              <p style="color: #888; font-size: 0.9rem; margin-top: 10px;">Próximo passo: Criar planos de pagamento</p>
            `,
            icon: 'success',
            background: '#151515',
            color: '#fff',
            confirmButtonColor: '#c333ff',
            confirmButtonText: 'Criar Planos'
          }).then(() => {
            navigate('/planos');
          });
        }, 2500);
      }

    } catch (error) {
      Swal.fire('Erro', 'Falha ao salvar MiniApp', 'error');
    }
  };

  // === FUNÇÕES CATEGORIAS ===
  const abrirModalCat = (cat = null) => {
    if (cat) {
      setCurrentCat({ ...cat });
    } else {
      setCurrentCat({ name: '', slug: '', icon_emoji: '📂' });
    }
    setIsEditingCat(true);
  };

  const salvarCategoria = async () => {
    try {
      if (currentCat.id) {
        await miniappService.updateCategory(id, currentCat.id, currentCat);
      } else {
        await miniappService.createCategory(id, currentCat);
      }
      Swal.fire('Sucesso!', 'Categoria salva', 'success');
      setIsEditingCat(false);
      carregarCategorias();
    } catch (error) {
      Swal.fire('Erro', 'Falha ao salvar categoria', 'error');
    }
  };

  const deletarCategoria = async (catId) => {
    const result = await Swal.fire({
      title: 'Excluir categoria?',
      text: 'Isso removerá a categoria e seus produtos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        await miniappService.deleteCategory(id, catId);
        Swal.fire('Deletado!', '', 'success');
        carregarCategorias();
      } catch (error) {
        Swal.fire('Erro', 'Falha ao deletar', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="bot-config-container" style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Button variant="ghost" onClick={() => navigate('/bots')}>
            <ArrowLeft size={20} /> Voltar
          </Button>
          <h1 style={{ marginTop: '15px', fontSize: '1.8rem' }}>Configurar Bot: {config.nome}</h1>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-container" style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #333', marginBottom: '30px' }}>
        <button 
          className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`}
          onClick={() => setActiveTab('geral')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'geral' ? 'rgba(195, 51, 255, 0.1)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'geral' ? '2px solid #c333ff' : '2px solid transparent',
            color: activeTab === 'geral' ? '#c333ff' : '#888',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          <MessageSquare size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Configuração Geral
        </button>

        <button 
          className={`tab-btn ${activeTab === 'miniapp' ? 'active' : ''}`}
          onClick={() => setActiveTab('miniapp')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'miniapp' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'miniapp' ? '2px solid #10b981' : '2px solid transparent',
            color: activeTab === 'miniapp' ? '#10b981' : '#888',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          <Smartphone size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          MiniApp / Loja
        </button>
      </div>

      {/* ============ ABA 1: CONFIGURAÇÃO GERAL ============ */}
      {activeTab === 'geral' && (
        <Card>
          <CardContent style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
              <Key size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Dados Essenciais
            </h3>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Nome Interno</label>
                <input
                  type="text"
                  value={config.nome}
                  onChange={(e) => setConfig({ ...config, nome: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Token do Bot (BotFather)</label>
                <input
                  type="text"
                  value={config.token}
                  onChange={(e) => setConfig({ ...config, token: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>ID do Canal VIP</label>
                <input
                  type="text"
                  value={config.id_canal_vip}
                  onChange={(e) => setConfig({ ...config, id_canal_vip: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  placeholder="Ex: -1001234567890"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
                  <Shield size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  ID do Admin Principal (Telegram)
                </label>
                <input
                  type="text"
                  value={config.admin_principal_id}
                  onChange={(e) => setConfig({ ...config, admin_principal_id: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  placeholder="Ex: 123456789"
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Pegue seu ID com o @userinfobot no Telegram
                </small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
                  <Headphones size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Username do Suporte (opcional)
                </label>
                <input
                  type="text"
                  value={config.suporte_username}
                  onChange={(e) => setConfig({ ...config, suporte_username: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  placeholder="@seususuario"
                />
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={salvarConfigGeral}>
                <Save size={18} /> Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ ABA 2: MINIAPP / LOJA ============ */}
      {activeTab === 'miniapp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CARD 1: HERO SECTION */}
          <Card>
            <CardContent style={{ padding: '25px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layout size={20} color="#10b981" />
                Hero Section (Topo da Loja)
              </h3>

              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>
                    <Type size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={miniAppConfig.hero_title}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, hero_title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    placeholder="Ex: ACERVO PREMIUM"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Subtítulo</label>
                  <input
                    type="text"
                    value={miniAppConfig.hero_subtitle}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, hero_subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    placeholder="Ex: O maior acervo da internet."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Texto do Botão</label>
                  <input
                    type="text"
                    value={miniAppConfig.hero_btn_text}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, hero_btn_text: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    placeholder="Ex: LIBERAR CONTEÚDO 🔓"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>
                    <PlayCircle size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    URL do Vídeo (Hero)
                  </label>
                  <input
                    type="text"
                    value={miniAppConfig.hero_video_url}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, hero_video_url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    placeholder="https://exemplo.com/video.mp4 (opcional)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: BACKGROUND */}
          <Card>
            <CardContent style={{ padding: '25px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Palette size={20} color="#c333ff" />
                Background da Loja
              </h3>

              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Tipo de Background</label>
                  <select
                    value={miniAppConfig.background_type}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, background_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  >
                    <option value="solid">Cor Sólida</option>
                    <option value="gradient">Gradiente</option>
                    <option value="image">Imagem URL</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>
                    {miniAppConfig.background_type === 'solid' && 'Cor (Hex)'}
                    {miniAppConfig.background_type === 'gradient' && 'Gradiente CSS'}
                    {miniAppConfig.background_type === 'image' && 'URL da Imagem'}
                  </label>
                  <input
                    type="text"
                    value={miniAppConfig.background_value}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, background_value: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    placeholder={
                      miniAppConfig.background_type === 'solid' ? '#000000' :
                      miniAppConfig.background_type === 'gradient' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                      'https://exemplo.com/bg.jpg'
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: POPUP */}
          <Card>
            <CardContent style={{ padding: '25px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Radio size={20} color="#ef4444" />
                Popup Promocional
              </h3>

              <div style={{ display: 'grid', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={miniAppConfig.enable_popup}
                    onChange={(e) => setMiniAppConfig({ ...miniAppConfig, enable_popup: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: '#ccc' }}>Ativar Popup ao entrar na loja</span>
                </label>

                {miniAppConfig.enable_popup && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Texto do Popup</label>
                      <input
                        type="text"
                        value={miniAppConfig.popup_text}
                        onChange={(e) => setMiniAppConfig({ ...miniAppConfig, popup_text: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          color: '#fff'
                        }}
                        placeholder="Ex: VOCÊ GANHOU UM PRESENTE!"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>URL do Vídeo (Popup)</label>
                      <input
                        type="text"
                        value={miniAppConfig.popup_video_url}
                        onChange={(e) => setMiniAppConfig({ ...miniAppConfig, popup_video_url: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          color: '#fff'
                        }}
                        placeholder="https://exemplo.com/promo.mp4"
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: FOOTER */}
          <Card>
            <CardContent style={{ padding: '25px' }}>
              <h3 style={{ marginBottom: '20px' }}>Rodapé</h3>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Texto do Rodapé</label>
                <input
                  type="text"
                  value={miniAppConfig.footer_text}
                  onChange={(e) => setMiniAppConfig({ ...miniAppConfig, footer_text: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                  placeholder="© 2026 Sua Empresa."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 5: CATEGORIAS */}
          <Card>
            <CardContent style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layout size={20} />
                  Categorias de Produtos
                </h3>
                <Button onClick={() => abrirModalCat(null)}>
                  <Plus size={18} /> Nova Categoria
                </Button>
              </div>

              {categories.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  Nenhuma categoria criada ainda.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{cat.icon_emoji || '📂'}</span>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{cat.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{cat.slug}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => abrirModalCat(cat)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: '1px solid #666',
                            borderRadius: '6px',
                            color: '#10b981',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deletarCategoria(cat.id)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: '1px solid #666',
                            borderRadius: '6px',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* BOTÃO SALVAR MINIAPP */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button onClick={salvarMiniAppConfig}>
              <Save size={18} /> Salvar Configurações do MiniApp
            </Button>
          </div>

        </div>
      )}

      {/* MODAL EDITAR CATEGORIA */}
      {isEditingCat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
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
            maxWidth: '500px',
            border: '1px solid #333'
          }}>
            <h3 style={{ marginBottom: '20px' }}>
              {currentCat?.id ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>

            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Nome</label>
                <input
                  type="text"
                  value={currentCat?.name || ''}
                  onChange={(e) => setCurrentCat({ ...currentCat, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                  placeholder="Ex: Vídeos"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Slug (URL amigável)</label>
                <input
                  type="text"
                  value={currentCat?.slug || ''}
                  onChange={(e) => setCurrentCat({ ...currentCat, slug: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                  placeholder="Ex: videos"
                />
                <small style={{ color: '#666', fontSize: '12px' }}>Somente letras minúsculas e hífens</small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#ccc', fontSize: '14px' }}>Emoji / Ícone</label>
                <input
                  type="text"
                  value={currentCat?.icon_emoji || ''}
                  onChange={(e) => setCurrentCat({ ...currentCat, icon_emoji: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '20px'
                  }}
                  placeholder="📂"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsEditingCat(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarCategoria}>
                <Save size={16} /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}