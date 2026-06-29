import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { getCityStats, getCategoryBreakdown, getStatusBreakdown } from '../../lib/api';
import { PAKISTAN_CITIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const STATUS_COLORS = {
  PENDING: '#fbbf24', ACCEPTED: '#60a5fa', IN_PROGRESS: '#c084fc',
  RESOLVED: '#34d399', REJECTED: '#f87171', CLOSED: '#94a3b8',
};

export default function CityStatsPage() {
  const [city, setCity] = useState('Karachi');
  const [stats, setStats] = useState(null);
  const [catBreakdown, setCatBreakdown] = useState({});
  const [statusBreakdown, setStatusBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const { t, isUrdu, theme } = useApp();
  const isDark = theme === 'dark';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCityStats(city),
      getCategoryBreakdown(city),
      getStatusBreakdown(city),
    ])
      .then(([s, c, st]) => {
        setStats(s.data);
        setCatBreakdown(c.data);
        setStatusBreakdown(st.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city]);

  const categoryChartData = Object.entries(catBreakdown)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8', icon: CATEGORY_ICONS[name] || '📋' }))
    .sort((a, b) => b.value - a.value);

  const statusChartData = Object.entries(statusBreakdown)
    .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#94a3b8' }));

  const tooltipStyle = {
    background: isDark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '12px',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '88px 20px 64px' }}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-sm font-semibold mb-3" style={{ color: '#10b981' }}>
              <BarChart3 size={13} /> City Statistics
            </div>
            <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
              {city} <span className="gradient-text">Stats</span>
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Live complaint data and resolution metrics</p>
          </div>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="input"
            style={{ minWidth: '180px', maxWidth: '200px' }}
          >
            {PAKISTAN_CITIES.map(c => (
              <option key={c} value={c} className="bg-[var(--bg-elevated)]">{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" text={`Loading ${city} stats...`} /></div>
        ) : !stats ? (
          <div className="text-center py-24">
            <BarChart3 size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No data available for {city}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BarChart3, label: 'Total Complaints', value: stats.totalComplaints, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
                { icon: Clock, label: 'Pending', value: stats.pendingComplaints, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
                { icon: CheckCircle, label: 'Resolved', value: stats.resolvedComplaints, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
                { icon: TrendingUp, label: 'Resolution Rate', value: stats.resolutionRate, color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
              ].map(({ icon: Icon, label, value, color, bg, border }) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-2xl p-5 anim-up"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl" style={{ background: bg }} />
                  <div className="relative">
                    <Icon size={20} className="mb-3" style={{ color }} />
                    <p className="text-3xl font-black" style={{ color }}>{value}</p>
                    <p className="text-xs mt-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra stats row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: TrendingUp, label: 'In Progress', value: stats.inProgressComplaints, color: '#60a5fa' },
                { icon: AlertTriangle, label: 'Emergency', value: stats.emergencyComplaints, color: '#f87171' },
                { icon: XCircle, label: 'Rejected', value: stats.rejectedComplaints ?? '—', color: '#94a3b8' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="card rounded-2xl p-4"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                >
                  <Icon size={18} className="mb-2" style={{ color }} />
                  <p className="text-2xl font-black" style={{ color }}>{value}</p>
                  <p className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Category Breakdown Bar Chart */}
              <div
                className="card rounded-2xl p-5 anim-up"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', animationDelay: '100ms' }}
              >
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Complaints by Category</h3>
                {categoryChartData.length === 0 ? (
                  <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>No category data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={categoryChartData} margin={{ top: 0, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--bg-hover)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {categoryChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Status Donut Chart */}
              <div
                className="card rounded-2xl p-5 anim-up"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', animationDelay: '200ms' }}
              >
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Complaints by Status</h3>
                {statusChartData.length === 0 ? (
                  <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>No status data yet</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusChartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {statusChartData.map(({ name, value, color }) => (
                        <div key={name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span style={{ color: 'var(--text-secondary)' }}>{name}</span>
                          </div>
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Top categories list */}
            {categoryChartData.length > 0 && (
              <div
                className="card rounded-2xl p-5 anim-up"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', animationDelay: '300ms' }}
              >
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Category Breakdown</h3>
                <div className="space-y-3">
                  {categoryChartData.map(({ name, value, color, icon }) => {
                    const pct = stats.totalComplaints > 0 ? Math.round((value / stats.totalComplaints) * 100) : 0;
                    return (
                      <div key={name}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <div className="flex items-center gap-2">
                            <span>{icon}</span>
                            <span style={{ color: 'var(--text-primary)' }}>{name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold" style={{ color }}>{value}</span>
                            <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
