"""
Vercel Python Serverless Function
Path: /api/chart-py
Called by: /src/app/api/chart/route.ts when running on Vercel

This is the EXACT same calculation as calc_chart.py
pyswisseph works identically as a Python package on Vercel
"""
import json
from http.server import BaseHTTPRequestHandler
import swisseph as swe


# ── Nakshatra lookup ──────────────────────────────────────────
NAKSHATRAS = [
    ('Ashwini',           'अश्विनी',         'Ketu'),
    ('Bharani',           'भरणी',            'Venus'),
    ('Krittika',          'कृत्तिका',         'Sun'),
    ('Rohini',            'रोहिणी',           'Moon'),
    ('Mrigashira',        'मृगशिरा',          'Mars'),
    ('Ardra',             'आर्द्रा',           'Rahu'),
    ('Punarvasu',         'पुनर्वसु',          'Jupiter'),
    ('Pushya',            'पुष्य',             'Saturn'),
    ('Ashlesha',          'आश्लेषा',           'Mercury'),
    ('Magha',             'मघा',              'Ketu'),
    ('Purva Phalguni',    'पूर्व फाल्गुनी',    'Venus'),
    ('Uttara Phalguni',   'उत्तर फाल्गुनी',    'Sun'),
    ('Hasta',             'हस्त',              'Moon'),
    ('Chitra',            'चित्रा',            'Mars'),
    ('Swati',             'स्वाती',            'Rahu'),
    ('Vishakha',          'विशाखा',           'Jupiter'),
    ('Anuradha',          'अनुराधा',           'Saturn'),
    ('Jyeshtha',          'ज्येष्ठा',           'Mercury'),
    ('Moola',             'मूल',              'Ketu'),
    ('Purva Ashadha',     'पूर्वाषाढ़ा',        'Venus'),
    ('Uttara Ashadha',    'उत्तराषाढ़ा',        'Sun'),
    ('Shravana',          'श्रवण',             'Moon'),
    ('Dhanishtha',        'धनिष्ठा',           'Mars'),
    ('Shatabhisha',       'शतभिषा',            'Rahu'),
    ('Purva Bhadrapada',  'पूर्व भाद्रपद',      'Jupiter'),
    ('Uttara Bhadrapada', 'उत्तर भाद्रपद',      'Saturn'),
    ('Revati',            'रेवती',             'Mercury'),
]

SIGNS_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
            'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
SIGNS_HI = ['मेष','वृष','मिथुन','कर्क','सिंह','कन्या',
            'तुला','वृश्चिक','धनु','मकर','कुंभ','मीन']
LORDS    = ['Mars','Venus','Mercury','Moon','Sun','Mercury',
            'Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']
NAME_HI  = {'Sun':'सूर्य','Moon':'चंद्र','Mars':'मंगल','Mercury':'बुध',
             'Jupiter':'गुरु','Venus':'शुक्र','Saturn':'शनि',
             'Rahu':'राहु','Ketu':'केतु'}

EXALT = {'Sun':0,'Moon':1,'Mars':9,'Mercury':5,'Jupiter':3,'Venus':11,'Saturn':6}
DEBIL = {'Sun':6,'Moon':7,'Mars':3,'Mercury':11,'Jupiter':9,'Venus':5,'Saturn':0}
OWN   = {'Sun':[4],'Moon':[3],'Mars':[0,7],'Mercury':[2,5],
         'Jupiter':[8,11],'Venus':[1,6],'Saturn':[9,10]}

PLANET_IDS = {
    'Sun': swe.SUN, 'Moon': swe.MOON, 'Mars': swe.MARS,
    'Mercury': swe.MERCURY, 'Jupiter': swe.JUPITER,
    'Venus': swe.VENUS, 'Saturn': swe.SATURN, 'Rahu': swe.MEAN_NODE,
}


def get_nakshatra(sid_deg: float) -> dict:
    idx  = int(sid_deg / (360 / 27)) % 27
    pada = int((sid_deg % (360 / 27)) / (360 / 108)) + 1
    en, hi, lord = NAKSHATRAS[idx]
    return {'en': en, 'hi': hi, 'lord': lord, 'pada': pada}


def calc_chart(year: int, month: int, day: int,
               hour: int, minute: int,
               lat: float, lon: float) -> dict:
    """
    Full Vedic chart calculation.
    Input: local IST time → converted to UTC → Swiss Ephemeris → sidereal (Lahiri)
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    # IST (UTC+5:30) → UTC
    total_min = hour * 60 + minute - 330
    if total_min < 0:
        total_min += 1440
        day -= 1

    jd       = swe.julday(year, month, day, total_min / 60.0)
    ayanamsa = swe.get_ayanamsa(jd)

    # Ascendant
    _houses, ascmc = swe.houses(jd, lat, lon, b'P')   # Placidus
    asc_sid      = (ascmc[0] - ayanamsa) % 360
    asc_sign_idx = int(asc_sid / 30)

    result = {
        'ayanamsa': round(ayanamsa, 4),
        'lagna': {
            'sign_en':   SIGNS_EN[asc_sign_idx],
            'sign_hi':   SIGNS_HI[asc_sign_idx],
            'degree':    round(asc_sid % 30, 2),
            'lord':      LORDS[asc_sign_idx],
            'nakshatra': get_nakshatra(asc_sid),
        },
        'planets': {},
    }

    rahu_sid = 0.0

    for pname, pid in PLANET_IDS.items():
        pos, _ = swe.calc_ut(jd, pid)
        sid      = (pos[0] - ayanamsa) % 360
        if pname == 'Rahu':
            rahu_sid = sid
        sign_idx = int(sid / 30)
        house    = ((sign_idx - asc_sign_idx) % 12) + 1

        dignity = 'Neutral'
        if pname in EXALT and sign_idx == EXALT[pname]:   dignity = 'Exalted'
        elif pname in DEBIL and sign_idx == DEBIL[pname]: dignity = 'Debilitated'
        elif pname in OWN   and sign_idx in OWN[pname]:   dignity = 'Own Sign'

        result['planets'][pname] = {
            'sign_en':   SIGNS_EN[sign_idx],
            'sign_hi':   SIGNS_HI[sign_idx],
            'degree':    round(sid % 30, 2),
            'house':     house,
            'nakshatra': get_nakshatra(sid),
            'dignity':   dignity,
            'name_hi':   NAME_HI[pname],
        }

    # Ketu = Rahu + 180°
    ketu_sid      = (rahu_sid + 180.0) % 360
    ketu_sign_idx = int(ketu_sid / 30)
    result['planets']['Ketu'] = {
        'sign_en':   SIGNS_EN[ketu_sign_idx],
        'sign_hi':   SIGNS_HI[ketu_sign_idx],
        'degree':    round(ketu_sid % 30, 2),
        'house':     ((ketu_sign_idx - asc_sign_idx) % 12) + 1,
        'nakshatra': get_nakshatra(ketu_sid),
        'dignity':   'Neutral',
        'name_hi':   NAME_HI['Ketu'],
    }

    return result


# ── Vercel serverless handler ─────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body   = json.loads(self.rfile.read(length))

            chart = calc_chart(
                int(body['year']), int(body['month']), int(body['day']),
                int(body['hour']), int(body['minute']),
                float(body['lat']), float(body['lon']),
            )

            payload = json.dumps(chart, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type',  'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(payload)

        except (KeyError, ValueError) as e:
            self._error(400, f'Invalid input: {e}')
        except Exception as e:
            self._error(500, f'Calculation error: {e}')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _error(self, code: int, msg: str):
        body = json.dumps({'error': msg}).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type',  'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass
