import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ThumbsUp, RefreshCw, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPublicComplaints, upvoteComplaint } from '../../lib/api';
import { PAKISTAN_CITIES, CATEGORY_ICONS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const CATEGORY_NAMES_LOCAL = {
  ROAD: 'Road', WATER: 'Water', ELECTRICITY: 'Electricity', SANITATION: 'Sanitation',
  GARBAGE: 'Garbage', SEWAGE: 'Sewage', STREE_LIGHT: 'Street Light', PARK: 'Park', OTHER: 'Other',
};

export default function PublicFeedPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Karachi');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [upvoted, setUpvoted] = useState(new Set());
  const { t, isUrdu } = useApp();

  const load = useCallback(() => {
    setLoading(true);
    getPublicComplaints(city, page, 12)
      .then(r => {
        setComplaints(r.data.content || r.data);
        setTotalPages(r.data.totalPages || 1);
        setTotal(r.data.totalElements || r.data.length || 0);
      })
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false));
  }, [city, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [city]);

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    if (upvoted.has(id)) return;
    try {
      await upvoteComplaint(id);
      setUpvoted(prev => new Set([...prev, id]));
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, upVoteCount: (c.upVoteCount || 0) + 1 } : c));
    } catch {
      toast.error('Already upvoted or login required');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '88px 20px 64px' }}>

        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-green text-sm font-semibold mb-4"
            style={{ color: '#10b981' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Complaint Feed
          </div>
          <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
            Public <span className="gradient-text">Complaints</span>
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Showing {total} complaints from {city} — fully transparent, fully public
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="input min-w-[160px]"
            style={{ maxWidth: '220px' }}
          >
            {PAKISTAN_CITIES.map(c => (
              <option key={c} value={c} className="bg-[var(--bg-elevated)]">{c}</option>
            ))}
          </select>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors glass"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading complaints..." />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
              No complaints found for {city}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Try selecting a different city</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="relative card rounded-2xl p-5 cursor-pointer group anim-up overflow-hidden"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {/* Priority strip */}
                {c.priority === 'EMERGENCY' && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                )}
                {c.priority === 'URGENT' && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
                )}

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {CATEGORY_ICONS[c.category] || '📋'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {CATEGORY_NAMES_LOCAL[c.category] || c.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <h3 className="font-bold text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                  {c.title}
                </h3>
                <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {c.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={10} /> {c.city}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div
                  className="flex items-center justify-between mt-3 pt-3"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <PriorityBadge priority={c.priority} />
                  <button
                    onClick={(e) => handleUpvote(c.id, e)}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                    style={{ color: upvoted.has(c.id) ? '#10b981' : 'var(--text-muted)' }}
                  >
                    <ThumbsUp size={12} className={upvoted.has(c.id) ? 'fill-current' : ''} />
                    {c.upVoteCount || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 glass"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              ← Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                  style={
                    page === i
                      ? { background: '#10b981', color: '#fff' }
                      : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 glass"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={t('complaintDetails')} size="lg">
        {selected && (
          <div className="space-y-5">
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
                { l: 'City', v: selected.city },
                { l: 'UC Code', v: selected.ucCode },
                { l: 'Category', v: CATEGORY_NAMES_LOCAL[selected.category] },
                { l: 'Upvotes', v: selected.upVoteCount || 0 },
                { l: 'Filed On', v: new Date(selected.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' }) },
                { l: 'Resolved', v: selected.resolvedAt ? '✓ ' + new Date(selected.resolvedAt).toLocaleDateString('en-PK', { dateStyle: 'medium' }) : 'Not yet' },
              ].map(({ l, v }) => (
                <div key={l} className="rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{v}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Area Address</p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{selected.areaAddress}</p>
            </div>

            {selected.locationLink && selected.locationLink !== 'N/A' && (
              <a
                href={selected.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#10b981' }}
              >
                <MapPin size={14} /> View on Google Maps <ExternalLink size={12} />
              </a>
            )}

            {selected.photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selected.photos.map((p, i) => (
                  <a key={i} href={p.photoUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={p.photoUrl} alt=""
                      className="w-full h-24 object-cover rounded-xl transition-colors"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
