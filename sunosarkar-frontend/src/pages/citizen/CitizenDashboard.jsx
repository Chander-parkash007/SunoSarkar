import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, CheckCircle, Clock, TrendingUp, AlertTriangle, ArrowRight, ThumbsUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getMyComplaints } from '../../lib/api';
import { getFullName, CATEGORY_ICONS, CATEGORY_LABELS } from '../../lib/auth';
import { safeArray, fmtDateShort, extractError } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING:     { color: '#ca8a04', bg: 'rgba(202,138,4,0.12)',   border: 'rgba(202,138,4,0.25)' },
  ACCEPTED:    { color: '#2563eb', bg: 'rgba(37,99,235,0.12)',   border: 'rgba(37,99,235,0.25)' },
  IN_PROGRESS: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)',  border: 'rgba(124,58,237,0.25)' },
  RESOLVED:    { color: '#16a34a', bg: 'rgba(22,163,74,0.12)',   border: 'rgba(22,163,74,0.25)' },
  CLOSED:      { color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.2)' },
  REJECTED:    { color: '#dc2626', bg: 'rgba(220,38,38,0.12)',   border: 'rgba(220,38,38,0.25)' },
};

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = getFullName();
  const { t, isUrdu, theme } = useApp();
  const isDark = theme === 'dark';

  useEffect(() => {
    getMyComplaints()
      .then(r => setComplaints(safeArray(r.data)))
      .catch(err => toast.error(extractError(err, 'Failed to load complaints')))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === 'PENDING').length,
    accepted:   complaints.filter(c => c.status === 'ACCEPTED').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved:   complaints.filter(c => ['RESOLVED','CLOSED'].includes(c.status)).length,
    rejected:   complaints.filter(c => c.status === 'REJECTED').length,
  };

  const resolutionPct = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const activePct     = stats.total > 0 ? Math.round(((stats.pending + stats.accepted + stats.inProgress) / stats.total) * 100) : 0;

  // Pie chart data
  const pieData = [
    { name: t('pending'),    value: stats.pending,    color: '#ca8a04' },
    { name: t('accepted'),   value: stats.accepted,   color: '#2563eb' },
    { name: t('inProgress'), value: stats.inProgress, color: '#7c3aed' },
    { name: t('resolved'),   value: stats.resolved,   color: '#16a34a' },
    { name: t('rejected'),   value: stats.rejected,   color: '#dc2626' },
  ].filter(d => d.value > 0);

  // Category bar chart data
  const catCounts = {};
  complaints.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });
  const barData = Object.entries(catCounts)
    .map(([cat, count]) => ({ name: CATEGORY_LABELS[cat]?.replace(/[^\w ]/g,'').trim() || cat, count, icon: CATEGORY_ICONS[cat] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const tooltipStyle = {
    background: isDark ? '#161616' : '#fff',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 12,
    color: 'var(--txt)',
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} dir={isUrdu ? 'rtl' : 'ltr'}>

        {/* ── Greeting ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)', marginBottom: 4, letterSpacing: '-0.02em' }}>
              {t('welcomeBack2')}, <span style={{ color: 'var(--green-bright)' }}>{name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--txt-3)' }}>
              {isUrdu ? 'آپ کی شہری شکایات کا جائزہ' : "Overview of your civic complaints"}
            </p>
          </div>
          <Link to="/dashboard/citizen/new" className="btn btn-primary btn-sm">
            <Plus size={14} /> {t('newComplaint')}
          </Link>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { icon: FileText,    label: t('totalFiled'),  value: stats.total,      color: '#16a34a',  bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.2)' },
            { icon: Clock,       label: t('pending'),     value: stats.pending,    color: '#ca8a04',  bg: 'rgba(202,138,4,0.08)',   border: 'rgba(202,138,4,0.2)' },
            { icon: TrendingUp,  label: t('inProgress'),  value: stats.inProgress + stats.accepted, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
            { icon: CheckCircle, label: t('resolved'),    value: stats.resolved,   color: '#16a34a',  bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.2)' },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} style={{ padding: '18px 16px', background: bg, border: `1px solid ${border}`, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 8 }}>{label}</p>
                  <p style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, color, letterSpacing: '-0.03em' }}>{value}</p>
                  {stats.total > 0 && (
                    <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>
                      {stats.total > 0 ? Math.round((value / stats.total) * 100) : 0}%
                    </p>
                  )}
                </div>
                <div style={{ padding: 10, borderRadius: 10, background: `${color}20`, flexShrink: 0 }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress Bar + Percentages ── */}
        {stats.total > 0 && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{t('resolutionProgress')}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--green-bright)', letterSpacing: '-0.03em' }}>{resolutionPct}%</span>
            </div>

            {/* Stacked bar */}
            <div style={{ height: 10, background: 'var(--bg-4)', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
              {pieData.map(({ value, color }) => (
                <div key={color} style={{ height: '100%', width: `${(value / stats.total) * 100}%`, background: color, transition: 'width 0.8s ease' }} />
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
              {pieData.map(({ name, value, color }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--txt-3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span>{name}</span>
                  <span style={{ fontWeight: 700, color }}>{value} ({Math.round((value/stats.total)*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Charts Row ── */}
        {stats.total > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: barData.length > 0 ? '1fr 1fr' : '1fr', gap: 12 }}>

            {/* Pie Chart */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 12 }}>
                {isUrdu ? 'حالت کے مطابق تقسیم' : 'Status Breakdown'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {pieData.map(({ name, value, color }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: 'var(--txt-2)' }}>{name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
                        <span style={{ fontSize: 10, color: 'var(--txt-3)' }}>({Math.round((value/stats.total)*100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart — by category */}
            {barData.length > 0 && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 12 }}>
                  {isUrdu ? 'زمرے کے مطابق شکایات' : 'By Category'}
                </p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--txt-3)' }} interval={0} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--txt-3)' }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="var(--green-bright)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* ── Recent Complaints ── */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{t('recentComplaints')}</span>
            <Link to="/dashboard/citizen/complaints" style={{ fontSize: 12, color: 'var(--green-bright)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              {t('viewAll')} <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner text={t('loading')} />
            </div>
          ) : complaints.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-2)', marginBottom: 4 }}>{t('noComplaintsYet')}</p>
              <p style={{ fontSize: 13, color: 'var(--txt-3)', marginBottom: 16 }}>
                {isUrdu ? 'اپنی پہلی شکایت درج کریں اور فرق ڈالیں' : 'File your first complaint and make a difference'}
              </p>
              <Link to="/dashboard/citizen/new" className="btn btn-primary btn-sm">
                <Plus size={13} /> {t('fileFirstComplaint')}
              </Link>
            </div>
          ) : (
            complaints.slice(0, 5).map((c, i) => (
              <div key={c.id} style={{
                padding: '14px 18px',
                borderBottom: i < Math.min(4, complaints.length - 1) ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                transition: 'background 0.13s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'var(--green-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {CATEGORY_ICONS[c.category] || '📋'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--txt-3)', flexShrink: 0 }}>{fmtDateShort(c.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.areaAddress}, {c.city}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                    {c.upVoteCount > 0 && (
                      <span style={{ fontSize: 11, color: 'var(--txt-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <ThumbsUp size={10} /> {c.upVoteCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { to: '/dashboard/citizen/new', icon: Plus,          label: t('newComplaint'), desc: isUrdu ? 'نئی شکایت درج کریں' : 'Report a new issue',    color: '#16a34a' },
            { to: '/complaints/public',     icon: TrendingUp,    label: t('complaints'),   desc: isUrdu ? 'تمام شکایات دیکھیں' : 'See all complaints',    color: '#2563eb' },
            { to: '/emergency',             icon: AlertTriangle, label: t('emergency'),    desc: isUrdu ? 'ہنگامی رابطے'        : 'Emergency contacts',    color: '#dc2626' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} style={{
              display: 'block', padding: '14px 12px',
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{desc}</div>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
