import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../../lib/api';
import { PAKISTAN_CITIES } from '../../lib/auth';
import { extractError } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Navbar from '../../components/layout/Navbar';

// Reusable labelled field
function Field({ label, icon: Icon, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--txt-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none', zIndex: 1 }} />}
        {children}
      </div>
    </div>
  );
}

const STEPS = 3;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t, isUrdu } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '', cnic: '', email: '',
    age: '', gender: '',
    city: '', ucCode: '', residentialAddress: '', permenantAddress: '',
    password: '', confirmPassword: '',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (step === 1) {
      if (!form.fullName.trim()) return 'Full name is required';
      if (!form.cnic.match(/^\d{5}-\d{7}-\d$/)) return 'CNIC format: 12345-1234567-1';
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Enter a valid email address';
      if (!form.gender) return 'Please select your gender';
    }
    if (step === 2) {
      if (!form.city) return 'Please select your city';
      if (!form.ucCode.trim()) return 'UC Code is required';
      if (!form.residentialAddress.trim()) return 'Residential address is required';
    }
    if (step === 3) {
      if (form.password.length < 8) return 'Password must be at least 8 characters';
      if (form.password !== form.confirmPassword) return 'Passwords do not match';
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    if (step < STEPS) setStep(s => s + 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    setLoading(true);
    try {
      await registerUser({
        fullName: form.fullName,
        cnic: form.cnic,
        email: form.email,
        password: form.password,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        city: form.city,
        ucCode: form.ucCode,
        residentialAddress: form.residentialAddress,
        permenantAddress: form.permenantAddress || form.residentialAddress,
      });
      toast.success('Registration successful! Check your email for an OTP.');
      navigate(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(extractError(err, 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = [t('personalInfo'), t('location'), t('security')];

  const inp = { paddingLeft: 38 }; // icon offset

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(22,163,74,0.07), transparent)',
      }} />

      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 20px 40px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--txt-3)', marginBottom: 24, textDecoration: 'none' }}
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
            {/* Header with stepper */}
            <div style={{ padding: '28px 28px 22px', background: 'var(--bg-3)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0, boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                }}>🇵🇰</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--txt)' }}>{t('createAccount')}</div>
                  <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>{t('joinToday')}</div>
                </div>
              </div>

              {/* Step pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {stepLabels.map((label, i) => {
                  const s = i + 1;
                  const done = step > s;
                  const active = step === s;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: s < STEPS ? 1 : 'none' }}>
                      <button
                        type="button"
                        onClick={() => done && setStep(s)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '5px 10px', borderRadius: 99,
                          border: 'none', cursor: done ? 'pointer' : 'default',
                          fontSize: 12, fontWeight: 600,
                          background: active ? '#16a34a' : done ? 'rgba(22,163,74,0.12)' : 'var(--bg-4)',
                          color: active ? '#fff' : done ? '#16a34a' : 'var(--txt-3)',
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{
                          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                          background: active ? 'rgba(255,255,255,0.25)' : done ? '#16a34a' : 'var(--bg-3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 800, color: active ? '#fff' : done ? '#fff' : 'var(--txt-3)',
                        }}>
                          {done ? '✓' : s}
                        </span>
                        {label}
                      </button>
                      {s < STEPS && (
                        <div style={{ flex: 1, height: 1.5, borderRadius: 99, background: done ? '#16a34a' : 'var(--border)', transition: 'background 0.3s' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-up">
                  <Field label={t('fullName')} icon={User} required>
                    <input type="text" className="input" style={inp} placeholder="Muhammad Ahmed" value={form.fullName} onChange={set('fullName')} />
                  </Field>
                  <Field label={t('cnic')} icon={CreditCard} required>
                    <input type="text" className="input" style={inp} placeholder="12345-1234567-1" value={form.cnic} onChange={set('cnic')} />
                  </Field>
                  <Field label={t('email')} icon={Mail} required>
                    <input type="email" className="input" style={inp} placeholder="you@example.com" value={form.email} onChange={set('email')} />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label={t('age')}>
                      <input type="number" className="input" placeholder="25" min="14" max="100" value={form.age} onChange={set('age')} />
                    </Field>
                    <Field label={t('gender')} required>
                      <select className="input" value={form.gender} onChange={set('gender')} required>
                        <option value="">Select</option>
                        <option value="MALE">{t('male')}</option>
                        <option value="FEMALE">{t('female')}</option>
                        <option value="OTHER">{t('other')}</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-up">
                  <Field label={t('city')} required>
                    <select className="input" value={form.city} onChange={set('city')} required>
                      <option value="">Select city</option>
                      {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label={t('ucCode')} icon={MapPin} required>
                    <input type="text" className="input" style={inp} placeholder="UC-001" value={form.ucCode} onChange={set('ucCode')} />
                  </Field>
                  <Field label={t('residentialAddress')} required>
                    <textarea className="input" placeholder="House No., Street, Area, City..." value={form.residentialAddress} onChange={set('residentialAddress')} rows={3} />
                  </Field>
                  <Field label={`${t('permanentAddress')} (optional)`}>
                    <textarea className="input" placeholder="If different from residential..." value={form.permenantAddress} onChange={set('permenantAddress')} rows={2} />
                  </Field>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-up">
                  <Field label={t('password')} icon={Lock} required>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input" style={{ paddingLeft: 38, paddingRight: 40 }}
                      placeholder="Minimum 8 characters"
                      value={form.password} onChange={set('password')}
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)', padding: 2 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </Field>
                  {/* Password strength */}
                  {form.password && (
                    <div style={{ marginTop: -8 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 99, transition: 'background 0.2s',
                            background: form.password.length >= i * 3
                              ? i <= 1 ? '#dc2626' : i <= 2 ? '#ea580c' : i <= 3 ? '#ca8a04' : '#16a34a'
                              : 'var(--border)',
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>
                        {form.password.length < 4 ? 'Too short' : form.password.length < 7 ? 'Weak' : form.password.length < 10 ? 'OK' : 'Strong'}
                      </div>
                    </div>
                  )}
                  <Field label={t('confirmPassword')} icon={Lock} required>
                    <input
                      type="password" className="input"
                      style={{
                        paddingLeft: 38,
                        borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#dc2626' : undefined,
                      }}
                      placeholder="Repeat your password"
                      value={form.confirmPassword} onChange={set('confirmPassword')}
                    />
                  </Field>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p style={{ fontSize: 12, color: '#dc2626', marginTop: -8 }}>Passwords do not match</p>
                  )}
                  {/* OTP notice */}
                  <div className="glass-green" style={{ borderRadius: 12, padding: '12px 14px' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', marginBottom: 4 }}>📧 Email Verification Required</p>
                    <p style={{ fontSize: 12, color: 'var(--txt-3)' }}>
                      A 6-digit OTP will be sent to <strong style={{ color: 'var(--txt-2)' }}>{form.email || 'your email'}</strong> to verify your account before you can login.
                    </p>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '11px 0' }}
                  >
                    ← {t('back')}
                  </button>
                )}
                {step < STEPS ? (
                  <button
                    type="button"
                    onClick={next}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '11px 0' }}
                  >
                    {t('continue')} →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : `${t('createAccount')} →`}
                  </button>
                )}
              </div>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--txt-3)', marginTop: 16 }}>
                {t('alreadyAccount')}{' '}
                <Link to="/login" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>{t('signIn')}</Link>
              </p>
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--txt-3)', marginTop: 6 }}>
                Government officer?{' '}
                <Link to="/register/officer" style={{ color: '#2563eb', textDecoration: 'none' }}>Officer Registration →</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
