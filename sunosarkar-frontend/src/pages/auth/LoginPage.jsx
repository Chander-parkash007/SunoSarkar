import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, loginOfficer } from '../../lib/api';
import { saveAuth } from '../../lib/auth';
import { extractError } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Navbar from '../../components/layout/Navbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { t, isUrdu } = useApp();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email.trim()) return toast.error('Email is required');
    if (!form.password.trim()) return toast.error('Password is required');
    setLoading(true);
    try {
      const fn = mode === 'citizen' ? loginUser : loginOfficer;
      const res = await fn(form);
      saveAuth(res.data);
      toast.success(`${t('welcomeBack')}, ${res.data.fullName?.split(' ')[0]}!`);
      const r = res.data.role;
      if (r === 'CITIZEN') navigate('/dashboard/citizen');
      else if (r === 'ADMIN') navigate('/dashboard/admin');
      else navigate('/dashboard/officer');
    } catch (err) {
      toast.error(extractError(err, 'Login failed. Check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(22,163,74,0.07), transparent)',
      }} />

      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 40px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Back link */}
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--txt-3)', marginBottom: 24,
            textDecoration: 'none', transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Header */}
            <div style={{
              padding: '32px 32px 24px',
              background: 'var(--bg-3)',
              borderBottom: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, boxShadow: '0 4px 16px rgba(22,163,74,0.4)',
              }}>🇵🇰</div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', marginBottom: 4 }}>
                {t('welcomeBack')}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--txt-3)' }}>{t('signInToAccount')}</p>
            </div>

            <div style={{ padding: 28 }}>
              {/* Citizen / Officer toggle */}
              <div style={{
                display: 'flex', gap: 4, padding: 4,
                background: 'var(--bg-3)',
                borderRadius: 12, marginBottom: 22,
              }}>
                {[
                  { key: 'citizen', icon: User, label: t('citizen') },
                  { key: 'officer', icon: Shield, label: t('officer') },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 7, padding: '9px 12px', borderRadius: 9,
                      border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600,
                      transition: 'all 0.15s',
                      background: mode === key
                        ? (key === 'citizen' ? '#16a34a' : '#2563eb')
                        : 'transparent',
                      color: mode === key ? '#fff' : 'var(--txt-3)',
                      boxShadow: mode === key ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                    }}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--txt-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('email')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none' }} />
                    <input
                      type="email" required
                      value={form.email} onChange={set('email')}
                      placeholder="you@example.com"
                      className="input"
                      style={{ paddingLeft: 38 }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--txt-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('password')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none' }} />
                    <input
                      type={showPass ? 'text' : 'password'} required
                      value={form.password} onChange={set('password')}
                      placeholder="••••••••"
                      className="input"
                      style={{ paddingLeft: 38, paddingRight: 40 }}
                    />
                    <button
                      type="button" onClick={() => setShowPass(s => !s)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)', padding: 2,
                      }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="btn btn-lg"
                  style={{
                    background: mode === 'citizen' ? '#16a34a' : '#2563eb',
                    color: '#fff',
                    boxShadow: mode === 'citizen' ? '0 4px 16px rgba(22,163,74,0.35)' : '0 4px 16px rgba(37,99,235,0.35)',
                    marginTop: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {loading ? <LoadingSpinner size="sm" /> : (
                    <>{mode === 'citizen' ? <User size={16} /> : <Shield size={16} />} {t('signIn')}</>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--txt-3)' }}>
                  Email not verified?{' '}
                  <Link to="/verify" style={{ color: '#ca8a04', fontWeight: 600, textDecoration: 'none' }}>Verify now →</Link>
                </p>
                <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />
                <p style={{ fontSize: 13, color: 'var(--txt-2)' }}>
                  {t('noAccount')}{' '}
                  <Link to="/register" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>{t('createOneFree')}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
