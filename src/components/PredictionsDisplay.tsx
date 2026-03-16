'use client';
import { PredictionSection } from '@/lib/jyotish-engine';
import { useState } from 'react';

interface PredictionsDisplayProps { sections: PredictionSection[]; }

const TYPE_STYLES = {
  positive: { icon: '✅', color: 'text-green-300', bg: 'bg-green-400/8 border-l-green-400' },
  caution: { icon: '⚠️', color: 'text-amber-300', bg: 'bg-amber-400/8 border-l-amber-400' },
  neutral: { icon: '📌', color: 'text-white/80', bg: 'bg-white/5 border-l-white/20' },
};

export default function PredictionsDisplay({ sections }: PredictionsDisplayProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((s, i) => (
          <button
            key={i} onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              active === i 
                ? 'bg-amber-500 text-black' 
                : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
            }`}
          >
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.titleHi}</span>
            <span className="sm:hidden">{s.titleHi.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active section */}
      {sections[active] && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{sections[active].icon}</span>
            <div>
              <h3 className="text-amber-300 font-bold text-xl">{sections[active].titleHi}</h3>
              <p className="text-white/40 text-sm">{sections[active].title}</p>
            </div>
          </div>
          <div className="space-y-3">
            {sections[active].predictions.map((pred, i) => {
              const style = TYPE_STYLES[pred.type];
              return (
                <div key={i} className={`rounded-xl p-4 border border-white/10 border-l-4 ${style.bg}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{style.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${style.color}`}>{pred.text}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-white/30 text-xs">📖</span>
                        <span className="text-white/30 text-xs">{pred.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {sections[active].predictions.length === 0 && (
              <div className="text-center py-8 text-white/40">
                <p>इस विषय में कोई विशेष जानकारी नहीं।</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
