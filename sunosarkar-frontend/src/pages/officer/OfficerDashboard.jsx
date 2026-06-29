import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, TrendingUp, AlertTriangle, User, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOfficerDashboard, getOfficerPending, updateComplaintStatus } from '../../lib/api';
import { CATEGORY_ICONS, STATUS_LABELS, ROLE_LABELS } from '../../lib/auth';
import { safeArray } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/ui/StatsCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const STATUSES = ['ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function OfficerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [note, setNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    Promise.all([getOfficerDashboard(), getOfficerPending()])
      .then(([d, p]) => { setDashboard(d.data); setPending(safeArray(p.data)); })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async () => {
    if (!newStatus) return toast.error('Select a status');
    setUpdating(true);
    try {
      await updateComplaintStatus(statusModal.id, newStatus, note);
      toast.success(`Complaint status updated to ${STATUS_LABELS[newStatus]}!`);
      setPending(prev => prev.filter(c => c.id !== statusModal.id));
      setStatusModal(null);
      setNote('');
      setNewStatus('');
      setDashboard(d => ({
        ...d,
        pendingComplaints: d.pendingComplaints - 1,
        inProgressComplaints: d.inProgressComplaints + 1,
      }));
    } catch (err) {
      toast.error(err.response?.data || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading officer dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6" dir={isUrdu ? 'rtl' : 'ltr'}>

        {/* Officer info card */}
        {dashboard && (
          <div
            className="rounded-2xl p-6 anim-up"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0.06) 100%)',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                👮
              </div>
              <div>
                <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                  {dashboard.OfficerName}
                </h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-sm flex items-center gap-1" style={{ color: '#60a5fa' }}>
                    <User size={12} /> {ROLE_LABELS[dashboard.officerRole] || 'Officer'}
                  </span>
                  <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={12} /> {dashboard.officerCity}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    UC: {dashboard.officerUcCode}
                  </span>
                  {dashboard.officerPhone && (
                    <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <Phone size={12} /> {dashboard.officerPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={FileText} label={isUrdu ? 'علاقے میں کل' : 'Total in Area'} value={dashboard?.totalComplaints ?? '—'} color="emerald" delay={0} />
          <StatsCard icon={Clock} label={t('pending')} value={dashboard?.pendingComplaints ?? '—'} color="amber" delay={80} />
          <StatsCard icon={TrendingUp} label={t('inProgress')} value={dashboard?.inProgressComplaints ?? '—'} color="blue" delay={160} />
          <StatsCard icon={CheckCircle} label={t('resolved')} value={dashboard?.resolvedComplaints ?? '—'} color="purple" delay={240} />
        </div>

        {/* Pending complaints */}
        <div
          className="relative rounded-2xl overflow-hidden anim-up"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center justify-between p-5"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Pending Complaints</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Complaints awaiting your action in UC {dashboard?.officerUcCode}
              </p>
            </div>
            {pending.length > 0 && (
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(251,191,36,0.12)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251,191,36,0.2)',
                }}
              >
                {pending.length} pending
              </span>
            )}
          </div>

          {pending.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="font-semibold" style={{ color: '#34d399' }}>All caught up!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No pending complaints in your area</p>
            </div>
          ) : (
            <div>
              {pending.map((c, i) => (
                <div
                  key={c.id}
                  className="p-5 cursor-pointer group anim-fade transition-colors"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    animationDelay: `${i * 50}ms`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelected(c)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: 'rgba(251,191,36,0.08)' }}
                    >
                      {CATEGORY_ICONS[c.category] || '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                        <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {new Date(c.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                        {c.areaAddress}, {c.city}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                        {c.priority === 'EMERGENCY' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#f87171' }}>
                            <AlertTriangle size={10} /> URGENT ACTION NEEDED
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setStatusModal(c); setNewStatus(''); setNote(''); }}
                      className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{
                        background: 'rgba(59,130,246,0.08)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59,130,246,0.2)',
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Complaint detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={t('complaintDetails')} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{CATEGORY_ICONS[selected.category] || '📋'}</div>
              <div>
                <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{selected.title}</h3>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority} />
                </div>
              </div>
            </div>
            <div
              className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              {selected.description}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { l: 'City', v: selected.city }, { l: 'UC Code', v: selected.ucCode },
                { l: 'Area', v: selected.areaAddress }, { l: 'Upvotes', v: selected.upVoteCount || 0 },
                { l: 'Filed', v: new Date(selected.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' }) },
                { l: 'Citizen', v: selected.user?.fullName || 'Unknown' },
              ].map(({ l, v }) => (
                <div key={l} className="rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</p>
                  <p className="font-semibold mt-0.5 text-sm" style={{ color: 'var(--text-primary)' }}>{v}</p>
                </div>
              ))}
            </div>
            {selected.photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selected.photos.map((p, i) => (
                  <a key={i} href={p.photoUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={p.photoUrl} alt=""
                      className="w-full h-24 object-cover rounded-xl"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </a>
                ))}
              </div>
            )}
            <button
              onClick={() => { setSelected(null); setStatusModal(selected); }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              Update Status
            </button>
          </div>
        )}
      </Modal>

      {/* Status update modal */}
      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title={t('updateStatus')}>
        {statusModal && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Updating: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{statusModal.title}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className="p-3 rounded-xl text-sm font-semibold transition-all"
                  style={
                    newStatus === s
                      ? { border: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }
                      : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                  }
                >
                  {STATUS_LABELS[s] || s}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note about this update..."
                rows={3}
                className="input"
              />
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || !newStatus}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              {updating ? <LoadingSpinner size="sm" /> : 'Update Status'}
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
