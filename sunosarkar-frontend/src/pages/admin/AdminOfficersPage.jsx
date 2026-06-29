import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetOfficers, adminVerifyOfficer } from '../../lib/api';
import { ROLE_LABELS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import { safeArray } from '../../lib/utils';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminOfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [verifying, setVerifying] = useState(null);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    adminGetOfficers()
      .then(r => { const arr = safeArray(r.data); setOfficers(arr); setFiltered(arr); })
      .catch(() => toast.error('Failed to load officers'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = officers;
    if (filter === 'PENDING') list = list.filter(o => !o.isVerifiedByAdmin);
    else if (filter === 'VERIFIED') list = list.filter(o => o.isVerifiedByAdmin);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.fullName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, filter, officers]);

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      await adminVerifyOfficer(id);
      toast.success('Officer approved!');
      setOfficers(prev => prev.map(o => o.id === id ? { ...o, isVerifiedByAdmin: true } : o));
    } catch {
      toast.error('Failed to verify');
    } finally {
      setVerifying(null);
    }
  };

  const pending = officers.filter(o => !o.isVerifiedByAdmin).length;

  return (
    <DashboardLayout>
      <div className="space-y-5" dir={isUrdu ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Manage Officers</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {officers.length} total officers · {pending} pending approval
            </p>
          </div>
          {pending > 0 && (
            <div
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              ⚠️ {pending} pending
            </div>
          )}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search officers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'VERIFIED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={
                  filter === f
                    ? { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' }
                    : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((o, i) => (
              <div
                key={o.id}
                className="card rounded-2xl p-4 flex items-center gap-4 anim-up"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={
                    o.isVerifiedByAdmin
                      ? { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.18)' }
                      : { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.18)' }
                  }
                >
                  👮
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{o.fullName}</p>
                    {o.isVerifiedByAdmin ? (
                      <span className="text-xs flex items-center gap-1" style={{ color: '#10b981' }}>
                        <CheckCircle size={10} /> Verified
                      </span>
                    ) : (
                      <span className="text-xs flex items-center gap-1" style={{ color: '#fbbf24' }}>
                        <Clock size={10} /> Pending
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{ROLE_LABELS[o.role] || o.role}</span>
                    <span>{o.city}</span>
                    <span>UC: {o.ucCode}</span>
                    <span>{o.email}</span>
                  </div>
                  {o.jurisdictionArea && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{o.jurisdictionArea}</p>
                  )}
                </div>

                {!o.isVerifiedByAdmin && (
                  <button
                    onClick={() => handleVerify(o.id)}
                    disabled={verifying === o.id}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    style={{
                      background: 'rgba(16,185,129,0.1)',
                      color: '#10b981',
                      border: '1px solid rgba(16,185,129,0.2)',
                    }}
                  >
                    {verifying === o.id ? <LoadingSpinner size="sm" /> : <><CheckCircle size={15} /> Approve</>}
                  </button>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div
                className="rounded-2xl py-16 text-center"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                <Shield size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No officers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
