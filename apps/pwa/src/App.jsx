import React, { useState, useEffect, useMemo } from 'react';

const FALLBACK_BURGERS = [
  {
    id: 101,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    badge: '👑 Nivel Suprema • Corona Real',
    price: 14.90,
    prepTime: '8-10 min',
    calories: '890 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Angus 220g a la leña de roble, doble cheddar 18 meses, panceta al maple y salsa Imperial.'
  },
  {
    id: 102,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    badge: '⭐ Nivel Clásica • Tradición Real',
    price: 9.90,
    prepTime: '5-7 min',
    calories: '610 kcal',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón smash 150g, queso americano fundido, vegetales orgánicos y aderezo Rapid.'
  },
  {
    id: 103,
    name: 'Burger Real Doble',
    category: 'Especiales',
    badge: '🔥 Nivel Doble • Favorita del Chef',
    price: 12.90,
    prepTime: '7-9 min',
    calories: '820 kcal',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash (300g), triple queso cheddar & jack, tocino crocante y salsa ahumada.'
  },
  {
    id: 104,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    badge: '💎 Nivel Gourmet • Edición Especial',
    price: 15.50,
    prepTime: '9-11 min',
    calories: '940 kcal',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    description: 'Doble corte Wagyu-Angus, gouda trufado, portobellos al ajillo y emulsión de trufa negra.'
  },
  {
    id: 105,
    name: 'Clásica Americana Smash',
    category: 'Clásicas',
    badge: '🍔 Nivel Clásica • Esencial Oklahoma',
    price: 8.50,
    prepTime: '4-6 min',
    calories: '560 kcal',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80',
    description: 'Doble smash fina con cebolla blanca prensada en plancha de hierro y doble americano.'
  },
  {
    id: 106,
    name: 'Clásica Bacon & Cheddar',
    category: 'Clásicas',
    badge: '🥓 Nivel Clásica Plus • Ahumada',
    price: 10.50,
    prepTime: '6-8 min',
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    description: 'Res 180g a la parrilla, baño de cheddar fundido, tocino horneado y BBQ de miel.'
  },
  {
    id: 107,
    name: 'Burger Crispy Golden Royal',
    category: 'Especiales',
    badge: '✨ Nivel Especial • Crujiente Dorado',
    price: 11.50,
    prepTime: '7-9 min',
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
    prepTime: '5-7 min',
    calories: '630 kcal',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón cuarto de libra sazonado con sal marina, doble cheddar y kétchup artesanal.'
  },
  {
    id: 109,
    name: 'Burger Trufa & Brie Imperial',
    category: 'Especiales',
    badge: '👑 Nivel Suprema • Alta Cocina',
    price: 15.90,
    prepTime: '9-12 min',
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
    prepTime: '6-8 min',
    calories: '650 kcal',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80',
    description: 'Res a la parrilla, aguacate Hass en láminas, queso suizo Emmental y alioli de lima.'
  }
];

const SPECIAL_OFFERS = [
  {
    id: 'PROMO-REY',
    code: 'CORONAREAL',
    title: 'Combo Corona Imperial (-20%)',
    subtitle: '1x Rey de las Burgers + 1x Burger Real Clásica',
    discountPercent: 20,
    badge: '🔥 Oferta Estrella',
    itemsToAdd: [101, 102],
    originalPrice: 24.80,
    offerPrice: 19.84
  },
  {
    id: 'PROMO-DOBLE',
    code: 'DOBLEPOWER',
    title: 'Dúo Doble Especial (-15%)',
    subtitle: '1x Burger Real Doble + 1x Burger Doble Especial',
    discountPercent: 15,
    badge: '💎 Nivel Gourmet',
    itemsToAdd: [103, 104],
    originalPrice: 28.40,
    offerPrice: 24.14
  },
  {
    id: 'PROMO-CLASICO',
    code: 'RAPID10',
    title: '10% OFF en Todo el Menú',
    subtitle: 'Aplica descuento directo sobre cualquier combinación en tu carrito',
    discountPercent: 10,
    badge: '⚡ Cupón Directo',
    itemsToAdd: []
  }
];

const ORDER_STEPS = ['Recibida 📋', 'En Parrilla 🔥', 'Empacando 🥡', 'En Camino 🛵', 'Entregada ✅'];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'ofertas' | 'ordenes' | 'perfil'
  const [burgers, setBurgers] = useState(FALLBACK_BURGERS);
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([
    { id: 101, name: 'Rey de las Burgers', price: 14.90, qty: 1, image: FALLBACK_BURGERS[0].image }
  ]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState('express'); // 'express' | 'pickup'
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta / Contactless');
  const [orders, setOrders] = useState([
    {
      id: 'ORD-9042',
      items: [
        { name: 'Burger Real Doble', qty: 1, price: 12.90 },
        { name: 'Burger Real Clásica', qty: 1, price: 9.90 }
      ],
      total: 22.80,
      statusIndex: 1,
      deliveryMode: 'Entrega Express (12 min)',
      paymentMethod: 'Apple Pay / Contactless',
      createdAt: 'Hace 14 min'
    }
  ]);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Modo Dual: Estado de tema ('dark' por defecto para impacto visual, configurable con 1 clic)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hamburger_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hamburger_theme', theme);
  }, [theme]);

  // User profile state
  const [profile, setProfile] = useState({
    name: 'Valentina Morales',
    email: 'valentina.m@empresa.com',
    phone: '+34 612 890 412',
    address: 'Av. Paseo de la Castellana 84, Piso 4B',
    tier: 'VIP Oro • Club Rapid',
    points: 640
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(json => {
        if (json?.data?.length) {
          setBurgers(json.data);
        }
      })
      .catch(() => {});

    // Check URL param ?select=ID from Ecommerce Landing
    const params = new URLSearchParams(window.location.search);
    const selectId = params.get('select');
    if (selectId) {
      const target = FALLBACK_BURGERS.find(b => String(b.id) === String(selectId));
      if (target) {
        setCart(prev => {
          const exists = prev.find(i => i.id === target.id);
          if (exists) return prev;
          return [...prev, { id: target.id, name: target.name, price: Number(target.price), qty: 1, image: target.image }];
        });
        showToast(`🍔 ${target.name} lista en tu simulación de compra`);
      }
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const filteredBurgers = useMemo(() => {
    return burgers.filter(b => {
      const matchesCat = categoryFilter === 'Todas' || b.category === categoryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [burgers, categoryFilter, searchQuery]);

  const getCartQty = (id) => {
    const found = cart.find(item => item.id === id);
    return found ? found.qty : 0;
  };

  const updateCartItem = (burger, delta) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === burger.id);
      if (!existing && delta > 0) {
        showToast(`Agregada: ${burger.name}`);
        return [...prev, { id: burger.id, name: burger.name, price: Number(burger.price), qty: 1, image: burger.image }];
      }
      if (existing) {
        const nextQty = existing.qty + delta;
        if (nextQty <= 0) {
          return prev.filter(item => item.id !== burger.id);
        }
        return prev.map(item => (item.id === burger.id ? { ...item, qty: nextQty } : item));
      }
      return prev;
    });
  };

  const handleApplyOffer = (offer) => {
    if (offer.itemsToAdd?.length) {
      setCart(prev => {
        const next = [...prev];
        offer.itemsToAdd.forEach(id => {
          const b = burgers.find(x => x.id === id) || FALLBACK_BURGERS.find(x => x.id === id);
          if (b) {
            const idx = next.findIndex(item => item.id === b.id);
            if (idx >= 0) {
              next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
            } else {
              next.push({ id: b.id, name: b.name, price: Number(b.price), qty: 1, image: b.image });
            }
          }
        });
        return next;
      });
    }
    setAppliedPromo(offer);
    setActiveTab('ordenes');
    showToast(`🎁 Promo ${offer.code} aplicada (-${offer.discountPercent}%)`);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const deliveryFee = cart.length === 0 ? 0 : deliveryMode === 'express' ? 1.90 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSimulateOrder = async () => {
    if (cart.length === 0) return;

    const newOrderPayload = {
      customerName: profile.name,
      items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total: Number(finalTotal.toFixed(2))
    };

    let orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload)
      });
      const data = await res.json();
      if (data?.data?.id) {
        orderId = data.data.id;
      }
    } catch {
      // Offline / local fallback
    }

    const createdOrder = {
      id: orderId,
      items: [...cart],
      total: Number(finalTotal.toFixed(2)),
      statusIndex: 0,
      deliveryMode: deliveryMode === 'express' ? 'Entrega Express (12 min)' : 'Retiro en Local Rapid',
      paymentMethod,
      createdAt: 'Justo ahora'
    };

    setOrders(prev => [createdOrder, ...prev]);
    setProfile(prev => ({
      ...prev,
      points: prev.points + Math.round(finalTotal * 10)
    }));
    setCart([]);
    setAppliedPromo(null);
    showToast(`✅ ¡Orden ${orderId} confirmada! (+${Math.round(finalTotal * 10)} pts)`);
  };

  const advanceOrderStatus = (orderId) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, statusIndex: Math.min(ORDER_STEPS.length - 1, o.statusIndex + 1) }
          : o
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '82px' }}>
      {/* Top App Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'var(--surface)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: '#181818',
              border: '1px solid #2B2B2B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <div style={{ width: '22px', height: '7px', background: 'var(--primary)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}></div>
            <div style={{ width: '20px', height: '3px', background: '#FFFFFF', borderRadius: '2px' }}></div>
            <div style={{ width: '22px', height: '4px', background: 'var(--primary)', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}></div>
          </div>
          <div>
            <div className="display-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: 1 }}>
              BURGER FACTORY
            </div>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--primary)', fontWeight: 800 }}>
              • EST. 2016 • HAMBURGER RAPID
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title="Alternar Modo Claro / Oscuro"
            aria-label="Alternar Modo Claro / Oscuro"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface-warm)',
              color: 'var(--text-main)',
              padding: '5px 11px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          <span
            style={{
              fontSize: '0.7rem',
              padding: '4px 9px',
              borderRadius: '999px',
              fontWeight: 700,
              background: isOnline ? 'var(--success-soft)' : '#FEE2E2',
              color: isOnline ? 'var(--success)' : '#B91C1C',
              border: '1px solid rgba(21, 128, 61, 0.2)'
            }}
          >
            {isOnline ? '● Online' : '● Offline'}
          </span>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            background: 'var(--secondary)',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          {toast}
        </div>
      )}

      {/* Main Content Area by Active Tab */}
      <main style={{ flex: 1, padding: '16px 18px calc(86px + env(safe-area-inset-bottom, 0px))' }} className="fade-in" key={activeTab}>
        {/* ================= TAB 1: MENÚ ================= */}
        {activeTab === 'menu' && (
          <div>
            {/* Promo Banner Inside Menu */}
            <div
              onClick={() => setActiveTab('ofertas')}
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #1E293B 0%, #311E0C 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #FEF3C7 100%)',
                border: theme === 'dark' ? '1px solid #78350F' : '1px solid #FDE68A',
                borderRadius: '18px',
                padding: '14px 16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: theme === 'dark' ? '#FBBF24' : '#92400E', letterSpacing: '0.05em' }}>
                  👑 Especialidad de la Casa
                </span>
                <div className="display-title" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                  Prueba el Rey de las Burgers
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  Toca para ver combos con hasta 20% OFF →
                </div>
              </div>
              <div style={{ fontSize: '2.1rem' }}>🍔</div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Buscar Rey de las Burgers, Real Doble..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 36px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '0.86rem',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>
                🔍
              </span>
            </div>

            {/* Category Pills */}
            <div className="horizontal-scroll" style={{ gap: '8px', marginBottom: '16px' }}>
              {['Todas', 'Especiales', 'Clásicas'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: categoryFilter === cat ? '2px solid var(--secondary)' : '1px solid var(--border)',
                    background: categoryFilter === cat ? 'var(--secondary)' : 'var(--surface)',
                    color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: categoryFilter === cat ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat === 'Todas' ? `Todas (${burgers.length})` : cat}
                </button>
              ))}
            </div>

            {/* Burger List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredBurgers.map(burger => {
                const qty = getCartQty(burger.id);
                return (
                  <div
                    key={burger.id}
                    style={{
                      background: 'var(--surface)',
                      border: qty > 0 ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      boxShadow: qty > 0 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <img
                      src={burger.image}
                      alt={burger.name}
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '16px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        background: 'var(--bg-app)'
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: burger.category === 'Especiales' ? 'var(--amber-soft)' : 'var(--success-soft)',
                            color: burger.category === 'Especiales' ? '#92400E' : '#166534',
                            marginBottom: '4px'
                          }}
                        >
                          {burger.badge || `⭐ Nivel ${burger.category}`}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '6px' }}>
                          <h3 className="display-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: 1 }}>
                            {burger.name}
                          </h3>
                          <span className="display-title" style={{ fontSize: '1.35rem', color: 'var(--primary)', letterSpacing: '0.02em' }}>
                            ${Number(burger.price).toFixed(2)}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                          {burger.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          ⏱️ {burger.prepTime || '7-9 min'} • 🔥 {burger.calories || '720 kcal'}
                        </span>

                        {qty === 0 ? (
                          <button
                            onClick={() => updateCartItem(burger, 1)}
                            style={{
                              background: 'var(--primary)',
                              color: '#0D0D0D',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 16px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              cursor: 'pointer',
                              boxShadow: 'var(--shadow-gold)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            + Agregar
                          </button>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: 'var(--brand-soft)',
                              border: '1px solid var(--border)',
                              borderRadius: '12px',
                              padding: '4px 10px'
                            }}
                          >
                            <button
                              onClick={() => updateCartItem(burger, -1)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--primary)',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer'
                              }}
                            >
                              −
                            </button>
                            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)' }}>{qty}</span>
                            <button
                              onClick={() => updateCartItem(burger, 1)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--primary)',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer'
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Checkout Bar when Cart has items */}
            {cartCount > 0 && (
              <div
                onClick={() => setActiveTab('ordenes')}
                style={{
                  position: 'sticky',
                  bottom: '12px',
                  marginTop: '20px',
                  background: 'var(--primary)',
                  color: '#0D0D0D',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-gold)',
                  border: '1px solid var(--primary-dark)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      background: '#0D0D0D',
                      color: 'var(--primary)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 800
                    }}
                  >
                    {cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ir a Simular Compra</span>
                </div>
                <span className="display-title" style={{ fontSize: '1.3rem', color: '#0D0D0D' }}>
                  ${finalTotal.toFixed(2)} ➔
                </span>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: OFERTAS ================= */}
        {activeTab === 'ofertas' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase' }}>
                🎁 Beneficios Exclusivos App
              </span>
              <h2 className="display-title" style={{ fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                Ofertas & Combos Reales
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Aplica un combo o cupón con un toque para simular tu pedido con precio preferencial.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SPECIAL_OFFERS.map(offer => {
                const isActive = appliedPromo?.id === offer.id;
                return (
                  <div
                    key={offer.id}
                    style={{
                      background: 'var(--surface)',
                      border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: 'var(--amber-soft)',
                          color: '#F5A623',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '999px'
                        }}
                      >
                        {offer.badge}
                      </span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          background: 'var(--bg-app)',
                          border: '1px dashed var(--border)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: 'var(--primary)'
                        }}
                      >
                        CÓDIGO: {offer.code}
                      </span>
                    </div>

                    <h3 className="display-title" style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {offer.subtitle}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {offer.offerPrice ? (
                        <div>
                          <span style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '8px' }}>
                            ${offer.originalPrice.toFixed(2)}
                          </span>
                          <span className="display-title" style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
                            ${offer.offerPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>
                          ✓ Descuento directo en checkout
                        </span>
                      )}

                      <button
                        onClick={() => handleApplyOffer(offer)}
                        style={{
                          background: isActive ? 'var(--success)' : 'var(--primary)',
                          color: isActive ? '#FFFFFF' : '#0D0D0D',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          boxShadow: isActive ? 'none' : 'var(--shadow-gold)'
                        }}
                      >
                        {isActive ? '✓ Aplicada' : 'Aplicar Oferta'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDENES (Simulador de Compra + Seguimiento) ================= */}
        {activeTab === 'ordenes' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                🛒 Checkout & Rastreo en Vivo
              </span>
              <h2 className="display-title" style={{ fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                Simulador de Compra y Órdenes
              </h2>
            </div>

            {/* Active Cart Checkout Card */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '16px',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="display-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  Tu Bandeja Actual ({cartCount})
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Vaciar bandeja
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '18px 8px' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>🍔</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Tu bandeja está vacía. Agrega tus hamburguesas favoritas desde la pestaña Menú.
                  </p>
                  <button
                    onClick={() => setActiveTab('menu')}
                    style={{
                      background: 'var(--primary)',
                      color: '#0D0D0D',
                      border: 'none',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-gold)'
                    }}
                  >
                    Explorar Menú de 10 Variantes
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    {cart.map(item => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '10px',
                          borderBottom: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            ${item.price.toFixed(2)} c/u
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'var(--bg-app)',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              padding: '2px 8px'
                            }}
                          >
                            <button
                              onClick={() => updateCartItem(item, -1)}
                              style={{ border: 'none', background: 'transparent', fontWeight: 800, cursor: 'pointer', color: 'var(--text-main)' }}
                            >
                              −
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{item.qty}</span>
                            <button
                              onClick={() => updateCartItem(item, 1)}
                              style={{ border: 'none', background: 'transparent', fontWeight: 800, cursor: 'pointer', color: 'var(--text-main)' }}
                            >
                              +
                            </button>
                          </div>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, minWidth: '52px', textAlign: 'right', color: 'var(--primary)' }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Mode Toggle */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('express')}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: deliveryMode === 'express' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: deliveryMode === 'express' ? 'var(--brand-soft)' : 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      🛵 Envío Express ($1.90)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('pickup')}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: deliveryMode === 'pickup' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: deliveryMode === 'pickup' ? 'var(--brand-soft)' : 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      🏪 Retiro en Local ($0.00)
                    </button>
                  </div>

                  {/* Payment Method Selector */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      MÉTODO DE PAGO SIMULADO
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-app)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-main)'
                      }}
                    >
                      <option>Tarjeta / Contactless</option>
                      <option>Apple Pay / Google Pay</option>
                      <option>Puntos Club Rapid + Efectivo</option>
                    </select>
                  </div>

                  {/* Totals Breakdown */}
                  <div
                    style={{
                      background: 'var(--bg-app)',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '0.8rem',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Subtotal Hamburguesas</span>
                      <span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--success)' }}>
                        <span>Promo ({appliedPromo.code})</span>
                        <span style={{ fontWeight: 700 }}>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Servicio de Entrega</span>
                      <span style={{ fontWeight: 700 }}>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '6px',
                        alignItems: 'baseline'
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>Total a Pagar</span>
                      <span className="display-title" style={{ color: 'var(--primary)', fontSize: '1.35rem' }}>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateOrder}
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
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-gold)'
                    }}
                  >
                    ✅ Confirmar y Simular Compra (${finalTotal.toFixed(2)})
                  </button>
                </>
              )}
            </div>

            {/* Active & Past Orders List */}
            <h3 className="display-title" style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px', letterSpacing: '0.04em' }}>
              Historial y Rastreo de Órdenes ({orders.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map(order => {
                const currentStep = ORDER_STEPS[order.statusIndex] || ORDER_STEPS[0];
                const isCompleted = order.statusIndex === ORDER_STEPS.length - 1;
                return (
                  <div
                    key={order.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '18px',
                      padding: '14px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        Orden #{order.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          background: isCompleted ? 'var(--success-soft)' : 'var(--amber-soft)',
                          color: isCompleted ? 'var(--success)' : '#F5A623'
                        }}
                      >
                        {currentStep}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {order.createdAt} • {order.deliveryMode}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      {order.items.map((it, i) => (
                        <div key={i}>
                          • {it.qty}x {it.name} (${(it.price * it.qty).toFixed(2)})
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        height: '6px',
                        background: 'var(--bg-app)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        marginBottom: '10px'
                      }}
                    >
                      <div
                        style={{
                          width: `${((order.statusIndex + 1) / ORDER_STEPS.length) * 100}%`,
                          height: '100%',
                          background: isCompleted ? 'var(--success)' : 'var(--primary)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="display-title" style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>
                        Total: ${Number(order.total).toFixed(2)}
                      </span>
                      {!isCompleted && (
                        <button
                          onClick={() => advanceOrderStatus(order.id)}
                          style={{
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '5px 10px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: 'var(--text-main)'
                          }}
                        >
                          Avanzar Estado ➔
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PERFIL ================= */}
        {activeTab === 'perfil' && (
          <div>
            {/* Loyalty Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1C1917 0%, #0D0D0D 100%)',
                color: '#FAF7F2',
                border: '1px solid var(--border)',
                borderRadius: '22px',
                padding: '20px',
                marginBottom: '18px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    background: 'rgba(245, 166, 35, 0.2)',
                    color: '#F5A623',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  👑 {profile.tier}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#D6D3D1' }}>ID #HR-8821</span>
              </div>

              <div className="display-title" style={{ fontSize: '1.5rem', marginBottom: '2px', letterSpacing: '0.04em' }}>
                {profile.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#A8A29E', marginBottom: '16px' }}>
                {profile.email}
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#D6D3D1', textTransform: 'uppercase' }}>RapidPoints Acumulados</div>
                  <div className="display-title" style={{ fontSize: '1.6rem', color: '#F5A623' }}>
                    {profile.points} pts
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ofertas')}
                  style={{
                    background: '#F5A623',
                    color: '#0D0D0D',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                  Canjear
                </button>
              </div>
            </div>

            {/* Editable Customer Data */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 className="display-title" style={{ fontSize: '1.25rem', marginBottom: '12px', letterSpacing: '0.04em' }}>
                Datos de Entrega & Consumidor
              </h3>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  NOMBRE DEL CLIENTE (Se refleja en Admin Dashboard)
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-app)',
                    fontSize: '0.84rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  DIRECCIÓN PREDETERMINADA
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-app)',
                    fontSize: '0.84rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            {/* Ecosystem Navigation Links */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {deferredPrompt && (
                <button
                  onClick={async () => {
                    deferredPrompt.prompt();
                    await deferredPrompt.userChoice;
                    setDeferredPrompt(null);
                  }}
                  style={{
                    background: 'var(--primary)',
                    color: '#0D0D0D',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  📲 Instalar App Burger Factory
                </button>
              )}
              <a
                href="/"
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>🌐 Volver a Landing E-commerce</span>
                <span style={{ color: 'var(--primary)' }}>➔</span>
              </a>
              <a
                href="/admin"
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>📊 Abrir Panel Admin de Métricas</span>
                <span style={{ color: 'var(--primary)' }}>➔</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Tab Navigation (Menú, Ofertas, Ordenes, Perfil) */}
      <nav
        aria-label="Navegación inferior"
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          maxWidth: '480px',
          background: 'var(--surface)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '8px 6px calc(10px + env(safe-area-inset-bottom, 0px))',
          zIndex: 50,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)'
        }}
      >
        {[
          { id: 'menu', label: 'Menú', icon: '🍔' },
          { id: 'ofertas', label: 'Ofertas', icon: '🏷️', badge: '3' },
          { id: 'ordenes', label: 'Ordenes', icon: '🛍️', badge: cartCount > 0 ? String(cartCount) : String(orders.length) },
          { id: 'perfil', label: 'Perfil', icon: '👤' }
        ].map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                position: 'relative',
                color: active ? 'var(--brand)' : 'var(--text-muted)',
                fontWeight: active ? 800 : 600,
                fontSize: '0.73rem'
              }}
            >
              <span
                style={{
                  fontSize: '1.25rem',
                  padding: '2px 14px',
                  borderRadius: '999px',
                  background: active ? 'var(--brand-soft)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '24%',
                    background: 'var(--brand)',
                    color: '#FFFFFF',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '999px',
                    minWidth: '16px'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
