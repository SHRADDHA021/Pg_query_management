import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, AlertCircle,
  Utensils, LogOut, Home, User, Menu, X,
  ChevronRight, Bell
} from 'lucide-react';
import { useState } from 'react';

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/complaints', icon: AlertCircle, label: 'Complaints' },
  { to: '/student/mess', icon: Utensils, label: 'Mess Menu' },
  { to: '/student/notices-schedules', icon: Bell, label: 'Notices & Schedules' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/rooms', icon: Building2, label: 'Rooms' },
  { to: '/admin/complaints', icon: AlertCircle, label: 'Complaints' },
  { to: '/admin/mess', icon: Utensils, label: 'Mess Menu' },
  { to: '/admin/notices-schedules', icon: Bell, label: 'Notices & Schedules' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const links = isAdmin() ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{ width: collapsed ? 64 : 256 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300"
    >
      {/* Background */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,10,0.97)', borderRight: '1px solid rgba(161,120,5,0.15)' }}
      />

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid rgba(161,120,5,0.12)' }}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div>
                <p className="font-bold text-sm" style={{ color: '#fff' }}>PG Manager</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  {isAdmin() ? 'Admin Panel' : 'Student Portal'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(161,120,5,0.12)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <span className="font-semibold text-sm" style={{ color: '#000' }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate" style={{ color: '#fff' }}>{user?.name}</p>
                <p className="text-xs truncate font-mono" style={{ color: '#6b7280' }}>@{user?.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? label : ''}
            >
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(161,120,5,0.12)' }}>
          <button
            onClick={handleLogout}
            className={`sidebar-link w-full ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? 'Logout' : ''}
            style={{ color: '#f87171' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171'; }}
          >
             {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
