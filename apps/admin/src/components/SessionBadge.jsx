import React from 'react';
import authService from '../services/authService';

export default function SessionBadge({ session, onLogout }) {
  if (!session) return null;

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  return (
    <div
      style={{
        background: 'var(--surface-warm)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 10px #10B981'
            }}
          />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            iDempiere REST v1 Activo
          </span>
        </div>

        {/* User Pill */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Usuario:</span>
          <strong style={{ color: 'var(--primary)' }}>{session.userName}</strong>
        </div>

        {/* Client / Tenant */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Tenant:</span>
          <strong style={{ color: 'var(--text-main)' }}>{session.clientName || session.clientId}</strong>
        </div>

        {/* Role */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Rol:</span>
          <strong style={{ color: 'var(--text-main)' }}>{session.roleName || session.roleId}</strong>
        </div>

        {/* Org & Warehouse */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Org/Almacén:</span>
          <strong style={{ color: 'var(--text-main)' }}>
            {session.orgName || session.orgId} • {session.warehouseName || session.warehouseId}
          </strong>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        title="Cerrar Sesión de iDempiere y purgar estado local"
        style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#F87171',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '0.76rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <span>🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
}
