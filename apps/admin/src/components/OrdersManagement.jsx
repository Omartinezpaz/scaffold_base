import React, { useState } from 'react';

export default function OrdersManagement({ orders = [], onSyncOrder, session }) {
  const [channelFilter, setChannelFilter] = useState('Todos');
  const [syncingId, setSyncingId] = useState(null);
  const [selectedOrderPayload, setSelectedOrderPayload] = useState(null);

  const filteredOrders = orders.filter(order => {
    if (channelFilter === 'Todos') return true;
    if (channelFilter === 'Pendientes') return !order.idempiereSync?.synced;
    return order.origin === channelFilter;
  });

  const pwaCount = orders.filter(o => o.origin === 'PWA Preventa').length;
  const ecomCount = orders.filter(o => o.origin === 'E-commerce').length;
  const syncedCount = orders.filter(o => o.idempiereSync?.synced).length;
  const pendingCount = orders.length - syncedCount;
  const totalVolume = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const handleSync = async (order) => {
    setSyncingId(order.id);
    try {
      if (onSyncOrder) {
        await onSyncOrder(order.id);
      }
    } finally {
      setSyncingId(null);
    }
  };

  // Generate iDempiere REST API v1 c_order payload for inspection
  const generateIdempierePayload = (order) => {
    return {
      endpoint: `${session?.baseUrl || 'https://test.idempiere.org:443'}/api/v1/models/c_order`,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + (session?.token ? `${session.token.substring(0, 15)}...` : 'IDEMPIERE_TOKEN'),
        'Content-Type': 'application/json'
      },
      body: {
        AD_Client_ID: { id: session?.clientId || 11 },
        AD_Org_ID: { id: session?.orgId || 11 },
        M_Warehouse_ID: { id: session?.warehouseId || 103 },
        C_DocTypeTarget_ID: { id: 1000030 }, // Standard Sales Order
        Description: `Pedido Multicanal ${order.id} desde ${order.origin} - Cliente: ${order.customerName}`,
        C_BPartner_ID: { id: 1000005 },
        DateOrdered: order.createdAt,
        Lines: order.items.map((it, idx) => ({
          Line: (idx + 1) * 10,
          Description: it.name,
          QtyOrdered: it.qty,
          PriceEntered: it.price,
          PriceActual: it.price
        }))
      }
    };
  };

  return (
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
      {/* Title & Filter Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              📦 Bandeja Central de Operaciones • Articulación 3 Capas
            </span>
          </div>
          <h2 className="serif-heading" style={{ fontSize: '1.8rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            Gestión de Pedidos Multicanal ({filteredOrders.length})
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Supervisa y aprueba pedidos generados en la <strong>PWA Preventa</strong> (fuerza de ventas en terreno) y en el <strong>E-commerce</strong>, coordinando su sincronización hacia iDempiere ERP.
          </p>
        </div>

        {/* Origin Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'Todos', label: `Todos (${orders.length})` },
            { id: 'PWA Preventa', label: `📱 PWA Preventa (${pwaCount})` },
            { id: 'E-commerce', label: `🌐 E-commerce (${ecomCount})` },
            { id: 'Pendientes', label: `⚠️ Pendientes ERP (${pendingCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setChannelFilter(f.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: channelFilter === f.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: channelFilter === f.id ? 'var(--primary)' : 'var(--surface-warm)',
                color: channelFilter === f.id ? '#0D0D0D' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORIGEN PWA PREVENTA</div>
          <div className="serif-heading" style={{ fontSize: '1.45rem', color: 'var(--primary)' }}>
            {pwaCount} Pedidos
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Capturados por vendedores móviles</div>
        </div>

        <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORIGEN E-COMMERCE</div>
          <div className="serif-heading" style={{ fontSize: '1.45rem', color: '#60A5FA' }}>
            {ecomCount} Pedidos
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Compras directas consumidores</div>
        </div>

        <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>SINCRONIZADOS IDEMPIERE</div>
          <div className="serif-heading" style={{ fontSize: '1.45rem', color: '#10B981' }}>
            {syncedCount} / {orders.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Con DocNo y partida de diario</div>
        </div>

        <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>VOLUMEN FACTURADO</div>
          <div className="serif-heading" style={{ fontSize: '1.45rem', color: 'var(--text-main)' }}>
            ${totalVolume.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Total pedidos registrados</div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 10px' }}>Pedido & Fecha</th>
              <th style={{ padding: '12px 10px' }}>Canal de Origen</th>
              <th style={{ padding: '12px 10px' }}>Cliente / Emisor</th>
              <th style={{ padding: '12px 10px' }}>Detalle de Ítems</th>
              <th style={{ padding: '12px 10px' }}>Total ($)</th>
              <th style={{ padding: '12px 10px' }}>Estado</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Sincronización iDempiere</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No hay pedidos registrados con el filtro actual.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => {
                const isSynced = order.idempiereSync?.synced;
                const isPWA = order.origin === 'PWA Preventa';
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {/* Order ID & Time */}
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {order.id}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Origin Badge */}
                    <td style={{ padding: '14px 10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 9px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          background: isPWA ? 'rgba(245, 166, 35, 0.15)' : 'rgba(96, 165, 250, 0.15)',
                          color: isPWA ? 'var(--primary)' : '#60A5FA',
                          border: isPWA ? '1px solid rgba(245, 166, 35, 0.3)' : '1px solid rgba(96, 165, 250, 0.3)'
                        }}
                      >
                        {isPWA ? '📱 PWA Preventa' : '🌐 E-commerce'}
                      </span>
                    </td>

                    {/* Customer & Seller */}
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                        {order.seller || (isPWA ? 'Preventista Móvil' : 'Web Directo')}
                      </div>
                    </td>

                    {/* Items */}
                    <td style={{ padding: '14px 10px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {order.items.map((it, idx) => (
                        <div key={idx}>
                          • {it.qty}x {it.name} (${Number(it.price).toFixed(2)})
                        </div>
                      ))}
                    </td>

                    {/* Total */}
                    <td style={{ padding: '14px 10px' }}>
                      <span className="serif-heading" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 10px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--surface-warm)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-main)'
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* iDempiere Sync Action */}
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                      {isSynced ? (
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              color: '#10B981',
                              padding: '4px 9px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}
                          >
                            ✓ ERP Doc: {order.idempiereSync.docNo}
                          </span>
                          <button
                            onClick={() => setSelectedOrderPayload(generateIdempierePayload(order))}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--primary)',
                              fontSize: '0.68rem',
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}
                          >
                            Ver Payload c_order
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <button
                            onClick={() => handleSync(order)}
                            disabled={syncingId === order.id}
                            style={{
                              background: 'linear-gradient(135deg, #F5A623 0%, #D98207 100%)',
                              color: '#0D0D0D',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              cursor: syncingId === order.id ? 'not-allowed' : 'pointer',
                              boxShadow: 'var(--shadow-gold)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            {syncingId === order.id ? '⏳ Sincronizando...' : '⚡ Sincronizar ERP'}
                          </button>
                          <button
                            onClick={() => setSelectedOrderPayload(generateIdempierePayload(order))}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              fontSize: '0.68rem',
                              cursor: 'pointer'
                            }}
                          >
                            Previsualizar JSON
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* JSON Payload Inspection Modal */}
      {selectedOrderPayload && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                  iDempiere REST API v1 • Contrato de Integración
                </span>
                <h3 className="serif-heading" style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  Estructura de Pedido (c_order)
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderPayload(null)}
                style={{
                  background: 'var(--surface-warm)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕ Cerrar
              </button>
            </div>

            <div style={{ marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Endpoint destino: <code style={{ color: 'var(--primary)', background: 'var(--surface-warm)', padding: '2px 6px', borderRadius: '4px' }}>{selectedOrderPayload.endpoint}</code>
            </div>

            <pre
              style={{
                background: '#050505',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '0.78rem',
                color: '#E5E7EB',
                overflowX: 'auto',
                fontFamily: 'monospace'
              }}
            >
              {JSON.stringify(selectedOrderPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
