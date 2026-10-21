import React, { useState } from 'react';
import authService, { GARDENWORLD_DEMO } from '../services/authService';

export default function LoginView({ onLoginSuccess }) {
  const savedConfig = authService.getSavedConfig();

  // Mode: '1-step' | '2-step'
  const [authMode, setAuthMode] = useState('1-step');

  // Server & Connectivity Config
  const [baseUrl, setBaseUrl] = useState(savedConfig.baseUrl || 'https://test.idempiere.org:443');
  const [proxyMode, setProxyMode] = useState(savedConfig.proxyMode || 'local');
  const [showConfig, setShowConfig] = useState(false);

  // Form Fields
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [parameters, setParameters] = useState({
    clientId: 11,
    clientName: 'GardenWorld',
    roleId: 102,
    roleName: 'GardenWorld Admin',
    organizationId: 11,
    orgId: 11,
    orgName: 'HQ',
    warehouseId: 103,
    warehouseName: 'HQ Warehouse',
    language: 'en_US'
  });

  // 2-Step State
  const [step2Ready, setStep2Ready] = useState(false);
  const [step2Options, setStep2Options] = useState({
    clients: [],
    roles: [],
    organizations: [],
    warehouses: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  // Quick Action: Cargar Demo GardenWorld
  const handleLoadGardenWorldDemo = () => {
    setBaseUrl(GARDENWORLD_DEMO.baseUrl);
    setUserName(GARDENWORLD_DEMO.userName);
    setPassword(GARDENWORLD_DEMO.password);
    setParameters({ ...GARDENWORLD_DEMO.parameters });
    setErrorMessage(null);
    setSuccessNotice('✨ Datos de GardenWorld Demo cargados. Haz clic en "Iniciar Sesión" para autenticar.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Submit 1-Step Login
  const handleSubmitOneStep = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await authService.loginOneStep({
        baseUrl,
        userName,
        password,
        parameters,
        proxyMode
      });
      if (result.success) {
        onLoginSuccess(result.session);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error de autenticación en iDempiere ERP');
    } finally {
      setLoading(false);
    }
  };

  // Submit Step 1 (Validate Credentials)
  const handleStep1Validate = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !password) {
      setErrorMessage('Por favor ingresa usuario y contraseña');
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await authService.loginStep1Validate({
        baseUrl,
        userName,
        password,
        proxyMode
      });

      setStep2Options({
        clients: result.clients || [],
        roles: result.roles || [],
        organizations: result.organizations || [],
        warehouses: result.warehouses || []
      });

      // Si hay primer elemento, seleccionarlo por defecto
      if (result.clients?.length) {
        setParameters(prev => ({
          ...prev,
          clientId: result.clients[0].id,
          clientName: result.clients[0].name
        }));
      }
      if (result.roles?.length) {
        setParameters(prev => ({
          ...prev,
          roleId: result.roles[0].id,
          roleName: result.roles[0].name
        }));
      }
      if (result.organizations?.length) {
        setParameters(prev => ({
          ...prev,
          orgId: result.organizations[0].id,
          organizationId: result.organizations[0].id,
          orgName: result.organizations[0].name
        }));
      }
      if (result.warehouses?.length) {
        setParameters(prev => ({
          ...prev,
          warehouseId: result.warehouses[0].id,
          warehouseName: result.warehouses[0].name
        }));
      }

      setStep2Ready(true);
      setSuccessNotice('✅ Credenciales validadas. Selecciona el contexto empresarial para ingresar.');
    } catch (err) {
      setErrorMessage(err.message || 'Credenciales inválidas en iDempiere ERP');
    } finally {
      setLoading(false);
    }
  };

  // Submit Step 2 (Confirm Context & Login)
  const handleStep2Confirm = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await authService.loginStep2Confirm({
        baseUrl,
        userName,
        password,
        parameters,
        proxyMode
      });
      if (result.success) {
        onLoginSuccess(result.session);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error confirmando contexto en iDempiere');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #1A1A1A 0%, #0D0D0D 80%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        color: 'var(--text-main)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #F5A623 0%, #D98207 100%)'
          }}
        />

        {/* Brand & ERP Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'var(--primary)',
              margin: '0 auto 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '9px',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <div style={{ width: '28px', height: '8px', background: '#0D0D0D', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}></div>
            <div style={{ width: '24px', height: '3px', background: '#FFFFFF', borderRadius: '2px' }}></div>
            <div style={{ width: '28px', height: '5px', background: '#0D0D0D', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}></div>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            Control de Acceso • iDempiere REST API v1
          </span>
          <h1
            className="serif-heading"
            style={{
              fontSize: '2rem',
              color: 'var(--text-main)',
              lineHeight: 1.1,
              marginTop: '4px',
              letterSpacing: '0.04em'
            }}
          >
            PANEL DE ADMINISTRACIÓN
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
            Ingreso centralizado para usuarios activos de iDempiere. Supervisa y sincroniza pedidos de PWA y E-commerce.
          </p>
        </div>

        {/* Quick Action: Demo GardenWorld Button */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={handleLoadGardenWorldDemo}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.15) 0%, rgba(217, 130, 7, 0.1) 100%)',
              border: '1.5px dashed var(--primary)',
              borderRadius: '12px',
              padding: '11px 16px',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚡</span>
            <span>Cargar Demo GardenWorld (test.idempiere.org)</span>
          </button>
        </div>

        {/* Connectivity & CORS Proxy Accordion Toggle */}
        <div
          style={{
            background: 'var(--surface-warm)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '10px 14px',
            marginBottom: '18px'
          }}
        >
          <div
            onClick={() => setShowConfig(!showConfig)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem' }}>⚙️</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Servidor & Proxy CORS: <strong style={{ color: 'var(--primary)' }}>{proxyMode === 'local' ? 'Proxy Local' : proxyMode}</strong>
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {showConfig ? '▲ Ocultar' : '▼ Configurar'}
            </span>
          </div>

          {showConfig && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  BASE URL DEL API DE IDEMPIERE
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://test.idempiere.org:443"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  MODO DE PROXY CORS (Para saltar restricciones de navegador)
                </label>
                <select
                  value={proxyMode}
                  onChange={(e) => setProxyMode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="local">Proxy Local (/api/idempiere-proxy) — Recomendado & Estable</option>
                  <option value="corsproxy">Proxy Público (https://corsproxy.io/?)</option>
                  <option value="direct">Directo (Sin Proxy — Requiere headers CORS en ERP)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Authentication Modality Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'var(--surface-warm)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid var(--border)'
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthMode('1-step'); setStep2Ready(false); setErrorMessage(null); }}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              background: authMode === '1-step' ? 'var(--primary)' : 'transparent',
              color: authMode === '1-step' ? '#0D0D0D' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            1 Paso (Acceso Rápido)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('2-step'); setErrorMessage(null); }}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              background: authMode === '2-step' ? 'var(--primary)' : 'transparent',
              color: authMode === '2-step' ? '#0D0D0D' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            2 Pasos (Multitenant)
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#FCA5A5',
              marginBottom: '16px'
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {successNotice && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#6EE7B7',
              marginBottom: '16px'
            }}
          >
            {successNotice}
          </div>
        )}

        {/* ================= MODALIDAD 1: LOGIN DIRECTO (1 PASO) ================= */}
        {authMode === '1-step' && (
          <form onSubmit={handleSubmitOneStep}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                USUARIO DE IDEMPIERE (userName)
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="admin @ gardenworld.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-warm)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                CONTRASEÑA (password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-warm)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Context Parameters Matrix */}
            <div
              style={{
                background: 'var(--surface-warm)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '20px'
              }}
            >
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                PARÁMETROS DE CONTEXTO ERP (FIJOS)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' }}>CLIENT ID</label>
                  <input
                    type="number"
                    value={parameters.clientId}
                    onChange={(e) => setParameters({ ...parameters, clientId: Number(e.target.value) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' }}>ROLE ID</label>
                  <input
                    type="number"
                    value={parameters.roleId}
                    onChange={(e) => setParameters({ ...parameters, roleId: Number(e.target.value) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' }}>ORG ID</label>
                  <input
                    type="number"
                    value={parameters.organizationId || parameters.orgId}
                    onChange={(e) => setParameters({ ...parameters, orgId: Number(e.target.value), organizationId: Number(e.target.value) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' }}>WAREHOUSE ID</label>
                  <input
                    type="number"
                    value={parameters.warehouseId}
                    onChange={(e) => setParameters({ ...parameters, warehouseId: Number(e.target.value) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #F5A623 0%, #D98207 100%)',
                color: '#0D0D0D',
                fontWeight: 800,
                fontSize: '0.92rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-gold)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '⏳ Autenticando en iDempiere...' : '🔑 Iniciar Sesión en 1 Paso'}
            </button>
          </form>
        )}

        {/* ================= MODALIDAD 2: LOGIN ASISTIDO (2 PASOS) ================= */}
        {authMode === '2-step' && (
          <div>
            {!step2Ready ? (
              <form onSubmit={handleStep1Validate}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    PASO 1 • USUARIO DE IDEMPIERE
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="admin @ gardenworld.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-warm)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    PASO 1 • CONTRASEÑA
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-warm)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#0D0D0D',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  {loading ? '⏳ Validando con iDempiere...' : '🔍 Paso 1: Validar Credenciales'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleStep2Confirm}>
                <div
                  style={{
                    background: 'rgba(245, 166, 35, 0.1)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>USUARIO VALIDADO</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{userName}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    TENANT / CLIENTE
                  </label>
                  <select
                    value={parameters.clientId}
                    onChange={(e) => {
                      const sel = step2Options.clients.find(c => String(c.id) === e.target.value);
                      setParameters({
                        ...parameters,
                        clientId: Number(e.target.value),
                        clientName: sel ? sel.name : `Client ${e.target.value}`
                      });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-warm)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                  >
                    {step2Options.clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ROL ASIGNADO
                  </label>
                  <select
                    value={parameters.roleId}
                    onChange={(e) => {
                      const sel = step2Options.roles.find(r => String(r.id) === e.target.value);
                      setParameters({
                        ...parameters,
                        roleId: Number(e.target.value),
                        roleName: sel ? sel.name : `Role ${e.target.value}`
                      });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-warm)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                  >
                    {step2Options.roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ORGANIZACIÓN
                  </label>
                  <select
                    value={parameters.orgId}
                    onChange={(e) => {
                      const sel = step2Options.organizations.find(o => String(o.id) === e.target.value);
                      setParameters({
                        ...parameters,
                        orgId: Number(e.target.value),
                        organizationId: Number(e.target.value),
                        orgName: sel ? sel.name : `Org ${e.target.value}`
                      });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-warm)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                  >
                    {step2Options.organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ALMACÉN / WAREHOUSE
                  </label>
                  <select
                    value={parameters.warehouseId}
                    onChange={(e) => {
                      const sel = step2Options.warehouses.find(w => String(w.id) === e.target.value);
                      setParameters({
                        ...parameters,
                        warehouseId: Number(e.target.value),
                        warehouseName: sel ? sel.name : `Warehouse ${e.target.value}`
                      });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-warm)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                  >
                    {step2Options.warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setStep2Ready(false)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ↩ Cambiar Usuario
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: '11px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F5A623 0%, #D98207 100%)',
                      color: '#0D0D0D',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: 'var(--shadow-gold)'
                    }}
                  >
                    {loading ? '⏳ Confirmando...' : '✅ Confirmar e Ingresar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
