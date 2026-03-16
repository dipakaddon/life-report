#!/usr/bin/env python3
import sys, json, math
import swisseph as swe
from datetime import datetime

def get_nakshatra(sid_deg):
    nakshatras = [
        ('Ashwini','अश्विनी','Ketu'),('Bharani','भरणी','Venus'),('Krittika','कृत्तिका','Sun'),
        ('Rohini','रोहिणी','Moon'),('Mrigashira','मृगशिरा','Mars'),('Ardra','आर्द्रा','Rahu'),
        ('Punarvasu','पुनर्वसु','Jupiter'),('Pushya','पुष्य','Saturn'),('Ashlesha','आश्लेषा','Mercury'),
        ('Magha','मघा','Ketu'),('Purva Phalguni','पूर्व फाल्गुनी','Venus'),('Uttara Phalguni','उत्तर फाल्गुनी','Sun'),
        ('Hasta','हस्त','Moon'),('Chitra','चित्रा','Mars'),('Swati','स्वाती','Rahu'),
        ('Vishakha','विशाखा','Jupiter'),('Anuradha','अनुराधा','Saturn'),('Jyeshtha','ज्येष्ठा','Mercury'),
        ('Moola','मूल','Ketu'),('Purva Ashadha','पूर्वाषाढ़ा','Venus'),('Uttara Ashadha','उत्तराषाढ़ा','Sun'),
        ('Shravana','श्रवण','Moon'),('Dhanishtha','धनिष्ठा','Mars'),('Shatabhisha','शतभिषा','Rahu'),
        ('Purva Bhadrapada','पूर्व भाद्रपद','Jupiter'),('Uttara Bhadrapada','उत्तर भाद्रपद','Saturn'),
        ('Revati','रेवती','Mercury')
    ]
    idx = int(sid_deg / (360/27))
    pada = int((sid_deg % (360/27)) / (360/108)) + 1
    en, hi, lord = nakshatras[idx % 27]
    return {'en': en, 'hi': hi, 'lord': lord, 'pada': pada}

def calc_chart(year, month, day, hour, minute, lat, lon):
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    # Convert to UTC (assuming IST = UTC+5:30)
    total_min = hour * 60 + minute - 330
    if total_min < 0:
        total_min += 1440
        day -= 1
        # simple day adjustment
    ut_hour = total_min / 60.0
    
    jd = swe.julday(year, month, day, ut_hour)
    ayanamsa = swe.get_ayanamsa(jd)
    
    # Ascendant
    houses, ascmc = swe.houses(jd, lat, lon, b'P')
    asc_trop = ascmc[0]
    asc_sid = (asc_trop - ayanamsa) % 360
    
    signs_en = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
    signs_hi = ['मेष','वृष','मिथुन','कर्क','सिंह','कन्या',
                'तुला','वृश्चिक','धनु','मकर','कुंभ','मीन']
    lords_en = ['Mars','Venus','Mercury','Moon','Sun','Mercury',
                'Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']
    
    asc_sign = int(asc_sid / 30)
    asc_deg = asc_sid % 30
    
    result = {
        'ayanamsa': round(ayanamsa, 4),
        'lagna': {
            'sign_en': signs_en[asc_sign], 'sign_hi': signs_hi[asc_sign],
            'degree': round(asc_deg, 2), 'lord': lords_en[asc_sign],
            'nakshatra': get_nakshatra(asc_sid)
        },
        'planets': {}
    }
    
    planet_ids = {
        'Sun': swe.SUN, 'Moon': swe.MOON, 'Mars': swe.MARS,
        'Mercury': swe.MERCURY, 'Jupiter': swe.JUPITER,
        'Venus': swe.VENUS, 'Saturn': swe.SATURN, 'Rahu': swe.MEAN_NODE
    }
    planet_hi = {
        'Sun':'सूर्य','Moon':'चंद्र','Mars':'मंगल','Mercury':'बुध',
        'Jupiter':'गुरु','Venus':'शुक्र','Saturn':'शनि','Rahu':'राहु','Ketu':'केतु'
    }
    
    # Dignity data
    exalt = {'Sun':0,'Moon':1,'Mars':9,'Mercury':5,'Jupiter':3,'Venus':11,'Saturn':6}  # sign index
    debil = {'Sun':6,'Moon':7,'Mars':3,'Mercury':11,'Jupiter':9,'Venus':5,'Saturn':0}
    own   = {'Sun':[4],'Moon':[3],'Mars':[0,7],'Mercury':[2,5],'Jupiter':[8,11],'Venus':[1,6],'Saturn':[9,10]}
    
    for name, pid in planet_ids.items():
        pos, _ = swe.calc_ut(jd, pid)
        sid = (pos[0] - ayanamsa) % 360
        if name == 'Rahu':
            sid = sid % 360
        sign_idx = int(sid / 30)
        deg = sid % 30
        house = ((sign_idx - asc_sign) % 12) + 1
        nak = get_nakshatra(sid)
        
        # Dignity
        dignity = 'Neutral'
        if name in exalt and sign_idx == exalt[name]: dignity = 'Exalted'
        elif name in debil and sign_idx == debil[name]: dignity = 'Debilitated'
        elif name in own and sign_idx in own[name]: dignity = 'Own Sign'
        
        result['planets'][name] = {
            'sign_en': signs_en[sign_idx], 'sign_hi': signs_hi[sign_idx],
            'degree': round(deg, 2), 'house': house,
            'nakshatra': nak, 'dignity': dignity,
            'name_hi': planet_hi[name]
        }
    
    # Ketu = opposite Rahu
    rahu_sid = (result['planets']['Rahu']['degree'] + 
                (result['planets']['Rahu']['house']-1)*30 + asc_sid) % 360
    # Recalculate properly
    rahu_pos, _ = swe.calc_ut(jd, swe.MEAN_NODE)
    rahu_sid_actual = (rahu_pos[0] - ayanamsa) % 360
    ketu_sid = (rahu_sid_actual + 180) % 360
    ketu_sign = int(ketu_sid / 30)
    ketu_deg = ketu_sid % 30
    ketu_house = ((ketu_sign - asc_sign) % 12) + 1
    result['planets']['Ketu'] = {
        'sign_en': signs_en[ketu_sign], 'sign_hi': signs_hi[ketu_sign],
        'degree': round(ketu_deg, 2), 'house': ketu_house,
        'nakshatra': get_nakshatra(ketu_sid), 'dignity': 'Neutral',
        'name_hi': planet_hi['Ketu']
    }
    
    return result

if __name__ == '__main__':
    data = json.loads(sys.stdin.read())
    result = calc_chart(
        data['year'], data['month'], data['day'],
        data['hour'], data['minute'],
        data['lat'], data['lon']
    )
    print(json.dumps(result, ensure_ascii=False))
