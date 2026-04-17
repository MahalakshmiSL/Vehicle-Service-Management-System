import { useState, useEffect } from 'react';

// ─── Page Layout ───────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, letterSpacing: 1, color: 'var(--dark)', lineHeight: 1 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--gray)', marginTop: 4, fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Card ──────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      ...style
    }}>
      {children}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────
export function StatCard({ label, value, accent = false }) {
  return (
    <div style={{
      background: accent ? 'var(--red)' : 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${accent ? 'transparent' : 'var(--border)'}`,
      boxShadow: 'var(--shadow)',
      padding: '20px 24px',
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: accent ? 'rgba(255,255,255,0.7)' : 'var(--gray)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: accent ? 'white' : 'var(--dark)', letterSpacing: 1 }}>{value}</p>
    </div>
  );
}

// ─── Button ────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    border: 'none', borderRadius: 'var(--radius)', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-body)', fontWeight: 600, transition: 'all 0.18s',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };
  const sizes = { sm: { padding: '6px 14px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '13px 28px', fontSize: 15 } };
  const variants = {
    primary: { background: 'var(--red)', color: 'white' },
    secondary: { background: 'var(--gray-light)', color: 'var(--dark)' },
    danger: { background: '#fee2e2', color: '#991b1b' },
    outline: { background: 'transparent', color: 'var(--dark)', border: '1.5px solid var(--border)' },
    dark: { background: 'var(--dark)', color: 'white' },
    success: { background: '#dcfce7', color: '#166534' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
}

// ─── Input ─────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', letterSpacing: 0.3 }}>{label}</label>}
      <input
        style={{
          border: `1.5px solid ${error ? '#f87171' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          fontSize: 14,
          color: 'var(--dark)',
          background: 'white',
          outline: 'none',
          transition: 'border-color 0.2s',
          width: '100%',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--red)'}
        onBlur={e => e.target.style.borderColor = error ? '#f87171' : 'var(--border)'}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
    </div>
  );
}

// ─── Select ────────────────────────────────────────
export function Select({ label, children, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', letterSpacing: 0.3 }}>{label}</label>}
      <select
        style={{
          border: `1.5px solid ${error ? '#f87171' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          fontSize: 14,
          color: 'var(--dark)',
          background: 'white',
          outline: 'none',
          cursor: 'pointer',
          width: '100%',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--red)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
    </div>
  );
}

// ─── Table ─────────────────────────────────────────
export function Table({ columns, data, emptyMsg = 'No data yet' }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--gray)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <p style={{ fontSize: 15 }}>{emptyMsg}</p>
      </div>
    );
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            {columns.map(col => (
              <th key={col.key} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 700, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '13px 16px', fontSize: 14, color: 'var(--dark)' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 520 }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: width,
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        animation: 'fadeUp 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--gray)', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Loader ────────────────────────────────────────
export function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────
export function Badge({ status }) {
  return <span className={`badge badge-${status}`}>{status?.replace('_', ' ')}</span>;
}

// ─── Toast system ──────────────────────────────────
let _setToasts = null;
export function ToastProvider() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' ? '✓' : '✕'} {t.msg}
        </div>
      ))}
    </div>
  );
}
export function toast(msg, type = 'success') {
  if (!_setToasts) return;
  const id = Date.now();
  _setToasts(prev => [...prev, { id, msg, type }]);
  setTimeout(() => _setToasts(prev => prev.filter(t => t.id !== id)), 3000);
}

// ─── Form Grid ─────────────────────────────────────
export function FormGrid({ children, cols = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
      {children}
    </div>
  );
}