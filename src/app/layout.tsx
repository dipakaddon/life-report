import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "वैदिक जन्म कुंडली | Vedic Astrology",
  description: "पंच-ग्रंथ ज्योतिष — Swiss Ephemeris से सटीक कुंडली और 26 विषयों पर हिंदी भविष्यवाणी",
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D0A1F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body style={{ background: '#050510', margin: 0, minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
