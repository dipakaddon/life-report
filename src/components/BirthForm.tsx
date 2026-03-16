'use client';
import { useState, useRef } from 'react';

interface FormData {
  name: string; date: string; time: string; place: string;
  lat?: number; lon?: number;
}

interface BirthFormProps {
  onSubmit: (data: FormData & { lat: number; lon: number }) => void;
  loading: boolean;
}

export default function BirthForm({ onSubmit, loading }: BirthFormProps) {
  const [form, setForm] = useState<FormData>({ name: '', date: '', time: '', place: '' });
  const [geocoding, setGeocoding] = useState(false);
  const [geoResult, setGeoResult] = useState<{ lat: number; lon: number; display: string } | null>(null);
  const [geoError, setGeoError] = useState('');
  const placeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined as any);

  const handlePlaceChange = (value: string) => {
    setForm(f => ({ ...f, place: value }));
    setGeoResult(null);
    setGeoError('');
    clearTimeout(placeTimeout.current);
    if (value.length > 2) {
      placeTimeout.current = setTimeout(async () => {
        setGeocoding(true);
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=3`;
          const res = await fetch(url, { headers: { 'User-Agent': 'JyotishApp/1.0' } });
          const data = await res.json();
          if (data?.length > 0) {
            setGeoResult({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name });
            setGeoError('');
          } else {
            setGeoError('स्थान नहीं मिला। कृपया पूरा नाम लिखें।');
          }
        } catch {
          setGeoError('Geocoding failed. Please try again.');
        }
        setGeocoding(false);
      }, 800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geoResult) { setGeoError('Please enter a valid place first'); return; }
    const [year, month, day] = form.date.split('-').map(Number);
    const [hour, minute] = form.time.split(':').map(Number);
    onSubmit({ ...form, lat: geoResult.lat, lon: geoResult.lon, date: form.date, time: form.time });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-amber-200 mb-2">आपका नाम / Your Name</label>
        <input
          type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="अपना नाम लिखें..."
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-amber-200 mb-2">जन्म तिथि / Date of Birth</label>
          <input
            type="date" value={form.date} required
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all [color-scheme:dark]"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-amber-200 mb-2">जन्म समय / Birth Time (IST)</label>
          <input
            type="time" value={form.time} required
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Place */}
      <div>
        <label className="block text-sm font-medium text-amber-200 mb-2">जन्म स्थान / Birth Place</label>
        <div className="relative">
          <input
            type="text" value={form.place} required
            onChange={e => handlePlaceChange(e.target.value)}
            placeholder="City, State, Country (e.g., Mumbai, Maharashtra, India)"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all pr-12"
          />
          {geocoding && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {geoResult && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="truncate">{geoResult.display.split(',').slice(0,3).join(',')}</span>
            <span className="text-white/40 text-xs flex-shrink-0">({geoResult.lat.toFixed(2)}°N, {geoResult.lon.toFixed(2)}°E)</span>
          </div>
        )}
        {geoError && <p className="mt-2 text-sm text-red-400">{geoError}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit" disabled={loading || !geoResult || !form.date || !form.time}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-400 hover:to-orange-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            कुंडली बन रही है...
          </>
        ) : (
          <>
            <span>🕉️</span>
            जन्म कुंडली देखें / Generate Report
          </>
        )}
      </button>
    </form>
  );
}
