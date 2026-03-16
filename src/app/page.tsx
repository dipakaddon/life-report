'use client';
import { useState } from 'react';
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

const SpaceBackground = dynamic(() => import('@/components/SpaceBackground'), { ssr: false });

interface Report {
  chart: ChartData; yogas: Yoga[]; dashas: DashaPeriod[];
  predictions: PredictionSection[]; name: string;
  birthYear: number; birthDate: string; birthTime: string; birthPlace: string;
}

const TABS = [
  { id:'chart',       label:'कुंडली',     sub:'ग्रह', icon:'🪐' },
  { id:'yogas',       label:'योग',        sub:'विशेष', icon:'✨' },
  { id:'predictions', label:'भविष्य',     sub:'26 विषय', icon:'📜' },
  { id:'dasha',       label:'दशा',        sub:'काल', icon:'⏳' },
];

export default function Home() {
  const [loading,    setLoading]    = useState(false);
  const [loadStep,   setLoadStep]   = useState('');
  const [error,      setError]      = useState('');
  const [report,     setReport]     = useState<Report | null>(null);
  const [activeTab,  setActiveTab]  = useState('chart');

  const generate = async (fd: { name:string; date:string; time:string; place:string; lat:number; lon:number }) => {
    setLoading(true); setError(''); setReport(null);
    try {
      setLoadStep('ग्रहों की गणना हो रही है...');
      const [year,month,day] = fd.date.split('-').map(Number);
      const [hour,minute]    = fd.time.split(':').map(Number);
      const cr = await fetch('/api/chart', { method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({year,month,day,hour,minute,lat:fd.lat,lon:fd.lon}) });
      if (!cr.ok) throw new Error('Chart calculation failed');
      const chart: ChartData = await cr.json();

      setLoadStep('रिपोर्ट तैयार हो रही है...');
      const rr = await fetch('/api/report', { method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({chart, birthYear:year}) });
      if (!rr.ok) throw new Error('Report generation failed');
      const { predictions, yogas, dashas } = await rr.json();

      setReport({ chart, yogas, dashas, predictions,
        name: fd.name || 'जातक', birthYear: year,
        birthDate: fd.date, birthTime: fd.time, birthPlace: fd.place });
      setActiveTab('chart');
      setTimeout(() => document.getElementById('rpt')?.scrollIntoView({ behavior:'smooth', block:'start' }), 150);
    } catch(e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); setLoadStep(''); }
  };

  const age = report ? new Date().getFullYear() - report.birthYear : 0;
  const curDasha = report?.dashas.find(d => d.startAge <= age && age < d.endAge);

  // ─── Responsive breakpoint helpers via inline checks ───
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <main style={{ minHeight:'100vh', position:'relative' }}>
      <SpaceBackground />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="no-print" style={{ position:'relative', zIndex:2, textAlign:'center',
        padding:'clamp(60px,10vw,100px) clamp(16px,5vw,32px) clamp(40px,6vw,60px)' }}>
        <div className="logo-float" style={{ display:'inline-block', marginBottom:28 }}>
          <SpaceLogo size={120} />
        </div>
        <h1 className="float-up" style={{
          fontSize:'clamp(32px,7vw,72px)', fontWeight:900,
          lineHeight:1.1, marginBottom:12, letterSpacing:'-1px'
        }}>
          <span className="text-gradient glow-text">वैदिक जन्म कुंडली</span>
        </h1>
        <p className="float-up" style={{
          animationDelay:'.1s', fontSize:'clamp(14px,2.5vw,20px)',
          color:'rgba(251,191,36,.75)', marginBottom:8
        }}>
          Vedic Astrology · Complete Life Report
        </p>
        <p className="float-up" style={{
          animationDelay:'.2s', fontSize:13, color:'rgba(255,255,255,.3)',
          maxWidth:520, margin:'0 auto 28px'
        }}>
          Swiss Ephemeris · Lahiri Ayanamsa · 26 Life Topics · Dasha Analysis
        </p>
        {/* Book badges */}
        <div className="float-up" style={{
          animationDelay:'.3s', display:'flex', flexWrap:'wrap',
          justifyContent:'center', gap:8
        }}>
          {['गर्ग होरा शास्त्र','फलदीपिका','भृगु संहिता','बृहज्जातकम्','वेदांग ज्योतिष'].map(b => (
            <span key={b} style={{
              fontSize:11, padding:'5px 14px', borderRadius:999,
              background:'rgba(255,255,255,.06)',
              border:'1px solid rgba(255,255,255,.1)',
              color:'rgba(251,191,36,.6)'
            }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────── */}
      <section className="no-print" style={{ position:'relative', zIndex:2,
        maxWidth:640, margin:'0 auto', padding:'0 clamp(12px,4vw,24px) clamp(40px,6vw,60px)' }}>
        <div className="glass glow-border" style={{ borderRadius:28, padding:'clamp(28px,5vw,48px) clamp(20px,5vw,44px)', position:'relative', overflow:'hidden' }}>
          {/* Decorative blobs */}
          <div style={{ position:'absolute', top:-50, right:-50, width:140, height:140,
            borderRadius:'50%', background:'radial-gradient(circle,rgba(251,191,36,.07),transparent)',
            pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-40, left:-40, width:110, height:110,
            borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,.07),transparent)',
            pointerEvents:'none' }}/>

          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>🔮</div>
            <h2 style={{ fontSize:'clamp(18px,3vw,22px)', fontWeight:700, color:'#fcd34d', marginBottom:6 }}>
              अपनी जन्म जानकारी दर्ज करें
            </h2>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.35)' }}>
              Enter your birth details to generate your Vedic horoscope
            </p>
          </div>

          <BirthForm onSubmit={generate} loading={loading} />

          {/* Loading indicator */}
          {loading && (
            <div style={{ marginTop:20, padding:'16px', borderRadius:16,
              background:'rgba(251,191,36,.06)', border:'1px solid rgba(251,191,36,.15)',
              display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:20, height:20, flexShrink:0,
                border:'2.5px solid rgba(251,191,36,.3)', borderTopColor:'#fbbf24',
                borderRadius:'50%', animation:'spin-cw .7s linear infinite' }}/>
              <span style={{ fontSize:14, color:'rgba(251,191,36,.8)' }}>{loadStep}</span>
            </div>
          )}
          {error && (
            <div style={{ marginTop:16, padding:'14px 16px', borderRadius:14,
              background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.25)',
              color:'#fca5a5', fontSize:13 }}>⚠️ {error}</div>
          )}
        </div>
      </section>

      {/* ── REPORT ───────────────────────────────────────── */}
      {report && (
        <section id="rpt" style={{ position:'relative', zIndex:2,
          maxWidth:1100, margin:'0 auto',
          padding:'0 clamp(12px,4vw,24px) clamp(60px,8vw,100px)' }}>

          {/* ─ Report header card ─ */}
          <div className="glass" style={{
            borderRadius:28, padding:'clamp(24px,4vw,36px) clamp(20px,4vw,40px)',
            marginBottom:24, position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg,rgba(245,158,11,.07),rgba(168,85,247,.05),rgba(59,130,246,.05))',
            border:'1px solid rgba(245,158,11,.18)'
          }}>
            {/* Deco */}
            <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200,
              borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,.07),transparent)',
              pointerEvents:'none' }}/>

            {/* Top row */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:20, alignItems:'center', marginBottom:24 }}>
              {/* Avatar */}
              <div style={{ width:72, height:72, flexShrink:0, borderRadius:'50%', position:'relative',
                background:'linear-gradient(135deg,#f59e0b,#8b5cf6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:28, fontWeight:900, color:'white',
                boxShadow:'0 0 28px rgba(245,158,11,.35)' }}>
                {report.name.charAt(0).toUpperCase()}
                <div className="spin-cw" style={{ position:'absolute', inset:-4, borderRadius:'50%',
                  border:'1.5px solid rgba(245,158,11,.3)', animationDuration:'10s' }}/>
              </div>
              {/* Name & info */}
              <div style={{ flex:1, minWidth:180 }}>
                <h2 style={{ fontSize:'clamp(22px,4vw,32px)', fontWeight:800, color:'#fcd34d', marginBottom:8 }}>
                  {report.name}
                </h2>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px' }}>
                  {[
                    ['📅', new Date(report.birthDate).toLocaleDateString('hi-IN',{year:'numeric',month:'long',day:'numeric'})],
                    ['🕐', `${report.birthTime} IST`],
                    ['📍', report.birthPlace.split(',').slice(0,2).join(',')],
                  ].map(([ic,v]) => (
                    <span key={v} style={{ display:'flex', gap:5, color:'rgba(255,255,255,.5)', fontSize:13 }}>
                      <span>{ic}</span><span>{v}</span>
                    </span>
                  ))}
                </div>
              </div>
              {/* Lagna badge */}
              <div style={{ textAlign:'center', padding:'16px 24px', borderRadius:20,
                background:'rgba(255,255,255,.06)', border:'1px solid rgba(251,191,36,.2)', flexShrink:0 }}>
                <div style={{ fontSize:'clamp(24px,4vw,32px)', fontWeight:900, color:'#fcd34d', lineHeight:1 }}>
                  {report.chart.lagna.sign_hi}
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:4 }}>
                  लग्न · {report.chart.lagna.sign_en}
                </div>
              </div>
            </div>

            {/* Stats grid — responsive */}
            <div style={{ display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:10, marginBottom:20 }}>
              {[
                { v:report.yogas.length,       l:'विशेष योग',    i:'✨' },
                { v:report.chart.lagna.nakshatra.hi, l:'नक्षत्र', i:'⭐' },
                { v:curDasha?.planetHi||'—',   l:'वर्तमान दशा', i:'⏳' },
                { v:Object.values(report.chart.planets).filter(p=>p.dignity==='Exalted').length, l:'उच्च ग्रह', i:'🔝' },
                { v:Object.values(report.chart.planets).filter(p=>p.dignity==='Debilitated').length, l:'नीच ग्रह', i:'⬇️' },
                { v:report.predictions.length, l:'कुल विषय',     i:'📋' },
              ].map(({ v,l,i }) => (
                <div key={l} className="stat-card">
                  <div style={{ fontSize:18, marginBottom:4 }}>{i}</div>
                  <div style={{ fontWeight:700, color:'#fcd34d',
                    fontSize:'clamp(14px,2.5vw,18px)', lineHeight:1.2 }}>{v}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', marginTop:3 }}>{l}</div>
                </div>
              ))}
            </div>

            <PDFDownload name={report.name} birthDate={report.birthDate}
              birthTime={report.birthTime} birthPlace={report.birthPlace}
              lagna={report.chart.lagna.sign_hi} yogaCount={report.yogas.length} />
          </div>

          {/* ─ Tabs ─ */}
          <div className="no-print" style={{ display:'flex', gap:8, marginBottom:20,
            overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`tab-pill ${activeTab===t.id ? 'active' : ''}`}>
                <span style={{ fontSize:18 }}>{t.icon}</span>
                <div>
                  <div>{t.label}</div>
                  <div style={{ fontSize:10, opacity:.7, fontWeight:400 }}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* ─ Tab content ─ */}
          <div className="glass" style={{ borderRadius:24,
            padding:'clamp(20px,4vw,36px) clamp(16px,4vw,36px)' }}>
            {activeTab==='chart'       && <ChartTable chart={report.chart} />}
            {activeTab==='yogas'       && <YogaDisplay yogas={report.yogas} />}
            {activeTab==='predictions' && <PredictionsDisplayV2 sections={report.predictions} />}
            {activeTab==='dasha'       && <DashaTimeline dashas={report.dashas} birthYear={report.birthYear} />}
          </div>

          <p style={{ textAlign:'center', color:'rgba(255,255,255,.15)', fontSize:11,
            marginTop:20, lineHeight:1.7 }}>
            🕉️ गर्ग होरा शास्त्र, फलदीपिका, भृगु संहिता, बृहज्जातकम्, वेदांग ज्योतिष के अध्ययन पर आधारित ·
            Swiss Ephemeris · Lahiri Ayanamsa · यह ज्योतिषाचार्य की व्यक्तिगत सलाह का विकल्प नहीं है।
          </p>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="no-print" style={{
        position:'relative', zIndex:2, textAlign:'center',
        padding:'32px 16px', borderTop:'1px solid rgba(255,255,255,.04)',
        color:'rgba(255,255,255,.15)', fontSize:12
      }}>
        <div style={{ marginBottom:6, fontSize:20 }}>🕉️</div>
        <p>वैदिक ज्योतिष · पंच-ग्रंथ अध्ययन · Pure TypeScript · No Python Required</p>
      </footer>
    </main>
  );
}
