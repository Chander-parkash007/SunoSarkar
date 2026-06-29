import { useState, useEffect } from 'react';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';
import { getEmergencyContacts } from '../../lib/api';
import { PAKISTAN_CITIES } from '../../lib/auth';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORY_ICONS_MAP = {
  POLICE: '👮', FIRE: '🚒', AMBULANCE: '🚑', RESCUE: '🚨', OTHER: '📞',
};

const NATIONAL_NUMBERS = [
  { name: 'Police',              number: '15',            icon: '👮', color: '#60a5fa',  bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.2)' },
  { name: 'Rescue / Ambulance',  number: '1122',          icon: '🚑', color: '#10b981',  bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' },
  { name: 'Fire Brigade',        number: '16',            icon: '🔥', color: '#f87171',  bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.2)' },
  { name: 'Edhi Ambulance',      number: '115',           icon: '🚑', color: '#fbbf24',  bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.2)' },
  { name: 'NADRA',               number: '051-111-786-100', icon: '🪪', color: '#c084fc', bg: 'rgba(168,85,247,0.07)', border: 'rgba(168,85,247,0.2)' },
  { name: 'Electricity Complaints', number: '118',        icon: '⚡', color: '#facc15',  bg: 'rgba(234,179,8,0.07)',  border: 'rgba(234,179,8,0.2)' },
];

export default function EmergencyPage() {
  const [city, setCity] = useState('Karachi');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, isUrdu } = useApp();

  useEffect(() => {
    setLoading(true);
    getEmergencyContacts(city)
      .then(r => setContacts(r.data))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, [city]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isUrdu ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '88px 20px 64px' }}>

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            <AlertTriangle size={14} /> {t('emergencyHelplines')}
          </div>
          <h1 className="text-5xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Emergency <span style={{ color: '#f87171' }}>{t('emergencyContacts')}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Quick access to emergency services — save these numbers, they could save your life
          </p>
        </div>

        {/* National numbers */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
            {t('nationalNumbers')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {NATIONAL_NUMBERS.map(({ name, number, icon, color, bg, border }) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="card rounded-2xl p-4 group block"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{name}</p>
                    <p className="text-2xl font-black" style={{ color }}>{number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color }}>
                  <Phone size={10} /> {t('tapToCall')}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* City-specific contacts */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              {t('citySpecific')}
            </h2>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="input"
              style={{ maxWidth: '180px', width: 'auto' }}
            >
              {PAKISTAN_CITIES.map(c => (
                <option key={c} value={c} className="bg-[var(--bg-elevated)]">{c}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text={`Loading ${city} contacts...`} />
            </div>
          ) : contacts.length === 0 ? (
            <div
              className="card rounded-2xl py-16 text-center"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
            >
              <Phone size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No specific contacts found for {city}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Use the national numbers above</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {contacts.map((contact, i) => {
                const cat = (contact.category || 'OTHER').toUpperCase();
                return (
                  <a
                    key={contact.id || i}
                    href={`tel:${contact.phoneNumber}`}
                    className="card rounded-2xl p-4 group block anim-up"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: 'var(--bg-elevated)' }}
                      >
                        {CATEGORY_ICONS_MAP[cat] || '📞'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {contact.serviceName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <MapPin size={10} />{contact.city || city}
                          </span>
                          {contact.category && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{contact.category}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-black" style={{ color: '#10b981' }}>{contact.phoneNumber}</p>
                        <p className="text-xs flex items-center gap-1 justify-end" style={{ color: 'var(--text-muted)' }}>
                          <Phone size={9} /> Call
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Safety tips */}
        <div className="mt-12 glass-green rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#10b981' }}>
            <AlertTriangle size={16} /> {t('safetyReminders')}
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: 'rgba(16,185,129,0.75)' }}>
            {[
              'Save emergency numbers on your phone before you need them',
              'In case of fire, evacuate first — then call 16',
              'For medical emergencies, call 1122 — they respond within minutes in most cities',
              'Report civic issues through SunoSarkar for non-emergency infrastructure problems',
              'Always give your exact location including street name and nearest landmark when calling',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5" style={{ color: '#10b981' }}>•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
