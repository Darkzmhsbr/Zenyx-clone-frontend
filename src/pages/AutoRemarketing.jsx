import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext';
import { remarketingAutoService, planService } from '../services/api';
import './AutoRemarketing.css';

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

export function AutoRemarketing() {
  const { selectedBot } = useBot();
  
  // Estados para Disparo Automático
  const [disparoConfig, setDisparoConfig] = useState({
    is_active: false,
    message_text: '',
    media_url: '',
    media_type: null,
    delay_minutes: 5,
    auto_destruct_seconds: 0,
    promo_values: {} // { plan_id: { price: X, button_text: Y } }
  });
  
  // Estados para Mensagens Alternantes
  const [alternatingConfig, setAlternatingConfig] = useState({
    is_active: false,
    messages: [],
    rotation_interval_seconds: 15,
    stop_before_remarketing_seconds: 60,
    auto_destruct_final: false
  });
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState('disparo'); // 'disparo', 'alternating', 'analytics'
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
      
      setDisparoConfig(remarketing);
      setAlternatingConfig(alternating);
      setPlanos(planosData);
      setStats(statistics);
      
      console.log('✅ Dados carregados:', { remarketing, alternating, planosData, statistics });
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      alert('Erro ao carregar configurações.');
    } finally {
      setLoading(false);
    }
  }
  
  // =========================================================
  // FUNÇÕES DE SALVAMENTO
  // =========================================================
  
  async function handleSaveDisparo() {
    if (!selectedBot?.id) return;
    
    // Validações
    if (disparoConfig.is_active) {
      if (!disparoConfig.message_text.trim()) {
        alert('Por favor, adicione uma mensagem de remarketing.');
        return;
      }
      
      if (disparoConfig.delay_minutes < 1 || disparoConfig.delay_minutes > 1440) {
        alert('O intervalo deve estar entre 1 e 1440 minutos.');
        return;
      }
      
      if (disparoConfig.media_url && !disparoConfig.media_type) {
        alert('Selecione o tipo de mídia (Foto ou Vídeo).');
        return;
      }
    }
    
    setSaving(true);
    
    try {
      await remarketingAutoService.saveRemarketingConfig(selectedBot.id, disparoConfig);
      alert('✅ Configuração de disparo automático salva!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('Erro: ' + (error.response?.data?.detail || error.message));
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
      
      if (alternatingConfig.rotation_interval_seconds < 5 || alternatingConfig.rotation_interval_seconds > 300) {
        alert('O intervalo deve estar entre 5 e 300 segundos.');
        return;
      }
    }
    
    setSaving(true);
    
    try {
      await remarketingAutoService.saveAlternatingMessages(selectedBot.id, alternatingConfig);
      alert('✅ Mensagens alternantes salvas!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('Erro: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  }
  
  // =========================================================
  // FUNÇÕES DO EDITOR DE TEXTO
  // =========================================================
  
  function applyFormatting(format) {
    const textarea = document.getElementById('disparo-message');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = disparoConfig.message_text;
    const selected = text.substring(start, end) || 'texto';
    
    let formatted = '';
    
    switch(format) {
      case 'bold':
        formatted = `<b>${selected}</b>`;
        break;
      case 'italic':
        formatted = `<i>${selected}</i>`;
        break;
      case 'underline':
        formatted = `<u>${selected}</u>`;
        break;
      case 'strike':
        formatted = `<s>${selected}</s>`;
        break;
      case 'spoiler':
        formatted = `<span class="tg-spoiler">${selected}</span>`;
        break;
      case 'code':
        formatted = `<code>${selected}</code>`;
        break;
      case 'pre':
        formatted = `<pre>${selected}</pre>`;
        break;
      case 'link':
        const url = prompt('Digite a URL:');
        if (url) formatted = `<a href="${url}">${selected}</a>`;
        break;
      default:
        return;
    }
    
    const newText = text.substring(0, start) + formatted + text.substring(end);
    setDisparoConfig(prev => ({ ...prev, message_text: newText }));
  }
  
  // =========================================================
  // FUNÇÕES DE PLANOS PROMOCIONAIS
  // =========================================================
  
  function handleTogglePlano(planoId) {
    setDisparoConfig(prev => {
      const newPromo = { ...prev.promo_values };
      
      if (newPromo[planoId]) {
        delete newPromo[planoId];
      } else {
        const plano = planos.find(p => p.id === planoId);
        newPromo[planoId] = {
          price: plano ? plano.valor * 0.7 : 0,
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
        ...prev.promo_values,
        [planoId]: {
          ...prev.promo_values[planoId],
          [field]: field === 'price' ? parseFloat(value) || 0 : value
        }
      }
    }));
  }
  
  // =========================================================
  // FUNÇÕES DE MENSAGENS ALTERNANTES
  // =========================================================
  
  function handleAddMessage() {
    if (!newMessage.trim()) {
      alert('Digite uma mensagem.');
      return;
    }
    
    setAlternatingConfig(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage.trim()]
    }));
    
    setNewMessage('');
  }
  
  function handleRemoveMessage(index) {
    setAlternatingConfig(prev => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index)
    }));
  }
  
  function handleEditMessage(index, newText) {
    setAlternatingConfig(prev => ({
      ...prev,
      messages: prev.messages.map((msg, i) => i === index ? newText : msg)
    }));
  }
  
  // =========================================================
  // RENDERIZAÇÃO
  // =========================================================
  
  if (!selectedBot) {
    return (
      <div className="auto-remarketing-container">
        <div className="alert alert-warning">
          <span>{Icons.Alert}</span>
          <p>Selecione um bot na barra lateral.</p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="auto-remarketing-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando...</p>
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
          <span>{saving ? 'Salvando...' : 'Salvar'}</span>
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
        
        {/* ===================================================== */}
        {/* ABA 1: DISPARO AUTOMÁTICO */}
        {/* ===================================================== */}
        {activeTab === 'disparo' && (
          <div className="tab-content">
            
            {/* Toggle */}
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
              
              {disparoConfig.is_active && (
                <div className="hint-text">
                  <span>{Icons.Check}</span>
                  <span>Sistema ativo! Disparos automáticos habilitados.</span>
                </div>
              )}
            </div>
            
            {disparoConfig.is_active && (
              <>
                {/* Editor de Texto */}
                <div className="config-card">
                  <label className="config-label">{Icons.Message} Mensagem de Remarketing</label>
                  
                  <div className="text-editor-toolbar">
                    <button type="button" onClick={() => applyFormatting('bold')} title="Negrito">
                      <strong>B</strong>
                    </button>
                    <button type="button" onClick={() => applyFormatting('italic')} title="Itálico">
                      <em>I</em>
                    </button>
                    <button type="button" onClick={() => applyFormatting('underline')} title="Sublinhado">
                      <u>U</u>
                    </button>
                    <button type="button" onClick={() => applyFormatting('strike')} title="Riscado">
                      <s>S</s>
                    </button>
                    <button type="button" onClick={() => applyFormatting('spoiler')} title="Spoiler">
                      🚫
                    </button>
                    <button type="button" onClick={() => applyFormatting('code')} title="Código">
                      {'</>'}
                    </button>
                    <button type="button" onClick={() => applyFormatting('pre')} title="Pré-formatado">
                      ¶¶
                    </button>
                    <button type="button" onClick={() => applyFormatting('link')} title="Link">
                      🔗
                    </button>
                  </div>
                  
                  <textarea
                    id="disparo-message"
                    className="input-field textarea-large"
                    rows={8}
                    value={disparoConfig.message_text}
                    onChange={(e) => setDisparoConfig(prev => ({ ...prev, message_text: e.target.value }))}
                    placeholder="Digite a mensagem...&#10;&#10;Variáveis:&#10;{first_name} - Nome&#10;{plano_original} - Plano&#10;{valor_original} - Valor"
                  />
                  
                  <div className="hint-text">
                    <span>{Icons.Alert}</span>
                    <span>Use: {'{first_name}'}, {'{plano_original}'}, {'{valor_original}'}</span>
                  </div>
                </div>
                
                {/* Mídia */}
                <div className="config-card">
                  <label className="config-label">{Icons.Photo} Mídia (Opcional)</label>
                  
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <input
                        type="url"
                        className="input-field"
                        value={disparoConfig.media_url || ''}
                        onChange={(e) => setDisparoConfig(prev => ({ ...prev, media_url: e.target.value }))}
                        placeholder="https://exemplo.com/imagem.jpg"
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
                
                {/* Planos Promocionais */}
                <div className="config-card">
                  <label className="config-label">{Icons.Money} Planos Promocionais</label>
                  
                  {planos.length === 0 ? (
                    <div className="alert alert-warning">
                      <span>{Icons.Alert}</span>
                      <p>Configure planos primeiro.</p>
                    </div>
                  ) : (
                    <div className="planos-grid">
                      {planos.map(plano => {
                        const isActive = !!disparoConfig.promo_values[plano.id];
                        const promoData = disparoConfig.promo_values[plano.id] || { price: plano.valor * 0.7, button_text: '' };
                        
                        return (
                          <div key={plano.id} className={`plano-card ${isActive ? 'active' : ''}`}>
                            <div className="plano-card-header">
                              <div className="plano-info">
                                <strong>{plano.nome_exibicao}</strong>
                                <span className="original-price">R$ {plano.valor.toFixed(2)}</span>
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
                                <label>Preço Promocional:</label>
                                <div className="input-with-prefix">
                                  <span>R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="input-field"
                                    value={promoData.price}
                                    onChange={(e) => handlePromoChange(plano.id, 'price', e.target.value)}
                                  />
                                </div>
                                
                                <label style={{ marginTop: '10px' }}>Texto do Botão:</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  value={promoData.button_text}
                                  onChange={(e) => handlePromoChange(plano.id, 'button_text', e.target.value)}
                                  placeholder="🔥 Nome do Plano - Oferta!"
                                />
                                
                                <div className="plano-savings">
                                  {Icons.Fire} Economia: R$ {(plano.valor - promoData.price).toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Timing */}
                <div className="config-card">
                  <label className="config-label">{Icons.Clock} Configurações de Tempo</label>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Aguardar (minutos)</label>
                      <input
                        type="number"
                        min="1"
                        max="1440"
                        className="input-field"
                        value={disparoConfig.delay_minutes}
                        onChange={(e) => setDisparoConfig(prev => ({ 
                          ...prev, 
                          delay_minutes: parseInt(e.target.value) || 1 
                        }))}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Auto-destruir após (segundos)</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        value={disparoConfig.auto_destruct_seconds}
                        onChange={(e) => setDisparoConfig(prev => ({ 
                          ...prev, 
                          auto_destruct_seconds: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            
          </div>
        )}
        
        {/* ===================================================== */}
        {/* ABA 2: MENSAGENS ALTERNANTES */}
        {/* ===================================================== */}
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
              
              <div className="hint-text">
                <span>{Icons.Alert}</span>
                <span>Mensagens que alternam enquanto aguarda o disparo.</span>
              </div>
            </div>
            
            {alternatingConfig.is_active && (
              <>
                <div className="config-card">
                  <label className="config-label">{Icons.Message} Mensagens (mínimo 2)</label>
                  
                  <div className="messages-list">
                    {alternatingConfig.messages.map((msg, index) => (
                      <div key={index} className="message-item">
                        <div className="message-number">{index + 1}</div>
                        
                        <textarea
                          className="input-field message-textarea"
                          rows={3}
                          value={msg}
                          onChange={(e) => handleEditMessage(index, e.target.value)}
                        />
                        
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => handleRemoveMessage(index)}
                        >
                          {Icons.Trash}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="add-message-box">
                    <textarea
                      className="input-field"
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nova mensagem..."
                    />
                    
                    <button type="button" className="btn-add" onClick={handleAddMessage}>
                      <span>{Icons.Plus}</span> Adicionar
                    </button>
                  </div>
                </div>
                
                <div className="config-card">
                  <label className="config-label">{Icons.Clock} Timing</label>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Alternar a cada (segundos)</label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        className="input-field"
                        value={alternatingConfig.rotation_interval_seconds}
                        onChange={(e) => setAlternatingConfig(prev => ({ 
                          ...prev, 
                          rotation_interval_seconds: parseInt(e.target.value) || 15 
                        }))}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Parar X seg antes do disparo</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        value={alternatingConfig.stop_before_remarketing_seconds}
                        onChange={(e) => setAlternatingConfig(prev => ({ 
                          ...prev, 
                          stop_before_remarketing_seconds: parseInt(e.target.value) || 60 
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="toggle-wrapper" style={{ marginTop: '20px' }}>
                    <label>{Icons.Trash} Auto-destruir ao parar</label>
                    <div 
                      className={`custom-toggle ${alternatingConfig.auto_destruct_final ? 'active' : ''}`}
                      onClick={() => setAlternatingConfig(prev => ({ 
                        ...prev, 
                        auto_destruct_final: !prev.auto_destruct_final 
                      }))}
                    >
                      <div className="toggle-handle"></div>
                      <span className="toggle-label">{alternatingConfig.auto_destruct_final ? 'SIM' : 'NÃO'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
          </div>
        )}
        
        {/* ===================================================== */}
        {/* ABA 3: ANALYTICS */}
        {/* ===================================================== */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">{Icons.Rocket}</div>
                <div className="stat-info">
                  <div className="stat-label">Enviados</div>
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
              
              <div className="stat-card">
                <div className="stat-icon">{Icons.Chart}</div>
                <div className="stat-info">
                  <div className="stat-label">Taxa</div>
                  <div className="stat-value">{stats.conversion_rate}%</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">{Icons.Fire}</div>
                <div className="stat-info">
                  <div className="stat-label">Hoje</div>
                  <div className="stat-value">{stats.today_sent}</div>
                </div>
              </div>
            </div>
            
            <div className="config-card">
              <label className="config-label">{Icons.Chart} Histórico</label>
              
              {stats.recent_logs.length === 0 ? (
                <div className="alert alert-info">
                  <span>{Icons.Alert}</span>
                  <p>Nenhum disparo ainda.</p>
                </div>
              ) : (
                <div className="logs-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Data/Hora</th>
                        <th>Status</th>
                        <th>Converteu?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_logs.map(log => (
                        <tr key={log.id}>
                          <td>{log.user_telegram_id}</td>
                          <td>{new Date(log.sent_at).toLocaleString('pt-BR')}</td>
                          <td>
                            <span className={`status-badge ${log.status}`}>
                              {log.status}
                            </span>
                          </td>
                          <td>
                            {log.converted ? (
                              <span className="converted-yes">{Icons.Check} Sim</span>
                            ) : (
                              <span className="converted-no">❌ Não</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}