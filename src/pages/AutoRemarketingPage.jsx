import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext';
import { remarketingAutoService, planService } from '../services/api';
import './AutoRemarketingPage.css';

// Ícones (Unicode)
const Icons = {
  Save: '💾',
  Rocket: '🚀',
  Message: '💬',
  Photo: '🖼️',
  Video: '🎥',
  Clock: '⏰',
  Trash: '🗑️',
  Plus: '➕',
  Check: '✅',
  Alert: '⚠️',
  Chart: '📊',
  Fire: '🔥',
  Money: '💰',
  Star: '⭐',
  Bomb: '💣'
};

// Objetos padrão para evitar erros de inicialização
const DEFAULT_DISPARO = {
  is_active: false,
  message_text: '',
  media_url: '',
  media_type: null,
  delay_minutes: 5,
  auto_destruct_enabled: false,      // ✅ NOVO
  auto_destruct_seconds: 3,          // ✅ NOVO
  auto_destruct_after_click: true,   // ✅ NOVO
  promo_values: {} 
};

const DEFAULT_ALTERNATING = {
  is_active: false,
  messages: [],
  rotation_interval_seconds: 15,
  stop_before_remarketing_seconds: 60,
  auto_destruct_final: false
};

export function AutoRemarketing() {
  const { selectedBot } = useBot();
  
  // Estados Inicializados com Defaults Seguros
  const [disparoConfig, setDisparoConfig] = useState(DEFAULT_DISPARO);
  const [alternatingConfig, setAlternatingConfig] = useState(DEFAULT_ALTERNATING);
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState('disparo'); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [planos, setPlanos] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stats, setStats] = useState({
    total_sent: 0,
    total_converted: 0,
    conversion_rate: 0,
    today_sent: 0,
    recent_logs: []
  });
  
  // Carregar dados ao iniciar
  useEffect(() => {
    if (selectedBot) {
      loadAllData();
    }
  }, [selectedBot]);
  
  async function loadAllData() {
    if (!selectedBot?.id) return;
    
    setLoading(true);
    
    try {
      const [remarketing, alternating, planosData, statistics] = await Promise.all([
        remarketingAutoService.getRemarketingConfig(selectedBot.id),
        remarketingAutoService.getAlternatingMessages(selectedBot.id),
        planService.listPlans(selectedBot.id),
        remarketingAutoService.getRemarketingStats(selectedBot.id)
      ]);
      
      // Validação de dados vindos da API
      setDisparoConfig(remarketing || DEFAULT_DISPARO);
      setAlternatingConfig(alternating || DEFAULT_ALTERNATING);
      setPlanos(Array.isArray(planosData) ? planosData : []); 
      setStats(statistics || { total_sent: 0, total_converted: 0, conversion_rate: 0, today_sent: 0, recent_logs: [] });
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // =========================================================
  // FUNÇÕES DE SALVAMENTO
  // =========================================================
  
  async function handleSaveDisparo() {
    if (!selectedBot?.id) return;
    
    if (disparoConfig.is_active) {
      if (!disparoConfig.message_text.trim()) {
        alert('Por favor, adicione uma mensagem de remarketing.');
        return;
      }
      
      if (disparoConfig.delay_minutes < 1 || disparoConfig.delay_minutes > 1440) {
        alert('O intervalo deve estar entre 1 e 1440 minutos.');
        return;
      }
    }
    
    setSaving(true);
    
    try {
      const payload = {
          ...disparoConfig,
          promo_values: disparoConfig.promo_values || {}
      };
      
      await remarketingAutoService.saveRemarketingConfig(selectedBot.id, payload);
      alert('✅ Configuração de disparo automático salva!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('Erro ao salvar. Verifique o console.');
    } finally {
      setSaving(false);
    }
  }
  
  async function handleSaveAlternating() {
    if (!selectedBot?.id) return;
    
    if (alternatingConfig.is_active) {
      if (alternatingConfig.messages.length < 2) {
        alert('São necessárias pelo menos 2 mensagens.');
        return;
      }
    }
    
    setSaving(true);
    
    try {
      await remarketingAutoService.saveAlternatingMessages(selectedBot.id, alternatingConfig);
      alert('✅ Mensagens alternantes salvas!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('Erro ao salvar mensagens.');
    } finally {
      setSaving(false);
    }
  }
  
  // =========================================================
  // EDITOR E FORMATADORES
  // =========================================================
  
  function applyFormatting(format) {
    const textarea = document.getElementById('disparo-message');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = disparoConfig.message_text || '';
    const selected = text.substring(start, end) || 'texto';
    
    let formatted = '';
    
    switch(format) {
      case 'bold': formatted = `<b>${selected}</b>`; break;
      case 'italic': formatted = `<i>${selected}</i>`; break;
      case 'underline': formatted = `<u>${selected}</u>`; break;
      case 'strike': formatted = `<s>${selected}</s>`; break;
      case 'spoiler': formatted = `<span class="tg-spoiler">${selected}</span>`; break;
      case 'code': formatted = `<code>${selected}</code>`; break;
      case 'pre': formatted = `<pre>${selected}</pre>`; break;
      case 'link': 
        const url = prompt('Digite a URL:');
        if (url) formatted = `<a href="${url}">${selected}</a>`;
        else return;
        break;
      default: return;
    }
    
    const newText = text.substring(0, start) + formatted + text.substring(end);
    setDisparoConfig(prev => ({ ...prev, message_text: newText }));
  }
  
  // =========================================================
  // PLANOS PROMOCIONAIS (CORRIGIDO: preco_atual)
  // =========================================================
  
  function handleTogglePlano(planoId) {
    setDisparoConfig(prev => {
      const currentPromos = prev.promo_values || {};
      const newPromo = { ...currentPromos };
      
      if (newPromo[planoId]) {
        delete newPromo[planoId];
      } else {
        const plano = planos.find(p => p.id === planoId);
        if (plano) {
          const valorOriginal = Number(plano.preco_atual) || 0;
          newPromo[planoId] = {
            price: valorOriginal * 0.7,
            button_text: ''
          };
        }
      }
      
      return { ...prev, promo_values: newPromo };
    });
  }
  
  function handlePromoChange(planoId, field, value) {
    setDisparoConfig(prev => {
      const currentPromos = prev.promo_values || {};
      const currentPlano = currentPromos[planoId] || {};
      
      return {
        ...prev,
        promo_values: {
          ...currentPromos,
          [planoId]: {
            ...currentPlano,
            [field]: field === 'price' ? parseFloat(value) || 0 : value
          }
        }
      };
    });
  }
  
  // =========================================================
  // MENSAGENS ALTERNANTES
  // =========================================================
  
  function handleAddMessage() {
    if (!newMessage.trim()) return;
    
    setAlternatingConfig(prev => ({
      ...prev,
      messages: [...(prev.messages || []), newMessage]
    }));
    setNewMessage('');
  }
  
  function handleRemoveMessage(index) {
    setAlternatingConfig(prev => ({
      ...prev,
      messages: (prev.messages || []).filter((_, i) => i !== index)
    }));
  }
  
  function handleEditMessage(index, value) {
    setAlternatingConfig(prev => {
      const updated = [...(prev.messages || [])];
      updated[index] = value;
      return { ...prev, messages: updated };
    });
  }
  
  // =========================================================
  // RENDER
  // =========================================================
  
  if (!selectedBot) {
    return (
      <div className="auto-remarketing-container">
        <div className="alert alert-warning">
          <span>{Icons.Alert}</span> Nenhum bot selecionado.
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="auto-remarketing-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auto-remarketing-container">
      
      {/* === HEADER === */}
      <div className="auto-remarketing-header">
        <div className="header-titles">
          <h1>{Icons.Rocket} Disparo Automático</h1>
          <p>Configure mensagens de remarketing inteligentes</p>
        </div>
        <button 
          className="btn-save-main" 
          onClick={activeTab === 'disparo' ? handleSaveDisparo : handleSaveAlternating}
          disabled={saving}
        >
          <span>{Icons.Save}</span>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
      
      {/* === TABS === */}
      <div className="auto-remarketing-tabs">
        <button 
          className={`tab-btn ${activeTab === 'disparo' ? 'active' : ''}`}
          onClick={() => setActiveTab('disparo')}
        >
          <span>{Icons.Rocket}</span> Configuração Principal
        </button>
        <button 
          className={`tab-btn ${activeTab === 'alternating' ? 'active' : ''}`}
          onClick={() => setActiveTab('alternating')}
        >
          <span>{Icons.Message}</span> Mensagens Alternantes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span>{Icons.Chart}</span> Analytics
        </button>
      </div>
      
      {/* === CONTEÚDO === */}
      <div className="auto-remarketing-content">
        
        {/* === ABA 1: DISPARO AUTOMÁTICO === */}
        {activeTab === 'disparo' && (
          <div className="tab-content">
            
            {/* Toggle Principal */}
            <div className="config-card">
              <div className="toggle-wrapper">
                <label>{Icons.Rocket} Ativar Disparo Automático</label>
                <div 
                  className={`custom-toggle ${disparoConfig.is_active ? 'active' : ''}`}
                  onClick={() => setDisparoConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
                >
                  <div className="toggle-handle"></div>
                  <span className="toggle-label">{disparoConfig.is_active ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
            
            {disparoConfig.is_active && (
              <>
                {/* Mensagem */}
                <div className="config-card">
                  <label className="config-label">{Icons.Message} Mensagem de Oferta</label>
                  <div className="text-editor-toolbar">
                    <button type="button" onClick={() => applyFormatting('bold')} title="Negrito"><b>B</b></button>
                    <button type="button" onClick={() => applyFormatting('italic')} title="Itálico"><i>I</i></button>
                    <button type="button" onClick={() => applyFormatting('underline')} title="Sublinhado"><u>U</u></button>
                    <button type="button" onClick={() => applyFormatting('strike')} title="Riscado"><s>S</s></button>
                    <button type="button" onClick={() => applyFormatting('code')} title="Código">&lt;/&gt;</button>
                    <button type="button" onClick={() => applyFormatting('link')} title="Link">🔗</button>
                  </div>
                  <textarea
                    id="disparo-message"
                    className="input-field textarea-large"
                    placeholder="Digite sua mensagem de remarketing aqui..."
                    value={disparoConfig.message_text || ''}
                    onChange={(e) => setDisparoConfig(prev => ({ ...prev, message_text: e.target.value }))}
                  />
                  <div className="hint-text">
                    <span>{Icons.Alert}</span>
                    Suporte a HTML: &lt;b&gt;, &lt;i&gt;, &lt;u&gt;, &lt;s&gt;, &lt;code&gt;, &lt;a&gt;
                  </div>
                </div>
                
                {/* Mídia */}
                <div className="config-card">
                  <label className="config-label">{Icons.Photo} Mídia (Opcional)</label>
                  <div className="form-row">
                    <div className="form-group">
                      <label>URL da Mídia</label>
                      <input
                        type="url"
                        className="input-field"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={disparoConfig.media_url || ''}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, media_url: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo</label>
                      <select
                        className="input-field"
                        value={disparoConfig.media_type || ''}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, media_type: e.target.value || null }))}
                      >
                        <option value="">Nenhuma</option>
                        <option value="photo">Foto</option>
                        <option value="video">Vídeo</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Planos Promocionais */}
                <div className="config-card">
                  <label className="config-label">{Icons.Money} Valores Promocionais</label>
                  {planos.length === 0 ? (
                    <div className="alert alert-info">
                      <span>{Icons.Alert}</span>
                      Nenhum plano cadastrado ainda.
                    </div>
                  ) : (
                    <div className="planos-grid">
                      {planos.map(plano => {
                        // 🔥 CORREÇÃO: Usando 'preco_atual' em vez de 'valor'
                        const valorOriginal = Number(plano.preco_atual) || 0;
                        
                        const promoValues = disparoConfig.promo_values || {};
                        const isActive = !!promoValues[plano.id];
                        const promoData = promoValues[plano.id] || { price: valorOriginal * 0.7, button_text: '' };
                        
                        const valorPromocional = Number(promoData.price) || 0;
                        const economia = valorOriginal - valorPromocional;
                        
                        return (
                          <div key={plano.id} className={`plano-card ${isActive ? 'active' : ''}`}>
                            <div className="plano-card-header">
                              <div className="plano-info">
                                <strong>{plano.nome_exibicao}</strong>
                                <span className="original-price">De: R$ {valorOriginal.toFixed(2)}</span>
                              </div>
                              <div 
                                className={`custom-toggle small ${isActive ? 'active' : ''}`}
                                onClick={() => handleTogglePlano(plano.id)}
                              >
                                <div className="toggle-handle"></div>
                              </div>
                            </div>
                            
                            {isActive && (
                              <div className="plano-card-body">
                                <label>Novo Preço:</label>
                                <div className="input-with-prefix">
                                  <span>R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="input-field"
                                    value={valorPromocional}
                                    onChange={(e) => handlePromoChange(plano.id, 'price', e.target.value)}
                                  />
                                </div>
                                
                                <label style={{ marginTop: '10px' }}>Botão:</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  value={promoData.button_text || ''}
                                  onChange={(e) => handlePromoChange(plano.id, 'button_text', e.target.value)}
                                  placeholder="Ex: 🔥 Quero Desconto!"
                                />
                                
                                <div className="plano-savings">
                                  {Icons.Fire} Economia de R$ {economia.toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Tempo de Espera */}
                <div className="config-card">
                  <label className="config-label">{Icons.Clock} Tempo de Espera</label>
                  <div className="form-group">
                    <label>Aguardar (minutos) antes de enviar o disparo</label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      className="input-field"
                      value={disparoConfig.delay_minutes || 5}
                      onChange={(e) => setDisparoConfig(prev => ({ ...prev, delay_minutes: parseInt(e.target.value) || 1 }))}
                    />
                    <div className="hint-text">
                      <span>{Icons.Alert}</span>
                      Tempo entre o PIX inicial e o envio da oferta promocional (1-1440 minutos)
                    </div>
                  </div>
                </div>

                {/* ✅ NOVA SEÇÃO: AUTO-DESTRUIÇÃO OPCIONAL */}
                <div className="config-card" style={{ borderLeft: '4px solid #c333ff', background: 'rgba(195, 51, 255, 0.03)' }}>
                  <label className="config-label">{Icons.Bomb} Auto-Destruição da Mensagem</label>
                  
                  {/* Toggle para ativar auto-destruição */}
                  <div className="toggle-wrapper" style={{ marginBottom: '20px' }}>
                    <label>Ativar Auto-Destruição</label>
                    <div 
                      className={`custom-toggle ${disparoConfig.auto_destruct_enabled ? 'active' : ''}`}
                      onClick={() => setDisparoConfig(prev => ({ ...prev, auto_destruct_enabled: !prev.auto_destruct_enabled }))}
                    >
                      <div className="toggle-handle"></div>
                      <span className="toggle-label">{disparoConfig.auto_destruct_enabled ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>

                  <div className="hint-text" style={{ marginBottom: '20px' }}>
                    <span>{Icons.Alert}</span>
                    Quando ativado, a mensagem de disparo será automaticamente apagada após o tempo configurado
                  </div>

                  {/* Opções aparecem apenas se auto_destruct_enabled = true */}
                  {disparoConfig.auto_destruct_enabled && (
                    <>
                      {/* Modo de auto-destruição */}
                      <div className="form-group" style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: '2px solid #333' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="destruct_mode"
                            checked={disparoConfig.auto_destruct_after_click === true}
                            onChange={() => setDisparoConfig(prev => ({ ...prev, auto_destruct_after_click: true }))}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span>Destruir APÓS o usuário clicar no botão</span>
                        </label>
                        <div className="hint-text" style={{ marginLeft: '28px' }}>
                          <span>✅</span>
                          Recomendado: A mensagem só será apagada depois que o usuário escolher um plano
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: '2px solid #333' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="destruct_mode"
                            checked={disparoConfig.auto_destruct_after_click === false}
                            onChange={() => setDisparoConfig(prev => ({ ...prev, auto_destruct_after_click: false }))}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span>Destruir imediatamente após envio</span>
                        </label>
                        <div className="hint-text" style={{ marginLeft: '28px' }}>
                          <span>⚠️</span>
                          A mensagem será apagada automaticamente mesmo se o usuário não clicar
                        </div>
                      </div>

                      {/* Tempo de auto-destruição */}
                      <div className="form-group" style={{ paddingLeft: '20px', borderLeft: '2px solid #333' }}>
                        <label>Tempo para auto-destruir (segundos)</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          className="input-field"
                          value={disparoConfig.auto_destruct_seconds || 3}
                          onChange={(e) => setDisparoConfig(prev => ({ ...prev, auto_destruct_seconds: parseInt(e.target.value) || 3 }))}
                          style={{ maxWidth: '200px' }}
                        />
                        <div className="hint-text">
                          <span>{Icons.Clock}</span>
                          Tempo de espera antes de apagar a mensagem (1-60 segundos)
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            
          </div>
        )}
        
        {/* === ABA 2: MENSAGENS ALTERNANTES === */}
        {activeTab === 'alternating' && (
          <div className="tab-content">
            <div className="config-card">
              <div className="toggle-wrapper">
                <label>{Icons.Message} Ativar Mensagens Alternantes</label>
                <div 
                  className={`custom-toggle ${alternatingConfig.is_active ? 'active' : ''}`}
                  onClick={() => setAlternatingConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
                >
                  <div className="toggle-handle"></div>
                  <span className="toggle-label">{alternatingConfig.is_active ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
            
            {alternatingConfig.is_active && (
              <>
                <div className="config-card">
                  <label className="config-label">{Icons.Message} Frases (Mínimo 2)</label>
                  <div className="messages-list">
                    {(alternatingConfig.messages || []).map((msg, index) => (
                      <div key={index} className="message-item">
                        <div className="message-number">{index + 1}</div>
                        <textarea
                          className="input-field message-textarea"
                          rows={2}
                          value={msg}
                          onChange={(e) => handleEditMessage(index, e.target.value)}
                        />
                        <button type="button" className="btn-remove" onClick={() => handleRemoveMessage(index)}>
                          {Icons.Trash}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-message-box">
                    <textarea
                      className="input-field"
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nova frase..."
                    />
                    <button type="button" className="btn-add" onClick={handleAddMessage}>
                      <span>{Icons.Plus}</span> Adicionar Frase
                    </button>
                  </div>
                </div>
                
                <div className="config-card">
                  <label className="config-label">{Icons.Clock} Rotação</label>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Trocar a cada (segundos)</label>
                      <input
                        type="number"
                        min="5"
                        className="input-field"
                        value={alternatingConfig.rotation_interval_seconds || 15}
                        onChange={(e) => setAlternatingConfig(prev => ({ ...prev, rotation_interval_seconds: parseInt(e.target.value) || 15 }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Parar antes do Remarketing (seg)</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        value={alternatingConfig.stop_before_remarketing_seconds || 60}
                        onChange={(e) => setAlternatingConfig(prev => ({ ...prev, stop_before_remarketing_seconds: parseInt(e.target.value) || 60 }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* === ABA 3: ANALYTICS === */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">{Icons.Rocket}</div>
                <div className="stat-info">
                  <div className="stat-label">Total Enviados</div>
                  <div className="stat-value">{stats.total_sent}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">{Icons.Money}</div>
                <div className="stat-info">
                  <div className="stat-label">Conversões</div>
                  <div className="stat-value">{stats.total_converted}</div>
                </div>
              </div>
            </div>
            {/* Tabela de logs omitida por brevidade (já estava ok) */}
          </div>
        )}
        
      </div>
    </div>
  );
}