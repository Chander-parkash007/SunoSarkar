import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Shield, CheckCircle, FileText,
  Users, MapPin, Phone, Menu, X,
  BarChart2, Bell, Clock, ChevronDown,
} from 'lucide-react';
import { getLeaderboard } from '../lib/api';
import { CATEGORY_ICONS, ROLE_LABELS } from '../lib/auth';
import { useApp } from '../context/AppContext';
import ThemeLangToggle from '../components/ui/ThemeLangToggle';
import Logo from '../components/ui/Logo';
import { isLoggedIn, getRole, clearAuth } from '../lib/auth';

/* ─── Reveal hook ─────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Animated Counter ────────────────────────────────────────── */
function Counter({ target, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Section wrapper with reveal ────────────────────────────── */
function Section({ children, style = {}, className = '' }) {
  const ref = useReveal();
  return (
    <section ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </section>
  );
}

/* ─── Top Nav ─────────────────────────────────────────────────── */
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const role = getRole();
  const { t, isUrdu } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const getDash = () => {
    if (role === 'CITIZEN') return '/dashboard/citizen';
    if (role === 'ADMIN') return '/dashboard/admin';
    return '/dashboard/officer';
  };

  const handleLogout = () => { clearAuth(); navigate('/'); };

  const links = [
    { to: '/complaints/public', label: t('complaints') },
    { to: '/stats',             label: t('stats') },
    { to: '/leaderboard',       label: t('leaderboard') },
    { to: '/emergency',         label: t('emergency') },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: scrolled ? 'var(--nav)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.25s ease',
    }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo — always links to home */}
        <Logo to="/" />

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              style={{ padding: '6px 12px', borderRadius: 7, fontSize: 13.5, fontWeight: 500, color: 'var(--txt-2)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-2)'}
            >{label}</Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div className="hide-mobile"><ThemeLangToggle /></div>
          {loggedIn ? (
            <div className="hide-mobile" style={{ display: 'flex', gap: 8 }}>
              <Link to={getDash()} className="btn btn-sm btn-secondary">{t('dashboard')}</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost">{t('logout')}</button>
            </div>
          ) : (
            <div className="hide-mobile" style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-sm btn-ghost">{t('signIn')}</Link>
              <Link to="/register" className="btn btn-sm btn-primary">{t('getStarted')}</Link>
            </div>
          )}
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--txt-2)', flexShrink: 0 }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="anim-down" style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              style={{ padding: '10px 4px', fontSize: 14, color: 'var(--txt-2)', textDecoration: 'none', display: 'block' }}
            >{label}</Link>
          ))}
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 4, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemeLangToggle />
            {loggedIn
              ? <div style={{ display: 'flex', gap: 8 }}><Link to={getDash()} className="btn btn-sm btn-primary">{t('dashboard')}</Link><button onClick={handleLogout} className="btn btn-sm btn-ghost">{t('logout')}</button></div>
              : <div style={{ display: 'flex', gap: 8 }}><Link to="/login" className="btn btn-sm btn-ghost">{t('signIn')}</Link><Link to="/register" className="btn btn-sm btn-primary">Get Started</Link></div>
            }
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Static data ─────────────────────────────────────────────── */
const CATEGORIES = [
  { key: 'ROAD',        label: 'Broken Roads',   desc: 'Potholes & damaged streets' },
  { key: 'GARBAGE',     label: 'Garbage',         desc: 'Uncollected waste & dumps' },
  { key: 'SEWAGE',      label: 'Sewage',           desc: 'Drain blockages & overflow' },
  { key: 'WATER',       label: 'Water Supply',    desc: 'Shortages & pipe leaks' },
  { key: 'ELECTRICITY', label: 'Power Outages',   desc: 'Electricity failures' },
  { key: 'SANITATION',  label: 'Sanitation',      desc: 'Public hygiene problems' },
  { key: 'STREE_LIGHT', label: 'Street Lights',   desc: 'Dark & unsafe streets' },
  { key: 'PARK',        label: 'Parks & Spaces',  desc: 'Green areas & recreation' },
];

const STEPS = [
  { num: '01', icon: Users,       label: 'Create an Account',    desc: 'Register free with your CNIC and verify your email in seconds.' },
  { num: '02', icon: FileText,    label: 'File a Complaint',     desc: 'Describe the issue, upload photos, and pin your exact location.' },
  { num: '03', icon: Bell,        label: 'Officers Are Notified', desc: 'The responsible officer for your area is alerted immediately.' },
  { num: '04', icon: CheckCircle, label: 'Track & Confirm',      desc: 'Follow live status updates. Mark resolved when the work is done.' },
];

const FEATURES = [
  { icon: Shield,    label: 'Verified Accountability', desc: 'Every officer is verified by admin. No anonymous negligence ever.' },
  { icon: Bell,      label: 'Instant Notifications',   desc: 'Officers are emailed the moment a complaint lands in their area.' },
  { icon: BarChart2, label: 'Public Transparency',     desc: 'City-wide statistics are fully public — anyone can see the numbers.' },
  { icon: Clock,     label: 'Auto Reminders',          desc: 'Unresolved complaints trigger automatic follow-up after 48 hours.' },
  { icon: MapPin,    label: 'Location Evidence',       desc: 'GPS coordinates and photos create undeniable proof for authorities.' },
  { icon: Phone,     label: 'Emergency Contacts',      desc: 'One-tap access to police, fire, and ambulance for your city.' },
];

const IMPACT_STATS = [
  { val: 1200, suffix: '+', label: 'Complaints Filed' },
  { val: 847,  suffix: '',  label: 'Issues Resolved' },
  { val: 320,  suffix: '+', label: 'Active Officers' },
  { val: 15,   suffix: '',  label: 'Cities Covered' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { isUrdu, theme } = useApp();
  const [leaderboard, setLeaderboard] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    getLeaderboard()
      .then(r => setLeaderboard((r.data || []).slice(0, 5)))
      .catch(() => {});
  }, []);

  /* ── shared style tokens ── */
  const sectionPad = { padding: '100px 0' };
  const headingStyle = {
    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    color: 'var(--txt)',
    lineHeight: 1.1,
  };
  const bodyStyle = { fontSize: 16, color: 'var(--txt-2)', lineHeight: 1.75 };
  const eyebrowStyle = {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--green-bright)',
    display: 'block', marginBottom: 18,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <TopNav />

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', paddingTop: 64 }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 35%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 35%, black 20%, transparent 75%)',
        }} />
        {/* Subtle green glow */}
        <div style={{
          position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 560, height: 360, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(ellipse, rgba(21,128,61,0.09) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(21,128,61,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1140, margin: '0 auto', padding: '80px 24px 64px', width: '100%' }}>
          {/* Pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <span className="pill pill-green anim-up">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-bright)', display: 'inline-block', flexShrink: 0 }} />
              Pakistan's Civic Accountability Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="anim-up" style={{
            textAlign: 'center',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.0,
            color: 'var(--txt)',
            animationDelay: '60ms',
            marginBottom: 16,
          }}>
            Pakistan deserves<br />
            <span className="text-green">better public services.</span>
          </h1>

          {/* Urdu */}
          <p className="anim-up" style={{
            textAlign: 'center', fontFamily: "'Noto Nastaliq Urdu', serif",
            fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: 'var(--txt-2)',
            lineHeight: 2.0, animationDelay: '120ms', marginBottom: 24,
          }}>
            آواز اٹھاؤ — حق لو
          </p>

          {/* Sub */}
          <p className="anim-up" style={{
            textAlign: 'center', maxWidth: 560, margin: '0 auto 44px',
            fontSize: 'clamp(1rem, 1.4vw, 1.1rem)', color: 'var(--txt-2)',
            lineHeight: 1.75, animationDelay: '180ms',
          }}>
            Report garbage, broken roads, sewage failures, and infrastructure problems
            directly to the government officers responsible for fixing them.
          </p>

          {/* CTAs */}
          <div className="anim-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '260ms', marginBottom: 80 }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: 180, justifyContent: 'center' }}>
              Report a Problem <ArrowRight size={16} />
            </Link>
            <Link to="/complaints/public" className="btn btn-secondary btn-lg" style={{ minWidth: 160, justifyContent: 'center' }}>
              View Complaints
            </Link>
          </div>

          {/* Stat counters */}
          <div className="anim-up" style={{
            animationDelay: '340ms',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'hidden',
          }}>
            {IMPACT_STATS.map(({ val, suffix, label }, i) => (
              <div key={label} style={{
                flex: '1 1 120px',
                padding: '28px 20px',
                textAlign: 'center',
                borderRight: i < IMPACT_STATS.length - 1 ? '1px solid var(--border)' : 'none',
                borderBottom: 0,
              }}>
                <div style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--txt)', lineHeight: 1 }}>
                  <Counter target={val} suffix={suffix} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 7, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-3)' }}>Scroll</span>
          <ChevronDown size={14} style={{ color: 'var(--txt-3)', animation: 'float 2.5s ease-in-out infinite' }} />
        </div>
      </div>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          WHY SECTION
      ════════════════════════════════════════════════════ */}
      <Section style={sectionPad}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
            {/* Left: text */}
            <div style={{ flex: '1 1 320px', minWidth: 280 }}>
              <span style={eyebrowStyle}>The Problem</span>
              <h2 style={{ ...headingStyle, marginBottom: 24 }}>
                Citizens report problems.<br />
                <span style={{ color: 'var(--txt-3)', fontWeight: 400 }}>Nothing happens.</span>
              </h2>
              <p style={{ ...bodyStyle, marginBottom: 20 }}>
                In Pakistan, millions of civic problems go unresolved — not because no one cares,
                but because there was no system to hold anyone accountable.
              </p>
              <p style={{ ...bodyStyle, marginBottom: 36 }}>
                SunoSarkar routes every complaint directly to the officer responsible for that area —
                with photo evidence, timestamps, and automatic follow-up reminders.
              </p>
              <Link to="/register" className="btn btn-primary">
                Start Filing Complaints <ArrowRight size={15} />
              </Link>
            </div>

            {/* Right: before/after */}
            <div style={{ flex: '1 1 320px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                {
                  label: 'Before SunoSarkar',
                  items: ['Complaint goes nowhere', 'No record kept', 'Officer unaware', 'Problem persists for months'],
                  bad: true,
                },
                {
                  label: 'With SunoSarkar',
                  items: ['Complaint filed with evidence', 'Officer notified instantly', 'Status tracked publicly', 'Resolution confirmed by citizen'],
                  bad: false,
                },
              ].map(({ label, items, bad }) => (
                <div key={label} style={{
                  padding: '24px 28px',
                  background: bad ? 'transparent' : 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: bad ? 'var(--txt-3)' : 'var(--green-bright)',
                    marginBottom: 16,
                  }}>{label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700,
                          background: bad ? 'rgba(185,28,28,0.08)' : 'var(--green-subtle)',
                          border: `1px solid ${bad ? 'rgba(185,28,28,0.18)' : 'var(--green-border)'}`,
                          color: bad ? '#b91c1c' : 'var(--green-bright)',
                        }}>
                          {bad ? '✗' : '✓'}
                        </div>
                        <span style={{ fontSize: 14, color: bad ? 'var(--txt-3)' : 'var(--txt-2)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════════ */}
      <Section style={sectionPad}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <span style={eyebrowStyle}>What You Can Report</span>
            <h2 style={{ ...headingStyle, maxWidth: 480 }}>
              Every public problem,<br />documented and tracked.
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}>
            {CATEGORIES.map(({ key, label, desc }) => (
              <div key={key} className="cat-card">
                <div style={{ fontSize: 28, marginBottom: 12, lineHeight: 1 }}>{CATEGORY_ICONS[key]}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--txt-3)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <Link to="/register" style={{ fontSize: 14, color: 'var(--green-bright)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              File a complaint now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <Section style={sectionPad}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 80, alignItems: 'flex-start' }}>
            {/* Sticky label col */}
            <div style={{ flex: '0 0 300px', minWidth: 240, position: 'sticky', top: 96 }}>
              <span style={eyebrowStyle}>How It Works</span>
              <h2 style={{ ...headingStyle, marginBottom: 20 }}>
                Four steps to<br />accountability.
              </h2>
              <p style={{ ...bodyStyle, marginBottom: 36 }}>
                From report to resolution — SunoSarkar creates an auditable trail that
                neither citizens nor officers can ignore.
              </p>
              <Link to="/register" className="btn btn-primary">
                Get Started Free <ArrowRight size={15} />
              </Link>
            </div>

            {/* Steps */}
            <div style={{ flex: '1 1 320px', minWidth: 280 }}>
              {STEPS.map(({ num, icon: Icon, label, desc }, i) => (
                <div key={num} style={{
                  display: 'flex', gap: 24,
                  paddingBottom: i < STEPS.length - 1 ? 40 : 0,
                  paddingTop: i > 0 ? 40 : 0,
                  borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div className="step-num" style={{ flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>STEP {num}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 8, letterSpacing: '-0.01em' }}>{label}</h3>
                    <p style={{ fontSize: 14, color: 'var(--txt-2)', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════ */}
      <Section style={sectionPad}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <span style={eyebrowStyle}>Platform Features</span>
            <h2 style={headingStyle}>
              Built for Pakistan.{' '}
              <span style={{ color: 'var(--txt-3)', fontWeight: 400 }}>Designed for change.</span>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 1,
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label}
                style={{ padding: '28px 24px', background: 'var(--bg)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
              >
                <div className="icon-box" style={{ marginBottom: 16 }}>
                  <Icon size={18} style={{ color: 'var(--green-bright)' }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)', marginBottom: 8, letterSpacing: '-0.01em' }}>{label}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--txt-2)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          IMPACT STATS STRIP
      ════════════════════════════════════════════════════ */}
      <Section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={eyebrowStyle}>Platform Impact</span>
            <h2 style={headingStyle}>Numbers that matter.</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
            {IMPACT_STATS.map(({ val, suffix, label }) => (
              <div key={label} style={{
                flex: '1 1 160px',
                padding: '40px 32px',
                textAlign: 'center',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}>
                <div className="stat-num">
                  <Counter target={val} suffix={suffix} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--txt-3)', marginTop: 10, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          MISSION QUOTE
      ════════════════════════════════════════════════════ */}
      <Section style={{ padding: '100px 0', background: isDark ? '#0d0d0d' : '#111111' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span style={{ ...eyebrowStyle, color: 'rgba(22,163,74,0.9)' }}>Our Mission</span>
          <blockquote style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: '#f0f0f0',
            lineHeight: 1.35,
            marginBottom: 32,
            fontStyle: 'normal',
          }}>
            "Technology should never replace government.<br />
            It should make government accountable."
          </blockquote>
          <p style={{ fontSize: 15, color: 'rgba(240,240,240,0.45)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            SunoSarkar was built independently using Java, Spring Boot, REST APIs, JWT Authentication,
            and MySQL — a belief that even one engineer can build tools that improve governance.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Register Free</Link>
            <Link to="/register/officer" className="btn-outline-green">Officer Registration</Link>
          </div>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          LEADERBOARD (conditional)
      ════════════════════════════════════════════════════ */}
      {leaderboard.length > 0 && (
        <>
          <Section style={sectionPad}>
            <div className="container-narrow">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={eyebrowStyle}>Officer Leaderboard</span>
                  <h2 style={headingStyle}>Top performing officers.</h2>
                </div>
                <Link to="/leaderboard" style={{ fontSize: 13, color: 'var(--green-bright)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  Full rankings <ArrowRight size={13} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                {leaderboard.map((off, i) => (
                  <div key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg)', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                  >
                    <div style={{ width: 28, textAlign: 'center', fontSize: i < 3 ? 18 : 13, fontWeight: 700, color: 'var(--txt-3)', flexShrink: 0 }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'var(--txt-2)', flexShrink: 0 }}>
                      {off.officerName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{off.officerName}</div>
                      <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 1 }}>{ROLE_LABELS[off.role] || off.role} · {off.city}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--green-bright)', lineHeight: 1 }}>{off.resolvedComplaints}</div>
                      <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>resolved</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
          <hr className="sep" />
        </>
      )}

      {/* ════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════ */}
      <Section style={{ padding: '100px 0' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span style={eyebrowStyle}>Get Involved</span>
          <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: 20 }}>
            Your city changes when<br />someone speaks up.
          </h2>
          <p style={{ ...bodyStyle, maxWidth: 520, margin: '0 auto 44px' }}>
            Every complaint filed is a record. Every record is pressure. Every resolved issue
            is proof that accountability works — when you demand it.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <Link to="/register" className="btn btn-primary btn-xl" style={{ minWidth: 200, justifyContent: 'center' }}>
              Report a Problem <ArrowRight size={16} />
            </Link>
            <Link to="/complaints/public" className="btn btn-secondary btn-xl" style={{ minWidth: 180, justifyContent: 'center' }}>
              Browse Complaints
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'var(--txt-3)' }}>
            Free to use · No downloads required ·{' '}
            <Link to="/register/officer" style={{ color: 'var(--green-bright)', fontWeight: 600 }}>Are you an officer?</Link>
          </p>
        </div>
      </Section>

      <hr className="sep" />

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer style={{ background: 'var(--bg-2)', padding: '56px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, marginBottom: 48 }}>
            {/* Brand col */}
            <div style={{ flex: '1 1 220px', minWidth: 200 }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🇵🇰</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.02em' }}>SunoSarkar</div>
              </Link>
              <p style={{ fontSize: 13.5, color: 'var(--txt-3)', lineHeight: 1.7, maxWidth: 240 }}>
                Pakistan's civic accountability platform. Report problems. Track solutions. Hold officials accountable.
              </p>
            </div>

            {/* Platform col */}
            <div style={{ flex: '1 1 140px', minWidth: 130 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16 }}>Platform</div>
              {[
                { to: '/complaints/public', label: 'Public Complaints' },
                { to: '/leaderboard',       label: 'Officer Rankings' },
                { to: '/stats',             label: 'City Statistics' },
                { to: '/emergency',         label: 'Emergency Contacts' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{ display: 'block', fontSize: 13.5, color: 'var(--txt-3)', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
                >{label}</Link>
              ))}
            </div>

            {/* Account col */}
            <div style={{ flex: '1 1 140px', minWidth: 130 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16 }}>Account</div>
              {[
                { to: '/register',         label: 'Citizen Registration' },
                { to: '/register/officer', label: 'Officer Registration' },
                { to: '/login',            label: 'Sign In' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{ display: 'block', fontSize: 13.5, color: 'var(--txt-3)', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
                >{label}</Link>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: 'var(--txt-3)' }}>
              © {new Date().getFullYear()} SunoSarkar. Built for Pakistan.
            </p>
            <p style={{ fontSize: 12, color: 'var(--txt-3)', fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.8 }}>
              سنو سرکار — آواز اٹھاؤ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
