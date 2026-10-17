import React, { useState, useEffect, useMemo } from 'react';

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

export default function App() {
  const [burgers, setBurgers] = useState(FALLBACK_BURGERS);
  const [customers, setCustomers] = useState(FALLBACK_CUSTOMERS);
  const [serverHealth, setServerHealth] = useState({
    status: 'healthy',
    uptime: 3640,
    database: {
      mode: 'in-memory',
      connected: false,
      engine: 'Hamburger Rapid In-Memory Store v1.0',
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
      const [healthRes, prodRes, custRes] = await Promise.all([
        fetch('/api/health').then(r => r.json()).catch(() => null),
        fetch('/api/products').then(r => r.json()).catch(() => null),
        fetch('/api/customers').then(r => r.json()).catch(() => null)
      ]);
      if (healthRes) setServerHealth(healthRes);
      if (prodRes?.data?.length) setBurgers(prodRes.data);
      if (custRes?.data?.length) setCustomers(custRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const notify = (text) => {
    setStatusMessage(text);
    setTimeout(() => setStatusMessage(null), 3200);
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
    notify('✅ Nueva variante agregada al catálogo disponible');
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
    }
    notify('🔄 Catálogo y métricas restablecidos a las 10 variantes originales');
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
  const totalCustomerOrders = customers.reduce((acc, c) => acc + Number(c.ordersCount || 0), 0);
  const avgConsumptionPerClient = customers.length ? totalCustomerSpend / customers.length : 0;
  const maxSpent = Math.max(...customers.map(c => Number(c.totalSpent || 1)), 1);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Executive Navigation */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
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
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #D9381E, #EA580C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 6px 16px rgba(217, 56, 30, 0.25)'
              }}
            >
              🍔
            </div>
            <div>
              <div className="serif-heading" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                Hamburger Rapid &bull; Admin Center
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Gestión de Catálogo, Inteligencia de Consumidores y Estado de Base de Datos
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchDashboardData}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '9px 15px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              🔄 Sincronizar Métricas
            </button>
            <a
              href="/"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '9px 16px',
                borderRadius: '999px',
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
                background: 'var(--brand)',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 6px 16px rgba(217, 56, 30, 0.24)'
              }}
            >
              📱 Abrir App Móvil PWA
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '28px 32px 64px' }}>
        {statusMessage && (
          <div
            style={{
              background: '#1C1917',
              color: '#FAF7F2',
              padding: '12px 20px',
              borderRadius: '14px',
              marginBottom: '20px',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              style={{ background: 'transparent', border: 'none', color: '#FBBF24', cursor: 'pointer', fontWeight: 800 }}
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Executive KPI Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '18px',
            marginBottom: '28px'
          }}
        >
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
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Hamburguesas Disponibles
              </span>
              <span style={{ background: 'var(--brand-soft)', color: 'var(--brand)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                Catálogo Activo
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {burgers.length} Variantes
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Stock total listo en cocina: <strong>{totalStock} unidades</strong>
            </div>
          </div>

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
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Consumo Acumulado Clientes
              </span>
              <span style={{ background: 'var(--success-soft)', color: 'var(--success)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                +18.4% vs mes ant.
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--brand)' }}>
              ${totalCustomerSpend.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Promedio por consumidor: <strong>${avgConsumptionPerClient.toFixed(2)}</strong> ({totalCustomerOrders} órdenes)
            </div>
          </div>

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
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Clientes Segmentados
              </span>
              <span style={{ background: 'var(--amber-soft)', color: '#92400E', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                3 Niveles VIP
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {customers.length} Clientes Top
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Favorita #1: <strong>Rey de las Burgers</strong>
            </div>
          </div>

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
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Estado de la Base de Datos
              </span>
              <span
                style={{
                  background: 'var(--success-soft)',
                  color: 'var(--success)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                ● Operativa
              </span>
            </div>
            <div className="serif-heading" style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
              {serverHealth?.database?.mode === 'mysql' ? '🐬 MySQL Cluster' : '⚡ In-Memory Store'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Host: <strong>{serverHealth?.database?.host || 'localhost'}</strong> &bull; Latencia: <strong>{serverHealth?.database?.latencyMs || 0.8}ms</strong>
            </div>
          </div>
        </section>

        {/* SECTION 1: DATABASE STATUS & INFRASTRUCTURE HEALTH */}
        <section
          style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #F5EFE4 100%)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '24px 28px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🗄️ Telemetría de Persistencia en Tiempo Real
              </span>
              <h2 className="serif-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Estado de la Base de Datos y Nodo Backend
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleResetCatalog}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                ♻️ Restaurar 10 Hamburguesas Base
              </button>
              <a
                href="/api/health"
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  background: '#1C1917',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                🩺 Ver JSON /api/health ↗
              </a>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px'
            }}
          >
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>MOTOR DE DATOS</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {serverHealth?.database?.engine || (serverHealth?.database?.mode === 'mysql' ? 'MySQL 8.0 InnoDB' : 'Hamburger Rapid In-Memory Store')}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>ESQUEMA / BASE DE DATOS</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {serverHealth?.database?.database || 'hamburger_rapid'}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>HOST / ENDPOINT</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {serverHealth?.database?.host || 'localhost (Auto-Discovery)'}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>COLECCIONES SINCRONIZADAS</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
                products ({burgers.length}) • customers ({customers.length})
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CUSTOMER CONSUMPTION METRICS */}
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '26px 28px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                👥 Analítica de Clientes & Fidelización
              </span>
              <h2 className="serif-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Métricas de Consumidores según Nivel de Consumo
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Clasificación automática por gasto acumulado, ticket promedio y variante de hamburguesa preferida.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Todos', 'Alto Consumo (Semanal)', 'Consumo Frecuente', 'Consumo Casual'].map(seg => (
                <button
                  key={seg}
                  onClick={() => setSegmentFilter(seg)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '999px',
                    border: segmentFilter === seg ? '1px solid var(--brand)' : '1px solid var(--border)',
                    background: segmentFilter === seg ? 'var(--brand)' : 'var(--bg)',
                    color: segmentFilter === seg ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
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
                                ? '#92400E'
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
                        <span className="serif-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand)' }}>
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
                                background: 'linear-gradient(90deg, var(--brand), #F59E0B)',
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

        {/* SECTION 3: AVAILABLE BURGERS INVENTORY & DEMAND */}
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
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🍔 Inventario Comercial & Especialidades
              </span>
              <h2 className="serif-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Hamburguesas Disponibles en Plataforma ({filteredBurgers.length})
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Listado oficial sincronizado con el E-commerce y la PWA Móvil. Incluye las variantes insignia y clásicas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {['Todas', 'Especiales', 'Clásicas'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: categoryFilter === cat ? '1px solid var(--brand)' : '1px solid var(--border)',
                    background: categoryFilter === cat ? 'var(--brand)' : 'var(--bg)',
                    color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
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
                  borderRadius: '999px',
                  border: 'none',
                  background: '#1C1917',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
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
                background: 'var(--bg)',
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
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px' }}>NOMBRE DE LA BURGER</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Burger Real Triple"
                  value={newBurger.name}
                  onChange={e => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px' }}>CATEGORÍA</label>
                <select
                  value={newBurger.category}
                  onChange={e => setNewBurger({ ...newBurger, category: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}
                >
                  <option value="Especiales">Especiales</option>
                  <option value="Clásicas">Clásicas</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px' }}>BADGE ESPECIALIDAD</label>
                <input
                  type="text"
                  value={newBurger.badge}
                  onChange={e => setNewBurger({ ...newBurger, badge: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px' }}>PRECIO ($)</label>
                <input
                  type="number"
                  step="0.10"
                  value={newBurger.price}
                  onChange={e => setNewBurger({ ...newBurger, price: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px' }}>STOCK</label>
                <input
                  type="number"
                  value={newBurger.stock}
                  onChange={e => setNewBurger({ ...newBurger, stock: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'var(--brand)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Guardar en BD
              </button>
            </form>
          )}

          {/* Available Burgers Grid */}
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
                        borderRadius: '999px',
                        background: burger.category === 'Especiales' ? 'var(--amber-soft)' : 'var(--success-soft)',
                        color: burger.category === 'Especiales' ? '#92400E' : 'var(--success)'
                      }}
                    >
                      {burger.badge || burger.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      ID #{burger.id}
                    </span>
                  </div>

                  <div className="serif-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {burger.name}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div>
                      <span className="serif-heading" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand)' }}>
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
      </main>
    </div>
  );
}
