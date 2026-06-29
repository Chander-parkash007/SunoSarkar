import { useState, useEffect } from 'react';
import { Search, UserX, Mail, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetUsers, adminDeactivateUser } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { safeArray } from '../../lib/utils';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const { t, isUrdu } = useApp();
  useEffect(() => {
    adminGetUsers()
      .then(r => { const arr = safeArray(r.data); setUsers(arr); setFiltered(arr); })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.city?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await adminDeactivateUser(confirmDeactivate.id);
      toast.success('User deactivated successfully.');
      setUsers(prev => prev.map(u => u.id === confirmDeactivate.id ? { ...u, active: false } : u));
      setConfirmDeactivate(null);
    } catch (err) {
      toast.error('Failed to deactivate user');
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5" dir={isUrdu ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Manage Users</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {users.length} total registered citizens
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl py-16 text-center"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <div className="text-5xl mb-4">👤</div>
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No users found</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((u, i) => (
              <div
                key={u.id}
                className="card rounded-2xl p-4 flex items-center gap-4 anim-up"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={
                    u.active !== false
                      ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' }
                      : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                  }
                >
                  {u.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.fullName}</p>
                    {u.active === false && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                      >
                        Deactivated
                      </span>
                    )}
                    {u.emailVerified && (
                      <span className="text-xs" style={{ color: '#10b981' }}>✓ Verified</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Mail size={10} />{u.email}</span>
                    {u.city && <span className="flex items-center gap-1"><MapPin size={10} />{u.city}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(u.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>

                {u.active !== false && (
                  <button
                    onClick={() => setConfirmDeactivate(u)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.18)',
                    }}
                  >
                    <UserX size={13} /> Deactivate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm deactivation modal */}
      <Modal isOpen={!!confirmDeactivate} onClose={() => setConfirmDeactivate(null)} title={isUrdu ? 'غیر فعال کرنے کی تصدیق' : 'Confirm Deactivation'}>
        {confirmDeactivate && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.18)',
                color: '#f87171',
              }}
            >
              Are you sure you want to deactivate{' '}
              <strong>{confirmDeactivate.fullName}</strong>? They will no longer be able to access the platform.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeactivate(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold glass"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: '#ef4444' }}
              >
                {deactivating ? <LoadingSpinner size="sm" /> : 'Deactivate User'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
