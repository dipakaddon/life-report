'use client';
import { DashaPeriod } from '@/lib/jyotish-engine-v2';

export default function DashaTimeline({ dashas, birthYear }: { dashas: DashaPeriod[]; birthYear: number }) {
  const currentAge = new Date().getFullYear() - birthYear;
  const total = dashas.reduce((s,d) => s+d.years, 0);

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,.4)' }}>जन्म</span>
          <span style={{ fontSize:12, color:'rgba(251,191,36,.7)', fontWeight:600 }}>
            वर्तमान आयु: {currentAge} वर्ष
          </span>
          <span style={{ fontSize:12, color:'rgba(255,255,255,.4)' }}>120 वर्ष</span>
        </div>
        {/* Segmented bar */}
        <div style={{ height:12, borderRadius:999, overflow:'hidden', display:'flex',
          background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)' }}>
          {dashas.map((d,i) => (
            <div key={i} style={{
              width:`${(d.years/total)*100}%`,
              background: d.startAge<=currentAge && currentAge<d.endAge
                ? d.color : d.color+'55',
              borderRight: i<dashas.length-1 ? '1px solid rgba(0,0,0,.3)' : 'none',
              transition:'all .3s',
              position:'relative',
            }} title={`${d.planetHi}: ${d.startAge}–${d.endAge}`}>
              {d.startAge<=currentAge && currentAge<d.endAge && (
                <div style={{ position:'absolute', inset:0,
                  animation:'pulse-ring .5s ease infinite', borderRadius:999 }}/>
              )}
            </div>
          ))}
        </div>
        {/* Current marker */}
        <div style={{ position:'relative', height:0 }}>
          <div style={{
            position:'absolute', top:-2,
            left:`${Math.min(currentAge/total*100, 99)}%`,
            transform:'translateX(-50%)',
            width:3, height:16, background:'white',
            borderRadius:2, boxShadow:'0 0 8px rgba(255,255,255,.8)'
          }}/>
        </div>
      </div>

      {/* Dasha cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {dashas.map((d,i) => {
          const isActive = d.startAge <= currentAge && currentAge < d.endAge;
          const isPast   = d.endAge <= currentAge;
          const sy = birthYear + d.startAge, ey = birthYear + d.endAge;

          return (
            <div key={i} style={{
              borderRadius:18, padding:'18px 20px',
              border:`1.5px solid ${isActive ? d.color+'66' : 'rgba(255,255,255,.07)'}`,
              background: isActive
                ? `linear-gradient(135deg,${d.color}10,${d.color}06)`
                : 'rgba(255,255,255,.025)',
              opacity: isPast ? .55 : 1,
              transition:'all .25s',
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
                {/* Color dot + planet */}
                <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{
                    width:44, height:44, borderRadius:'50%',
                    background:`radial-gradient(circle at 35% 35%,${d.color},${d.color}88)`,
                    boxShadow:`0 0 16px ${d.color}44`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, fontWeight:800, color:'rgba(0,0,0,.7)',
                  }}>{d.planetHi[0]}</div>
                  {isActive && (
                    <div style={{ width:6, height:6, borderRadius:'50%',
                      background: d.color, animation:'bounce-subtle 1s ease-in-out infinite' }}/>
                  )}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:17, color: isActive ? d.color : '#f1f5f9' }}>
                      {d.planetHi}
                    </span>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,.35)' }}>महादशा</span>
                    {isActive && (
                      <span style={{
                        fontSize:10, fontWeight:700, padding:'2px 10px',
                        borderRadius:999, background:d.color, color:'#000',
                        letterSpacing:'.06em', textTransform:'uppercase'
                      }}>▶ अभी</span>
                    )}
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginBottom:8 }}>
                    {d.years} वर्ष · आयु {d.startAge}–{d.endAge} · ({sy}–{ey})
                  </div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.65)', lineHeight:1.6 }}>
                    {d.description}
                  </p>
                </div>

                {/* Year badge */}
                <div style={{ flexShrink:0, textAlign:'right' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.5)' }}>{sy}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.25)' }}>–{ey}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
