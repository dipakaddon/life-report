// Jyotish Knowledge Engine
// Based on: Garga Hora Shastra, Phaldipika, Bhrigu Sanhita, Brihat Jatakam, Vedanga Jyotish

export interface PlanetData {
  sign_en: string; sign_hi: string; degree: number; house: number;
  nakshatra: { en: string; hi: string; lord: string; pada: number };
  dignity: string; name_hi: string;
}

export interface ChartData {
  ayanamsa: number;
  lagna: { sign_en: string; sign_hi: string; degree: number; lord: string; nakshatra: { en: string; hi: string; lord: string; pada: number } };
  planets: Record<string, PlanetData>;
}

// ─── GARGA HORA SHASTRA: Direct verified text (English translations) ───
const GARGA_TEXTS: Record<string, Record<number, string>> = {
  Sun: {
    4: "The Sun in the 4th house destroys friends and relations. It makes the native a victim of regret and remorse. The native is in possession of umbrella of power and conveyances. He is quite happy. He commands respect and power too. He is lean and thin by appearance but is always brave in struggles.",
    5: "The Sun in the 5th house makes the native intelligent. He may be deprived of sons. He is inimical to his father. He roams in forest. He may be a trader.",
    6: "The Sun in the 6th house destroys even well-equipped enemies. The Sun in 6th house gives many enemies if Sun is combined with or aspected by enemical planets.",
    7: "The Sun in the 7th house in malefic or debilitated sign or in conjunction with malefic makes the first married wife an unfortunate lady.",
    8: "Waning Moon in the 8th house may cause fear of death by typhoid, fever or burning by fire in childhood.",
    9: "Sun in 9th house in unfavourable sign makes the native irreligious and unfortunate. Sun in own or exalted sign in the 9th house makes one very religious and fortunate.",
    10: "If the Sun occupies the 10th house, the native becomes the minute observer of even petty works. He becomes brilliant and a brave fighter. He daily enjoys his paternal wealth. Such Sun however may make the native sick also.",
    11: "The Sun in the 11th house makes the native endowed with wealth, grain and gold. It makes him handsome, full of arts, learned, polite and expert in music or songs.",
    12: "The Sun in the 12th house makes the native too expensive. He is quite strange in expenses. He may have illicit connections with some distant woman.",
  },
  Moon: {
    1: "Full Moon in Lagna makes the native handsome, rich and tender. Waning Moon in Lagna makes the native dirty and little brave.",
    4: "The Moon (Waxing) in the 4th house makes the native endowed with wife, relations and servants. It confers house, conveyances and fixed property or wealth.",
    5: "The Moon in the 5th house confers daughters, sons and grandsons. Even Waning Moon or the Moon in conjunction with malefic may confer a fickle daughter.",
    9: "Full Moon in 9th house gives rise in fortune in middle of life. It makes the native virtuous and devoted to father. Waning Moon in 9th house ruins everything good.",
    10: "If the Moon occupies the 10th house, the native enjoys always domestic happiness. He is endowed with good fortune and maternal wealth. He is of calm disposition.",
    11: "The Moon in the 11th house makes the native famous, meritful, wise, wealthy, enjoyer of life, fair-complexioned and popular amongst people.",
    12: "The Moon in the 12th house makes the native miser, greedy and great suspicious by nature.",
  },
  Mars: {
    1: "Mars in Lagna may give diseases in anus, itches in navel and some deformity in middle part of body. He may be very short-tempered.",
    4: "Mars in 4th house may give livelihood connected with land. He is bereft of relations. He lives in muddy areas in a mud-built house. Note: Mars in 4th house may give a job connected with any of its Karak such as Land, Police, Military, Doctors, Fire etc.",
    6: "Mars in the 6th house makes the native strong. He does well in his job.",
    9: "Mars in the 9th house makes the native violent in attitude and also unfortunate. (Mars in enemical or debilitated sign alone may give such results.)",
    10: "Mars in the 10th house makes the native powerful, rich, strong and famous. Mars in Cancer in the 10th house gives happiness.",
    11: "Mars in the 11th house makes the native wealthy, honoured, truthful, strong-determined, owner of horses or conveyances, singer, sweet in speech, brave and in services.",
  },
  Mercury: {
    1: "Mercury in Lagna makes one handsome, efficient, quiet, brilliant, sweet in speech and very kind. He always looks like a child. He may be a physician, chemist, scientist, artist or ruler.",
    2: "Mercury in 2nd house makes the native very wise. He is endowed with divine knowledge. He earns much wealth.",
    4: "Mercury in 4th house free from malefic influences confers immense wealth, several friends and relations. The native enjoys life in various ways. Mercury in 4th house may give variegated place of abode. House may contain gold and valuables.",
    5: "Mercury in the 5th house gives issues (children). Combust Mercury or Mercury aspected by enemical planet may cause loss of some born issues. It may cause loss of maternal uncle. It gives few sons.",
    9: "Malefic Mercury in the 9th house gives a weak and dull fortune. An auspicious and strong Mercury in the 9th house makes one quite fortunate and religious-minded.",
    10: "Mercury in the 10th house confers wealth, honour, power, position, fine intellect, endurance, religious blend, livelihood by fair means, good morale, titles, awards etc. on the native.",
    11: "Mercury in the 11th house makes the native quite meritful, wise, dear to women and own persons. Mercury in the 11th house confers long life, wealth and good fortune.",
  },
  Jupiter: {
    1: "Jupiter in Lagna makes the native a poet, a singer, handsome, pious, donor or benefactor, generous, enjoyer, honoured by rulers, happy, worshipper of Devatas and quite wealthy.",
    2: "Jupiter in the second house makes the native wealthy and always energetic. Aspect of Mercury on such Jupiter may make the native poor.",
    4: "Jupiter in the 4th house confers boy-friend, fine clothes, happiness from lands and education.",
    5: "Jupiter in 5th house gives auspicious mind. Lone Jupiter in 5th house may give five sons.",
    6: "Jupiter in the 6th house destroys enemies. He gets happiness from maternal uncle.",
    8: "Jupiter in the 8th house in auspicious or own sign gives death in conscious state of mind at some holy place. Note: Kalyan Varma says Jupiter in 8th house gives long life in spite of ill-health.",
    9: "Jupiter in 9th house gives pilgrimages. It makes the native handsome, happy, meritful, performer of Yagnas, philanthropist and very famous. The native prospers his dynasty. He gets happiness for whole of life. He is very fortunate.",
    10: "Jupiter in 10th house makes the native renowned, happy, wealthy, meritful, owning vehicles, truthful, finishing the task on hand, very clever and majestic.",
    11: "Jupiter in the 11th house makes the native healthy and strong. The native knows Mantras and Sastras of others.",
  },
  Venus: {
    1: "Venus in Lagna gives stable nature. Venus in Lagna confers good longevity, wealth.",
    2: "Venus in 2nd house makes one wealthy by earnings through learning or through wife. He speaks sweet and wins in debate by his wits.",
    4: "Venus in the 4th house makes the native brave, long-lived and honoured by the rulers. He is a friend of others. He lives in variegated house. He lives the life of comforts and luxuries for long.",
    5: "Venus in the 5th house makes one happy, learned and very rich. He will have sons. He may be a minister, a commander, magistrate, judge and the like.",
    7: "Venus in the 7th house gives a fair complexioned and quite beautiful wife having beautiful eyes like lotus.",
    9: "Venus in 9th house makes the native rich and fortunate. He makes his fortune and prospers by dint of his own efforts. He possesses many qualities.",
    10: "Venus in 10th house may give a deaf brother. The native enjoys life like a king even in forest. He looks handsome in war-robe. Note: Venus in 10th gives wealth, power, position, post and fame if it is uncombust.",
    11: "Venus in the 11th house gives superior wife, gems, good health and freedom from sorrows. It gives enormous wealth and servants.",
  },
  Saturn: {
    1: "Saturn in Lagna in Libra, Sagittarius and Pisces may make the native a ruler and long-lived.",
    2: "Saturn in the 2nd house makes one poor, hard-hearted and unhappy. Saturn in 2nd house if conjoined with or aspected by friendly planet may make the native kind-hearted and religious-minded.",
    4: "Saturn in the 4th house confers a bad chair and a dilapidated house. He always feels restless and unhappy due to some protracted illness. He may have to leave the place and the chair. Note: An unfavourable Saturn may cause displacement, fall from position, heart-trouble, vehicular accident.",
    7: "Saturn in 7th house may delay but not deny marriage.",
    9: "Saturn in the 9th house makes the native too proud. If Saturn occupies its exalted or own sign in the 9th house, it means he has come to this world from heaven and will again go back to heaven after ruling here with justice. His previous birth was good and his next birth will be equally good.",
    10: "Saturn in 10th house makes the native wise, brave, rich and a minister. He may be the leader or head of a village, town or group of people. He may be a Magistrate or a Judge.",
    11: "If Saturn occupies the 11th house, the native may have stable property. He has gains of land. He is brave, courageous, happy and ungreedy.",
  },
  Rahu: {
    1: "Rahu in Lagna in Aries, Taurus or Cancer sign, if aspected by benefics, may ward off all evils.",
    4: "Rahu in 4th house gives trouble to friends and relations. Rahu in 4th house barring favourable signs may be detrimental for mental peace, education and happiness from mother, friends and relations.",
    6: "Rahu in the 6th house makes the native brave, beautiful, wise, famous and honoured like a ruler. It destroys enemies in war.",
    9: "Rahu in the 9th house makes the native follow degraded type of faith and religion. He is untruthful and unholy. He is unlucky and unfortunate.",
    10: "Rahu in the 10th house makes the native head of some public body or group of people or head of village or town. It may make the native a judge or a magistrate. It may also make him a minister or secretary to the government. It may make him a scholar or a brave warrior or quite a wealthy man.",
    11: "Rahu in the 11th house may offer opportunity to enrich oneself through foreign sources.",
    12: "Rahu in the 12th house always engages the native in degraded works. He ill-spends his money.",
  },
  Ketu: {
    3: "Ketu in the 3rd house makes the native happy, fortunate and very rich. He is endowed with son also.",
    4: "Ketu in the 4th house makes the native the cause of trouble to his parents. The native suffers from great anxiety and great troubles. He is bereft of happiness from his friends.",
    6: "Ketu in the 6th house will destroy enemies as a cruel planet.",
    9: "If the native has Ketu in the 9th house, he must be giving troubles to his father in childhood. He may be an unlucky and irreligious person. He may have rise in his fortune through Mlechchas.",
    10: "Ketu in the 10th house is helpful for a job in some foreign country. It may confer jobs in multinational companies. The native may perform degraded works.",
    11: "Ketu in the 11th house makes the native fortunate, learned, handsome, well-dressed and brilliant. Enemies suffer at the hands of the native. Ketu in the 11th house confers all kinds of gains.",
  },
};

// ─── PHALDIPIKA: Principles (learned during study) ───
const PHALDIPIKA_PRINCIPLES: Record<string, string> = {
  'Venus_Exalted_Kendra': 'मालव्य योग — पंच महापुरुष योग। शुक्र उच्च केंद्र में: सुंदर रूप, कलात्मक प्रतिभा, दीर्घायु, धन, राज-सम्मान।',
  'Jupiter_Debilitated_Neechabhanga': 'नीचभंग राज योग — नीच ग्रह का स्वामी केंद्र में: प्रारंभिक कठिनाइयों के बाद असाधारण सफलता। 30-36 वर्ष के बाद पूर्ण फल।',
  'Sagittarius_Lagna': 'धनु लग्न: न्यायप्रिय, दार्शनिक, उत्साही, स्वतंत्र विचारक। उच्च शिक्षा और धर्म में गहरी रुचि।',
  'Multiple_Planets_4th': 'संग्रह योग — एक भाव में 5 ग्रह: उस भाव के विषय (घर, माता, मन) जातक के जीवन का केंद्र बनते हैं।',
  'Rahu_10th_Career': 'राहु दशम: करियर में अप्रत्याशित उन्नति, विदेशी संस्थाओं से जुड़ाव, सार्वजनिक प्रसिद्धि।',
};

// ─── BHRIGU SANHITA: Case patterns (learned during study) ───
const BHRIGU_PATTERNS: Record<string, string> = {
  'Jupiter_2nd_Debilitated': 'भृगु: गुरु नीच द्वितीय — धन में प्रारंभिक संघर्ष, लेकिन नीचभंग से अंततः धनवान। 30 के बाद आर्थिक स्थिरता।',
  'Venus_4th_Exalted': 'भृगु: शुक्र उच्च चतुर्थ — सुंदर जीवन साथी, घर में सुख-सुविधाएं, दीर्घायु।',
  'Saturn_4th': 'भृगु: शनि चतुर्थ — मूल स्थान से दूर जाकर जीवन में स्थिरता। एक बड़ा स्थान-परिवर्तन अवश्य होगा।',
  'Mars_9th': 'भृगु: मंगल नवम — लंबी यात्राएं, पिता से मतभेद, धर्म के लिए संघर्ष, भाग्य परिश्रम से बनता है।',
  'Mercury_5th': 'भृगु: बुध पंचम — बौद्धिक प्रतिभा पिछले जन्म से। नवप्रवर्तक (Innovator) स्वभाव।',
};

// ─── BRIHAT JATAKAM: Classical rules ───
const BRIHAT_RULES: Record<string, string> = {
  'Malavya_Yoga': 'बृहज्जातकम् (वाराहमिहिर): मालव्य योग — शुक्र उच्च/स्वराशि + केंद्र = पंच महापुरुष योग। सुंदर, कलाप्रिय, धनवान, दीर्घजीवी।',
  'Neechabhanga': 'बृहज्जातकम्: नीचभंग नियम — नीच ग्रह का राशि-स्वामी केंद्र या त्रिकोण में हो तो राज योग बनता है।',
  'Sangraha_Yoga': 'बृहज्जातकम्: संग्रह योग — एक भाव में 3+ ग्रह: उस भाव का कर्म जातक के जीवन पर असाधारण प्रभाव डालता है।',
  'Pisces_Stellium': 'बृहज्जातकम्: मीन राशि में शुक्र + चंद्र + अन्य = उच्च पद, सौभाग्य, और बड़े परिवार का योग।',
};

// ─── VEDANGA JYOTISH: Nakshatra descriptions ───
const NAKSHATRA_DESC: Record<string, { deity: string; quality: string; hi: string }> = {
  'Ashwini': { deity: 'अश्विनी कुमार', quality: 'गति, नवीनता, चिकित्सा', hi: 'तेज, नवीन विचार, उपचार क्षमता' },
  'Bharani': { deity: 'यम', quality: 'परिवर्तन, साहस', hi: 'साहसी, नेतृत्व, दृढ़ संकल्पी' },
  'Krittika': { deity: 'अग्नि', quality: 'तीक्ष्णता, शुद्धि', hi: 'तीव्र बुद्धि, शुद्धिकरण की शक्ति' },
  'Rohini': { deity: 'ब्रह्मा', quality: 'सृजन, सौंदर्य', hi: 'सौंदर्यप्रिय, रचनात्मक, समृद्ध' },
  'Mrigashira': { deity: 'सोम', quality: 'खोज, यात्रा', hi: 'जिज्ञासु, यात्री, ज्ञान-पिपासु' },
  'Ardra': { deity: 'रुद्र', quality: 'परिवर्तन, तूफान', hi: 'तीव्र बुद्धि, परिवर्तनकारी' },
  'Punarvasu': { deity: 'अदिति', quality: 'पुनर्जन्म, आशा', hi: 'आशावादी, लचीले, बार-बार उठने वाले' },
  'Pushya': { deity: 'बृहस्पति', quality: 'पोषण, धर्म', hi: 'पोषण करने वाले, धार्मिक, शुभ' },
  'Ashlesha': { deity: 'सर्प', quality: 'कुंडलिनी, रहस्य', hi: 'रहस्यमय, गहरी शक्ति' },
  'Magha': { deity: 'पितृ', quality: 'पूर्वजों का आशीर्वाद', hi: 'नेतृत्व, पूर्वज-शक्ति, राज-सम्मान' },
  'Purva Phalguni': { deity: 'भग', quality: 'प्रेम, आनंद', hi: 'कलाप्रिय, प्रेमी, आनंदमय' },
  'Uttara Phalguni': { deity: 'अर्यमन', quality: 'अनुबंध, सामाजिक', hi: 'सामाजिक प्रतिष्ठा, अनुबंध, मित्रता' },
  'Hasta': { deity: 'सविता', quality: 'कौशल, हस्तशिल्प', hi: 'कुशल हाथ, व्यावहारिक, चतुर' },
  'Chitra': { deity: 'विश्वकर्मा', quality: 'सृजन, सौंदर्य', hi: 'कलात्मक, आकर्षक, निर्माण क्षमता' },
  'Swati': { deity: 'वायु', quality: 'स्वतंत्रता, व्यापार', hi: 'स्वतंत्र, व्यापारी, लचीले' },
  'Vishakha': { deity: 'इंद्र-अग्नि', quality: 'लक्ष्य, दृढ़ता', hi: 'लक्ष्य-केंद्रित, दृढ़, परिवर्तनशील' },
  'Anuradha': { deity: 'मित्र', quality: 'मित्रता, सहयोग', hi: 'मित्रभाव, टीम-वर्क, सफलता' },
  'Jyeshtha': { deity: 'इंद्र', quality: 'वरिष्ठता, शक्ति', hi: 'शक्तिशाली, नेता, सुरक्षक' },
  'Moola': { deity: 'निऋति', quality: 'जड़ें, परिवर्तन', hi: 'गहरी जड़ें, मूलभूत परिवर्तन' },
  'Purva Ashadha': { deity: 'आप', quality: 'जल, शुद्धि', hi: 'शुद्धिकरण, उत्साह, विजयी' },
  'Uttara Ashadha': { deity: 'विश्वेदेव', quality: 'विजय, सार्वभौमिक', hi: 'सार्वभौमिक विजय, नेतृत्व' },
  'Shravana': { deity: 'विष्णु', quality: 'सुनना, ज्ञान', hi: 'ज्ञान-पिपासु, परंपरा-प्रेमी' },
  'Dhanishtha': { deity: 'अष्टवसु', quality: 'धन, संगीत', hi: 'संगीतप्रिय, धनवान, साहसी' },
  'Shatabhisha': { deity: 'वरुण', quality: 'उपचार, रहस्य', hi: 'रहस्यमय, वैज्ञानिक, उपचारक' },
  'Purva Bhadrapada': { deity: 'अज एकपाद', quality: 'परिवर्तन, अग्नि', hi: 'तीव्र, परिवर्तनकारी, उग्र' },
  'Uttara Bhadrapada': { deity: 'अहिर्बुध्न्य', quality: 'गहराई, शांति', hi: 'गहरा मन, असाधारण सहनशक्ति, आध्यात्मिक' },
  'Revati': { deity: 'पूषन', quality: 'यात्रा, सुरक्षा', hi: 'यात्री, सुरक्षक, दयालु, कलाप्रेमी' },
};

// ─── YOGA DETECTION ───
export interface Yoga {
  name: string; nameHi: string; description: string;
  source: string; strength: 'Excellent' | 'Good' | 'Moderate';
}

export function detectYogas(chart: ChartData): Yoga[] {
  const yogas: Yoga[] = [];
  const p = chart.planets;
  const lagna = chart.lagna;

  // Malavya Yoga
  if (p.Venus?.dignity === 'Exalted' && [1,4,7,10].includes(p.Venus.house)) {
    yogas.push({
      name: 'Malavya Yoga', nameHi: 'मालव्य योग',
      description: 'शुक्र उच्च/स्वराशि में केंद्र भाव में। पंच महापुरुष योगों में से एक। सौंदर्य, कला, दीर्घायु, धन, और राज-सम्मान देता है।',
      source: 'बृहज्जातकम् (वाराहमिहिर) + फलदीपिका', strength: 'Excellent'
    });
  }

  // Ruchaka Yoga (Mars exalted/own in kendra)
  if ((p.Mars?.dignity === 'Exalted' || p.Mars?.dignity === 'Own Sign') && [1,4,7,10].includes(p.Mars.house)) {
    yogas.push({
      name: 'Ruchaka Yoga', nameHi: 'रुचक योग',
      description: 'मंगल उच्च/स्वराशि में केंद्र में। साहस, शक्ति, सैन्य/प्रशासनिक सफलता।',
      source: 'बृहज्जातकम् (वाराहमिहिर)', strength: 'Excellent'
    });
  }

  // Hamsa Yoga (Jupiter exalted/own in kendra)
  if ((p.Jupiter?.dignity === 'Exalted' || p.Jupiter?.dignity === 'Own Sign') && [1,4,7,10].includes(p.Jupiter.house)) {
    yogas.push({
      name: 'Hamsa Yoga', nameHi: 'हंस योग',
      description: 'गुरु उच्च/स्वराशि में केंद्र में। विद्वत्ता, धर्म, न्याय, और सम्मान।',
      source: 'बृहज्जातकम् (वाराहमिहिर)', strength: 'Excellent'
    });
  }

  // Shasha Yoga (Saturn own/exalted in kendra)
  if ((p.Saturn?.dignity === 'Own Sign' || p.Saturn?.dignity === 'Exalted') && [1,4,7,10].includes(p.Saturn.house)) {
    yogas.push({
      name: 'Shasha Yoga', nameHi: 'शश योग',
      description: 'शनि उच्च/स्वराशि में केंद्र में। अनुशासन, दीर्घायु, उच्च पद, और टिकाऊ सफलता।',
      source: 'बृहज्जातकम् (वाराहमिहिर)', strength: 'Excellent'
    });
  }

  // Bhadra Yoga (Mercury own/exalted in kendra)
  if ((p.Mercury?.dignity === 'Own Sign' || p.Mercury?.dignity === 'Exalted') && [1,4,7,10].includes(p.Mercury.house)) {
    yogas.push({
      name: 'Bhadra Yoga', nameHi: 'भद्र योग',
      description: 'बुध उच्च/स्वराशि में केंद्र में। असाधारण बुद्धि, वाकपटुता, और व्यापारिक सफलता।',
      source: 'बृहज्जातकम् (वाराहमिहिर)', strength: 'Excellent'
    });
  }

  // Neechabhanga Raja Yoga
  const lagnaSignIndex = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(lagna.sign_en);
  const debilLords: Record<string, string> = {
    'Sun': 'Venus', 'Moon': 'Saturn', 'Mars': 'Moon', 'Mercury': 'Jupiter',
    'Jupiter': 'Saturn', 'Venus': 'Mercury', 'Saturn': 'Sun'
  };
  Object.entries(p).forEach(([planet, data]) => {
    if (data.dignity === 'Debilitated' && debilLords[planet]) {
      const lordName = debilLords[planet];
      const lord = p[lordName];
      if (lord && [1,4,7,10].includes(lord.house)) {
        yogas.push({
          name: `${planet} Neechabhanga Raja Yoga`,
          nameHi: `${data.name_hi} नीचभंग राज योग`,
          description: `${data.name_hi} नीच है परन्तु उसके स्वामी ${p[lordName]?.name_hi} केंद्र भाव में हैं। नीचता भंग होकर राज योग बनता है। कठिनाइयों के बाद असाधारण सफलता।`,
          source: 'बृहज्जातकम् + फलदीपिका', strength: 'Good'
        });
      }
    }
  });

  // Rahu in 10th - Public leadership yoga
  if (p.Rahu?.house === 10) {
    yogas.push({
      name: 'Rahu 10th Yoga', nameHi: 'राहु दशम योग',
      description: 'राहु दशम भाव में — सार्वजनिक नेतृत्व, विदेशी संस्थाओं से जुड़ाव, असाधारण करियर उन्नति।',
      source: 'गर्ग होरा शास्त्र (पृ. 150)', strength: 'Good'
    });
  }

  // Sangraha Yoga (3+ planets in one house)
  const houseCounts: Record<number, number> = {};
  Object.values(p).forEach(pl => {
    houseCounts[pl.house] = (houseCounts[pl.house] || 0) + 1;
  });
  Object.entries(houseCounts).forEach(([house, count]) => {
    if (count >= 3) {
      yogas.push({
        name: `Sangraha Yoga (House ${house})`,
        nameHi: `संग्रह योग (${house}वाँ भाव)`,
        description: `${house}वें भाव में ${count} ग्रह एकत्र हैं। इस भाव के विषय जातक के जीवन का केंद्रबिंदु बन जाते हैं।`,
        source: 'बृहज्जातकम् (वाराहमिहिर)', strength: 'Moderate'
      });
    }
  });

  // Budha-Aditya Yoga
  if (p.Sun && p.Mercury && p.Sun.house === p.Mercury.house) {
    yogas.push({
      name: 'Budha-Aditya Yoga', nameHi: 'बुध-आदित्य योग',
      description: 'सूर्य और बुध एक भाव में। तीव्र बुद्धि, वाकपटुता, करियर में सरकारी/प्रशासनिक सफलता।',
      source: 'गर्ग होरा शास्त्र + फलदीपिका', strength: 'Good'
    });
  }

  return yogas;
}

// ─── DASHA CALCULATION ───
export interface DashaPeriod {
  planet: string; planetHi: string; years: number;
  startAge: number; endAge: number;
  description: string; color: string;
}

const DASHA_YEARS: Record<string, number> = {
  'Sun': 6, 'Moon': 10, 'Mars': 7, 'Rahu': 18, 'Jupiter': 16,
  'Saturn': 19, 'Mercury': 17, 'Ketu': 7, 'Venus': 20
};
const DASHA_LORDS: string[] = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_COLORS: Record<string, string> = {
  'Sun': '#FF6B35', 'Moon': '#7EB8C9', 'Mars': '#E53E3E', 'Rahu': '#6B46C1',
  'Jupiter': '#F6AD55', 'Saturn': '#4A5568', 'Mercury': '#48BB78',
  'Ketu': '#9F7AEA', 'Venus': '#F687B3'
};
const PLANET_HI: Record<string, string> = {
  'Sun':'सूर्य','Moon':'चंद्र','Mars':'मंगल','Mercury':'बुध','Jupiter':'गुरु',
  'Venus':'शुक्र','Saturn':'शनि','Rahu':'राहु','Ketu':'केतु'
};

export function calculateDashas(chart: ChartData, birthYear: number): DashaPeriod[] {
  // Moon nakshatra determines starting dasha
  const moonNak = chart.planets.Moon?.nakshatra.lord || 'Moon';
  const startIdx = DASHA_LORDS.indexOf(moonNak);
  
  const dashas: DashaPeriod[] = [];
  let currentAge = 0;

  for (let i = 0; i < 9; i++) {
    const planet = DASHA_LORDS[(startIdx + i) % 9];
    const years = DASHA_YEARS[planet];
    dashas.push({
      planet, planetHi: PLANET_HI[planet], years,
      startAge: Math.round(currentAge),
      endAge: Math.round(currentAge + years),
      description: getDashaDescription(planet, chart),
      color: DASHA_COLORS[planet]
    });
    currentAge += years;
    if (currentAge > 120) break;
  }
  return dashas;
}

function getDashaDescription(planet: string, chart: ChartData): string {
  const pd = chart.planets[planet];
  if (!pd) return '';
  const house = pd.house;
  const dignity = pd.dignity;
  const sign = pd.sign_hi;
  
  const baseDesc: Record<string, string> = {
    'Sun': 'सत्ता, पिता, और आत्मा से जुड़े विषयों में सक्रियता।',
    'Moon': 'मन, माता, और भावनात्मक जीवन में परिवर्तन।',
    'Mars': 'साहस, ऊर्जा, और संघर्ष की दशा।',
    'Mercury': 'बुद्धि, व्यापार, और संचार में विकास।',
    'Jupiter': 'ज्ञान, धर्म, और विस्तार की दशा।',
    'Venus': 'प्रेम, कला, और भौतिक सुख की दशा।',
    'Saturn': 'कर्म, अनुशासन, और दीर्घकालीन फल की दशा।',
    'Rahu': 'अप्रत्याशित परिवर्तन और भौतिक महत्वाकांक्षा की दशा।',
    'Ketu': 'आध्यात्मिक जागरण और वैराग्य की दशा।',
  };
  
  return `${baseDesc[planet] || ''} ${planet} ${sign} में ${house}वें भाव में (${dignity}).`;
}

// ─── MAIN PREDICTION GENERATOR ───
export interface PredictionSection {
  title: string; titleHi: string; icon: string;
  predictions: Array<{ text: string; source: string; type: 'positive' | 'caution' | 'neutral' }>;
}

export function generatePredictions(chart: ChartData): PredictionSection[] {
  const p = chart.planets;
  const lagna = chart.lagna;
  const sections: PredictionSection[] = [];

  // 1. PERSONALITY
  const personality: PredictionSection = { title: 'Personality & Character', titleHi: 'व्यक्तित्व एवं स्वभाव', icon: '🧠', predictions: [] };
  
  const lagnaDesc: Record<string, string> = {
    'Aries': 'साहसी, आत्मविश्वासी, नेतृत्व करने वाले, और ऊर्जावान।',
    'Taurus': 'स्थिर, धैर्यशील, सौंदर्यप्रिय, और व्यावहारिक।',
    'Gemini': 'बहुमुखी, बुद्धिमान, संचार में कुशल, और जिज्ञासु।',
    'Cancer': 'संवेदनशील, पोषण करने वाले, भावनात्मक रूप से गहरे।',
    'Leo': 'राजसी, नेतृत्वशील, आत्मसम्मानी, और उदार।',
    'Virgo': 'विश्लेषणात्मक, सेवाभावी, विस्तार पर ध्यान देने वाले।',
    'Libra': 'संतुलित, न्यायप्रिय, सौंदर्यप्रिय, और कूटनीतिक।',
    'Scorpio': 'गहरे, रहस्यमय, दृढ़, और परिवर्तनकारी।',
    'Sagittarius': 'दार्शनिक, उत्साही, न्यायप्रिय, और स्वतंत्र विचारक।',
    'Capricorn': 'महत्वाकांक्षी, अनुशासित, व्यावहारिक, और दृढ़निश्चयी।',
    'Aquarius': 'मानवतावादी, नवीन विचारक, स्वतंत्र, और वैज्ञानिक।',
    'Pisces': 'कल्पनाशील, आध्यात्मिक, संवेदनशील, और उदार।',
  };

  personality.predictions.push({
    text: `${lagna.sign_hi} लग्न: ${lagnaDesc[lagna.sign_en] || ''} लग्न के स्वामी ${lagna.lord} हैं।`,
    source: 'फलदीपिका + बृहज्जातकम्', type: 'neutral'
  });

  // Moon nakshatra personality
  const moonNak = p.Moon?.nakshatra.en || '';
  if (NAKSHATRA_DESC[moonNak]) {
    personality.predictions.push({
      text: `चंद्र ${NAKSHATRA_DESC[moonNak].hi} (${p.Moon?.nakshatra.hi})। देवता: ${NAKSHATRA_DESC[moonNak].deity}।`,
      source: 'वेदांग ज्योतिष', type: 'neutral'
    });
  }

  sections.push(personality);

  // 2. CAREER
  const career: PredictionSection = { title: 'Career & Profession', titleHi: 'करियर एवं व्यवसाय', icon: '💼', predictions: [] };
  
  // 10th house
  const tenthHousePlanets = Object.entries(p).filter(([, v]) => v.house === 10);
  tenthHousePlanets.forEach(([name, data]) => {
    const gargaText = GARGA_TEXTS[name]?.[10];
    if (gargaText) {
      career.predictions.push({ text: `${data.name_hi} दशम भाव: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: 'positive' });
    }
  });

  // 10th lord
  const tenthLordMap: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
  };
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const tenthSign = signs[(signs.indexOf(lagna.sign_en) + 9) % 12];
  const tenthLord = tenthLordMap[tenthSign];

  if (tenthLord && p[tenthLord]) {
    career.predictions.push({
      text: `दशम भाव (${tenthSign}) के स्वामी ${p[tenthLord].name_hi} ${p[tenthLord].sign_hi} के ${p[tenthLord].house}वें भाव में हैं।`,
      source: 'फलदीपिका', type: 'neutral'
    });
  }

  if (tenthHousePlanets.length === 0) {
    career.predictions.push({
      text: 'दशम भाव खाली है। करियर के लिए दशमेश और दशम भाव पर दृष्टि देखें।',
      source: 'फलदीपिका', type: 'neutral'
    });
  }

  sections.push(career);

  // 3. WEALTH
  const wealth: PredictionSection = { title: 'Wealth & Finance', titleHi: 'धन एवं वित्त', icon: '💰', predictions: [] };
  
  const secondHousePlanets = Object.entries(p).filter(([, v]) => v.house === 2);
  secondHousePlanets.forEach(([name, data]) => {
    const gargaText = GARGA_TEXTS[name]?.[2];
    if (gargaText) {
      wealth.predictions.push({ text: `${data.name_hi} द्वितीय भाव: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: data.dignity === 'Exalted' || data.dignity === 'Own Sign' ? 'positive' : 'neutral' });
    }
  });

  // 11th house gains
  const eleventhPlanets = Object.entries(p).filter(([, v]) => v.house === 11);
  eleventhPlanets.forEach(([name, data]) => {
    const gargaText = GARGA_TEXTS[name]?.[11];
    if (gargaText) {
      wealth.predictions.push({ text: `${data.name_hi} लाभ भाव (11वें): ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: 'positive' });
    }
  });

  if (secondHousePlanets.length === 0 && eleventhPlanets.length === 0) {
    wealth.predictions.push({ text: 'धन भाव और लाभ भाव में ग्रह नहीं हैं। धन भाव के स्वामी की स्थिति देखें।', source: 'फलदीपिका', type: 'neutral' });
  }

  sections.push(wealth);

  // 4. MARRIAGE & RELATIONSHIPS
  const marriage: PredictionSection = { title: 'Marriage & Relationships', titleHi: 'विवाह एवं संबंध', icon: '❤️', predictions: [] };
  
  const seventhPlanets = Object.entries(p).filter(([, v]) => v.house === 7);
  seventhPlanets.forEach(([name, data]) => {
    const gargaText = GARGA_TEXTS[name]?.[7];
    if (gargaText) {
      marriage.predictions.push({ text: `${data.name_hi} सप्तम भाव: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: 'neutral' });
    }
  });

  // Venus as karaka of marriage
  if (p.Venus) {
    const gargaText = GARGA_TEXTS['Venus']?.[p.Venus.house];
    if (gargaText) {
      marriage.predictions.push({ text: `शुक्र (विवाह कारक) ${p.Venus.house}वें भाव में: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: p.Venus.dignity === 'Exalted' ? 'positive' : 'neutral' });
    }
  }

  if (seventhPlanets.length === 0) {
    marriage.predictions.push({ text: `सप्तम भाव खाली है। विवाह के लिए सप्तमेश और शुक्र की दशा देखें।`, source: 'फलदीपिका', type: 'neutral' });
  }

  sections.push(marriage);

  // 5. HEALTH
  const health: PredictionSection = { title: 'Health & Wellbeing', titleHi: 'स्वास्थ्य', icon: '🏥', predictions: [] };

  // 6th and 8th house planets
  [6, 8].forEach(house => {
    Object.entries(p).filter(([, v]) => v.house === house).forEach(([name, data]) => {
      const gargaText = GARGA_TEXTS[name]?.[house];
      if (gargaText) {
        health.predictions.push({ text: `${data.name_hi} ${house}वें भाव में: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: 'caution' });
      }
    });
  });

  // Lagna lord health
  const lagnaLordPlanet = p[lagna.lord];
  if (lagnaLordPlanet) {
    const lagnaHealthDesc: Record<string, string> = {
      'Aries': 'सिर और मस्तिष्क पर ध्यान दें।', 'Taurus': 'गला और गर्दन की देखभाल।',
      'Gemini': 'फेफड़े और श्वास संबंधी स्वास्थ्य।', 'Cancer': 'पेट और पाचन पर ध्यान।',
      'Leo': 'हृदय और रीढ़ की देखभाल।', 'Virgo': 'पाचन तंत्र और आंत।',
      'Libra': 'गुर्दे और कमर।', 'Scorpio': 'प्रजनन अंग और उत्सर्जन तंत्र।',
      'Sagittarius': 'जांघ, कूल्हे, और लीवर।', 'Capricorn': 'जोड़ और हड्डियाँ।',
      'Aquarius': 'पैर और रक्त संचार।', 'Pisces': 'पैर और लसीका तंत्र।',
    };
    health.predictions.push({ text: `${lagna.sign_hi} लग्न: ${lagnaHealthDesc[lagna.sign_en] || ''}`, source: 'फलदीपिका', type: 'caution' });
  }

  sections.push(health);

  // 6. HOME & PROPERTY
  const home: PredictionSection = { title: 'Home & Property', titleHi: 'घर एवं संपत्ति', icon: '🏠', predictions: [] };
  const fourthPlanets = Object.entries(p).filter(([, v]) => v.house === 4);
  fourthPlanets.forEach(([name, data]) => {
    const gargaText = GARGA_TEXTS[name]?.[4];
    if (gargaText) {
      home.predictions.push({ text: `${data.name_hi} चतुर्थ भाव: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: (data.dignity === 'Exalted' || name === 'Moon' || name === 'Venus') ? 'positive' : 'caution' });
    }
  });
  sections.push(home);

  // 7. SPIRITUALITY
  const spirit: PredictionSection = { title: 'Spirituality & Dharma', titleHi: 'आध्यात्म एवं धर्म', icon: '🕉️', predictions: [] };
  const ninthPlanets = Object.entries(p).filter(([, v]) => v.house === 9);
  ninthPlanets.forEach(([name, data]) => {
    const gargaText = GARGA_TEXTS[name]?.[9];
    if (gargaText) {
      spirit.predictions.push({ text: `${data.name_hi} नवम भाव: ${gargaText}`, source: 'गर्ग होरा शास्त्र', type: 'neutral' });
    }
  });
  if (ninthPlanets.length === 0) {
    spirit.predictions.push({ text: 'नवम भाव खाली है। धर्म और भाग्य के लिए नवमेश की स्थिति देखें।', source: 'फलदीपिका', type: 'neutral' });
  }
  sections.push(spirit);

  return sections;
}

export { GARGA_TEXTS, NAKSHATRA_DESC, BHRIGU_PATTERNS, BRIHAT_RULES, PHALDIPIKA_PRINCIPLES };
