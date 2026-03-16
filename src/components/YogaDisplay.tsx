'use client';
import { Yoga } from '@/lib/jyotish-engine-v2';

const STR: Record<string, { label:string; color:string; bg:string; stars:number }> = {
  Excellent: { label:'उत्कृष्ट', color:'#4ade80', bg:'rgba(74,222,128,.08)',  stars:5 },
  Good:      { label:'उत्तम',    color:'#60a5fa', bg:'rgba(96,165,250,.08)',  stars:4 },
  Moderate:  { label:'सामान्य', color:'#fbbf24', bg:'rgba(251,191,36,.08)',  stars:3 },
};

function Stars({ n, color }: { n:number; color:string }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {Array.from({length:5}).map((_,i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i<n ? color : 'transparent'} stroke={color} strokeWidth={1.5} opacity={i<n?1:.3}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function YogaDisplay({ yogas }: { yogas: Yoga[] }) {
  if (!yogas.length) return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,.3)' }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
      <p>इस कुंडली में कोई विशेष योग नहीं पाया गया।</p>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {yogas.map((y,i) => {
        const s = STR[y.strength] || STR.Moderate;
        return (
          <div key={i} className="glass-hover" style={{
            borderRadius:18, padding:'20px 22px',
            background: s.bg, border:`1px solid ${s.color}33`,
            animation:`slide-in .3s ease ${i*.05}s both`,
          }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <h3 style={{ fontSize:18, fontWeight:700, color: s.color }}>{y.nameHi}</h3>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,.35)', fontStyle:'italic' }}>{y.name}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                  <Stars n={s.stars} color={s.color} />
                  <span style={{ fontSize:11, color:s.color, fontWeight:600 }}>{s.label}</span>
                </div>
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', textAlign:'right',
                padding:'4px 10px', borderRadius:8, background:'rgba(255,255,255,.05)',
                border:'1px solid rgba(255,255,255,.07)', flexShrink:0 }}>
                📖 {y.source}
              </div>
            </div>
            <p style={{ fontSize:14, color:'rgba(255,255,255,.75)', lineHeight:1.7 }}>{y.description}</p>
          </div>
        );
      })}
    </div>
  );
}
