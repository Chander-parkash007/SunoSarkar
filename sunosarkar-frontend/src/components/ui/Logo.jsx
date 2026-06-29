import { Link } from 'react-router-dom';

/**
 * SunoSarkar Logo Component
 * - Clicking always navigates to "/"
 * - size: 'sm' | 'md' | 'lg'
 * - showUrdu: show Urdu tagline below
 */
export default function Logo({ size = 'md', showUrdu = true, to = '/' }) {
  const sizes = {
    sm: { icon: 26, title: 13, urdu: 9,  gap: 8,  radius: 7 },
    md: { icon: 32, title: 14, urdu: 10, gap: 10, radius: 8 },
    lg: { icon: 44, title: 18, urdu: 12, gap: 12, radius: 11 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        textDecoration: 'none',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Icon mark */}
      <div style={{
        width: s.icon,
        height: s.icon,
        borderRadius: s.radius,
        background: 'var(--green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(21,128,61,0.35)',
      }}>
        {/* Custom S mark in white */}
        <svg width={s.icon * 0.55} height={s.icon * 0.55} viewBox="0 0 24 24" fill="none">
          <text
            x="50%" y="58%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="900"
            fontFamily="Inter, sans-serif"
            letterSpacing="-1"
          >SS</text>
        </svg>
      </div>

      {/* Text */}
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontSize: s.title,
          fontWeight: 800,
          color: 'var(--txt)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          SunoSarkar
        </div>
        {showUrdu && (
          <div style={{
            fontSize: s.urdu,
            color: 'var(--green-bright)',
            fontFamily: "'Noto Nastaliq Urdu', serif",
            lineHeight: 1.8,
            marginTop: 1,
          }}>
            سنو سرکار
          </div>
        )}
      </div>
    </Link>
  );
}
