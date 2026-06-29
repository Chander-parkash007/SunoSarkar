import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, MapPin, Phone, CreditCard, Shield, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerOfficer } from '../../lib/api';
import { PAKISTAN_CITIES } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const OFFICER_ROLES = [
  { value: 'MUNICIPAL_WORKER', label: 'Municipal Worker',       desc: 'Field-level operations' },
  { value: 'UC_CHAIRMAN',      label: 'UC Chairman',            desc: 'Union Council rep' },
  { value: 'TOWN_OFFICER',     label: 'Town Officer',           desc: 'Town administration' },
  { value: 'AC',               label: 'Asst. Commissioner',     desc: 'Sub-division admin' },
  { value: 'DC',               label: 'Deputy Commissioner',    desc: 'District administration' },
  { value: 'MAYOR',            label: 'Mayor',                  desc: 'City administration' },
];

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--txt-3)', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none', zIndex: 1 }} />}
        {children}
      </div>
    </div>
  );
}

export default function OfficerRegisterPage() {
  const navigate = useNavigate();
  const { t, isUrdu } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '', cnic: '', email: '', password: '', confirmPassword: '',
    role: '', city: '', ucCode: '', jurisdisctionArea: '', phoneNumber: '',
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error('Please select your role');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await registerOfficer({
        fullName: form.fullName, cnic: form.cnic, email: form.email,
        password: form.password, role: form.role, city: form.city,
        ucCode: form.ucCode, jurisdisctionArea: form.jurisdisctionArea,
        phoneNumber: form.phoneNumber,
      });
      toast.success('Registration submitted! Verify your email, then wait for admin approval.');
      navigate(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inp = { paddingLeft: 38 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px' }}>
        <div style={{ width: '100%', maxWidth: 660 }}>

          {/* Back */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--txt-3)', marginBottom: 24, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Card */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>

            {/* Header */}
            <div style={{ padding: '28px 32px', background: 'var(--bg-3)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={20} style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.02em', marginBottom: 2 }}>{t('officerReg')}</h1>
                  <p style={{ fontSize: 13, color: 'var(--txt-2)' }}>Government official registration — admin approval required</p>
                </div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(202,138,4,0.08)', border: '1px solid rgba(202,138,4,0.2)', fontSize: 12, color: '#ca8a04', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <span>After email verification, your account requires admin approval before you can login. This may take 1–2 business days.</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Role grid */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--txt-3)', marginBottom: 10 }}>
                  Select Your Role *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {OFFICER_ROLES.map(({ value, label, desc }) => (
                    <button key={value} type="button" onClick={() => setForm(f => ({ ...f, role: value }))}
                      style={{
                        textAlign: 'left', padding: '12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.13s',
                        border: form.role === value ? '1px solid rgba(59,130,246,0.45)' : '1px solid var(--border)',
                        background: form.role === value ? 'rgba(59,130,246,0.1)' : 'var(--bg-3)',
                        color: form.role === value ? '#60a5fa' : 'var(--txt-2)',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 11, opacity: 0.65 }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Two-column fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                <Field label={`${t('fullName')} *`} icon={User}>
                  <input type="text" value={form.fullName} onChange={set('fullName')} placeholder="Officer Full Name" className="input" style={inp} required />
                </Field>
                <Field label={`${t('cnic')} *`} icon={CreditCard}>
                  <input type="text" value={form.cnic} onChange={set('cnic')} placeholder="12345-1234567-1" className="input" style={inp} required />
                </Field>
                <Field label={`${t('email')} *`} icon={Mail}>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="officer@gov.pk" className="input" style={inp} required />
                </Field>
                <Field label="Phone Number" icon={Phone}>
                  <input type="tel" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="03XX-XXXXXXX" className="input" style={inp} />
                </Field>
                <Field label={`${t('city')} *`}>
                  <select value={form.city} onChange={set('city')} className="input" required>
                    <option value="">Select city</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label={`${t('ucCode')} *`} icon={MapPin}>
                  <input type="text" value={form.ucCode} onChange={set('ucCode')} placeholder="UC-001" className="input" style={inp} required />
                </Field>
              </div>

              {/* Jurisdiction - full width */}
              <Field label="Jurisdiction Area" icon={MapPin}>
                <input type="text" value={form.jurisdisctionArea} onChange={set('jurisdisctionArea')} placeholder="e.g. Gulshan-e-Iqbal, Karachi" className="input" style={inp} />
              </Field>

              {/* Password row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                <Field label={`${t('password')} *`} icon={Lock}>
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className="input" style={{ paddingLeft: 38, paddingRight: 40 }} required />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)', padding: 2 }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>
                <Field label={`${t('confirmPassword')} *`} icon={Lock}>
                  <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" className="input" style={inp} required />
                </Field>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }}>
                {loading ? <LoadingSpinner size="sm" /> : <><Shield size={16} /> Submit Officer Application <ChevronRight size={15} /></>}
              </button>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--txt-3)', marginTop: 4 }}>
                Not an officer?{' '}
                <Link to="/register" style={{ color: 'var(--green-bright)', fontWeight: 600, textDecoration: 'none' }}>Citizen registration →</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
