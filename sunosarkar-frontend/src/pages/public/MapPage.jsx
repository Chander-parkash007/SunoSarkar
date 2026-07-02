import { useState, useEffect, useRef } from 'react';
import { MapPin, RefreshCw, Filter } from 'lucide-react';
import { getPublicComplaints } from '../../lib/api';
import { PAKISTAN_CITIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Pakistan city coordinates
const CITY_COORDS = {
  'Karachi':     [24.8607, 67.0011],
  'Lahore':      [31.5204, 74.3587],
  'Islamabad':   [33.6844, 73.0479],
  'Rawalpindi':  [33.5651, 73.0169],
  'Faisalabad':  [31.4504, 73.1350],
  'Multan':      [30.1575, 71.5249],
  'Peshawar':    [34.0150, 71.5249],
  'Quetta':      [30.1798, 66.9750],
  'Sialkot':     [32.4945, 74.5229],
  'Gujranwala':  [32.1877, 74.1945],
  'Hyderabad':   [25.3960, 68.3578],
  'Sargodha':    [32.0836, 72.6711],
  'Bahawalpur':  [29.3956, 71.6722],
  'Abbottabad':  [34.1490, 73.2117],
  'Sukkur':      [27.7052, 68.8574],
};

const STATUS_COLORS = {
  PENDING:     '#ca8a04',
  ACCEPTED:    '#2563eb',
  IN_PROGRESS: '#7c3aed',
  RESOLVED:    '#16a34a',
  CLOSED:      '#16a34a',
  REJECTED:    '#dc2626',
};

const CATEGORY_NAMES = {
  ROAD: 'Road', WATER: 'Water', ELECTRICITY: 'Electricity',
  SANITATION: 'Sanitation', GARBAGE: 'Garbage', SEWAGE: 'Sewage',
  STREE_LIGHT: 'Street Light', PARK: 'Park', OTHER: 'Other',
};

// Add small random offset so pins don't stack exactly
function jitter(coord) {
  return coord + (Math.random() - 0.5) * 0.03;
}

export default function MapPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Karachi');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const { t, isUrdu, theme } = useApp();
  const isDark = theme === 'dark';

  // Load complaints
  const loadComplaints = () => {
    setLoading(true);
    getPublicComplaints(city, 0, 100)
      .then(r => setComplaints(r.data?.content || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadComplaints(); }, [city]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then(L => {
      // Fix default icon path
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const coords = CITY_COORDS[city] || [30.3753, 69.3451];
      const map = L.map(mapRef.current, {
        center: coords,
        zoom: 12,
        zoomControl: true,
      });

      // Dark or light tile layer
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when city changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const coords = CITY_COORDS[city] || [30.3753, 69.3451];
    mapInstanceRef.current.setView(coords, 12);
  }, [city]);

  // Add markers when complaints load
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    import('leaflet').then(L => {
      // Clear existing markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const filtered = complaints.filter(c =>
        statusFilter === 'ALL' || c.status === statusFilter
      );

      filtered.forEach(c => {
        const baseCoords = CITY_COORDS[c.city] || CITY_COORDS[city] || [30.3753, 69.3451];
        const lat = jitter(baseCoords[0]);
        const lng = jitter(baseCoords[1]);
        const color = STATUS_COLORS[c.status] || '#71717a';
        const icon = CATEGORY_ICONS[c.category] || '📋';

        // Custom colored circle marker
        const markerIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: 36px; height: 36px; border-radius: 50%;
              background: ${color}22; border: 2.5px solid ${color};
              display: flex; align-items: center; justify-content: center;
              font-size: 16px; cursor: pointer;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              transition: transform 0.15s;
            " title="${c.title}">
              ${icon}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstanceRef.current);
        marker.on('click', () => setSelected(c));
        markersRef.current.push(marker);
      });
    });
  }, [complaints, mapReady, statusFilter]);

  const filteredCount = complaints.filter(c =>
    statusFilter === 'ALL' || c.status === statusFilter
  ).length;

  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Controls bar */}
      <div style={{
        marginTop: 64, padding: '12px 20px',
        background: 'var(--bg-2)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flexShrink: 0,
      }}>
        {/* City selector */}
        <select value={city} onChange={e => setCity(e.target.value)} className="input" style={{ width: 160 }}>
          {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1px solid',
              borderColor: statusFilter === s ? (STATUS_COLORS[s] || 'var(--green-bright)') : 'var(--border)',
              background: statusFilter === s ? `${STATUS_COLORS[s] || '#16a34a'}18` : 'var(--bg-3)',
              color: statusFilter === s ? (STATUS_COLORS[s] || 'var(--green-bright)') : 'var(--txt-3)',
              transition: 'all 0.13s',
            }}>
              {s === 'ALL' ? `All (${complaints.length})` : `${s.replace('_', ' ')} (${statusCounts[s] || 0})`}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button onClick={loadComplaints} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)',
          color: 'var(--txt-2)', fontSize: 13, cursor: 'pointer',
        }}>
          <RefreshCw size={13} /> Refresh
        </button>

        {/* Count */}
        <span style={{ fontSize: 13, color: 'var(--txt-3)', marginLeft: 'auto' }}>
          {isUrdu ? `${filteredCount} شکایات نقشے پر` : `${filteredCount} complaints on map`}
        </span>
      </div>

      {/* Map container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Leaflet CSS */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Loading overlay */}
        {loading && (
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 16px', zIndex: 1000,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <LoadingSpinner size="sm" />
            <span style={{ fontSize: 13, color: 'var(--txt-2)' }}>
              {isUrdu ? 'لوڈ ہو رہا ہے...' : 'Loading complaints...'}
            </span>
          </div>
        )}

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 24, left: 16, zIndex: 1000,
          background: 'var(--bg-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 6,
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt-3)', marginBottom: 4 }}>
            {isUrdu ? 'حالت' : 'Status'}
          </div>
          {Object.entries(STATUS_COLORS).filter(([k]) => k !== 'CLOSED').map(([status, color]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--txt-2)' }}>{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>

        {/* Selected complaint panel */}
        {selected && (
          <div style={{
            position: 'absolute', top: 16, right: 16, zIndex: 1000,
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '16px 18px', width: 300,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{CATEGORY_ICONS[selected.category] || '📋'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{CATEGORY_NAMES[selected.category] || selected.category}</div>
                  <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{selected.city}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)', fontSize: 18, lineHeight: 1 }}>×</button>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 8, lineHeight: 1.4 }}>{selected.title}</h3>

            <p style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {selected.description}
            </p>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <StatusBadge status={selected.status} />
              <PriorityBadge priority={selected.priority} />
            </div>

            <div style={{ fontSize: 11, color: 'var(--txt-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} /> {selected.areaAddress}
            </div>

            {selected.upVoteCount > 0 && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--txt-3)' }}>
                👍 {selected.upVoteCount} {isUrdu ? 'ووٹ' : 'upvotes'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
