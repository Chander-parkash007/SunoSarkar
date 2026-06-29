import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, AlertTriangle, ChevronRight, FileText, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import { fileComplaint } from '../../lib/api';
import { PAKISTAN_CITIES, CATEGORY_ICONS } from '../../lib/auth';
import { safeArray, extractError, fmtDate, fmtDateShort } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORIES = ['ROAD','WATER','ELECTRICITY','SANITATION','GARBAGE','SEWAGE','STREE_LIGHT','PARK','OTHER'];
const PRIORITIES = [
  { value: 'NORMAL',    label: 'Normal',    desc: 'Routine issue',       icon: '🔵' },
  { value: 'URGENT',    label: 'Urgent',    desc: 'Needs quick action',  icon: '🟡' },
  { value: 'EMERGENCY', label: 'Emergency', desc: 'Critical situation',  icon: '🔴' },
];
const CATEGORY_NAMES = {
  ROAD: 'Road', WATER: 'Water', ELECTRICITY: 'Electricity', SANITATION: 'Sanitation',
  GARBAGE: 'Garbage', SEWAGE: 'Sewage', STREE_LIGHT: 'Street Light', PARK: 'Park', OTHER: 'Other',
};

export default function NewComplaintPage() {
  const navigate = useNavigate();
  const { t, isUrdu } = useApp();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'NORMAL',
    city: '', ucCode: '', areaAddress: '', locationLink: '',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setPhotos(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removePhoto = (i) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const validateStep1 = () => {
    if (!form.category) { toast.error('Please select a category'); return false; }
    if (!form.title.trim()) { toast.error('Complaint title is required'); return false; }
    if (form.description.trim().length < 20) { toast.error('Description must be at least 20 characters'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!form.city) { toast.error('Please select your city'); return false; }
    if (!form.ucCode.trim()) { toast.error('UC code is required'); return false; }
    if (!form.areaAddress.trim()) { toast.error('Area address is required'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dto = {
        title: form.title, description: form.description,
        category: form.category, priority: form.priority,
        city: form.city, ucCode: form.ucCode,
        areaAddress: form.areaAddress, locationLink: form.locationLink || 'N/A',
      };
      const formData = new FormData();
      formData.append('complaint', JSON.stringify(dto));
      photos.forEach(p => formData.append('photos', p));
      await fileComplaint(formData);
      toast.success('Complaint filed! Officers in your area have been notified. 🎉');
      navigate('/dashboard/citizen/complaints');
    } catch (err) {
      toast.error(extractError(err, 'Failed to file complaint'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [t('details'), t('location'), t('photos')];

  const stepBtnStyle = (i) => {
    if (step === i + 1) return { background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 };
    if (step > i + 1) return { background: 'rgba(22,163,74,0.15)', color: '#16a34a', border: 'none', padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 };
    return { background: 'var(--bg-3)', color: 'var(--txt-3)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'default', display: 'flex', alignItems: 'center', gap: 6 };
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }} dir={isUrdu ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>{t('fileNewComplaint')}</h1>
          <p style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 2 }}>Describe the issue — officers will be notified immediately</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {steps.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => {
                  if (i + 1 < step) setStep(i + 1);
                  else if (i + 1 === step + 1) {
                    if (step === 1 && validateStep1()) setStep(2);
                    else if (step === 2 && validateStep2()) setStep(3);
                  }
                }}
                style={stepBtnStyle(i)}
              >
                {step > i + 1 ? '✓' : i + 1} {label}
              </button>
              {i < steps.length - 1 && (
                <div style={{ width: 24, height: 1, background: step > i + 1 ? '#16a34a' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="anim-up">

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 10 }}>
                    {t('category')} *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, category: cat }))}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                          padding: '12px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 0.13s',
                          background: form.category === cat ? 'rgba(22,163,74,0.1)' : 'var(--bg-3)',
                          border: form.category === cat ? '1px solid rgba(22,163,74,0.35)' : '1px solid var(--border)',
                          color: form.category === cat ? '#16a34a' : 'var(--txt-2)',
                        }}
                      >
                        <span style={{ fontSize: 22 }}>{CATEGORY_ICONS[cat]}</span>
                        <span>{CATEGORY_NAMES[cat]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 10 }}>
                    {t('priority')}
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {PRIORITIES.map(({ value, label, desc, icon }) => {
                      const isSelected = form.priority === value;
                      const selColor = value === 'EMERGENCY' ? '#dc2626' : value === 'URGENT' ? '#ea580c' : '#71717a';
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, priority: value }))}
                          style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '12px 8px', borderRadius: 12, fontSize: 12, cursor: 'pointer',
                            transition: 'all 0.13s',
                            background: isSelected ? `${selColor}12` : 'var(--bg-3)',
                            border: isSelected ? `1px solid ${selColor}40` : '1px solid var(--border)',
                            color: isSelected ? selColor : 'var(--txt-3)',
                          }}
                        >
                          <span style={{ fontSize: 22, marginBottom: 4 }}>{icon}</span>
                          <span style={{ fontWeight: 600 }}>{label}</span>
                          <span style={{ fontSize: 11, marginTop: 2, color: 'var(--txt-3)' }}>{desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('title')} *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={set('title')}
                    placeholder="Brief title describing the problem..."
                    maxLength={100}
                    className="input"
                  />
                  <p style={{ fontSize: 11, marginTop: 4, textAlign: 'right', color: 'var(--txt-3)' }}>{form.title.length}/100</p>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('description')} *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Describe the problem in detail..."
                    rows={5}
                    className="input"
                  />
                  <p style={{ fontSize: 11, marginTop: 4, textAlign: 'right', color: form.description.length >= 20 ? '#16a34a' : 'var(--txt-3)' }}>
                    {form.description.length} chars {form.description.length < 20 ? '(min. 20)' : '✓'}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-up">
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('city')} *
                  </label>
                  <select value={form.city} onChange={set('city')} className="input">
                    <option value="">Select city</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('ucCode')} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={form.ucCode}
                      onChange={set('ucCode')}
                      placeholder="e.g. UC-001"
                      className="input"
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('areaAddress')} *
                  </label>
                  <textarea
                    value={form.areaAddress}
                    onChange={set('areaAddress')}
                    placeholder="Exact location: Street name, near landmark, etc."
                    rows={3}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 6 }}>
                    {t('googleMapsLink')}{' '}
                    <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--txt-3)' }}>(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.locationLink}
                    onChange={set('locationLink')}
                    placeholder="https://maps.google.com/..."
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="anim-up">
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt-3)', marginBottom: 10 }}>
                    {t('photos')}{' '}
                    <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional, max 5)</span>
                  </label>

                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 12, padding: 32, borderRadius: 14, border: '2px dashed var(--border)',
                    cursor: 'pointer', background: 'var(--bg-3)',
                  }}>
                    <input type="file" style={{ display: 'none' }} accept="image/*" multiple onChange={handlePhotos} />
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={26} style={{ color: '#16a34a' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{t('dropPhotos')}</p>
                      <p style={{ fontSize: 11, marginTop: 4, color: 'var(--txt-3)' }}>JPG, PNG, WEBP up to 10MB each</p>
                    </div>
                  </label>

                  {previews.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
                      {previews.map((url, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={url} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                          <button
                            onClick={() => removePhoto(i)}
                            style={{
                              position: 'absolute', top: 6, right: 6, width: 22, height: 22,
                              borderRadius: '50%', background: '#dc2626', border: 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', color: '#fff',
                            }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: 14, padding: '16px 18px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 12 }}>📋 {t('complaintSummary')}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: t('category'), value: `${CATEGORY_ICONS[form.category]} ${CATEGORY_NAMES[form.category]}` },
                      { label: t('priority'), value: form.priority },
                      { label: t('title'), value: form.title },
                      { label: t('city'), value: form.city },
                      { label: t('ucCode'), value: form.ucCode },
                      { label: t('photos'), value: `${photos.length} selected` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                        <span style={{ width: 90, flexShrink: 0, color: 'var(--txt-3)' }}>{label}</span>
                        <span style={{ fontWeight: 500, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {form.priority === 'EMERGENCY' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', borderRadius: 12, background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <AlertTriangle size={17} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Emergency Complaint</p>
                      <p style={{ fontSize: 12, marginTop: 2, color: 'rgba(220,38,38,0.7)' }}>Officers will be notified immediately.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation footer */}
          <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                ← {t('back')}
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && validateStep1()) setStep(2);
                  else if (step === 2 && validateStep2()) setStep(3);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {t('continue')} <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? <LoadingSpinner size="sm" /> : <><FileText size={15} /> {t('submitComplaint')}</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
