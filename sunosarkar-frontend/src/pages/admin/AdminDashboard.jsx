import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, FileText, CheckCircle, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetStats, adminGetPendingOfficers, adminVerifyOfficer } from '../../lib/api';
import { ROLE_LABELS } from '../../lib/auth';
import { safeArray } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingOfficers, setPendingOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    Promise.all([adminGetStats(), adminGetPendingOfficers()])
      .then(([s, p]) => { setStats(s.data); setPendingOfficers(safeArray(p.data)); })
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      await adminVerifyOfficer(id);
      toast.success('Officer verified! They can now login.');
      setPendingOfficers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      toast.error('Failed to verify officer');
    } finally {
      setVerifying(null);
    }
  };

  const pieData = stats ? [
    { name: 'Pending',     value: stats.pendingComplaints,  color: '#fbbf24' },
    { name: 'In Progress', value: stats.inProgress,          color: '#60a5fa' },
    { name: 'Resolved',    value: stats.resolvedComplaints,  color: '#34d399' },
    { name: 'Rejected',    value: stats.rejectedComplaints,  color: '#f87171' },
  ].filter(d => d.value > 0) : [];

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6" dir={isUrdu ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
              Admin <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Platform-wide overview and management
            </p>
          </div>
          {pendingOfficers.length > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold animate-pulse"
              style={{
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              <AlertTriangle size={16} />
              {pendingOfficers.length} officer{pendingOfficers.length > 1 ? 's' : ''} awaiting approval
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={Users} label={t('totalUsers')} value={stats?.totalUser} color="emerald" delay={0} />
          <StatsCard icon={Shield} label={t('totalOfficers')} value={stats?.totalOfficers} color="blue" delay={80} />
          <StatsCard icon={FileText} label={t('totalComplaints')} value={stats?.totalComplaints} color="amber" delay={160} />
          <StatsCard icon={CheckCircle} label={t('resolved')} value={stats?.resolvedComplaints} color="purple" trend={stats?.resolutionRate} delay={240} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pie chart */}
          <div
            className="card rounded-2xl p-5 anim-up"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Complaints Breakdown</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={3} dataKey="value"
                    >
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No data yet</p>
            )}
          </div>

          {/* Quick actions */}
          <div
            className="lg:col-span-2 card rounded-2xl p-5 anim-up"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: '/dashboard/admin/officers', icon: Shield, label: 'Manage Officers', desc: 'Verify & review', color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
                { to: '/dashboard/admin/users', icon: Users, label: 'Manage Users', desc: 'View & deactivate', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
                { to: '/dashboard/admin/complaints', icon: FileText, label: 'All Complaints', desc: 'Platform-wide view', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.15)' },
                { to: '/leaderboard', icon: TrendingUp, label: t('leaderboard'), desc: 'Officer rankings', color: '#c084fc', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)' },
              ].map(({ to, icon: Icon, label, desc, color, bg, border }) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-xl p-4 block group transition-all"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                    style={{ background: bg }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Pending officer approvals */}
        {pendingOfficers.length > 0 && (
          <div
            className="relative rounded-2xl overflow-hidden anim-up"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.04), rgba(251,146,60,0.04))',
              border: '1px solid rgba(251,191,36,0.2)',
            }}
          >
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid rgba(251,191,36,0.15)' }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} style={{ color: '#fbbf24' }} />
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Officers Awaiting Approval</h3>
              </div>
              <Link
                to="/dashboard/admin/officers"
                className="text-xs flex items-center gap-1 hover:opacity-80"
                style={{ color: '#fbbf24' }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div>
              {pendingOfficers.slice(0, 5).map((o, i) => (
                <div
                  key={o.id}
                  className="flex items-center gap-4 p-4 transition-colors"
                  style={{ borderBottom: i < pendingOfficers.slice(0, 5).length - 1 ? '1px solid rgba(251,191,36,0.08)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'rgba(251,191,36,0.1)' }}
                  >
                    👮
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{o.fullName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {ROLE_LABELS[o.role]} · {o.city} · UC {o.ucCode}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{o.email}</p>
                  </div>
                  <button
                    onClick={() => handleVerify(o.id)}
                    disabled={verifying === o.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    style={{
                      background: 'rgba(16,185,129,0.12)',
                      color: '#34d399',
                      border: '1px solid rgba(16,185,129,0.2)',
                    }}
                  >
                    {verifying === o.id ? <LoadingSpinner size="sm" /> : '✓ Approve'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform health */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Resolution Rate', value: stats?.resolutionRate || '0%', icon: '📈', color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)', desc: 'Of all complaints' },
            { label: 'Pending Complaints', value: stats?.pendingComplaints || 0, icon: '⏳', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.15)', desc: 'Awaiting action' },
            { label: 'Rejected Complaints', value: stats?.rejectedComplaints || 0, icon: '❌', color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', desc: 'Could not be addressed' },
          ].map(({ label, value, icon, color, bg, border, desc }) => (
            <div
              key={label}
              className="card rounded-2xl p-5 anim-up"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-2xl font-black" style={{ color }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
