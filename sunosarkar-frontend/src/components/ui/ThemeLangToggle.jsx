import { Sun, Moon, Languages } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ThemeLangToggle({ compact = false }) {
  const { theme, toggleTheme, lang, setLang } = useApp();
  const isUrdu = lang === 'ur';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

      {/* Language toggle — large and obvious for senior citizens */}
      <button
        onClick={() => setLang(isUrdu ? 'en' : 'ur')}
        title={isUrdu ? 'Switch to English' : 'اردو میں بدلیں'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: compact ? '4px 8px' : '6px 10px',
          borderRadius: 8,
          background: isUrdu ? 'var(--green-subtle)' : 'var(--bg-3)',
          border: `1px solid ${isUrdu ? 'var(--green-border)' : 'var(--border)'}`,
          color: isUrdu ? 'var(--green-bright)' : 'var(--txt-2)',
          fontSize: compact ? 11 : 12,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
          letterSpacing: isUrdu ? 0 : '0.02em',
          fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit',
          lineHeight: isUrdu ? 1.8 : 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = isUrdu ? 'var(--green-subtle)' : 'var(--bg-4)';
          e.currentTarget.style.borderColor = isUrdu ? 'var(--green-bright)' : 'var(--border-2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isUrdu ? 'var(--green-subtle)' : 'var(--bg-3)';
          e.currentTarget.style.borderColor = isUrdu ? 'var(--green-border)' : 'var(--border)';
        }}
      >
        {isUrdu ? 'EN' : 'اردو'}
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? (isUrdu ? 'روشن موڈ' : 'Light mode') : (isUrdu ? 'تاریک موڈ' : 'Dark mode')}
        style={{
          width: compact ? 28 : 32,
          height: compact ? 28 : 32,
          borderRadius: 8,
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          color: 'var(--txt-2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--txt)';
          e.currentTarget.style.background = 'var(--bg-4)';
          e.currentTarget.style.borderColor = 'var(--border-2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--txt-2)';
          e.currentTarget.style.background = 'var(--bg-3)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {theme === 'dark' ? <Sun size={compact ? 13 : 15} /> : <Moon size={compact ? 13 : 15} />}
      </button>
    </div>
  );
}
