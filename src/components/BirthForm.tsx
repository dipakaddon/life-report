'use client';
import { useState, useRef } from 'react';

interface FormData { name: string; date: string; time: string; place: string; }
interface Props { onSubmit: (d: FormData & { lat: number; lon: number }) => void; loading: boolean; }

type GeoResult = { lat: number; lon: number; display: string };

export default function BirthForm({ onSubmit, loading }: Props) {
  const [form, setForm]     = useState<FormData>({ name:'', date:'', time:'', place:'' });
  const [geo, setGeo]       = useState<GeoResult | null>(null);
  const [geoErr, setGeoErr] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(0 as any);

  const handlePlace = (v: string) => {
    setForm(f => ({ ...f, place: v }));
    setGeo(null); setGeoErr('');
    clearTimeout(timer.current);
    if (v.length < 3) return;
    timer.current = setTimeout(async () => {
      setGeocoding(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'JyotishApp/1.0' } }
        );
        const d = await r.json();
        if (d?.length > 0)
          setGeo({ lat: +d[0].lat, lon: +d[0].lon, display: d[0].display_name });
        else setGeoErr('स्थान नहीं मिला। अधिक जानकारी लिखें।');
      } catch { setGeoErr('Location search failed. Try again.'); }
      setGeocoding(false);
    }, 700);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geo) { setGeoErr('Please wait for location to be found.'); return; }
    onSubmit({ ...form, lat: geo.lat, lon: geo.lon });
  };

  const isReady = !!geo && !!form.date && !!form.time && !loading;

  return (
    <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Name */}
      <div className="field-wrap">
        <input
          type="text" value={form.name} placeholder=" "
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="field-input"
          style={{ paddingRight:'44px' }}
        />
        <label className="field-label">आपका नाम / Your Name</label>
        <span className="field-icon">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </span>
      </div>

      {/* Date + Time row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div className="field-wrap">
          <input
            type="date" value={form.date} required placeholder=" "
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="field-input"
            style={{ colorScheme:'dark', paddingRight:'14px' }}
          />
          <label className="field-label">जन्म तिथि</label>
        </div>
        <div className="field-wrap">
          <input
            type="time" value={form.time} required placeholder=" "
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            className="field-input"
            style={{ colorScheme:'dark', paddingRight:'14px' }}
          />
          <label className="field-label">समय (IST)</label>
        </div>
      </div>

      {/* Place */}
      <div>
        <div className="field-wrap">
          <input
            type="text" value={form.place} required placeholder=" "
            onChange={e => handlePlace(e.target.value)}
            className="field-input"
            style={{ paddingRight:'44px' }}
          />
          <label className="field-label">जन्म स्थान / Birth Place (City, Country)</label>
          <span className="field-icon">
            {geocoding ? (
              <div style={{ width:18, height:18, border:'2px solid rgba(251,191,36,.7)',
                borderTopColor:'transparent', borderRadius:'50%',
                animation:'spin-cw .7s linear infinite' }}/>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            )}
          </span>
        </div>

        {/* Geo feedback */}
        {geo && (
          <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:8,
            padding:'8px 12px', borderRadius:10,
            background:'rgba(74,222,128,.08)', border:'1px solid rgba(74,222,128,.2)' }}>
            <svg width="14" height="14" fill="none" stroke="#4ade80" viewBox="0 0 24 24" style={{flexShrink:0}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
            <span style={{ fontSize:12, color:'#4ade80', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {geo.display.split(',').slice(0,3).join(', ')}
            </span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,.3)', flexShrink:0 }}>
              {geo.lat.toFixed(2)}°, {geo.lon.toFixed(2)}°
            </span>
          </div>
        )}
        {geoErr && (
          <p style={{ marginTop:8, fontSize:12, color:'#f87171',
            padding:'8px 12px', borderRadius:10,
            background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)' }}>
            ⚠️ {geoErr}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit" disabled={!isReady}
        style={{
          width:'100%', padding:'16px', borderRadius:16, border:'none',
          fontWeight:700, fontSize:16, cursor: isReady ? 'pointer' : 'not-allowed',
          background: isReady
            ? 'linear-gradient(135deg,#f59e0b,#ef4444)'
            : 'rgba(255,255,255,.08)',
          color: isReady ? '#000' : 'rgba(255,255,255,.3)',
          boxShadow: isReady ? '0 8px 32px rgba(245,158,11,.35)' : 'none',
          transform: isReady ? 'none' : 'none',
          transition:'all .25s',
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:'inherit',
        }}
        onMouseEnter={e => isReady && ((e.currentTarget.style.transform='translateY(-2px) scale(1.01)'))}
        onMouseLeave={e => (e.currentTarget.style.transform='none')}
      >
        {loading ? (
          <>
            <div style={{ width:20, height:20, border:'2.5px solid rgba(0,0,0,.4)',
              borderTopColor:'#000', borderRadius:'50%',
              animation:'spin-cw .7s linear infinite' }}/>
            <span>कुंडली बन रही है...</span>
          </>
        ) : (
          <>
            <span style={{ fontSize:22 }}>🔮</span>
            <span>कुंडली देखें / Generate Report</span>
          </>
        )}
      </button>

      {/* Helper text */}
      {!geo && !geoErr && form.place.length === 0 && (
        <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,.25)', marginTop:-8 }}>
          सभी जानकारी भरें — स्थान खोजना automatic है
        </p>
      )}
    </form>
  );
}
