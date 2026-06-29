import { useApp } from '../../context/AppContext';

export default function LangModal() {
  const { showLangModal, setLang } = useApp();
  if (!showLangModal) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="anim-scale"
        style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '40px 32px',
          width: '100%',
          maxWidth: 380,
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Logo */}
        {/* Logo */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: '0 auto 20px',
          background: 'var(--green)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 26,
          boxShadow: '0 4px 16px rgba(21,128,61,0.4)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Inter,sans-serif">SS</text>
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.02em', marginBottom: 4 }}>
          SunoSarkar
        </h1>
        <p style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 16, color: 'var(--green-bright)', lineHeight: 2, marginBottom: 6 }}>
          سنو سرکار
        </p>
        <p style={{ fontSize: 13, color: 'var(--txt-3)', marginBottom: 28 }}>
          Choose your language / اپنی زبان منتخب کریں
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { code: 'en', flag: '🇬🇧', name: 'English', sub: 'Continue in English', urdu: false },
            { code: 'ur', flag: '🇵🇰', name: 'اردو', sub: 'اردو میں جاری رکھیں', urdu: true },
          ].map(({ code, flag, name, sub, urdu }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              style={{
                flex: 1, padding: '18px 12px', borderRadius: 14,
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--green-bright)';
                e.currentTarget.style.background = 'var(--green-subtle)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-3)';
              }}
            >
              <span style={{ fontSize: 28 }}>{flag}</span>
              <span style={{
                fontWeight: 700, fontSize: 15, color: 'var(--txt)',
                fontFamily: urdu ? "'Noto Nastaliq Urdu', serif" : 'inherit',
              }}>{name}</span>
              <span style={{
                fontSize: 11, color: 'var(--txt-3)',
                fontFamily: urdu ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                direction: urdu ? 'rtl' : 'ltr',
              }}>{sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
