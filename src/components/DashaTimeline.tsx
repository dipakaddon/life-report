'use client';
import { DashaPeriod } from '@/lib/jyotish-engine';

interface DashaTimelineProps { dashas: DashaPeriod[]; birthYear: number; }

export default function DashaTimeline({ dashas, birthYear }: DashaTimelineProps) {
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;
  
  const totalYears = dashas.reduce((s, d) => s + d.years, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <span>वर्तमान आयु: {currentAge} वर्ष</span>
      </div>
      
      {/* Timeline bar */}
      <div className="relative h-8 rounded-full overflow-hidden flex">
        {dashas.map((dasha, i) => (
          <div
            key={i}
            style={{ width: `${(dasha.years / totalYears) * 100}%`, backgroundColor: dasha.color + '99' }}
            className="relative group"
            title={`${dasha.planetHi}: ${dasha.startAge}-${dasha.endAge} वर्ष`}
          >
            {dasha.startAge <= currentAge && currentAge < dasha.endAge && (
              <div className="absolute inset-0 border-2 border-white rounded-sm"></div>
            )}
          </div>
        ))}
        {/* Current age marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${(Math.min(currentAge, totalYears) / totalYears) * 100}%` }}
        />
      </div>

      {/* Dasha cards */}
      <div className="space-y-3">
        {dashas.map((dasha, i) => {
          const isActive = dasha.startAge <= currentAge && currentAge < dasha.endAge;
          const isPast = dasha.endAge <= currentAge;
          const startYear = birthYear + dasha.startAge;
          const endYear = birthYear + dasha.endAge;
          
          return (
            <div key={i} className={`rounded-xl p-4 border transition-all ${
              isActive 
                ? 'border-amber-400/60 bg-amber-400/10 ring-1 ring-amber-400/30' 
                : isPast 
                  ? 'border-white/10 bg-white/3 opacity-60'
                  : 'border-white/15 bg-white/5'
            }`}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                       style={{ backgroundColor: dasha.color + 'AA' }}>
                    {dasha.planetHi[0]}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white" style={{ color: dasha.color }}>{dasha.planetHi}</span>
                    <span className="text-white/40 text-sm">{dasha.planet} Mahadasha</span>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">
                        ▶ वर्तमान
                      </span>
                    )}
                  </div>
                  <div className="text-white/50 text-xs mt-1">
                    {dasha.years} वर्ष | आयु {dasha.startAge}–{dasha.endAge} | ({startYear}–{endYear})
                  </div>
                  <p className="text-white/70 text-sm mt-2">{dasha.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
