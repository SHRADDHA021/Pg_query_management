export function StatusBadge({ status, type = 'complaint' }) {
  const getConfig = () => {
    if (type === 'complaint') {
      switch (status) {
        case 'SUBMITTED':   return 'badge-info';
        case 'IN_REVIEW':   return 'badge-warning';
        case 'IN_PROGRESS': return 'badge-warning';
        case 'RESOLVED':    return 'badge-success';
        case 'CLOSED':      return 'badge-danger';
        default:            return 'badge-gray';
      }
    }
    if (type === 'fee') {
      switch (status) {
        case 'PAID':    return 'badge-success';
        case 'UNPAID':  return 'badge-warning';
        case 'OVERDUE': return 'badge-danger';
        default:        return 'badge-gray';
      }
    }
    if (type === 'user') {
      switch (status) {
        case 'VERIFIED': return 'badge-success';
        case 'PENDING':  return 'badge-warning';
        case 'REJECTED': return 'badge-danger';
        default:         return 'badge-gray';
      }
    }
    if (type === 'room') {
      switch (status) {
        case 'VACANT':  return 'badge-success';
        case 'PARTIAL': return 'badge-warning';
        case 'FULL':    return 'badge-danger';
        default:        return 'badge-gray';
      }
    }
    return 'badge-gray';
  };

  return (
    <span className={getConfig()}>
      {status?.replace('_', ' ')}
    </span>
  );
}

export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const px = size === 'sm' ? 16 : size === 'lg' ? 40 : 24;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem' }}>
      <div style={{
        width: px, height: px,
        border: '2px solid rgba(255,255,255,0.08)',
        borderTopColor: '#f59e0b',
        borderRadius: '9999px',
        animation: 'spin 0.7s linear infinite'
      }} />
      {text && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{text}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', textAlign: 'center' }}>
      {Icon && <Icon style={{ width: '3rem', height: '3rem', color: '#374151', marginBottom: '1rem' }} />}
      <h3 style={{ color: '#d1d5db', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{title}</h3>
      {description && <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '24rem' }}>{description}</p>}
    </div>
  );
}

const COLOR_MAP = {
  primary: { bg: 'rgba(245,158,11,0.10)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  success: { bg: 'rgba(5,150,105,0.10)',  text: '#34d399', border: 'rgba(5,150,105,0.25)' },
  warning: { bg: 'rgba(245,158,11,0.10)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  danger:  { bg: 'rgba(220,38,38,0.10)',  text: '#f87171', border: 'rgba(220,38,38,0.25)' },
  info:    { bg: 'rgba(245,158,11,0.08)', text: '#fcd34d', border: 'rgba(245,158,11,0.20)' },
  purple:  { bg: 'rgba(245,158,11,0.08)', text: '#fcd34d', border: 'rgba(245,158,11,0.20)' },
};

export function StatsCard({ icon: Icon, label, value, color = 'primary', subtitle }) {
  const c = COLOR_MAP[color] || COLOR_MAP.primary;
  return (
    <div className="stat-card" style={{ borderColor: c.border }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>{label}</p>
          <p style={{ fontSize: '1.875rem', fontWeight: 700, color: c.text }}>{value}</p>
          {subtitle && <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>{subtitle}</p>}
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: c.bg }}>
          <Icon style={{ width: '1.5rem', height: '1.5rem', color: c.text }} />
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const maxW = { sm: 448, md: 512, lg: 672, xl: 896 }[size] || 512;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="glass-card animate-slide-up" style={{ position: 'relative', width: '100%', maxWidth: maxW, padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
