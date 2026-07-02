import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, ChevronDown, Shield } from 'lucide-react';
import { isLoggedIn, getFullName, getRole, clearAuth, ROLE_LABELS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import ThemeLangToggle from '../ui/ThemeLangToggle';
import Logo from '../ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const role = getRole();
  const name = getFullName();
  const { t, isUrdu } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location.pathname]);

  const handleLogout = () => { clearAuth(); navigate('/'); };

  const getDash = () => {
    if (role === 'CITIZEN') return '/dashboard/citizen';
    if (role === 'ADMIN') return '/dashboard/admin';
    return '/dashboard/officer';
  };

  const links = [
    { to: '/', label: t('home') },
    { to: '/complaints/public', label: t('complaints') },
    { to: '/map', label: isUrdu ? 'نقشہ' : 'Map' },
    { to: '/stats', label: 'Stats' },
    { to: '/leaderboard', label: t('leaderboard') },
    { to: '/emergency', label: t('emergency') },
  ];

  const active = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: scrolled ? 'var(--nav)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        transition: 'all 0.25s ease',
      }}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* ─── Inner container ─── */}
      <div style={{
        maxWidth: 1140, margin: '0 auto', padding: '0 20px',
        height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
      }}>

        {/* Logo — always links to home */}
        <Logo to="/" />

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '6px 12px', borderRadius: 7, fontSize: 13.5,
              fontWeight: active(to) ? 600 : 500,
              color: active(to) ? 'var(--green-bright)' : 'var(--txt-2)',
              background: active(to) ? 'var(--green-subtle)' : 'transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active(to)) { e.currentTarget.style.color = 'var(--txt)'; e.currentTarget.style.background = 'var(--bg-3)'; } }}
              onMouseLeave={e => { if (!active(to)) { e.currentTarget.style.color = 'var(--txt-2)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div className="hide-mobile"><ThemeLangToggle /></div>

          {loggedIn ? (
            <div style={{ position: 'relative' }} className="hide-mobile">
              <button onClick={() => setProfileOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 5px', borderRadius: 10,
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: 'var(--green)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff',
                }}>
                  {name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)', lineHeight: 1.2 }}>{name?.split(' ')[0]}</div>
                  <div style={{ fontSize: 10, color: 'var(--green-bright)', lineHeight: 1.2 }}>{ROLE_LABELS[role] || role}</div>
                </div>
                <ChevronDown size={13} style={{ color: 'var(--txt-3)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>

              {profileOpen && (
                <div className="anim-scale" style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: 188, background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 14, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 50,
                }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'var(--green-bright)', marginTop: 1 }}>{ROLE_LABELS[role] || role}</div>
                  </div>
                  <div style={{ padding: 6 }}>
                    <DropItem to={getDash()} icon={LayoutDashboard} label={t('dashboard')} />
                    {role === 'ADMIN' && <DropItem to="/dashboard/admin" icon={Shield} label={t('adminPanel')} />}
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none',
                      fontSize: 13, fontWeight: 500, color: '#dc2626', cursor: 'pointer', transition: 'background 0.12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={14} /> {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hide-mobile" style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">{t('signIn')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('getStarted')}</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="show-mobile" onClick={() => setMenuOpen(o => !o)} style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--bg-3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--txt-2)', flexShrink: 0,
          }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="anim-down" style={{
          background: 'var(--bg-2)', borderBottom: '1px solid var(--border)',
          padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '10px 12px', borderRadius: 9, fontSize: 14,
              fontWeight: active(to) ? 600 : 500,
              color: active(to) ? 'var(--green-bright)' : 'var(--txt-2)',
              background: active(to) ? 'var(--green-subtle)' : 'transparent',
              textDecoration: 'none', display: 'block',
            }}>{label}</Link>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 4 }}>
            <ThemeLangToggle />
            {loggedIn ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={getDash()} className="btn btn-primary btn-sm">{t('dashboard')}</Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">{t('logout')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-secondary btn-sm">{t('signIn')}</Link>
                <Link to="/register" className="btn btn-primary btn-sm">{t('getStarted')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function DropItem({ to, icon: Icon, label }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
      borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--txt-2)',
      textDecoration: 'none', transition: 'all 0.12s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--txt)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--txt-2)'; }}
    >
      <Icon size={14} /> {label}
    </Link>
  );
}
