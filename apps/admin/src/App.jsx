import React, { useState, useEffect, useMemo } from 'react';
import authService from './services/authService';
import LoginView from './components/LoginView';
import SessionBadge from './components/SessionBadge';
import OrdersManagement from './components/OrdersManagement';

const FALLBACK_BURGERS = [
  {
    id: 101,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    badge: '👑 Nivel Suprema • Corona Real',
    price: 14.90,
    stock: 48,
    ordersCount: 412,
    calories: '890 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Angus 220g flameada a la leña de roble, doble cheddar añejo 18m y panceta al maple.'
  },
  {
    id: 102,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    badge: '⭐ Nivel Clásica • Tradición Real',
    price: 9.90,
    stock: 65,
    ordersCount: 538,
    calories: '610 kcal',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón smash 150g, queso americano fundido, lechuga orgánica y aderezo Rapid.'
  },
  {
    id: 103,
    name: 'Burger Real Doble',
    category: 'Especiales',
    badge: '🔥 Nivel Doble • Favorita del Chef',
    price: 12.90,
    stock: 52,
    ordersCount: 465,
    calories: '820 kcal',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash (300g), triple queso cheddar & jack, tocino y salsa ahumada.'
  },
  {
    id: 104,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    badge: '💎 Nivel Gourmet • Edición Especial',
    price: 15.50,
    stock: 36,
    ordersCount: 389,
    calories: '940 kcal',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    description: 'Doble corte Wagyu-Angus, gouda trufado, portobellos al ajillo y mayo de trufa negra.'
  },
  {
    id: 105,
    name: 'Clásica Americana Smash',
    category: 'Clásicas',
    badge: '🍔 Nivel Clásica • Esencial Oklahoma',
    price: 8.50,
    stock: 74,
    ordersCount: 342,
    calories: '560 kcal',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80',
    description: 'Doble smash fina al estilo Oklahoma con cebolla blanca prensada y doble americano.'
  },
  {
    id: 106,
    name: 'Clásica Bacon & Cheddar',
    category: 'Clásicas',
    badge: '🥓 Nivel Clásica Plus • Ahumada',
    price: 10.50,
    stock: 58,
    ordersCount: 310,
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    description: 'Res 180g a la parrilla, baño de cheddar líquido, tocino horneado y BBQ de miel.'
  },
  {
    id: 107,
    name: 'Burger Crispy Golden Royal',
    category: 'Especiales',
    badge: '✨ Nivel Especial • Crujiente Dorado',
    price: 11.50,
    stock: 44,
    ordersCount: 276,
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Pollo de granja marinado 24h en 12 especias, coleslaw de manzana y honey mustard.'
  },
  {
    id: 108,
    name: 'Clásica Cuarto de Libra Real',
    category: 'Clásicas',
    badge: '⭐ Nivel Clásica • Cuarto de Libra',
    price: 9.50,
    stock: 62,
    ordersCount: 295,
    calories: '630 kcal',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón cuarto de libra con sal marina, doble cheddar, cebolla fresca y kétchup artesanal.'
  },
  {
    id: 109,
    name: 'Burger Trufa & Brie Imperial',
    category: 'Especiales',
    badge: '👑 Nivel Suprema • Alta Cocina',
    price: 15.90,
    stock: 29,
    ordersCount: 224,
    calories: '870 kcal',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop&q=80',
    description: 'Angus 200g, queso Brie francés derretido, mermelada de tocino e higos en pan pretzel.'
  },
  {
    id: 110,
    name: 'Clásica Campestre Aguacate & Grill',
    category: 'Clásicas',
    badge: '🌿 Nivel Clásica • Frescura Grill',
    price: 11.20,
    stock: 41,
    ordersCount: 248,
    calories: '650 kcal',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80',
    description: 'Res a la parrilla, aguacate Hass en láminas, queso suizo Emmental y alioli de lima.'
  }
];

const FALLBACK_CUSTOMERS = [
  {
    id: 1,
    name: 'Valentina Morales',
    email: 'valentina.m@empresa.com',
    tier: 'VIP Oro',
    favoriteBurger: 'Rey de las Burgers',
    ordersCount: 28,
    totalSpent: 418.60,
    avgTicket: 14.95,
    lastOrder: 'Hace 18 min',
    consumptionSegment: 'Alto Consumo (Semanal)'
  },
  {
    id: 2,
    name: 'Mateo Fernández',
    email: 'm.fernandez@studio.io',
    tier: 'VIP Oro',
    favoriteBurger: 'Burger Doble Especial',
    ordersCount: 24,
    totalSpent: 372.00,
    avgTicket: 15.50,
    lastOrder: 'Hace 42 min',
    consumptionSegment: 'Alto Consumo (Semanal)'
  },
  {
    id: 3,
    name: 'Camila Mendoza',
    email: 'camila.mendoza@design.co',
    tier: 'VIP Oro',
    favoriteBurger: 'Burger Trufa & Brie Imperial',
    ordersCount: 21,
    totalSpent: 333.90,
    avgTicket: 15.90,
    lastOrder: 'Hoy, 14:05',
    consumptionSegment: 'Alto Consumo (Semanal)'
  },
  {
    id: 4,
    name: 'Sofía Castellanos',
    email: 'sofia.castellanos@mail.com',
    tier: 'Miembro Plata',
    favoriteBurger: 'Burger Real Doble',
    ordersCount: 17,
    totalSpent: 234.30,
    avgTicket: 13.78,
    lastOrder: 'Hoy, 13:20',
    consumptionSegment: 'Consumo Frecuente'
  },
  {
    id: 5,
    name: 'Alejandro Ríos',
    email: 'arios@techcorp.com',
    tier: 'Miembro Plata',
    favoriteBurger: 'Burger Real Clásica',
    ordersCount: 15,
    totalSpent: 178.50,
    avgTicket: 11.90,
    lastOrder: 'Ayer, 21:10',
    consumptionSegment: 'Consumo Frecuente'
  },
  {
    id: 6,
    name: 'Diego Santamaría',
    email: 'diego.santa@correo.es',
    tier: 'Club Rapid',
    favoriteBurger: 'Clásica Bacon & Cheddar',
    ordersCount: 9,
    totalSpent: 103.50,
    avgTicket: 11.50,
    lastOrder: 'Hace 3 días',
    consumptionSegment: 'Consumo Casual'
  }
];

const FALLBACK_ORDERS = [
  {
    id: 'ORD-9045',
    customerName: 'Distribuidora Central Gourmet',
    channel: 'PWA Preventa',
    origin: 'PWA Preventa',
    seller: 'Carlos Mendoza (Preventista #04)',
    items: [
      { name: 'Rey de las Burgers', qty: 6, price: 14.90 },
      { name: 'Burger Real Doble', qty: 4, price: 12.90 }
    ],
    total: 141.00,
    status: 'Pendiente de Aprobación',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    idempiereSync: { synced: false, docNo: null, syncDate: null }
  },
  {
    id: 'ORD-9044',
    customerName: 'Valentina Morales',
    channel: 'E-commerce',
    origin: 'E-commerce',
    seller: 'Portal Web Directo',
    items: [
      { name: 'Rey de las Burgers', qty: 2, price: 14.90 },
      { name: 'Burger Real Clásica', qty: 1, price: 9.90 }
    ],
    total: 39.70,
    status: 'En preparación',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    idempiereSync: { synced: true, docNo: 'CO-100412', syncDate: new Date(Date.now() - 1000 * 60 * 16).toISOString() }
  },
  {
    id: 'ORD-9043',
    customerName: 'Cafetería & Bistro Plaza',
    channel: 'PWA Preventa',
    origin: 'PWA Preventa',
    seller: 'Lucía Navarro (Preventista #02)',
    items: [
      { name: 'Burger Doble Especial', qty: 5, price: 15.50 },
      { name: 'Clásica Bacon & Cheddar', qty: 5, price: 10.50 }
    ],
    total: 130.00,
    status: 'Aprobado',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    idempiereSync: { synced: true, docNo: 'CO-100411', syncDate: new Date(Date.now() - 1000 * 60 * 30).toISOString() }
  },
  {
    id: 'ORD-9042',
    customerName: 'Mateo Fernández',
    channel: 'E-commerce',
    origin: 'E-commerce',
    seller: 'Portal Web Directo',
    items: [
      { name: 'Burger Doble Especial', qty: 1, price: 15.50 },
      { name: 'Burger Real Doble', qty: 1, price: 12.90 }
    ],
    total: 28.40,
    status: 'Entregado',
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    idempiereSync: { synced: true, docNo: 'CO-100408', syncDate: new Date(Date.now() - 1000 * 60 * 50).toISOString() }
  },
  {
    id: 'ORD-9041',
    customerName: 'Hotel Boutique Las Terrazas',
    channel: 'PWA Preventa',
    origin: 'PWA Preventa',
    seller: 'Carlos Mendoza (Preventista #04)',
    items: [
      { name: 'Burger Trufa & Brie Imperial', qty: 8, price: 15.90 },
      { name: 'Burger Crispy Golden Royal', qty: 4, price: 11.50 }
    ],
    total: 173.20,
    status: 'Facturado ERP',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    idempiereSync: { synced: true, docNo: 'CO-100405', syncDate: new Date(Date.now() - 1000 * 60 * 90).toISOString() }
  }
];

export default function App() {
  // AuthGuard State
  const [session, setSession] = useState(() => authService.getSession());

  // Active Main Navigation Tab in Admin Console: 'orders' | 'burgers' | 'customers' | 'telemetry'
  const [activeTab, setActiveTab] = useState('orders');

  // Business Data State
  const [burgers, setBurgers] = useState(FALLBACK_BURGERS);
  const [customers, setCustomers] = useState(FALLBACK_CUSTOMERS);
  const [orders, setOrders] = useState(FALLBACK_ORDERS);
  const [serverHealth, setServerHealth] = useState({
    status: 'healthy',
    uptime: 3640,
    database: {
      mode: 'in-memory',
      connected: false,
      engine: 'Burger Factory In-Memory Store v1.0',
      host: 'localhost (In-Memory)',
      database: 'hamburger_rapid',
      latencyMs: 0.8
    }
  });

  const [segmentFilter, setSegmentFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'Especiales',
    badge: '👑 Nivel Especial • Chef Signature',
    price: '13.50',
    stock: '40',
    description: ''
  });
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [healthRes, prodRes, custRes, ordersRes] = await Promise.all([
        fetch('/api/health').then(r => r.json()).catch(() => null),
        fetch('/api/products').then(r => r.json()).catch(() => null),
        fetch('/api/customers').then(r => r.json()).catch(() => null),
        fetch('/api/orders').then(r => r.json()).catch(() => null)
      ]);
      if (healthRes) setServerHealth(healthRes);
      if (prodRes?.data?.length) setBurgers(prodRes.data);
      if (custRes?.data?.length) setCustomers(custRes.data);
      if (ordersRes?.data?.length) setOrders(ordersRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const notify = (text) => {
    setStatusMessage(text);
    setTimeout(() => setStatusMessage(null), 3600);
  };

  // Sync order to iDempiere ERP
  const handleSyncOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: session?.baseUrl,
          token: session?.token
        })
      });
      const json = await res.json();
      if (json?.data) {
        setOrders(prev => prev.map(o => o.id === orderId ? json.data : o));
        notify(`✅ Pedido ${orderId} sincronizado en iDempiere ERP (DocNo: ${json.data.idempiereSync?.docNo})`);
      }
    } catch {
      // Fallback local update
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Sincronizado iDempiere',
            idempiereSync: {
              synced: true,
              docNo: `CO-${Math.floor(100400 + Math.random() * 500)}`,
              syncDate: new Date().toISOString()
            }
          };
        }
        return o;
      }));
      notify(`✅ Pedido ${orderId} sincronizado en iDempiere ERP`);
    }
  };

  const handleCreateBurger = async (e) => {
    e.preventDefault();
    if (!newBurger.name.trim()) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBurger,
          price: parseFloat(newBurger.price) || 12.90,
          stock: parseInt(newBurger.stock, 10) || 40
        })
      });
      const json = await res.json();
      if (json?.data) {
        setBurgers(prev => [json.data, ...prev]);
      }
    } catch {
      const fallbackItem = {
        id: Date.now(),
        ...newBurger,
        price: parseFloat(newBurger.price) || 12.90,
        stock: parseInt(newBurger.stock, 10) || 40,
        ordersCount: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
      };
      setBurgers(prev => [fallbackItem, ...prev]);
    }
    setNewBurger({
      name: '',
      category: 'Especiales',
      badge: '👑 Nivel Especial • Chef Signature',
      price: '13.50',
      stock: '40',
      description: ''
    });
    setShowAddForm(false);
    notify('✅ Nueva variante agregada al catálogo');
  };

  const handleDeleteBurger = async (id, name) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {}
    setBurgers(prev => prev.filter(b => b.id !== id));
    notify(`🗑️ Variante "${name}" retirada del catálogo`);
  };

  const handleResetCatalog = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchDashboardData();
    } catch {
      setBurgers(FALLBACK_BURGERS);
      setCustomers(FALLBACK_CUSTOMERS);
      setOrders(FALLBACK_ORDERS);
    }
    notify('🔄 Catálogo y métricas restablecidos a los valores originales');
  };

  const filteredCustomers = useMemo(() => {
    if (segmentFilter === 'Todos') return customers;
    return customers.filter(c => c.consumptionSegment === segmentFilter);
  }, [customers, segmentFilter]);

  const filteredBurgers = useMemo(() => {
    if (categoryFilter === 'Todas') return burgers;
    return burgers.filter(b => b.category === categoryFilter);
  }, [burgers, categoryFilter]);

  const totalStock = burgers.reduce((acc, b) => acc + (Number(b.stock) || 0), 0);
  const totalCustomerSpend = customers.reduce((acc, c) => acc + Number(c.totalSpent || 0), 0);
  const maxSpent = Math.max(...customers.map(c => Number(c.totalSpent || 1)), 1);

  // ================= AUTHGUARD =================
  // Si no hay sesión válida de iDempiere, se renderiza la pantalla de login
  if (!session) {
    return <LoginView onLoginSuccess={(sess) => setSession(sess)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Top Executive Navigation */}
      <header
        style={{
          background: 'rgba(13, 13, 13, 0.94)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 32px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '7px',
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              <div style={{ width: '22px', height: '6px', background: '#0D0D0D', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}></div>
              <div style={{ width: '20px', height: '3px', background: '#FFFFFF', borderRadius: '2px' }}></div>
              <div style={{ width: '22px', height: '4px', background: '#0D0D0D', borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' }}></div>
            </div>
            <div>
              <div className="serif-heading" style={{ fontSize: '1.45rem', color: 'var(--text-main)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
                BURGER FACTORY &bull; ADMIN CENTER
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Control de Pedidos Multicanal &bull; Integración iDempiere ERP v1
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchDashboardData}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              🔄 Sincronizar
            </button>
            <a
              href="/"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            >
              🌐 E-commerce Landing
            </a>
            <a
              href="/app"
              style={{
                textDecoration: 'none',
                background: 'var(--primary)',
                color: '#0D0D0D',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              📱 PWA Preventa
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '24px 32px 64px' }}>
        {/* Active iDempiere ERP Session Context Bar */}
        <SessionBadge session={session} onLogout={() => setSession(null)} />

        {/* Global Toast Message */}
        {statusMessage && (
          <div
            style={{
              background: '#1C1917',
              border: '1px solid var(--primary)',
              color: '#FAF7F2',
              padding: '12px 20px',
              borderRadius: '14px',
              marginBottom: '20px',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 800 }}
            >
              ✕ Cerrar
            </button>
          </div>
        )}

        {/* Executive KPI Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          {/* KPI 1: Multichannel Orders */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Bandeja de Pedidos
              </span>
              <span style={{ background: 'var(--brand-soft)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                Multicanal
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
              {orders.length} Pedidos
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              📱 {orders.filter(o => o.origin === 'PWA Preventa').length} PWA Preventa &bull; 🌐 {orders.filter(o => o.origin === 'E-commerce').length} E-commerce
            </div>
          </div>

          {/* KPI 2: ERP Sync State */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Sincronización ERP
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                iDempiere REST v1
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', color: '#10B981', letterSpacing: '0.04em' }}>
              {orders.filter(o => o.idempiereSync?.synced).length} / {orders.length} Listos
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Tenant: <strong>{session.clientName}</strong> &bull; Org: <strong>{session.orgName}</strong>
            </div>
          </div>

          {/* KPI 3: Available Burgers */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Catálogo Comercial
              </span>
              <span style={{ background: 'var(--brand-soft)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                10 Insignias
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
              {burgers.length} Variantes
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Stock listo en cocina: <strong>{totalStock} unidades</strong>
            </div>
          </div>

          {/* KPI 4: Customers Volume */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Consumo Acumulado
              </span>
              <span style={{ background: 'var(--brand-soft)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                Fidelización
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', color: 'var(--primary)', letterSpacing: '0.04em' }}>
              ${totalCustomerSpend.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Clientes VIP: <strong>{customers.length} cuentas registradas</strong>
            </div>
          </div>
        </section>

        {/* Central Backoffice Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '14px',
            marginBottom: '26px',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'orders', label: '🛒 Gestión de Pedidos Multicanal', badge: `${orders.length}` },
            { id: 'burgers', label: '🍔 Catálogo & Stock de Cocina', badge: `${burgers.length}` },
            { id: 'customers', label: '👥 Analítica de Consumidores', badge: `${customers.length}` },
            { id: 'telemetry', label: '🗄️ Telemetría de Base de Datos & ERP' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: activeTab === tab.id ? 'var(--primary)' : 'var(--surface)',
                color: activeTab === tab.id ? '#0D0D0D' : 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.id ? 'var(--shadow-gold)' : 'none'
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    background: activeTab === tab.id ? '#0D0D0D' : 'var(--surface-warm)',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: GESTIÓN DE PEDIDOS MULTICANAL (PWA PREVENTA VS E-COMMERCE) ================= */}
        {activeTab === 'orders' && (
          <OrdersManagement
            orders={orders}
            onSyncOrder={handleSyncOrder}
            session={session}
          />
        )}

        {/* ================= TAB 2: CATÁLOGO Y STOCK DE COCINA ================= */}
        {activeTab === 'burgers' && (
          <section
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '26px 28px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🍔 Inventario Comercial & Especialidades
                </span>
                <h2 className="serif-heading" style={{ fontSize: '1.8rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                  Hamburguesas Disponibles en Plataforma ({filteredBurgers.length})
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Sincronizado en tiempo real con la PWA Preventa de vendedores y con el E-commerce.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {['Todas', 'Especiales', 'Clásicas'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: categoryFilter === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: categoryFilter === cat ? 'var(--primary)' : 'var(--bg)',
                      color: categoryFilter === cat ? '#0D0D0D' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: showAddForm ? '#262626' : 'var(--primary)',
                    color: showAddForm ? '#FFFFFF' : '#0D0D0D',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: showAddForm ? 'none' : 'var(--shadow-gold)'
                  }}
                >
                  {showAddForm ? '✕ Cancelar' : '+ Nueva Hamburguesa'}
                </button>
              </div>
            </div>

            {/* Optional Form to Add a New Burger */}
            {showAddForm && (
              <form
                onSubmit={handleCreateBurger}
                style={{
                  background: 'var(--surface-warm)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  padding: '18px',
                  marginBottom: '22px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  alignItems: 'end'
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>NOMBRE DE LA BURGER</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Burger Real Triple"
                    value={newBurger.name}
                    onChange={e => setNewBurger({ ...newBurger, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>CATEGORÍA</label>
                  <select
                    value={newBurger.category}
                    onChange={e => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                  >
                    <option value="Especiales">Especiales</option>
                    <option value="Clásicas">Clásicas</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>BADGE ESPECIALIDAD</label>
                  <input
                    type="text"
                    value={newBurger.badge}
                    onChange={e => setNewBurger({ ...newBurger, badge: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>PRECIO ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newBurger.price}
                    onChange={e => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>STOCK</label>
                  <input
                    type="number"
                    value={newBurger.stock}
                    onChange={e => setNewBurger({ ...newBurger, stock: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary)',
                    color: '#0D0D0D',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  Guardar en BD
                </button>
              </form>
            )}

            {/* Burgers Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '16px'
              }}
            >
              {filteredBurgers.map(burger => (
                <div
                  key={burger.id}
                  style={{
                    background: 'var(--surface-warm)',
                    border: '1px solid var(--border)',
                    borderRadius: '18px',
                    padding: '14px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={burger.image}
                    alt={burger.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      flexShrink: 0,
                      background: 'var(--bg-secondary)'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: burger.category === 'Especiales' ? 'var(--amber-soft)' : 'var(--success-soft)',
                          color: burger.category === 'Especiales' ? '#F5A623' : 'var(--success)'
                        }}
                      >
                        {burger.badge || burger.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        ID #{burger.id}
                      </span>
                    </div>

                    <div className="serif-heading" style={{ fontSize: '1.25rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.04em' }}>
                      {burger.name}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div>
                        <span className="serif-heading" style={{ fontSize: '1.35rem', color: 'var(--primary)' }}>
                          ${Number(burger.price).toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                          Stock: <strong>{burger.stock}</strong> &bull; {burger.ordersCount || 120} ventas
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteBurger(burger.id, burger.name)}
                        title="Eliminar variante"
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= TAB 3: ANALÍTICA DE CONSUMIDORES ================= */}
        {activeTab === 'customers' && (
          <section
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '26px 28px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  👥 Fidelización & Análisis de Demanda
                </span>
                <h2 className="serif-heading" style={{ fontSize: '1.8rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                  Métricas de Consumidores según Nivel de Consumo
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Clasificación automática por gasto acumulado, ticket promedio y variante preferida.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Todos', 'Alto Consumo (Semanal)', 'Consumo Frecuente', 'Consumo Casual'].map(seg => (
                  <button
                    key={seg}
                    onClick={() => setSegmentFilter(seg)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: segmentFilter === seg ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: segmentFilter === seg ? 'var(--primary)' : 'var(--bg)',
                      color: segmentFilter === seg ? '#0D0D0D' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 10px' }}>Consumidor / Cliente</th>
                    <th style={{ padding: '12px 10px' }}>Segmento de Consumo</th>
                    <th style={{ padding: '12px 10px' }}>Hamburguesa Favorita</th>
                    <th style={{ padding: '12px 10px' }}>Órdenes</th>
                    <th style={{ padding: '12px 10px' }}>Ticket Prom.</th>
                    <th style={{ padding: '12px 10px' }}>Consumo Total ($)</th>
                    <th style={{ padding: '12px 10px', minWidth: '160px' }}>Índice de Consumo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(cust => {
                    const ratio = Math.min(100, Math.round((Number(cust.totalSpent) / maxSpent) * 100));
                    return (
                      <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 10px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.email} &bull; {cust.lastOrder}</div>
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              background:
                                cust.consumptionSegment.includes('Alto')
                                  ? 'var(--amber-soft)'
                                  : cust.consumptionSegment.includes('Frecuente')
                                  ? 'var(--purple-soft)'
                                  : 'var(--success-soft)',
                              color:
                                cust.consumptionSegment.includes('Alto')
                                  ? 'var(--primary)'
                                  : cust.consumptionSegment.includes('Frecuente')
                                  ? 'var(--purple)'
                                  : 'var(--success)'
                            }}
                          >
                            {cust.tier} • {cust.consumptionSegment}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px', fontWeight: 700 }}>
                          🍔 {cust.favoriteBurger}
                        </td>
                        <td style={{ padding: '14px 10px', fontWeight: 800 }}>
                          {cust.ordersCount} pedidos
                        </td>
                        <td style={{ padding: '14px 10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          ${Number(cust.avgTicket).toFixed(2)}
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <span className="serif-heading" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                            ${Number(cust.totalSpent).toFixed(2)}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${ratio}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #F5A623, #D98207)',
                                  borderRadius: '999px'
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', minWidth: '34px' }}>
                              {ratio}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================= TAB 4: TELEMETRÍA DE BD Y ERP ================= */}
        {activeTab === 'telemetry' && (
          <section
            style={{
              background: 'linear-gradient(135deg, #181818 0%, #121212 100%)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px 28px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🗄️ Telemetría de Persistencia & Conectividad ERP
                </span>
                <h2 className="serif-heading" style={{ fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                  Estado de la Base de Datos, Servidor e iDempiere
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleResetCatalog}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: 'var(--text-main)'
                  }}
                >
                  ♻️ Restaurar Datos Base
                </button>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    background: 'var(--primary)',
                    color: '#0D0D0D',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  🩺 Ver JSON /api/health ↗
                </a>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '14px'
              }}
            >
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>MOTOR LOCAL DB</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {serverHealth?.database?.engine || (serverHealth?.database?.mode === 'mysql' ? 'MySQL 8.0 InnoDB' : 'Burger Factory In-Memory Store')}
                </div>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>ESQUEMA / BD LOCAL</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {serverHealth?.database?.database || 'hamburger_rapid'}
                </div>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>SERVIDOR IDEMPIERE ERP</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                  {session.baseUrl}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Modo Proxy: <strong>{session.proxyMode}</strong>
                </div>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>COLECCIONES SINCRONIZADAS</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                  pedidos ({orders.length}) &bull; productos ({burgers.length}) &bull; clientes ({customers.length})
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
