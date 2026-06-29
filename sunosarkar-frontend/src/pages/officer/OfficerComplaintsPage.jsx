import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAreaComplaints, updateComplaintStatus } from '../../lib/api';
import { CATEGORY_ICONS, STATUS_LABELS } from '../../lib/auth';
import { safeArray } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

export default function OfficerComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const { t, isUrdu } = useApp();

  const ucCode = localStorage.getItem('ucCode') || '';

  useEffect(() => {
    setLoading(true);
    getAreaComplaints(ucCode, page, 20)
      .then(r => {
        const arr = safeArray(r.data);
        setComplaints(arr);
        setFiltered(arr);
        setTotalPages(r.data?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(complaints); return; }
    const q = search.toLowerCase();
    setFiltered(complaints.filter(c =>
      c.title.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
    ));
  }, [search, complaints]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return toast.error('Select a status');
    setUpdating(true);
    try {
      await updateComplaintStatus(statusModal.id, newStatus, note);
      toast.success('Status updated!');
      setComplaints(prev => prev.map(c => c.id === statusModal.id ? { ...c, status: newStatus } : c));
      setStatusModal(null);
      setNote('');
      setNewStatus('');
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5" dir={isUrdu ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
              {t('areaComplaints')}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Complaints from your jurisdiction
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div
                className="rounded-2xl py-16 text-center"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                <div className="text-5xl mb-4">📋</div>
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No complaints found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((c, i) => (
                  <div
                    key={c.id}
                    className="card rounded-2xl p-5 anim-up"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: 'var(--bg-elevated)' }}
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
                          {c.user?.fullName && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.user.fullName}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => { setStatusModal(c); setNewStatus(''); setNote(''); }}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-xl text-sm disabled:opacity-40 glass"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  ← Prev
                </button>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-xl text-sm disabled:opacity-40 glass"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Modal */}
      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title={t('updateStatus')}>
        {statusModal && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Complaint:{' '}
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{statusModal.title}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(s => (
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
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional note..."
              rows={3}
              className="input"
            />
            <button
              onClick={handleStatusUpdate}
              disabled={updating || !newStatus}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
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
