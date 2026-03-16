'use client';
import { Yoga } from '@/lib/jyotish-engine';

interface YogaDisplayProps { yogas: Yoga[]; }

const STRENGTH_CONFIG = {
  Excellent: { label: 'उत्कृष्ट', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', stars: '⭐⭐⭐⭐⭐' },
  Good: { label: 'उत्तम', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', stars: '⭐⭐⭐⭐' },
  Moderate: { label: 'सामान्य', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', stars: '⭐⭐⭐' },
};

export default function YogaDisplay({ yogas }: YogaDisplayProps) {
  if (!yogas.length) return (
    <div className="text-center py-8 text-white/40">
      <div className="text-4xl mb-3">🔍</div>
      <p>इस कुंडली में कोई विशेष योग नहीं पाया गया।</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {yogas.map((yoga, i) => {
        const cfg = STRENGTH_CONFIG[yoga.strength];
        return (
          <div key={i} className={`rounded-2xl border p-5 ${cfg.bg}`}>
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className={`font-bold text-lg ${cfg.color}`}>{yoga.nameHi}</h3>
                  <span className="text-white/50 text-sm">{yoga.name}</span>
                </div>
                <div className="text-white/40 text-xs mt-1">📖 स्रोत: {yoga.source}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm">{cfg.stars}</div>
                <div className={`text-xs mt-1 ${cfg.color}`}>{cfg.label}</div>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{yoga.description}</p>
          </div>
        );
      })}
    </div>
  );
}
