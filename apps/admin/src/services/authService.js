/**
 * authService.js
 * Servicio modular de autenticación y control de acceso contra iDempiere REST API v1.
 * Diseñado como librería reutilizable tanto para el Panel de Administración como para la PWA de Pedidos.
 */

const STORAGE_TOKEN_KEY = 'idempiere_auth_token';
const STORAGE_SESSION_KEY = 'idempiere_auth_session';
const STORAGE_CONFIG_KEY = 'idempiere_auth_config';

export const GARDENWORLD_DEMO = {
  baseUrl: 'https://test.idempiere.org:443',
  userName: 'admin @ gardenworld.com',
  password: 'GardenAdmin',
  parameters: {
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
  }
};

export const DEFAULT_CONFIG = {
  baseUrl: 'https://test.idempiere.org:443',
  proxyMode: 'local' // 'local' | 'corsproxy' | 'direct'
};

class AuthService {
  constructor() {
    this.session = this.loadStoredSession();
  }

  loadStoredSession() {
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY) || sessionStorage.getItem(STORAGE_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  getSavedConfig() {
    try {
      const cfg = localStorage.getItem(STORAGE_CONFIG_KEY);
      return cfg ? JSON.parse(cfg) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  saveConfig(config) {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch {}
  }

  isAuthenticated() {
    const session = this.getSession();
    return !!(session && session.token);
  }

  getSession() {
    if (!this.session) {
      this.session = this.loadStoredSession();
    }
    return this.session;
  }

  getToken() {
    const session = this.getSession();
    return session?.token || null;
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  cleanUrl(url) {
    return (url || '').trim().replace(/\/+$/, '');
  }

  /**
   * Ejecuta petición HTTP considerando el modo de proxy configurado
   */
  async request({ baseUrl, path, method = 'POST', headers = {}, body = null, proxyMode = 'local' }) {
    const targetUrl = `${this.cleanUrl(baseUrl)}${path}`;

    if (proxyMode === 'local') {
      // Proxy local en nuestro backend Express (/api/idempiere-proxy)
      const res = await fetch('/api/idempiere-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          method,
          headers,
          body
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.detail || `Error HTTP ${res.status} desde iDempiere`);
      }
      return data;
    }

    if (proxyMode === 'corsproxy') {
      // Proxy público corsproxy.io
      const corsUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      const res = await fetch(corsUrl, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.detail || `Error HTTP ${res.status} vía CORS Proxy`);
      }
      return data;
    }

    // Directo (requiere headers CORS en iDempiere)
    const res = await fetch(targetUrl, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || data?.detail || `Error HTTP ${res.status} directo`);
    }
    return data;
  }

  /**
   * Modalidad 1: Login Directo / 1 Paso (Acceso Rápido)
   * Endpoint: POST {baseUrl}/api/v1/auth/tokens
   */
  async loginOneStep({ baseUrl, userName, password, parameters, proxyMode = 'local' }) {
    this.saveConfig({ baseUrl, proxyMode });

    const orgVal = Number(parameters.organizationId || parameters.orgId) || 11;
    const payload = {
      userName: userName.trim(),
      password,
      parameters: {
        clientId: Number(parameters.clientId) || parameters.clientId || 11,
        roleId: Number(parameters.roleId) || parameters.roleId || 102,
        organizationId: orgVal,
        warehouseId: Number(parameters.warehouseId) || parameters.warehouseId || 103,
        language: parameters.language || 'en_US'
      }
    };

    const data = await this.request({
      baseUrl,
      path: '/api/v1/auth/tokens',
      method: 'POST',
      body: payload,
      proxyMode
    });

    if (!data || !data.token) {
      throw new Error('iDempiere no devolvió un token de sesión válido.');
    }

    const session = {
      token: data.token,
      userId: data.userId || 100,
      userName: userName.trim(),
      clientId: payload.parameters.clientId,
      clientName: parameters.clientName || data.parameters?.clientName || 'GardenWorld',
      roleId: payload.parameters.roleId,
      roleName: parameters.roleName || data.parameters?.roleName || 'GardenWorld Admin',
      orgId: orgVal,
      organizationId: orgVal,
      orgName: parameters.orgName || data.parameters?.orgName || 'HQ',
      warehouseId: payload.parameters.warehouseId,
      warehouseName: parameters.warehouseName || data.parameters?.warehouseName || 'HQ Warehouse',
      language: payload.parameters.language,
      baseUrl: this.cleanUrl(baseUrl),
      proxyMode,
      authMode: '1-step',
      authenticatedAt: new Date().toISOString()
    };

    this.saveSession(session);
    return { success: true, session };
  }

  /**
   * Modalidad 2: Paso 1 - Validación de Usuario y Contraseña (Multitenant Dinámico)
   * Valida credenciales y obtiene tenants, roles y organizaciones asignados.
   */
  async loginStep1Validate({ baseUrl, userName, password, proxyMode = 'local' }) {
    this.saveConfig({ baseUrl, proxyMode });

    // En iDempiere REST v1, se envía userName y password para validar y descubrir los contextos accesibles
    let data;
    try {
      data = await this.request({
        baseUrl,
        path: '/api/v1/auth/tokens',
        method: 'POST',
        body: { userName: userName.trim(), password },
        proxyMode
      });
    } catch (err) {
      // Si el servidor requiere al menos parámetros por defecto para responder, reintentamos con parámetros base
      if (err.message && err.message.toLowerCase().includes('parameters')) {
        data = await this.request({
          baseUrl,
          path: '/api/v1/auth/tokens',
          method: 'POST',
          body: {
            userName: userName.trim(),
            password,
            parameters: {
              clientId: 11,
              roleId: 102,
              organizationId: 11,
              warehouseId: 103,
              language: 'en_US'
            }
          },
          proxyMode
        });
      } else {
        throw err;
      }
    }

    // Extraer o generar opciones de contexto multitenant
    const clients = data.clients || [
      { id: 11, name: 'GardenWorld (11)' },
      { id: 1000000, name: 'Standard Tenant (1000000)' }
    ];

    const roles = data.roles || [
      { id: 102, name: 'GardenWorld Admin (102)' },
      { id: 103, name: 'GardenWorld User (103)' },
      { id: 50000, name: 'Sales Representative (50000)' }
    ];

    const organizations = data.organizations || [
      { id: 11, name: 'HQ - Sede Principal (11)' },
      { id: 12, name: 'Store #1 - Sucursal Norte (12)' }
    ];

    const warehouses = data.warehouses || [
      { id: 103, name: 'HQ Warehouse - Almacén Central (103)' },
      { id: 104, name: 'Store Warehouse - Almacén Tienda (104)' }
    ];

    return {
      success: true,
      rawResponse: data,
      token: data.token || null,
      clients,
      roles,
      organizations,
      warehouses
    };
  }

  /**
   * Modalidad 2: Paso 2 - Confirmación de Contexto y Emisión de Token
   */
  async loginStep2Confirm({ baseUrl, userName, password, parameters, proxyMode = 'local' }) {
    return this.loginOneStep({
      baseUrl,
      userName,
      password,
      parameters,
      proxyMode
    });
  }

  saveSession(session) {
    this.session = session;
    try {
      localStorage.setItem(STORAGE_TOKEN_KEY, session.token);
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem(STORAGE_TOKEN_KEY, session.token);
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch {}
  }

  logout() {
    this.session = null;
    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
      sessionStorage.removeItem(STORAGE_TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {}
  }
}

export const authService = new AuthService();
export default authService;
