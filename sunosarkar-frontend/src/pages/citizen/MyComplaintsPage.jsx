import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ThumbsUp, CheckCircle, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyComplaints, confirmResolved, upvoteComplaint } from '../../lib/api';
import { CATEGORY_ICONS, CATEGORY_LABELS, STATUS_LABELS } from '../../lib/auth';
import { safeArray, extractError, fmtDate, fmtDateShort } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const STATUSES = ['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'];

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    getMyComplaints()
      .then(r => setComplaints(safeArray(r.data)))
      .catch(err => {
        console.error('MyComplaints error:', err?.response?.status, err?.response?.data);
        toast.error(extractError(err, 'Failed to load complaints'));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.title?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleConfirm = async id => {
    try {
      await confirmResolved(id);
      toast.success('Problem confirmed as resolved. Thank you!');
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'CLOSED', isConfirmedResolved: true } : c));
      setSelected(null);
    } catch (err) {
      toast.error(extractError(err, 'Failed to confirm'));
    }
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      await upvoteComplaint(id);
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, upVoteCount: (c.upVoteCount || 0) + 1 } : c));
      toast.success('Upvoted!');
    } catch (err) {
      toast.error(extractError(err, 'Failed to upvote'));
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} dir={isUrdu ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>{t('myComplaints')}</h1>
            <p style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 2 }}>{complaints.length} {isUrdu ? `شکایت${complaints.length !== 1 ? '' : ''}` : `complaint${complaints.length !== 1 ? 's' : ''}`} {isUrdu ? 'کل' : 'total'}</p>
          </div>
          <Link to="/dashboard/citizen/new" className="btn btn-primary btn-sm"><Plus size={14} /> {t('newComplaint')}</Link>
        </div>

        {/* Search + filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder={isUrdu ? 'عنوان، شہر سے تلاش کریں...' : 'Search by title, city, description...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 38, paddingRight: search ? 36 : 12 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)', padding: 2 }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '5px 12px', borderRadius: 99, flexShrink: 0,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: '1px solid',
                  borderColor: statusFilter === s ? '#16a34a' : 'var(--border)',
                  background: statusFilter === s ? '#16a34a' : 'var(--bg-3)',
                  color: statusFilter === s ? '#fff' : 'var(--txt-3)',
                  transition: 'all 0.13s',
                }}
              >
                {s === 'ALL' ? (isUrdu ? 'سب' : 'All') : STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner text="Loading your complaints..." /></div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14,
            padding: '48px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <p style={{ fontSize: 14, color: 'var(--txt-2)', fontWeight: 600 }}>
            {!search && statusFilter === 'ALL' ? t('noComplaintsYet') : isUrdu ? 'کوئی شکایت نہیں ملی' : 'No complaints match your filters'}
            </p>
            {!search && statusFilter === 'ALL' && (
              <Link to="/dashboard/citizen/new" className="btn btn-primary btn-sm" style={{ marginTop: 14, display: 'inline-flex' }}>
                <Plus size={13} /> File First Complaint
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14,
                  padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  animationDelay: `${i * 30}ms`,
                }}
                className="anim-up"
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--bg-3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Priority bar */}
                  {c.priority === 'EMERGENCY' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#dc2626', borderRadius: '14px 0 0 14px' }} />}
                  {c.priority === 'URGENT' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#ea580c', borderRadius: '14px 0 0 14px' }} />}
                  <div style={{
                    width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                    background: 'var(--bg-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>
                    {CATEGORY_ICONS[c.category] || '📋'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                      <span style={{ fontSize: 11, color: 'var(--txt-3)', flexShrink: 0 }}>{fmtDateShort(c.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                      <span style={{ fontSize: 11, color: 'var(--txt-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={10} /> {c.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={e => handleUpvote(c.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--txt-3)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
                  >
                    <ThumbsUp size={12} /> {c.upVoteCount || 0} upvotes
                  </button>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {c.status === 'RESOLVED' && !c.isConfirmedResolved && (
                      <button
                        onClick={e => { e.stopPropagation(); handleConfirm(c.id); }}
                        className="btn btn-sm"
                        style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)', padding: '4px 10px', fontSize: 11 }}
                      >
                        <CheckCircle size={11} /> {t('confirmResolved')}
                      </button>
                    )}
                    {c.photos?.length > 0 && <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>📷 {c.photos.length}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={t('complaintDetails')} size="lg">
        {selected && <ComplaintDetail c={selected} onConfirm={handleConfirm} t={t} />}
      </Modal>
    </DashboardLayout>
  );
}

function ComplaintDetail({ c, onConfirm, t }) {
  const InfoBox = ({ label, value }) => (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 3, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{value ?? '—'}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
          {CATEGORY_ICONS[c.category] || '📋'}
        </div>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--txt)', marginBottom: 8 }}>{c.title}</h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <StatusBadge status={c.status} />
            <PriorityBadge priority={c.priority} />
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.7 }}>
        {c.description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <InfoBox label="Category" value={CATEGORY_LABELS[c.category] || c.category} />
        <InfoBox label="City" value={c.city} />
        <InfoBox label="UC Code" value={c.ucCode} />
        <InfoBox label="Upvotes" value={c.upVoteCount || 0} />
        <InfoBox label="Filed On" value={fmtDate(c.createdAt)} />
        <InfoBox label="Resolved On" value={fmtDate(c.resolvedAt)} />
      </div>

      {c.areaAddress && (
        <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', fontWeight: 600, marginBottom: 4 }}>Area Address</div>
          <div style={{ fontSize: 13, color: 'var(--txt)' }}>{c.areaAddress}</div>
        </div>
      )}

      {c.locationLink && c.locationLink !== 'N/A' && (
        <a href={c.locationLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
          <MapPin size={13} /> View on Google Maps →
        </a>
      )}

      {c.photos?.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Photos ({c.photos.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {c.photos.map((p, i) => (
              <a key={i} href={p.photoUrl} target="_blank" rel="noopener noreferrer">
                <img src={p.photoUrl} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {c.status === 'RESOLVED' && !c.isConfirmedResolved && (
        <button onClick={() => onConfirm(c.id)} className="btn btn-primary" style={{ width: '100%', padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <CheckCircle size={16} /> {t('confirmResolved')}
        </button>
      )}
    </div>
  );
}
