export default function LoadingSpinner({ size = 'md', text }) {
  const px = { sm: 16, md: 24, lg: 40, xl: 56 }[size] || 24;
  return (
    <span className="inline-flex flex-col items-center gap-2">
      <svg
        width={px} height={px}
        viewBox="0 0 24 24"
        fill="none"
        className="anim-spin"
        style={{ flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="10" stroke="var(--border-2, rgba(255,255,255,0.15))" strokeWidth="2.5" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {text && <span style={{ color: 'var(--txt-3)', fontSize: 13 }}>{text}</span>}
    </span>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🇵🇰</div>
        <div className="flex justify-center mb-3">
          <LoadingSpinner size="lg" />
        </div>
        <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 18 }}>SunoSarkar</p>
        <p style={{ color: 'var(--txt-3)', fontSize: 13, marginTop: 4 }}>Loading...</p>
      </div>
    </div>
  );
}
