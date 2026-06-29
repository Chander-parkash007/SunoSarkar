import { useState, useEffect } from 'react';
import { Trophy, MapPin } from 'lucide-react';
import { getLeaderboard } from '../../lib/api';
import { ROLE_LABELS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    getLeaderboard()
      .then(r => setLeaderboard(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top3 = leaderboard.slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '88px 20px 64px' }}>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-green text-sm font-semibold mb-4" style={{ color: '#10b981' }}>
            <Trophy size={14} /> {t('officerRankings')}
          </div>
          <h1 className="text-5xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            <span className="gradient-text">{t('leaderboard')}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Officers ranked by number of complaints resolved — recognizing those who create real change
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading leaderboard..." />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-24">
            <Trophy size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No data yet</p>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            <div className="flex items-end justify-center gap-4 mb-12">
              {/* 2nd place */}
              {top3[1] && (
                <div className="flex flex-col items-center anim-up" style={{ animationDelay: '100ms' }}>
                  <div className="relative w-16 h-16 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                      {top3[1].officerName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-sm font-black text-slate-900 shadow">🥈</div>
                  </div>
                  <p className="text-sm font-bold text-center max-w-[100px] truncate" style={{ color: 'var(--text-secondary)' }}>
                    {top3[1].officerName}
                  </p>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{top3[1].city}</p>
                  <div
                    className="w-24 rounded-t-xl flex flex-col items-center justify-end pb-3"
                    style={{ height: '90px', background: 'linear-gradient(to top, #475569, #64748b)' }}
                  >
                    <p className="text-2xl font-black text-white">{top3[1].resolvedComplaints}</p>
                    <p className="text-xs text-slate-300">resolved</p>
                  </div>
                </div>
              )}

              {/* 1st place */}
              {top3[0] && (
                <div className="flex flex-col items-center anim-bounce">
                  <div className="relative mb-3">
                    <div
                      className="absolute -inset-2 rounded-3xl blur-lg animate-pulse"
                      style={{ background: 'rgba(245,158,11,0.25)' }}
                    />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                      {top3[0].officerName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-base shadow-lg">🥇</div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                  </div>
                  <p className="text-base font-black text-center max-w-[120px] truncate" style={{ color: 'var(--text-primary)' }}>
                    {top3[0].officerName}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: '#fbbf24' }}>
                    {ROLE_LABELS[top3[0].role] || top3[0].role}
                  </p>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{top3[0].city}</p>
                  <div
                    className="w-28 rounded-t-xl flex flex-col items-center justify-end pb-3"
                    style={{ height: '120px', background: 'linear-gradient(to top, #d97706, #f59e0b)' }}
                  >
                    <p className="text-3xl font-black text-white">{top3[0].resolvedComplaints}</p>
                    <p className="text-xs text-amber-100">resolved</p>
                  </div>
                </div>
              )}

              {/* 3rd place */}
              {top3[2] && (
                <div className="flex flex-col items-center anim-up" style={{ animationDelay: '200ms' }}>
                  <div className="relative w-16 h-16 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                      {top3[2].officerName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-sm shadow">🥉</div>
                  </div>
                  <p className="text-sm font-bold text-center max-w-[100px] truncate" style={{ color: 'var(--text-secondary)' }}>
                    {top3[2].officerName}
                  </p>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{top3[2].city}</p>
                  <div
                    className="w-24 rounded-t-xl flex flex-col items-center justify-end pb-3"
                    style={{ height: '70px', background: 'linear-gradient(to top, #c2410c, #ea580c)' }}
                  >
                    <p className="text-2xl font-black text-white">{top3[2].resolvedComplaints}</p>
                    <p className="text-xs text-orange-200">resolved</p>
                  </div>
                </div>
              )}
            </div>

            {/* Full ranked list */}
            <div className="space-y-3">
              {leaderboard.map((officer, i) => (
                <div
                  key={i}
                  className="card rounded-2xl p-4 flex items-center gap-4 anim-up"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, rgba(245,158,11,0.05), var(--card-bg))'
                      : 'var(--card-bg)',
                    border: i === 0
                      ? '1px solid rgba(245,158,11,0.25)'
                      : i === 1
                      ? '1px solid rgba(148,163,184,0.2)'
                      : i === 2
                      ? '1px solid rgba(194,65,12,0.2)'
                      : '1px solid var(--border)',
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {/* Rank badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={
                      i === 0
                        ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }
                        : i === 1
                        ? { background: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }
                        : i === 2
                        ? { background: 'rgba(194,65,12,0.12)', color: '#fb923c', border: '1px solid rgba(194,65,12,0.2)' }
                        : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '0.875rem' }
                    }
                  >
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={
                      i < 3
                        ? { background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#fff' }
                        : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                    }
                  >
                    {officer.officerName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {officer.officerName}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {ROLE_LABELS[officer.role] || officer.role}
                      </span>
                      <span className="text-xs flex items-center gap-0.5" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={9} /> {officer.city}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className="text-2xl font-black"
                      style={{ color: i === 0 ? '#fbbf24' : i < 3 ? 'var(--text-primary)' : '#10b981' }}
                    >
                      {officer.resolvedComplaints}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
