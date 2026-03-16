'use client';
import { ChartData } from '@/lib/jyotish-engine';

interface ChartTableProps { chart: ChartData; }

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☀️', Moon: '🌙', Mars: '♂', Mercury: '☿', Jupiter: '♃',
  Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋'
};

const DIGNITY_COLORS: Record<string, string> = {
  Exalted: 'text-green-400 font-bold',
  Debilitated: 'text-red-400',
  'Own Sign': 'text-blue-400 font-semibold',
  Neutral: 'text-white/70'
};

const DIGNITY_HI: Record<string, string> = {
  Exalted: 'उच्च', Debilitated: 'नीच', 'Own Sign': 'स्वराशि', Neutral: '-'
};

export default function ChartTable({ chart }: ChartTableProps) {
  const planets = Object.entries(chart.planets);
  
  // Group planets by house for visual display
  const byHouse: Record<number, string[]> = {};
  planets.forEach(([name, data]) => {
    if (!byHouse[data.house]) byHouse[data.house] = [];
    byHouse[data.house].push(name);
  });

  return (
    <div className="space-y-6">
      {/* Lagna Card */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{chart.lagna.sign_hi}</div>
            <div className="text-sm text-white/60">{chart.lagna.sign_en}</div>
          </div>
          <div className="flex-1 min-w-48">
            <div className="text-amber-200 font-semibold text-lg">लग्न / Ascendant</div>
            <div className="text-white/70 text-sm">
              {chart.lagna.degree.toFixed(1)}° | नक्षत्र: {chart.lagna.nakshatra.hi} ({chart.lagna.nakshatra.en}) पद {chart.lagna.nakshatra.pada}
            </div>
            <div className="text-white/60 text-sm">लग्नेश: {chart.lagna.lord} | Ayanamsa: {chart.ayanamsa.toFixed(2)}°</div>
          </div>
        </div>
      </div>

      {/* Planet Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/10 text-amber-200">
              <th className="px-4 py-3 text-left">ग्रह</th>
              <th className="px-4 py-3 text-left">राशि</th>
              <th className="px-4 py-3 text-center">भाव</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">नक्षत्र</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">पद</th>
              <th className="px-4 py-3 text-center">स्थिति</th>
            </tr>
          </thead>
          <tbody>
            {planets.map(([name, data], i) => (
              <tr key={name} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/3' : ''} hover:bg-white/8 transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{PLANET_SYMBOLS[name]}</span>
                    <div>
                      <div className="text-white font-medium">{data.name_hi}</div>
                      <div className="text-white/40 text-xs">{name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-white">{data.sign_hi}</div>
                  <div className="text-white/40 text-xs">{data.sign_en} {data.degree.toFixed(1)}°</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-amber-300 font-bold">{data.house}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="text-white/80">{data.nakshatra.hi}</div>
                  <div className="text-white/40 text-xs">{data.nakshatra.en}</div>
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-white/60">{data.nakshatra.pada}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${DIGNITY_COLORS[data.dignity]}`}>
                    {DIGNITY_HI[data.dignity]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* House Map */}
      <div>
        <h3 className="text-amber-200 font-semibold mb-3 text-sm uppercase tracking-wider">भाव-चक्र / House Map</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(house => (
            <div key={house} className={`rounded-xl p-3 text-center border ${byHouse[house]?.length ? 'bg-amber-500/15 border-amber-400/30' : 'bg-white/5 border-white/10'}`}>
              <div className="text-white/40 text-xs mb-1">भाव {house}</div>
              <div className="flex flex-wrap justify-center gap-1">
                {byHouse[house]?.map(p => (
                  <span key={p} className="text-base" title={p}>{PLANET_SYMBOLS[p]}</span>
                )) || <span className="text-white/20 text-xs">—</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
