import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyEmail, resendOtp } from '../../lib/api';
import { extractError } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputs = useRef([]);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) { setOtp(paste.split('')); inputs.current[5]?.focus(); }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Please enter the 6-digit OTP');
    setLoading(true);
    try {
      await verifyEmail({ email, otpCode });
      toast.success(isUrdu ? 'ای میل تصدیق ہو گئی! اب لاگ ان کریں۔' : 'Email verified! You can now login.');
      navigate('/login');
    } catch (err) {
      const msg = extractError(err, 'Invalid or expired OTP');
      toast.error(msg);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error(isUrdu ? 'پہلے ای میل درج کریں' : 'Enter your email first');
    setResending(true);
    try {
      await resendOtp(email);
      toast.success(isUrdu ? 'نیا کوڈ بھیجا گیا!' : 'New OTP sent to your email!');
      setCountdown(60);
    } catch (err) {
      toast.error(extractError(err, 'Failed to resend OTP'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Back */}
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--txt-3)', marginBottom: 24, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            <ArrowLeft size={14} /> {t('backToLogin')}
          </Link>

          {/* Card */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>

            {/* Header */}
            <div style={{ padding: '32px 32px 24px', background: 'var(--bg-3)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(21,128,61,0.1)', border: '1px solid rgba(21,128,61,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mail size={28} style={{ color: 'var(--green-bright)' }} />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', marginBottom: 6, letterSpacing: '-0.02em' }}>
                {t('verifyEmail')}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--txt-2)' }}>
                {t('sentCode')}
                {email && <span style={{ display: 'block', marginTop: 4, fontWeight: 600, color: 'var(--green-bright)' }}>{email}</span>}
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Email delivery notice */}
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(202,138,4,0.08)', border: '1px solid rgba(202,138,4,0.2)', fontSize: 12, color: '#ca8a04', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, fontSize: 14 }}>⚠️</span>
                <span>
                  {isUrdu
                    ? 'اگر ای میل نہ ملے تو اسپام فولڈر چیک کریں یا "دوبارہ بھیجیں" دبائیں۔ ڈیلیوری میں 1–2 منٹ لگ سکتے ہیں۔'
                    : 'If you don\'t receive the OTP, check your spam folder or click "Resend". Delivery may take 1–2 minutes.'
                  }
                </span>
              </div>

              {/* Email input (if no email param) */}
              {!emailParam && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('email')}
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input" />
                </div>
              )}

              {/* OTP boxes */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--txt-3)', marginBottom: 14, textAlign: 'center' }}>
                  {t('enterOtp')}
                </label>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }} onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => inputs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      style={{
                        width: 48, height: 56, borderRadius: 10, textAlign: 'center',
                        fontSize: 20, fontWeight: 800, outline: 'none',
                        background: digit ? 'rgba(21,128,61,0.1)' : 'var(--input-bg)',
                        border: digit ? '1.5px solid rgba(21,128,61,0.4)' : '1.5px solid var(--input-border)',
                        color: digit ? 'var(--green-bright)' : 'var(--txt)',
                        transition: 'all 0.12s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={loading || otp.join('').length !== 6}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {loading ? <LoadingSpinner size="sm" /> : t('verifyEmailBtn')}
              </button>

              {/* Resend */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--txt-3)', marginBottom: 8 }}>{t('didntReceive')}</p>
                <button
                  onClick={handleResend}
                  disabled={resending || countdown > 0}
                  style={{ background: 'none', border: 'none', cursor: countdown > 0 ? 'not-allowed' : 'pointer', color: 'var(--green-bright)', fontSize: 13, fontWeight: 600, opacity: (resending || countdown > 0) ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  {resending ? <LoadingSpinner size="sm" /> : <RefreshCw size={13} />}
                  {countdown > 0 ? `${t('resendIn')} ${countdown}s` : t('resendOtp')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
