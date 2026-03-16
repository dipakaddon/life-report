'use client';
import { useState, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import BirthForm from '@/components/BirthForm';
import ChartTable from '@/components/ChartTable';
import YogaDisplay from '@/components/YogaDisplay';
import DashaTimeline from '@/components/DashaTimeline';
import PredictionsDisplayV2 from '@/components/PredictionsDisplayV2';
import PDFDownload from '@/components/PDFDownload';
import SpaceLogo from '@/components/SpaceLogo';
import { ChartData } from '@/lib/jyotish-engine-v2';
import type { Yoga, DashaPeriod, PredictionSection } from '@/lib/jyotish-engine-v2';

// Lazy load canvas (client-only)
const SpaceBackground = dynamic(() => import('@/components/SpaceBackground'), { ssr: false });

interface Report {
  chart: ChartData; yogas: Yoga[]; dashas: DashaPeriod[];
  predictions: PredictionSection[]; name: string;
  birthYear: number; birthDate: string; birthTime: string; birthPlace: string;
}

const TABS = [
  { id: 'chart',       label: 'कुंडली',      icon: '🪐', sub: 'ग्रह-स्थिति' },
  { id: 'yogas',       label: 'योग',         icon: '✨', sub: 'विशेष योग' },
  { id: 'predictions', label: 'भविष्यवाणी',  icon: '📜', sub: '26 विषय' },
  { id: 'dasha',       label: 'दशा',         icon: '⏳', sub: 'समय-काल' },
];

const FEATURES = [
  { icon: '🌍', text: 'Swiss Ephemeris\nLahiri Ayanamsa' },
  { icon: '📚', text: 'पंच-ग्रंथ\nज्योतिष' },
  { icon: '🔮', text: '26 जीवन\nविषय' },
  { icon: '⏱️', text: 'दशा\nविश्लेषण' },
  { icon: '📥', text: 'PDF\nDownload' },
  { icon: '🆓', text: 'बिल्कुल\nमुफ्त' },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [step, setStep] = useState<'idle' | 'calc' | 'report'>('idle');

  const handleSubmit = async (fd: { name: string; date: string; time: string; place: string; lat: number; lon: number }) => {
    setLoading(true); setError(''); setReport(null); setStep('calc');
    try {
      const [year, month, day] = fd.date.split('-').map(Number);
      const [hour, minute] = fd.time.split(':').map(Number);
      const cr = await fetch('/api/chart', { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, day, hour, minute, lat: fd.lat, lon: fd.lon }) });
      if (!cr.ok) throw new Error('Chart calculation failed');
      const chart: ChartData = await cr.json();
      setStep('report');
      const rr = await fetch('/api/report', { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, birthYear: year }) });
      if (!rr.ok) throw new Error('Report generation failed');
      const { predictions, yogas, dashas } = await rr.json();
      setReport({ chart, yogas, dashas, predictions, name: fd.name || 'जातक',
        birthYear: year, birthDate: fd.date, birthTime: fd.time, birthPlace: fd.place });
      setActiveTab('chart');
      setTimeout(() => document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (e) { setError(e instanceof Error ? e.message : 'त्रुटि'); setStep('idle'); }
    finally { setLoading(false); }
  };

  const currentAge = report ? new Date().getFullYear() - report.birthYear : 0;
  const activeDasha = report?.dashas.find(d => d.startAge <= currentAge && currentAge < d.endAge);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Animated Space Background */}
      <SpaceBackground />

      {/* ══════ HERO SECTION ══════ */}
      <section className="no-print" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px 16px 60px' }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <SpaceLogo size={140} />
        </div>

        {/* Title */}
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 76px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '12px', lineHeight: 1.1 }}>
            <span className="text-gradient title-glow">वैदिक जन्म कुंडली</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'rgba(253,211,77,0.75)', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Vedic Astrology — Complete Life Report
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            गर्ग होरा शास्त्र • फलदीपिका • भृगु संहिता • बृहज्जातकम् • वेदांग ज्योतिष
          </p>
        </div>

        {/* Feature pills */}
        <div className="fade-up" style={{ animationDelay: '0.4s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '12px', color: 'rgba(255,255,255,0.7)',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: '16px' }}>{f.icon}</span>
              <span style={{ lineHeight: 1.3 }}>{f.text.replace('\n', ' ')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FORM SECTION ══════ */}
      <section className="no-print" style={{ position: 'relative', zIndex: 2, maxWidth: '660px', margin: '0 auto', padding: '0 16px 60px' }}>
        <div className="glass border-animate" style={{ padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
          {/* Corner decoration */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(253,211,77,0.08), transparent)',
            pointerEvents: 'none',
          }}/>
          <div style={{
            position: 'absolute', bottom: '-30px', left: '-30px',
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent)',
            pointerEvents: 'none',
          }}/>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔮</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FCD34D', marginBottom: '6px' }}>
              अपनी जन्म जानकारी दर्ज करें
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              Enter your birth details to generate your Vedic horoscope
            </p>
          </div>

          <BirthForm onSubmit={handleSubmit} loading={loading} />

          {/* Loading state */}
          {loading && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                {['🌙', '⭐', '🪐', '✨', '☀️'].map((s, i) => (
                  <span key={i} style={{ fontSize: '20px', animation: `twinkle ${1 + i * 0.2}s ease-in-out ${i * 0.15}s infinite` }}>{s}</span>
                ))}
              </div>
              <p style={{ color: 'rgba(253,211,77,0.8)', fontSize: '14px' }}>
                {step === 'calc' ? '🌌 ग्रहों की गणना हो रही है...' : '📜 रिपोर्ट तैयार हो रही है...'}
              </p>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontSize: '14px', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </section>

      {/* ══════ REPORT SECTION ══════ */}
      {report && (
        <section id="report-section" style={{ position: 'relative', zIndex: 2, maxWidth: '1140px', margin: '0 auto', padding: '0 16px 100px' }}>

          {/* ── Report Header Card ── */}
          <div style={{
            position: 'relative', marginBottom: '28px', padding: '36px 40px',
            borderRadius: '28px', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(168,85,247,0.06) 50%, rgba(59,130,246,0.06) 100%)',
            border: '1px solid rgba(245,158,11,0.2)',
            backdropFilter: 'blur(20px)',
          }}>
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)', pointerEvents: 'none' }}/>
            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent)', pointerEvents: 'none' }}/>

            {/* Header row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
              {/* Avatar */}
              <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '50%', position: 'relative',
                background: 'linear-gradient(135deg, #F59E0B, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(245,158,11,0.4)', fontSize: '32px', fontWeight: 900, color: 'white' }}>
                {report.name.charAt(0).toUpperCase()}
                <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%',
                  border: '1px solid rgba(245,158,11,0.4)', animation: 'spin-slow 8s linear infinite' }}/>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#FCD34D', marginBottom: '8px' }}>{report.name}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {[
                    ['📅', new Date(report.birthDate).toLocaleDateString('hi-IN',{year:'numeric',month:'long',day:'numeric'})],
                    ['🕐', `${report.birthTime} IST`],
                    ['📍', report.birthPlace.split(',').slice(0,2).join(',')],
                  ].map(([ic, v]) => (
                    <span key={v} style={{ display: 'flex', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', alignItems: 'center' }}>
                      <span>{ic}</span><span>{v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Lagna badge */}
              <div style={{ textAlign: 'center', padding: '16px 28px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(253,211,77,0.2)', flexShrink: 0 }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#FCD34D', lineHeight: 1 }}>{report.chart.lagna.sign_hi}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>लग्न • {report.chart.lagna.sign_en}</div>
                <div style={{ color: 'rgba(253,211,77,0.5)', fontSize: '11px' }}>{report.chart.lagna.nakshatra.hi}</div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {[
                { v: report.yogas.length, l: 'विशेष योग', icon: '✨' },
                { v: report.chart.lagna.nakshatra.hi, l: 'लग्न नक्षत्र', icon: '⭐' },
                { v: activeDasha?.planetHi || '—', l: 'वर्तमान दशा', icon: '⏳' },
                { v: Object.values(report.chart.planets).filter(p=>p.dignity==='Exalted').length, l: 'उच्च ग्रह', icon: '🔝' },
                { v: Object.values(report.chart.planets).filter(p=>p.dignity==='Debilitated').length, l: 'नीच ग्रह', icon: '⬇️' },
                { v: report.predictions.length, l: 'कुल विषय', icon: '📋' },
              ].map(({ v, l, icon }) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px 12px',
                  textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
                  <div style={{ fontWeight: 700, color: '#FCD34D', fontSize: '17px' }}>{v}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '2px' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Download buttons */}
            <PDFDownload name={report.name} birthDate={report.birthDate} birthTime={report.birthTime}
              birthPlace={report.birthPlace} lagna={report.chart.lagna.sign_hi} yogaCount={report.yogas.length} />
          </div>

          {/* ── Tabs ── */}
          <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 22px', borderRadius: '18px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.3s',
                ...(activeTab === t.id
                  ? { background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                      color: 'black', boxShadow: '0 8px 32px rgba(245,158,11,0.35)', transform: 'translateY(-2px)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)',
                      backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }),
              }}>
                <span style={{ fontSize: '20px' }}>{t.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div>{t.label}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, fontWeight: 400 }}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px',
          }}>
            {activeTab === 'chart' && <ChartTable chart={report.chart} />}
            {activeTab === 'yogas' && <YogaDisplay yogas={report.yogas} />}
            {activeTab === 'predictions' && <PredictionsDisplayV2 sections={report.predictions} />}
            {activeTab === 'dasha' && <DashaTimeline dashas={report.dashas} birthYear={report.birthYear} />}
          </div>

          {/* Disclaimer */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: '11px', marginTop: '20px', lineHeight: 1.6 }}>
            🕉️ गर्ग होरा शास्त्र, फलदीपिका, भृगु संहिता, बृहज्जातकम्, वेदांग ज्योतिष के अध्ययन पर आधारित।
            Swiss Ephemeris (Lahiri Ayanamsa) से ग्रह गणना। यह किसी अनुभवी ज्योतिषाचार्य की व्यक्तिगत सलाह का विकल्प नहीं है।
          </p>
        </section>
      )}

      {/* ══════ FOOTER ══════ */}
      <footer className="no-print" style={{ position: 'relative', zIndex: 2, textAlign: 'center',
        padding: '40px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>
        <div style={{ marginBottom: '8px', fontSize: '20px' }}>🕉️</div>
        <p>वैदिक ज्योतिष — पंच-ग्रंथ अध्ययन • Swiss Ephemeris • Rule-Based Engine</p>
        <p style={{ marginTop: '4px', fontSize: '11px' }}>Made with ❤️ for Jyotish lovers</p>
      </footer>
    </main>
  );
}
