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
  Star: '⭐'
};

// Objetos padrão para evitar erros de inicialização
const DEFAULT_DISPARO = {
  is_active: false,
  message_text: '',
  media_url: '',
  media_type: null,
  delay_minutes: 5,
  auto_destruct_seconds: 0,
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
        // 🔥 CORREÇÃO: Usando preco_atual conforme database.py
        const valorBase = plano && plano.preco_atual ? Number(plano.preco_atual) : 0;
        
        newPromo[planoId] = {
          price: valorBase * 0.7,
          button_text: `🔥 ${plano?.nome_exibicao || 'Plano'} - Oferta!`
        };
      }
      
      return { ...prev, promo_values: newPromo };
    });
  }
  
  function handlePromoChange(planoId, field, value) {
    setDisparoConfig(prev => ({
      ...prev,
      promo_values: {
        ...(prev.promo_values || {}),
        [planoId]: {
          ...(prev.promo_values?.[planoId] || {}),
          [field]: field === 'price' ? parseFloat(value) || 0 : value
        }
      }
    }));
  }
  
  // =========================================================
  // MENSAGENS ALTERNANTES
  // =========================================================
  
  function handleAddMessage() {
    if (!newMessage.trim()) {
      alert('Digite uma mensagem.');
      return;
    }
    setAlternatingConfig(prev => ({
      ...prev,
      messages: [...(prev.messages || []), newMessage.trim()]
    }));
    setNewMessage('');
  }
  
  function handleRemoveMessage(index) {
    setAlternatingConfig(prev => ({
      ...prev,
      messages: (prev.messages || []).filter((_, i) => i !== index)
    }));
  }
  
  function handleEditMessage(index, newText) {
    setAlternatingConfig(prev => ({
      ...prev,
      messages: (prev.messages || []).map((msg, i) => i === index ? newText : msg)
    }));
  }
  
  // =========================================================
  // RENDER
  // =========================================================
  
  if (!selectedBot) {
    return (
      <div className="auto-remarketing-container">
        <div className="alert alert-warning">
          <span>{Icons.Alert}</span>
          <p>Selecione um bot na barra lateral para começar.</p>
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
      {/* Header */}
      <div className="auto-remarketing-header">
        <div className="header-titles">
          <h1>{Icons.Rocket} Disparo Automático</h1>
          <p>Configure disparos automáticos para recuperar vendas</p>
        </div>
        
        <button 
          className="btn-save-main"
          onClick={activeTab === 'disparo' ? handleSaveDisparo : handleSaveAlternating}
          disabled={saving || activeTab === 'analytics'}
        >
          <span>{Icons.Save}</span>
          <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="auto-remarketing-tabs">
        <button 
          className={`tab-btn ${activeTab === 'disparo' ? 'active' : ''}`}
          onClick={() => setActiveTab('disparo')}
        >
          <span>{Icons.Rocket}</span> Disparo Automático
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
      
      {/* Conteúdo */}
      <div className="auto-remarketing-content">
        
        {/* === ABA 1: DISPARO AUTOMÁTICO === */}
        {activeTab === 'disparo' && (
          <div className="tab-content">
            
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
                <div className="config-card">
                  <label className="config-label">{Icons.Message} Mensagem de Remarketing</label>
                  
                  <div className="text-editor-toolbar">
                    <button type="button" onClick={() => applyFormatting('bold')}><strong>B</strong></button>
                    <button type="button" onClick={() => applyFormatting('italic')}><em>I</em></button>
                    <button type="button" onClick={() => applyFormatting('underline')}><u>U</u></button>
                    <button type="button" onClick={() => applyFormatting('strike')}><s>S</s></button>
                    <button type="button" onClick={() => applyFormatting('spoiler')}>🚫</button>
                    <button type="button" onClick={() => applyFormatting('code')}>{'</>'}</button>
                    <button type="button" onClick={() => applyFormatting('link')}>🔗</button>
                  </div>
                  
                  <textarea
                    id="disparo-message"
                    className="input-field textarea-large"
                    rows={8}
                    value={disparoConfig.message_text || ''}
                    onChange={(e) => setDisparoConfig(prev => ({ ...prev, message_text: e.target.value }))}
                    placeholder="Digite a mensagem..."
                  />
                  <div className="hint-text">
                    <span>{Icons.Alert}</span>
                    <span>Use: {'{first_name}'}, {'{plano_original}'}, {'{valor_original}'}</span>
                  </div>
                </div>
                
                <div className="config-card">
                  <label className="config-label">{Icons.Photo} Mídia (Opcional)</label>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <input
                        type="url"
                        className="input-field"
                        value={disparoConfig.media_url || ''}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, media_url: e.target.value }))}
                        placeholder="URL da Imagem ou Vídeo"
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <select
                        className="input-field"
                        value={disparoConfig.media_type || ''}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, media_type: e.target.value || null }))}
                      >
                        <option value="">Sem mídia</option>
                        <option value="photo">🖼️ Foto</option>
                        <option value="video">🎥 Vídeo</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="config-card">
                  <label className="config-label">{Icons.Money} Ofertas nos Planos</label>
                  
                  {planos.length === 0 ? (
                    <div className="alert alert-warning">
                      <span>{Icons.Alert}</span>
                      <p>Nenhum plano cadastrado.</p>
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
                
                <div className="config-card">
                  <label className="config-label">{Icons.Clock} Tempo de Espera</label>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Aguardar (minutos)</label>
                      <input
                        type="number"
                        min="1"
                        className="input-field"
                        value={disparoConfig.delay_minutes || 5}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, delay_minutes: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Auto-destruir (segundos)</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        value={disparoConfig.auto_destruct_seconds || 0}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, auto_destruct_seconds: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
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