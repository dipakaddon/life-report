'use client';

interface PDFDownloadProps {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  lagna: string;
  yogaCount: number;
}

export default function PDFDownload({ name, birthDate, birthTime, birthPlace, lagna, yogaCount }: PDFDownloadProps) {
  const handlePrint = () => {
    // Add print styles
    const style = document.createElement('style');
    style.id = 'print-style';
    style.textContent = `
      @media print {
        body { background: white !important; color: black !important; }
        header, footer, .no-print, button { display: none !important; }
        .print-section { break-inside: avoid; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => style.remove(), 1000);
  };

  const handleDownloadTxt = () => {
    // Collect all prediction text from the DOM
    const sections = document.querySelectorAll('[data-prediction-section]');
    let content = `🕉️ वैदिक जन्म कुंडली — जीवन विश्लेषण\n`;
    content += `${'='.repeat(60)}\n\n`;
    content += `नाम: ${name}\n`;
    content += `जन्म तिथि: ${new Date(birthDate).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    content += `जन्म समय: ${birthTime} IST\n`;
    content += `जन्म स्थान: ${birthPlace}\n`;
    content += `लग्न: ${lagna}\n`;
    content += `विशेष योग: ${yogaCount}\n\n`;
    content += `आधार ग्रंथ: गर्ग होरा शास्त्र, फलदीपिका, भृगु संहिता, बृहज्जातकम्, वेदांग ज्योतिष\n`;
    content += `${'='.repeat(60)}\n\n`;

    sections.forEach(sec => {
      const title = sec.querySelector('[data-section-title]')?.textContent || '';
      const items = sec.querySelectorAll('[data-prediction-item]');
      content += `\n${title}\n${'-'.repeat(40)}\n`;
      items.forEach(item => {
        const text = item.querySelector('[data-pred-text]')?.textContent || '';
        const source = item.querySelector('[data-pred-source]')?.textContent || '';
        content += `• ${text}\n  (स्रोत: ${source})\n`;
      });
    });

    content += `\n${'='.repeat(60)}\n`;
    content += `यह रिपोर्ट केवल ज्योतिष अध्ययन पर आधारित है।\n`;
    content += `अनुभवी ज्योतिषाचार्य की व्यक्तिगत सलाह अवश्य लें।\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kundali_${name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3 flex-wrap no-print">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white/85 text-sm font-semibold transition-all duration-300 border border-white/20 hover:border-yellow-400/50 hover:text-white hover:-translate-y-0.5"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print / PDF
      </button>

      <button
        onClick={handleDownloadTxt}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-amber-300 text-sm font-semibold transition-all duration-300 border border-amber-400/30 hover:border-amber-400/60 hover:text-amber-200 hover:-translate-y-0.5"
        style={{
          background: 'rgba(251,191,36,0.1)',
          backdropFilter: 'blur(16px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(251,191,36,0.15)',
        }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        डाउनलोड (.txt)
      </button>
    </div>
  );
}
