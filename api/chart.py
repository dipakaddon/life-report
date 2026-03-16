"""
Vercel Python Serverless Function: /api/chart
Calculates Vedic birth chart using Swiss Ephemeris (pyswisseph)
Lahiri Ayanamsa, Placidus houses, Sidereal positions
"""
import json
from http.server import BaseHTTPRequestHandler
import swisseph as swe


def get_nakshatra(sid_deg: float) -> dict:
    nakshatras = [
        ('Ashwini',          'अश्विनी',        'Ketu'),
        ('Bharani',          'भरणी',           'Venus'),
        ('Krittika',         'कृत्तिका',        'Sun'),
        ('Rohini',           'रोहिणी',          'Moon'),
        ('Mrigashira',       'मृगशिरा',         'Mars'),
        ('Ardra',            'आर्द्रा',          'Rahu'),
        ('Punarvasu',        'पुनर्वसु',         'Jupiter'),
        ('Pushya',           'पुष्य',            'Saturn'),
        ('Ashlesha',         'आश्लेषा',          'Mercury'),
        ('Magha',            'मघा',             'Ketu'),
        ('Purva Phalguni',   'पूर्व फाल्गुनी',   'Venus'),
        ('Uttara Phalguni',  'उत्तर फाल्गुनी',   'Sun'),
        ('Hasta',            'हस्त',             'Moon'),
        ('Chitra',           'चित्रा',           'Mars'),
        ('Swati',            'स्वाती',           'Rahu'),
        ('Vishakha',         'विशाखा',          'Jupiter'),
        ('Anuradha',         'अनुराधा',          'Saturn'),
        ('Jyeshtha',         'ज्येष्ठा',          'Mercury'),
        ('Moola',            'मूल',             'Ketu'),
        ('Purva Ashadha',    'पूर्वाषाढ़ा',       'Venus'),
        ('Uttara Ashadha',   'उत्तराषाढ़ा',       'Sun'),
        ('Shravana',         'श्रवण',            'Moon'),
        ('Dhanishtha',       'धनिष्ठा',          'Mars'),
        ('Shatabhisha',      'शतभिषा',           'Rahu'),
        ('Purva Bhadrapada', 'पूर्व भाद्रपद',     'Jupiter'),
        ('Uttara Bhadrapada','उत्तर भाद्रपद',     'Saturn'),
        ('Revati',           'रेवती',            'Mercury'),
    ]
    idx = int(sid_deg / (360 / 27)) % 27
    pada = int((sid_deg % (360 / 27)) / (360 / 108)) + 1
    en, hi, lord = nakshatras[idx]
    return {'en': en, 'hi': hi, 'lord': lord, 'pada': pada}


def calc_chart(year: int, month: int, day: int,
               hour: int, minute: int,
               lat: float, lon: float) -> dict:
    """
    Calculate complete Vedic birth chart.
    Input time assumed IST (UTC+5:30), converted to UTC internally.
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    # IST → UTC  (-5h30m)
    total_min = hour * 60 + minute - 330
    if total_min < 0:
        total_min += 1440
        day -= 1          # simple date rollback (works for most cases)

    ut_hour = total_min / 60.0
    jd = swe.julday(year, month, day, ut_hour)
    ayanamsa = swe.get_ayanamsa(jd)

    # Ascendant (Placidus houses)
    houses, ascmc = swe.houses(jd, lat, lon, b'P')
    asc_trop = ascmc[0]
    asc_sid = (asc_trop - ayanamsa) % 360

    signs_en = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    signs_hi = ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
                'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन']
    lords   = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
               'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']

    asc_sign_idx = int(asc_sid / 30)
    asc_deg      = asc_sid % 30

    result = {
        'ayanamsa': round(ayanamsa, 4),
        'lagna': {
            'sign_en':   signs_en[asc_sign_idx],
            'sign_hi':   signs_hi[asc_sign_idx],
            'degree':    round(asc_deg, 2),
            'lord':      lords[asc_sign_idx],
            'nakshatra': get_nakshatra(asc_sid),
        },
        'planets': {},
    }

    # Dignity tables
    exalt_sign = {'Sun': 0, 'Moon': 1, 'Mars': 9, 'Mercury': 5,
                  'Jupiter': 3, 'Venus': 11, 'Saturn': 6}
    debil_sign = {'Sun': 6, 'Moon': 7, 'Mars': 3, 'Mercury': 11,
                  'Jupiter': 9, 'Venus': 5,  'Saturn': 0}
    own_signs  = {'Sun': [4], 'Moon': [3], 'Mars': [0, 7],
                  'Mercury': [2, 5], 'Jupiter': [8, 11],
                  'Venus': [1, 6], 'Saturn': [9, 10]}
    name_hi    = {'Sun': 'सूर्य', 'Moon': 'चंद्र', 'Mars': 'मंगल',
                  'Mercury': 'बुध', 'Jupiter': 'गुरु', 'Venus': 'शुक्र',
                  'Saturn': 'शनि', 'Rahu': 'राहु', 'Ketu': 'केतु'}

    planet_ids = {
        'Sun':     swe.SUN,
        'Moon':    swe.MOON,
        'Mars':    swe.MARS,
        'Mercury': swe.MERCURY,
        'Jupiter': swe.JUPITER,
        'Venus':   swe.VENUS,
        'Saturn':  swe.SATURN,
        'Rahu':    swe.MEAN_NODE,
    }

    rahu_sid_actual = 0.0

    for pname, pid in planet_ids.items():
        pos, _ = swe.calc_ut(jd, pid)
        sid = (pos[0] - ayanamsa) % 360

        if pname == 'Rahu':
            rahu_sid_actual = sid

        sign_idx = int(sid / 30)
        deg      = sid % 30
        house    = ((sign_idx - asc_sign_idx) % 12) + 1

        # Dignity
        dignity = 'Neutral'
        if pname in exalt_sign and sign_idx == exalt_sign[pname]:
            dignity = 'Exalted'
        elif pname in debil_sign and sign_idx == debil_sign[pname]:
            dignity = 'Debilitated'
        elif pname in own_signs and sign_idx in own_signs[pname]:
            dignity = 'Own Sign'

        result['planets'][pname] = {
            'sign_en':   signs_en[sign_idx],
            'sign_hi':   signs_hi[sign_idx],
            'degree':    round(deg, 2),
            'house':     house,
            'nakshatra': get_nakshatra(sid),
            'dignity':   dignity,
            'name_hi':   name_hi[pname],
        }

    # Ketu = exactly opposite Rahu
    ketu_sid      = (rahu_sid_actual + 180.0) % 360
    ketu_sign_idx = int(ketu_sid / 30)
    ketu_deg      = ketu_sid % 30
    ketu_house    = ((ketu_sign_idx - asc_sign_idx) % 12) + 1

    result['planets']['Ketu'] = {
        'sign_en':   signs_en[ketu_sign_idx],
        'sign_hi':   signs_hi[ketu_sign_idx],
        'degree':    round(ketu_deg, 2),
        'house':     ketu_house,
        'nakshatra': get_nakshatra(ketu_sid),
        'dignity':   'Neutral',
        'name_hi':   name_hi['Ketu'],
    }

    return result


# ── Vercel serverless handler ──────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        try:
            length  = int(self.headers.get('Content-Length', 0))
            body    = json.loads(self.rfile.read(length))

            year   = int(body['year'])
            month  = int(body['month'])
            day    = int(body['day'])
            hour   = int(body['hour'])
            minute = int(body['minute'])
            lat    = float(body['lat'])
            lon    = float(body['lon'])

            chart = calc_chart(year, month, day, hour, minute, lat, lon)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(chart, ensure_ascii=False).encode('utf-8'))

        except KeyError as e:
            self._error(400, f'Missing field: {e}')
        except Exception as e:
            self._error(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _error(self, code: int, message: str):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'error': message}).encode())

    def log_message(self, *args):
        pass  # silence default logging
