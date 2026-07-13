export function StatusBadge({ status, type = 'complaint' }) {
  const getConfig = () => {
    if (type === 'complaint') {
      switch (status) {
        case 'SUBMITTED': return 'badge-info';
        case 'IN_REVIEW': return 'badge-purple';
        case 'IN_PROGRESS': return 'badge-warning';
        case 'RESOLVED': return 'badge-success';
        case 'CLOSED': return 'badge-danger';
        default: return 'badge-gray';
      }
    }
    if (type === 'fee') {
      switch (status) {
        case 'PAID': return 'badge-success';
        case 'UNPAID': return 'badge-warning';
        case 'OVERDUE': return 'badge-danger';
        default: return 'badge-gray';
      }
    }
    if (type === 'user') {
      switch (status) {
        case 'VERIFIED': return 'badge-success';
        case 'PENDING': return 'badge-warning';
        case 'REJECTED': return 'badge-danger';
        default: return 'badge-gray';
      }
    }
    if (type === 'room') {
      switch (status) {
        case 'VACANT': return 'badge-success';
        case 'PARTIAL': return 'badge-warning';
        case 'FULL': return 'badge-danger';
        default: return 'badge-gray';
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
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizeClass} border-2 border-white/20 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="w-12 h-12 text-gray-600 mb-4" />}
      <h3 className="text-gray-300 font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm">{description}</p>}
    </div>
  );
}

export function StatsCard({ icon: Icon, label, value, color = 'primary', subtitle }) {
  const colorMap = {
    primary: { bg: 'bg-primary-500/10', text: 'text-primary-400', border: 'border-primary-500/20' },
    success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    danger: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  };
  const c = colorMap[color] || colorMap.primary;
  return (
    <div className={`stat-card border ${c.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative glass-card w-full ${sizeMap[size]} p-6 animate-slide-up`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
