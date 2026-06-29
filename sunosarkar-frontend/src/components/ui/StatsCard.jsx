const colors = {
  emerald: { bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.18)', text: '#16a34a', icon: 'rgba(22,163,74,0.14)' },
  blue:    { bg: 'rgba(37,99,235,0.07)', border: 'rgba(37,99,235,0.18)', text: '#2563eb', icon: 'rgba(37,99,235,0.14)' },
  amber:   { bg: 'rgba(202,138,4,0.07)', border: 'rgba(202,138,4,0.18)', text: '#ca8a04', icon: 'rgba(202,138,4,0.14)' },
  purple:  { bg: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.18)', text: '#7c3aed', icon: 'rgba(124,58,237,0.14)' },
  red:     { bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.18)', text: '#dc2626', icon: 'rgba(220,38,38,0.14)' },
  slate:   { bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.18)', text: '#64748b', icon: 'rgba(100,116,139,0.14)' },
};

// Dark mode brighter text
const darkText = {
  emerald: '#4ade80', blue: '#60a5fa', amber: '#fbbf24',
  purple: '#a78bfa', red: '#f87171', slate: '#94a3b8',
};

export default function StatsCard({ icon: Icon, label, value, color = 'emerald', trend, delay = 0 }) {
  const c = colors[color] || colors.emerald;
  return (
    <div
      className="rounded-2xl p-4 anim-up"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
            {label}
          </p>
          <p className="dark-num" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, color: c.text }}>
            {value ?? '—'}
          </p>
          {trend && (
            <p style={{ fontSize: 11, color: c.text, marginTop: 4, fontWeight: 600 }}>{trend}</p>
          )}
        </div>
        {Icon && (
          <div style={{ padding: 10, borderRadius: 10, background: c.icon, flexShrink: 0 }}>
            <Icon size={18} style={{ color: c.text }} />
          </div>
        )}
      </div>
    </div>
  );
}
