import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Plus, Users, Shield, Trophy,
  Phone, ChevronLeft, ChevronRight, LogOut, Menu, X, Globe, BarChart3,
} from 'lucide-react';
import { clearAuth, getFullName, getRole, ROLE_LABELS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import ThemeLangToggle from '../ui/ThemeLangToggle';
import Logo from '../ui/Logo';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();
  const name = getFullName();
  const { t, isUrdu } = useApp();

  const citizenNav = [
    { to: '/dashboard/citizen', icon: LayoutDashboard, label: t('overview') },
    { to: '/dashboard/citizen/complaints', icon: FileText, label: t('myComplaints') },
    { to: '/dashboard/citizen/new', icon: Plus, label: t('newComplaint') },
  ];
  const officerNav = [
    { to: '/dashboard/officer', icon: LayoutDashboard, label: t('overview') },
    { to: '/dashboard/officer/complaints', icon: FileText, label: t('areaComplaints') },
  ];
  const adminNav = [
    { to: '/dashboard/admin', icon: LayoutDashboard, label: t('overview') },
    { to: '/dashboard/admin/users', icon: Users, label: t('manageUsers') },
    { to: '/dashboard/admin/officers', icon: Shield, label: t('manageOfficers') },
    { to: '/dashboard/admin/complaints', icon: FileText, label: t('allComplaints') },
  ];
  const exploreNav = [
    { to: '/leaderboard', icon: Trophy, label: t('leaderboard') },
    { to: '/emergency', icon: Phone, label: t('emergency') },
    { to: '/complaints/public', icon: Globe, label: t('complaints') },
    { to: '/stats', icon: BarChart3, label: t('stats') },
  ];

  const mainNav = role === 'CITIZEN' ? citizenNav : role === 'ADMIN' ? adminNav : officerNav;
  const handleLogout = () => { clearAuth(); navigate('/'); };

  const isActive = (to) => location.pathname === to;

  const SidebarContent = ({ onClose }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <Logo to="/" size={collapsed ? 'sm' : 'md'} showUrdu={!collapsed} />
        {onClose && (
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--txt-3)', cursor: 'pointer', padding: 4 }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* User */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, #16a34a, #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#fff',
        }}>
          {name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#16a34a', marginTop: 1 }}>{ROLE_LABELS[role] || role}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt-3)', padding: '4px 8px 8px' }}>
            Main
          </div>
        )}
        {mainNav.map(({ to, icon: Icon, label }) => (
          <NavItem key={to} to={to} icon={Icon} label={label} collapsed={collapsed} active={isActive(to)} />
        ))}

        <div style={{ margin: '12px 0 4px', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          {!collapsed && (
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt-3)', padding: '0 8px 8px' }}>
              Explore
            </div>
          )}
          {exploreNav.map(({ to, icon: Icon, label }) => (
            <NavItem key={to} to={to} icon={Icon} label={label} collapsed={collapsed} active={isActive(to)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 8px' }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt-3)', fontWeight: 700 }}>Prefs</span>
            <ThemeLangToggle compact />
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '9px 10px', borderRadius: 9,
            background: 'none', border: 'none',
            fontSize: 13, fontWeight: 500, color: '#dc2626',
            cursor: 'pointer', transition: 'background 0.12s',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && t('logout')}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex',
            width: '100%', padding: '6px', borderRadius: 8,
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--txt-3)', cursor: 'pointer', justifyContent: 'center', alignItems: 'center',
            marginTop: 4, gap: 0,
          }}
          className="collapse-btn hide-mobile"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: collapsed ? 64 : 220,
          flexShrink: 0,
          background: 'var(--bg-2)',
          borderRight: '1px solid var(--border)',
          transition: 'width 0.25s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="hide-mobile"
      >
        <SidebarContent />
        {/* Collapse toggle at very bottom */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            padding: '8px 0',
            background: 'none',
            border: 'none',
            borderTop: '1px solid var(--border)',
            color: 'var(--txt-3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />
          <aside
            className="anim-left"
            style={{
              position: 'relative', width: 240, flexShrink: 0,
              background: 'var(--bg-2)',
              borderRight: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 56,
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 12,
          flexShrink: 0,
        }}>
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(true)}
            style={{
              display: 'none',
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--txt-2)', flexShrink: 0,
            }}
          >
            <Menu size={16} />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>
              {getPageTitle(location.pathname, t)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 1 }}>
              {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="show-mobile">
              <ThemeLangToggle compact />
            </div>
            <Link
              to="/"
              style={{ fontSize: 12, color: 'var(--txt-3)', textDecoration: 'none', padding: '5px 10px', borderRadius: 7, background: 'var(--bg-3)', border: '1px solid var(--border)' }}
              className="hide-mobile"
            >
              ← Site
            </Link>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, collapsed, active }) {
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 9,
        padding: '8px 10px',
        borderRadius: 9,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        color: active ? '#16a34a' : 'var(--txt-2)',
        background: active ? 'rgba(22,163,74,0.08)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.13s',
        marginBottom: 2,
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--txt)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-2)'; } }}
    >
      <Icon size={16} style={{ flexShrink: 0, color: active ? '#16a34a' : 'inherit' }} />
      {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
      {active && !collapsed && (
        <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
      )}
    </Link>
  );
}

function getPageTitle(path, t) {
  const map = {
    '/dashboard/citizen': t('overview'),
    '/dashboard/citizen/complaints': t('myComplaints'),
    '/dashboard/citizen/new': t('fileNewComplaint'),
    '/dashboard/officer': t('overview'),
    '/dashboard/officer/complaints': t('areaComplaints'),
    '/dashboard/admin': t('overview'),
    '/dashboard/admin/users': t('manageUsers'),
    '/dashboard/admin/officers': t('manageOfficers'),
    '/dashboard/admin/complaints': t('allComplaints'),
    '/leaderboard': t('leaderboard'),
    '/emergency': t('emergency'),
    '/complaints/public': t('complaints'),
    '/stats': t('stats'),
  };
  return map[path] || t('dashboard');
}
