'use client';
import { ChartData } from '@/lib/jyotish-engine-v2';
import { useState } from 'react';

const SYM: Record<string,string> = {
  Sun:'☀️', Moon:'🌙', Mars:'♂️', Mercury:'☿', Jupiter:'♃',
  Venus:'♀️', Saturn:'♄', Rahu:'☊', Ketu:'☋'
};
const DIGNITY_CLASS: Record<string,string> = {
  Exalted:'dignity-exalted', Debilitated:'dignity-debilitated',
  'Own Sign':'dignity-own', Neutral:'dignity-neutral'
};
const DIGNITY_HI: Record<string,string> = {
  Exalted:'उच्च', Debilitated:'नीच', 'Own Sign':'स्वराशि', Neutral:'सम'
};

export default function ChartTable({ chart }: { chart: ChartData }) {
  const [view, setView] = useState<'table'|'wheel'>('table');
  const planets = Object.entries(chart.planets);

  // House grid
  const byHouse: Record<number,string[]> = {};
  planets.forEach(([n,d]) => { if(!byHouse[d.house]) byHouse[d.house]=[]; byHouse[d.house].push(n); });

  const houseNames = ['','प्रथम','द्वितीय','तृतीय','चतुर्थ','पंचम','षष्ठ','सप्तम','अष्टम','नवम','दशम','एकादश','द्वादश'];

  return (
    <div>
      {/* Lagna banner */}
      <div style={{
        display:'flex', flexWrap:'wrap', gap:16, alignItems:'center',
        padding:'20px 24px', borderRadius:18, marginBottom:24,
        background:'linear-gradient(135deg,rgba(251,191,36,.1),rgba(168,85,247,.08))',
        border:'1px solid rgba(251,191,36,.2)'
      }}>
        <div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>लग्न / Ascendant</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
            <span style={{ fontSize:28, fontWeight:800, color:'#fcd34d' }}>{chart.lagna.sign_hi}</span>
            <span style={{ fontSize:14, color:'rgba(255,255,255,.5)' }}>{chart.lagna.sign_en}</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,.35)' }}>{chart.lagna.degree}°</span>
          </div>
        </div>
        <div style={{ borderLeft:'1px solid rgba(255,255,255,.1)', paddingLeft:16 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', marginBottom:2 }}>नक्षत्र</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.75)' }}>{chart.lagna.nakshatra.hi} पद {chart.lagna.nakshatra.pada}</div>
        </div>
        <div style={{ borderLeft:'1px solid rgba(255,255,255,.1)', paddingLeft:16 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', marginBottom:2 }}>लग्नेश</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.75)' }}>{chart.lagna.lord}</div>
        </div>
        <div style={{ borderLeft:'1px solid rgba(255,255,255,.1)', paddingLeft:16, marginLeft:'auto' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', marginBottom:2 }}>Ayanamsa</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>Lahiri {chart.ayanamsa}°</div>
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['table','📊 तालिका'],['wheel','🔵 भाव चक्र']].map(([v,l]) => (
          <button key={v} onClick={() => setView(v as 'table'|'wheel')} style={{
            padding:'8px 18px', borderRadius:999, border:'1.5px solid',
            borderColor: view===v ? 'rgba(251,191,36,.5)' : 'rgba(255,255,255,.1)',
            background: view===v ? 'rgba(251,191,36,.1)' : 'transparent',
            color: view===v ? '#fcd34d' : 'rgba(255,255,255,.45)',
            fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .2s'
          }}>{l}</button>
        ))}
      </div>

      {view === 'table' ? (
        /* ── Planet table ── */
        <div style={{ overflowX:'auto', borderRadius:16, border:'1px solid rgba(255,255,255,.07)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead>
              <tr style={{ background:'rgba(255,255,255,.04)' }}>
                {['ग्रह','राशि','भाव','नक्षत्र / पद','स्थिति'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11,
                    fontWeight:700, color:'rgba(251,191,36,.8)', textTransform:'uppercase',
                    letterSpacing:'.07em', whiteSpace:'nowrap', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planets.map(([name,d],i) => (
                <tr key={name} style={{
                  borderTop:'1px solid rgba(255,255,255,.04)',
                  background: i%2===0 ? 'transparent' : 'rgba(255,255,255,.015)',
                  transition:'background .15s'
                }}
                  onMouseEnter={e => (e.currentTarget.style.background='rgba(251,191,36,.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i%2===0 ? 'transparent' : 'rgba(255,255,255,.015)')}
                >
                  <td style={{ padding:'14px 16px', whiteSpace:'nowrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:20, lineHeight:1 }}>{SYM[name]}</span>
                      <div>
                        <div style={{ fontWeight:600, color:'#f1f5f9' }}>{d.name_hi}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>{name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ fontWeight:500 }}>{d.sign_hi}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>{d.sign_en} {d.degree}°</div>
                  </td>
                  <td style={{ padding:'14px 16px', textAlign:'center' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%',
                      background:'rgba(251,191,36,.1)', border:'1.5px solid rgba(251,191,36,.25)',
                      display:'inline-flex', alignItems:'center', justifyContent:'center',
                      fontSize:15, fontWeight:700, color:'#fcd34d' }}>
                      {d.house}
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ fontSize:13 }}>{d.nakshatra.hi}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>{d.nakshatra.en} · पद {d.nakshatra.pada}</div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span className={`dignity-badge ${DIGNITY_CLASS[d.dignity]}`}>
                      {DIGNITY_HI[d.dignity]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── House wheel ── */
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {Array.from({length:12},(_,i)=>i+1).map(h => (
              <div key={h} style={{
                borderRadius:16, padding:'14px 12px', textAlign:'center',
                background: byHouse[h]?.length ? 'rgba(251,191,36,.06)' : 'rgba(255,255,255,.025)',
                border:`1.5px solid ${byHouse[h]?.length ? 'rgba(251,191,36,.2)' : 'rgba(255,255,255,.06)'}`,
                transition:'all .2s'
              }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginBottom:6,
                  textTransform:'uppercase', letterSpacing:'.08em' }}>
                  {houseNames[h]}
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(251,191,36,.7)', marginBottom:8 }}>भाव {h}</div>
                <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:4, minHeight:28 }}>
                  {byHouse[h]?.map(p => (
                    <span key={p} title={p} style={{ fontSize:18, lineHeight:1 }}>{SYM[p]}</span>
                  )) || <span style={{ color:'rgba(255,255,255,.15)', fontSize:12 }}>—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
