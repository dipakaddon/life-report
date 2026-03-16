'use client';
import { PredictionSection } from '@/lib/jyotish-engine-v2';
import { useState } from 'react';

interface Props { sections: PredictionSection[]; }

const TYPE_STYLES = {
  positive: { icon: '✅', border: 'border-l-green-500', bg: 'bg-green-500/5', text: 'text-green-200' },
  caution:  { icon: '⚠️', border: 'border-l-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-200' },
  neutral:  { icon: '📌', border: 'border-l-white/20', bg: 'bg-white/3', text: 'text-white/80' },
};

export default function PredictionsDisplayV2({ sections }: Props) {
  const [active, setActive] = useState(0);

  // Group sections for sidebar navigation
  const groups = [
    { label: 'व्यक्तित्व', ids: ['lagna', 'mind', 'strength'] },
    { label: 'जीवन क्षेत्र', ids: ['edu', 'career', 'wealth', 'marriage', 'children', 'longevity', 'fame'] },
    { label: 'परिवार', ids: ['mother', 'father', 'siblings'] },
    { label: 'चुनौतियाँ', ids: ['health', 'enemies', 'legal', 'losses', 'travel'] },
    { label: 'ज्योतिष', ids: ['nakshatra', 'combos', 'bhrigu', 'spirit', 'houses', 'friends'] },
    { label: 'सारांश', ids: ['summary'] },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="md:w-52 flex-shrink-0">
        <div className="space-y-1 md:sticky md:top-4">
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => setActive(i)}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                active === i ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}>
              <span className="text-base flex-shrink-0">{s.icon}</span>
              <span className="truncate">{s.titleHi}</span>
              <span className="ml-auto text-xs text-white/30 flex-shrink-0">{s.predictions.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {sections[active] && (
          <div data-prediction-section>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
              <span className="text-3xl">{sections[active].icon}</span>
              <div>
                <h3 className="text-amber-300 font-bold text-xl" data-section-title>{sections[active].titleHi}</h3>
                <p className="text-white/30 text-sm">विषय {active + 1}/26</p>
              </div>
            </div>
            <div className="space-y-3">
              {sections[active].predictions.map((pred, i) => {
                const style = TYPE_STYLES[pred.type];
                return (
                  <div key={i} data-prediction-item
                    className={`rounded-xl p-4 border border-white/10 border-l-4 ${style.border} ${style.bg}`}>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 text-sm mt-0.5">{style.icon}</span>
                      <div>
                        <p className={`text-sm leading-relaxed ${style.text}`} data-pred-text>{pred.text}</p>
                        <p className="text-white/25 text-xs mt-1.5 flex items-center gap-1" data-pred-source>
                          <span>📖</span> {pred.source}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {sections[active].predictions.length === 0 && (
                <div className="text-center py-8 text-white/30">इस विषय में कोई जानकारी नहीं।</div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm text-white/60 transition-all">
                ← पिछला
              </button>
              <span className="flex items-center text-white/30 text-sm px-3">{active + 1}/{sections.length}</span>
              <button onClick={() => setActive(Math.min(sections.length - 1, active + 1))} disabled={active === sections.length - 1}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm text-white/60 transition-all">
                अगला →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
