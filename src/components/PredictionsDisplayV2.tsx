'use client';
import { PredictionSection } from '@/lib/jyotish-engine-v2';
import { useState } from 'react';

export default function PredictionsDisplayV2({ sections }: { sections: PredictionSection[] }) {
  const [active, setActive] = useState(0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {/* Horizontal scrolling topic pills */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:12,
        scrollbarWidth:'none', marginBottom:20 }}
        className="no-print">
        {sections.map((s,i) => (
          <button key={s.id} onClick={() => setActive(i)}
            className={`tab-pill ${active===i ? 'active' : ''}`}>
            <span style={{ fontSize:16 }}>{s.icon}</span>
            <span style={{ fontSize:13 }}>{s.titleHi}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {sections[active] && (
        <div data-prediction-section key={active} style={{ animation:'slide-in .25s ease' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20,
            paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ width:52, height:52, borderRadius:16, flexShrink:0,
              background:'rgba(251,191,36,.1)', border:'1px solid rgba(251,191,36,.2)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
              {sections[active].icon}
            </div>
            <div>
              <h3 data-section-title style={{ fontSize:20, fontWeight:700, color:'#fcd34d', marginBottom:2 }}>
                {sections[active].titleHi}
              </h3>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.3)' }}>
                विषय {active+1}/{sections.length}
              </p>
            </div>
            {/* Count badge */}
            <div style={{ marginLeft:'auto', padding:'4px 12px', borderRadius:999,
              background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)',
              fontSize:12, color:'rgba(255,255,255,.4)' }}>
              {sections[active].predictions.length} अंक
            </div>
          </div>

          {/* Predictions */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {sections[active].predictions.map((pred,i) => (
              <div key={i} data-prediction-item
                className={`pred-item ${pred.type}`}
                style={{ animationDelay: `${i*.04}s` }}>
                <div style={{ display:'flex', gap:12 }}>
                  <span style={{ flexShrink:0, fontSize:16, marginTop:1 }}>
                    {pred.type==='positive' ? '✅' : pred.type==='caution' ? '⚠️' : '📌'}
                  </span>
                  <div>
                    <p data-pred-text style={{ fontSize:14, lineHeight:1.7,
                      color: pred.type==='positive' ? 'rgba(200,255,200,.85)'
                           : pred.type==='caution'  ? 'rgba(255,230,160,.85)'
                           : 'rgba(241,245,249,.75)' }}>
                      {pred.text}
                    </p>
                    <p data-pred-source style={{ marginTop:6, fontSize:11,
                      color:'rgba(255,255,255,.22)', display:'flex', alignItems:'center', gap:4 }}>
                      <span>📖</span>{pred.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <div style={{ display:'flex', gap:12, marginTop:24, paddingTop:20,
            borderTop:'1px solid rgba(255,255,255,.07)' }}>
            <button onClick={() => setActive(Math.max(0,active-1))} disabled={active===0}
              style={{ flex:1, padding:'10px', borderRadius:12,
                background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)',
                color:'rgba(255,255,255,.5)', fontSize:13, fontWeight:600,
                cursor:active===0?'not-allowed':'pointer', opacity:active===0?.4:1,
                fontFamily:'inherit', transition:'all .2s' }}>
              ← पिछला
            </button>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, color:'rgba(255,255,255,.25)', minWidth:60, textAlign:'center' }}>
              {active+1}/{sections.length}
            </div>
            <button onClick={() => setActive(Math.min(sections.length-1,active+1))} disabled={active===sections.length-1}
              style={{ flex:1, padding:'10px', borderRadius:12,
                background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)',
                color:'rgba(255,255,255,.5)', fontSize:13, fontWeight:600,
                cursor:active===sections.length-1?'not-allowed':'pointer',
                opacity:active===sections.length-1?.4:1,
                fontFamily:'inherit', transition:'all .2s' }}>
              अगला →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
