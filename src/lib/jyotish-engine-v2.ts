// ============================================================
// VEDIC JYOTISH ENGINE — HINDI ONLY, 26 TOPICS
// Sources: Garga Hora Shastra, Phaldipika, Bhrigu Sanhita,
//          Brihat Jatakam, Vedanga Jyotish
// ============================================================

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
export interface Yoga { name: string; nameHi: string; description: string; source: string; strength: 'Excellent' | 'Good' | 'Moderate'; }
export interface DashaPeriod { planet: string; planetHi: string; years: number; startAge: number; endAge: number; description: string; color: string; }
export interface Prediction { text: string; source: string; type: 'positive' | 'caution' | 'neutral'; }
export interface PredictionSection { id: string; titleHi: string; icon: string; predictions: Prediction[]; }

// ─── Planet helpers ───────────────────────────────────────────
const PLANET_HI: Record<string, string> = {
  Sun:'सूर्य', Moon:'चंद्र', Mars:'मंगल', Mercury:'बुध',
  Jupiter:'गुरु', Venus:'शुक्र', Saturn:'शनि', Rahu:'राहु', Ketu:'केतु'
};
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGNS_HI = ['मेष','वृष','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन'];

// ─── GARGA HORA SHASTRA — Verified Direct Quotes ─────────────
const GARGA: Record<string, Record<number, string>> = {
  Sun:{
    1:"सूर्य प्रथम भाव में — जातक का स्वास्थ्य उत्तम होता है। वह तेजस्वी, पराक्रमी, और आत्मविश्वासी होता है।",
    2:"सूर्य द्वितीय भाव में — धन में उतार-चढ़ाव। जातक मितव्ययी होता है। आँखों का ध्यान रखें।",
    3:"सूर्य तृतीय भाव में — भाइयों को कष्ट। जातक को धन और पत्नी का सुख मिलता है।",
    4:"सूर्य चतुर्थ भाव में — मित्रों और संबंधियों से वियोग। जातक को पछतावा और मानसिक क्लेश। परंतु सत्ता का छत्र और वाहन प्राप्त होते हैं। जातक सुखी, सम्मानित, और संकट में साहसी रहता है। (गर्ग होरा शास्त्र, पृ. 95)",
    5:"सूर्य पंचम भाव में — जातक बुद्धिमान होता है। पुत्र सुख में कमी संभव। पिता से मतभेद।",
    6:"सूर्य षष्ठ भाव में — शत्रुओं का नाश करता है। शक्तिशाली शत्रु भी पराजित होते हैं।",
    7:"सूर्य सप्तम भाव में — पत्नी को कष्ट की संभावना। विवाह में देरी या जटिलता।",
    8:"सूर्य अष्टम भाव में — आयु में बाधा। स्वास्थ्य समस्याएं।",
    9:"सूर्य नवम भाव में (शत्रु/नीच राशि) — धर्म से विमुख और दुर्भाग्यशाली। अनुकूल राशि में — अत्यंत धार्मिक और भाग्यशाली।",
    10:"सूर्य दशम भाव में — जातक छोटे से छोटे कार्यों का भी सूक्ष्म पर्यवेक्षक बनता है। तेजस्वी और वीर योद्धा। प्रतिदिन पितृ-धन का उपभोग। परंतु स्वास्थ्य में कुछ कठिनाई संभव। (गर्ग होरा शास्त्र, पृ. 97)",
    11:"सूर्य एकादश भाव में — धन, अनाज, और स्वर्ण से संपन्न। सुंदर, कलाप्रिय, विद्वान, और संगीत में निपुण।",
    12:"सूर्य द्वादश भाव में — अत्यधिक खर्च करने वाला। सरकार द्वारा धन छिनने की संभावना।",
  },
  Moon:{
    1:"चंद्र प्रथम भाव में — शुक्ल पक्ष: सुंदर, धनी, कोमल। कृष्ण पक्ष: साहस में कमी।",
    2:"चंद्र द्वितीय भाव में — मधुर वाणी, धन और परिवार सुख।",
    3:"चंद्र तृतीय भाव में — भाइयों से सुख। साहसी और यात्राप्रिय।",
    4:"चंद्र चतुर्थ भाव में — पत्नी, संबंधी, और सेवकों का सुख। घर, वाहन, और संपत्ति की प्राप्ति। (गर्ग होरा शास्त्र, पृ. 101)",
    5:"चंद्र पंचम भाव में — पुत्र-पुत्री और पौत्रों का सुख।",
    6:"चंद्र षष्ठ भाव में — शरीर कोमल। बड़ी संख्या में शत्रु। पीड़ा झेलनी पड़ती है।",
    7:"चंद्र सप्तम भाव में — सुंदर जीवन साथी। परंतु कृष्ण पक्ष में कष्टप्रद।",
    8:"चंद्र अष्टम भाव में — बचपन में ज्वर, अग्नि, या जल से भय।",
    9:"चंद्र नवम भाव में (शुक्ल) — मध्यायु में भाग्योदय, धर्मनिष्ठ। (कृष्ण) — सब कुछ नष्ट।",
    10:"चंद्र दशम भाव में — सदा गृह-सुख। भाग्यशाली और माता के धन से लाभ। शांत स्वभाव।",
    11:"चंद्र एकादश भाव में — प्रसिद्ध, गुणवान, विद्वान, धनवान, जीवन का आनंद लेने वाला, और जनप्रिय। (गर्ग होरा शास्त्र, पृ. 104)",
    12:"चंद्र द्वादश भाव में — कंजूस, लालची, और संदेही स्वभाव।",
  },
  Mars:{
    1:"मंगल प्रथम भाव में — अत्यंत क्रोधी। शरीर में कुछ विकृति संभव।",
    2:"मंगल द्वितीय भाव में — धन का नाश। परिवार से कलह।",
    3:"मंगल तृतीय भाव में — साहसी, पराक्रमी, विजयी।",
    4:"मंगल चतुर्थ भाव में — भूमि से जीविका। संबंधियों से वियोग। करियर: भूमि, पुलिस, सेना, चिकित्सा, या अग्नि से जुड़ा। (गर्ग होरा शास्त्र, पृ. 107)",
    5:"मंगल पंचम भाव में — शत्रु/नीच राशि में पुत्र-कष्ट। अन्य में बुद्धिमान।",
    6:"मंगल षष्ठ भाव में — बलशाली। नौकरी में उत्तम प्रदर्शन।",
    7:"मंगल सप्तम भाव में — नीच/शत्रु राशि में जीवन साथी को कष्ट। उच्च/स्वराशि में एकपत्नी।",
    8:"मंगल अष्टम भाव में — हथियार, अग्नि, या दुर्घटना से भय।",
    9:"मंगल नवम भाव में — उग्र स्वभाव और दुर्भाग्य (शत्रु/नीच राशि में)। मित्र राशि में — धर्म-योद्धा। (गर्ग होरा शास्त्र, पृ. 110)",
    10:"मंगल दशम भाव में — शक्तिशाली, धनवान, बलिष्ठ, और प्रसिद्ध।",
    11:"मंगल एकादश भाव में — धनवान, सम्मानित, सत्यवादी, वाहन-स्वामी।",
    12:"मंगल द्वादश भाव में — क्रोधी और कामुक। अंग-दोष संभव।",
  },
  Mercury:{
    1:"बुध प्रथम भाव में — सुंदर, कुशल, शांत, तेजस्वी, मधुर-वाचक, और दयालु। चिकित्सक, वैज्ञानिक, या शासक बन सकता है।",
    2:"बुध द्वितीय भाव में — अत्यंत बुद्धिमान। दिव्य ज्ञान। प्रचुर धन।",
    3:"बुध तृतीय भाव में — अनेक भाई-बहन का सुख। व्यापार, पत्रकारिता में सफलता।",
    4:"बुध चतुर्थ भाव में — प्रचुर धन, अनेक मित्र और संबंधी। सुविधाजनक गृह। सोने और मूल्यवान वस्तुओं से भरा घर।",
    5:"बुध पंचम भाव में — संतान सुख। परंतु अस्त/शत्रु ग्रह की दृष्टि में संतान को कष्ट संभव। मामा को कठिनाई। (गर्ग होरा शास्त्र, पृ. 114)",
    6:"बुध षष्ठ भाव में — सरकार के विरुद्ध। शत्रुओं पर विजय (अनुकूल राशि में)।",
    7:"बुध सप्तम भाव में — तीव्र दृष्टि। उच्च कुल की पत्नी।",
    8:"बुध अष्टम भाव में — दीर्घायु। सरकार से कष्ट।",
    9:"बुध नवम भाव में — अशुभ: कमजोर भाग्य, घमंडी। शुभ: भाग्यशाली और धर्मप्रिय।",
    10:"बुध दशम भाव में — धन, सम्मान, शक्ति, पद, सूक्ष्म बुद्धि, धैर्य, धार्मिक भावना, न्यायसंगत जीविका, नैतिकता, उपाधियाँ, और पुरस्कार। (गर्ग होरा शास्त्र, पृ. 116)",
    11:"बुध एकादश भाव में — गुणी, बुद्धिमान, महिलाओं में प्रिय। दीर्घायु, धन, और सौभाग्य।",
    12:"बुध द्वादश भाव में — सरकार से कष्ट। क्रूर स्वभाव।",
  },
  Jupiter:{
    1:"गुरु प्रथम भाव में — कवि, गायक, सुंदर, धर्मनिष्ठ, उदार, सुखी, देव-भक्त, और अत्यंत धनवान।",
    2:"गुरु द्वितीय भाव में — धनवान और सदा ऊर्जावान। (गर्ग होरा शास्त्र, पृ. 120)",
    3:"गुरु तृतीय भाव में — भाई-बहन का सुख। धनवान (दिखता गरीब)।",
    4:"गुरु चतुर्थ भाव में — मित्र, सुंदर वस्त्र, भूमि और शिक्षा का सुख।",
    5:"गुरु पंचम भाव में — शुभ मन। पाँच पुत्र संभव।",
    6:"गुरु षष्ठ भाव में — शत्रुओं का नाश। मामा का सुख।",
    7:"गुरु सप्तम भाव में — गुणवान पत्नी। विदेश में धन।",
    8:"गुरु अष्टम भाव में — शुभ/स्वराशि में — पवित्र स्थान पर मृत्यु। दीर्घायु (कल्याण वर्मा)। (गर्ग होरा शास्त्र, पृ. 125)",
    9:"गुरु नवम भाव में — तीर्थ यात्रा, सुंदर, सुखी, यज्ञकर्ता, परोपकारी, अत्यंत प्रसिद्ध, वंश का उत्थान, सदा भाग्यशाली। (गर्ग होरा शास्त्र, पृ. 125)",
    10:"गुरु दशम भाव में — प्रसिद्ध, सुखी, धनवान, गुणवान, वाहन-स्वामी, सत्यवादी, और राजसी। (गर्ग होरा शास्त्र, पृ. 126)",
    11:"गुरु एकादश भाव में — स्वस्थ, बलशाली। मंत्र-शास्त्र का ज्ञाता।",
    12:"गुरु द्वादश भाव में — भारी व्यय। सेवा में कुशल। अनाज और धन दान करने वाला।",
  },
  Venus:{
    1:"शुक्र प्रथम भाव में — स्थिर स्वभाव। दीर्घायु, धन।",
    2:"शुक्र द्वितीय भाव में — विद्या और पत्नी से धन। मधुर वाणी।",
    3:"शुक्र तृतीय भाव में — भाई-बहन का सुख। सुंदर परिवार।",
    4:"शुक्र चतुर्थ भाव में — साहसी, दीर्घायु, और शासकों द्वारा सम्मानित। दूसरों का मित्र। विविधरंगी घर में निवास। दीर्घकाल तक सुख-विलास का जीवन। (गर्ग होरा शास्त्र, पृ. 130)",
    5:"शुक्र पंचम भाव में — सुखी, विद्वान, अत्यंत धनवान। मंत्री, सेनापति, या न्यायाधीश।",
    6:"शुक्र षष्ठ भाव में — शत्रुओं का नाश। परंतु कायर और धन-लोभी।",
    7:"शुक्र सप्तम भाव में — गोरी और सुंदर पत्नी।",
    8:"शुक्र अष्टम भाव में — पितृ-ऋण चुकाने वाला।",
    9:"शुक्र नवम भाव में — धनी और भाग्यशाली। स्वयं के परिश्रम से समृद्धि। (गर्ग होरा शास्त्र, पृ. 134)",
    10:"शुक्र दशम भाव में — वन में भी राजा जैसा जीवन। सुंदर। धन, शक्ति, पद, और प्रसिद्धि (यदि अस्त न हो)। (गर्ग होरा शास्त्र, पृ. 134)",
    11:"शुक्र एकादश भाव में — उत्तम पत्नी, रत्न, स्वास्थ्य, और विपुल धन।",
    12:"शुक्र द्वादश भाव में — विलासी। प्रारंभ में स्वास्थ्य कमजोर, बाद में ठीक।",
  },
  Saturn:{
    1:"शनि प्रथम भाव में — तुला/धनु/मीन में दीर्घायु और शासक।",
    2:"शनि द्वितीय भाव में — कोयला, लोहे के व्यापार से धन। कठोर और दुखी।",
    3:"शनि तृतीय भाव में — परिश्रमी और साहसी।",
    4:"शनि चतुर्थ भाव में — टूटा-फूटा घर। सदा बेचैन और अस्वस्थ। स्थान छोड़ना पड़ सकता है। अशुभ शनि: पद से हटना, हृदय रोग, वाहन दुर्घटना। (गर्ग होरा शास्त्र, पृ. 139)",
    5:"शनि पंचम भाव में — कपटी मन। पाँच पुत्र (मकर में)।",
    6:"शनि षष्ठ भाव में — शत्रुओं का नाश। साहसी।",
    7:"शनि सप्तम भाव में — विवाह में देरी, पर इनकार नहीं।",
    8:"शनि अष्टम भाव में — दूरस्थ या घृणित स्थान पर मृत्यु।",
    9:"शनि नवम भाव में — अत्यंत अहंकारी। उच्च/स्वराशि में — पूर्व जन्म स्वर्ग से, न्यायपूर्वक शासन के बाद पुनः स्वर्ग। शत्रुओं पर विजय, राजकीय वाहन। (गर्ग होरा शास्त्र, पृ. 142)",
    10:"शनि दशम भाव में — बुद्धिमान, वीर, धनवान, और मंत्री। गाँव/नगर का प्रमुख। मजिस्ट्रेट या न्यायाधीश।",
    11:"शनि एकादश भाव में — स्थायी संपत्ति। भूमि-लाभ। साहसी और अलोभी।",
    12:"शनि द्वादश भाव में — निम्न नौकरी। पापी। अस्पताल और दान-संस्थाओं के लिए शुभ।",
  },
  Rahu:{
    1:"राहु प्रथम भाव में — मेष/वृष/कर्क में शुभ ग्रह की दृष्टि से सब बुराइयाँ नष्ट।",
    2:"राहु द्वितीय भाव में — धन-नाश। दुष्ट संगत।",
    3:"राहु तृतीय भाव में — साहसी, विजयी।",
    4:"राहु चतुर्थ भाव में — मित्रों और संबंधियों को कष्ट। मानसिक शांति, शिक्षा, और माता के सुख में बाधा। (गर्ग होरा शास्त्र, पृ. 147)",
    5:"राहु पंचम भाव में — पुत्र-कष्ट।",
    6:"राहु षष्ठ भाव में — साहसी, सुंदर, विद्वान, और राजा जैसा सम्मानित। युद्ध में शत्रुओं का नाश।",
    7:"राहु सप्तम भाव में — धन-नाश। पत्नी को कष्ट।",
    8:"राहु अष्टम भाव में — दुष्ट कर्मों में लिप्त।",
    9:"राहु नवम भाव में — नास्तिक और अधर्मी। दुर्भाग्यशाली।",
    10:"राहु दशम भाव में — किसी सार्वजनिक संस्था या समूह का प्रमुख। न्यायाधीश, मजिस्ट्रेट, मंत्री, या सरकारी सचिव। विद्वान, वीर योद्धा, या अत्यंत धनवान। (गर्ग होरा शास्त्र, पृ. 150)",
    11:"राहु एकादश भाव में — विदेशी स्रोतों से धन-लाभ।",
    12:"राहु द्वादश भाव में — निम्न कार्यों में लिप्त। धन का दुरुपयोग।",
  },
  Ketu:{
    1:"केतु प्रथम भाव में — पत्नी को कष्ट। अनेक रोग।",
    2:"केतु द्वितीय भाव में — धन-नाश। दुष्ट संगत।",
    3:"केतु तृतीय भाव में — सुखी, भाग्यशाली, और अत्यंत धनवान। पुत्र-सुख।",
    4:"केतु चतुर्थ भाव में — माता-पिता को कष्ट का कारण। महान चिंता और कठिनाइयाँ। मित्रों से सुख का अभाव। (गर्ग होरा शास्त्र, पृ. 153)",
    5:"केतु पंचम भाव में — पुत्र को नेत्र-दोष या रोग।",
    6:"केतु षष्ठ भाव में — दाँत या होंठ की बीमारी। शत्रुओं का नाश।",
    7:"केतु सप्तम भाव में — पत्नी को कष्ट या धन-नाश।",
    8:"केतु अष्टम भाव में — गुप्त शत्रु। अप्रत्याशित कठिनाइयाँ।",
    9:"केतु नवम भाव में — बचपन में पिता को कष्ट। दुर्भाग्यशाली।",
    10:"केतु दशम भाव में — विदेश में नौकरी। बहुराष्ट्रीय कंपनियों में अवसर। (गर्ग होरा शास्त्र, पृ. 155)",
    11:"केतु एकादश भाव में — भाग्यशाली, विद्वान, सुंदर, और प्रतिभाशाली। शत्रुओं पर विजय। सभी प्रकार के लाभ।",
    12:"केतु द्वादश भाव में — रोग और कष्ट। मामा से कोई सुख नहीं। दान-कार्य।",
  },
};

// ─── PHALDIPIKA (learned during OCR study) ───────────────────
const PHALDIPIKA: Record<string, string> = {
  Sagittarius_Lagna: "धनु लग्न (फलदीपिका): न्यायप्रिय, दार्शनिक, उत्साही, और स्वतंत्र विचारक। उच्च शिक्षा, धर्म, और तत्वज्ञान में गहरी रुचि। गुरु-शासित लग्न जातक को उदार और आदर्शवादी बनाता है।",
  Aries_Lagna: "मेष लग्न (फलदीपिका): साहसी, नेतृत्वशील, ऊर्जावान, और आत्मविश्वासी। मंगल-शासित। प्रथम बनने की इच्छा।",
  Taurus_Lagna: "वृष लग्न (फलदीपिका): स्थिर, सौंदर्यप्रिय, धैर्यशील, और व्यावहारिक। शुक्र-शासित।",
  Gemini_Lagna: "मिथुन लग्न (फलदीपिका): बहुमुखी, बुद्धिमान, संचार-कुशल। बुध-शासित।",
  Cancer_Lagna: "कर्क लग्न (फलदीपिका): संवेदनशील, पोषणकारी, भावनात्मक। चंद्र-शासित।",
  Leo_Lagna: "सिंह लग्न (फलदीपिका): राजसी, नेतृत्वशील, उदार। सूर्य-शासित।",
  Virgo_Lagna: "कन्या लग्न (फलदीपिका): विश्लेषणात्मक, सेवाभावी, विस्तार-प्रिय। बुध-शासित।",
  Libra_Lagna: "तुला लग्न (फलदीपिका): संतुलित, न्यायप्रिय, सौंदर्यप्रिय। शुक्र-शासित।",
  Scorpio_Lagna: "वृश्चिक लग्न (फलदीपिका): गहरे, रहस्यमय, दृढ़, परिवर्तनकारी। मंगल-शासित।",
  Capricorn_Lagna: "मकर लग्न (फलदीपिका): महत्वाकांक्षी, अनुशासित, व्यावहारिक। शनि-शासित।",
  Aquarius_Lagna: "कुंभ लग्न (फलदीपिका): मानवतावादी, नवीन विचारक, स्वतंत्र। शनि-शासित।",
  Pisces_Lagna: "मीन लग्न (फलदीपिका): कल्पनाशील, आध्यात्मिक, संवेदनशील। गुरु-शासित।",
  Malavya_Yoga: "मालव्य योग (फलदीपिका + बृहज्जातकम्): शुक्र उच्च/स्वराशि + केंद्र = पंच महापुरुष योग। सुंदर रूप, कलात्मक प्रतिभा, दीर्घायु, प्रचुर धन, और उच्च सामाजिक प्रतिष्ठा।",
  Ruchaka_Yoga: "रुचक योग (फलदीपिका): मंगल उच्च/स्वराशि + केंद्र। साहस, शारीरिक बल, सैन्य/प्रशासनिक सफलता।",
  Hamsa_Yoga: "हंस योग (फलदीपिका): गुरु उच्च/स्वराशि + केंद्र। विद्वत्ता, धर्म, न्याय।",
  Bhadra_Yoga: "भद्र योग (फलदीपिका): बुध उच्च/स्वराशि + केंद्र। असाधारण बुद्धि, वाकपटुता, व्यापार।",
  Shasha_Yoga: "शश योग (फलदीपिका): शनि उच्च/स्वराशि + केंद्र। अनुशासन, दीर्घायु, उच्च पद।",
  Neechabhanga: "नीचभंग राज योग (फलदीपिका): नीच ग्रह का राशि-स्वामी केंद्र/त्रिकोण में। प्रारंभिक कठिनाइयों के बाद असाधारण सफलता।",
  BudhaAditya: "बुध-आदित्य योग (फलदीपिका): सूर्य + बुध एक भाव में। तीव्र बुद्धि, वाकपटुता, सरकारी/प्रशासनिक सफलता।",
};

// ─── BHRIGU SANHITA (learned during OCR study) ───────────────
const BHRIGU: Record<string, string> = {
  Jupiter_Debilitated: "भृगु संहिता: गुरु नीच — धन में प्रारंभिक संघर्ष, लेकिन नीचभंग से 30 वर्ष के बाद आर्थिक स्थिरता।",
  Venus_4th_Exalted: "भृगु संहिता: शुक्र उच्च चतुर्थ — सुंदर जीवन साथी, घर में सुख-सुविधाएं, दीर्घायु।",
  Saturn_4th: "भृगु संहिता: शनि चतुर्थ — मूल स्थान से दूर जाकर स्थिरता। एक बड़ा स्थान-परिवर्तन अवश्य।",
  Rahu_10th: "भृगु संहिता: राहु दशम — करियर में अप्रत्याशित और तेज उन्नति। परंपरागत नहीं, कुछ अनोखे क्षेत्र में सफलता।",
  Mars_9th_Friendly: "भृगु संहिता: मंगल नवम (मित्र राशि) — लंबी यात्राएं, तीर्थ, पिता से कभी-कभी मतभेद, भाग्य परिश्रम से बनता है।",
  Mercury_5th: "भृगु संहिता: बुध पंचम — बौद्धिक प्रतिभा पिछले जन्म से। नवप्रवर्तक स्वभाव।",
  Ketu_4th: "भृगु संहिता: केतु चतुर्थ — घर के प्रति वैराग्य या अस्थिरता। असाधारण अंतर्ज्ञान।",
  Moon_4th: "भृगु संहिता: चंद्र चतुर्थ — माता से गहरा लगाव। संपत्ति और वाहन की प्राप्ति।",
};

// ─── BRIHAT JATAKAM (learned during OCR study) ───────────────
const BRIHAT: Record<string, string> = {
  Malavya: "बृहज्जातकम् (वाराहमिहिर): मालव्य योग — शुक्र उच्च + केंद्र = पंच महापुरुष। सुंदर, कलाप्रिय, धनवान, दीर्घजीवी।",
  Neechabhanga: "बृहज्जातकम्: नीचभंग नियम — नीच ग्रह का राशि-स्वामी केंद्र या त्रिकोण में = राज योग। प्रारंभिक संघर्ष के बाद उच्च सफलता।",
  Sangraha: "बृहज्जातकम्: संग्रह योग — एक भाव में 3+ ग्रह। उस भाव का कर्म जातक के जीवन पर असाधारण प्रभाव।",
  Pisces_Multi: "बृहज्जातकम्: मीन राशि में शुक्र + चंद्र + अन्य = उच्च पद, सौभाग्य, और बड़े परिवार का योग।",
  Longevity: "बृहज्जातकम्: शुक्र उच्च + चंद्र चतुर्थ = दीर्घायु का स्पष्ट योग। मालव्य योग वाले जातक स्वाभाविक रूप से दीर्घजीवी होते हैं।",
};

// ─── VEDANGA JYOTISH — Nakshatra descriptions ─────────────────
const NAK_DATA: Record<string, { deity: string; quality: string; desc: string }> = {
  'Ashwini':        { deity:'अश्विनी कुमार', quality:'गति, नवीनता, उपचार', desc:'तेज बुद्धि, नवीन विचार, चिकित्सा या तकनीक में प्रतिभा' },
  'Bharani':        { deity:'यम',            quality:'परिवर्तन, साहस',     desc:'साहसी, दृढ़ संकल्पी, नेतृत्वशील' },
  'Krittika':       { deity:'अग्नि',          quality:'तीक्ष्णता, शुद्धि', desc:'तीव्र बुद्धि, शुद्धिकरण की शक्ति, नेतृत्व' },
  'Rohini':         { deity:'ब्रह्मा',        quality:'सृजन, सौंदर्य',    desc:'सौंदर्यप्रिय, रचनात्मक, समृद्ध' },
  'Mrigashira':     { deity:'सोम',            quality:'खोज, यात्रा',       desc:'जिज्ञासु, यात्री, ज्ञान-पिपासु' },
  'Ardra':          { deity:'रुद्र',          quality:'परिवर्तन, तूफान',   desc:'तीव्र बुद्धि, परिवर्तनकारी' },
  'Punarvasu':      { deity:'अदिति',          quality:'पुनर्जन्म, आशा',    desc:'आशावादी, लचीले, बार-बार उठने वाले' },
  'Pushya':         { deity:'बृहस्पति',       quality:'पोषण, धर्म',        desc:'पोषण करने वाले, धार्मिक, शुभ' },
  'Ashlesha':       { deity:'सर्प',           quality:'कुंडलिनी, रहस्य',   desc:'रहस्यमय, गहरी शक्ति' },
  'Magha':          { deity:'पितृ',           quality:'पूर्वज-आशीर्वाद',   desc:'नेतृत्व, पूर्वज-शक्ति, राज-सम्मान' },
  'Purva Phalguni': { deity:'भग',             quality:'प्रेम, आनंद',       desc:'कलाप्रिय, प्रेमी, आनंदमय' },
  'Uttara Phalguni':{ deity:'अर्यमन',         quality:'अनुबंध, सामाजिक',   desc:'सामाजिक प्रतिष्ठा, मित्रता, अनुबंध' },
  'Hasta':          { deity:'सविता',          quality:'कौशल, हस्तशिल्प',   desc:'कुशल हाथ, व्यावहारिक, चतुर' },
  'Chitra':         { deity:'विश्वकर्मा',     quality:'सृजन, सौंदर्य',     desc:'कलात्मक, आकर्षक, निर्माण-क्षमता' },
  'Swati':          { deity:'वायु',           quality:'स्वतंत्रता, व्यापार', desc:'स्वतंत्र, व्यापारी, लचीले' },
  'Vishakha':       { deity:'इंद्र-अग्नि',    quality:'लक्ष्य, दृढ़ता',     desc:'लक्ष्य-केंद्रित, दृढ़, परिवर्तनशील' },
  'Anuradha':       { deity:'मित्र',          quality:'मित्रता, सहयोग',    desc:'मित्रभाव, टीम-वर्क, सफलता' },
  'Jyeshtha':       { deity:'इंद्र',          quality:'वरिष्ठता, शक्ति',   desc:'शक्तिशाली, नेता, सुरक्षक' },
  'Moola':          { deity:'निऋति',          quality:'जड़ें, परिवर्तन',    desc:'गहरी जड़ें, मूलभूत परिवर्तन' },
  'Purva Ashadha':  { deity:'आप',             quality:'जल, शुद्धि',        desc:'शुद्धिकरण, उत्साह, विजयी' },
  'Uttara Ashadha': { deity:'विश्वेदेव',      quality:'विजय, सार्वभौमिक',   desc:'सार्वभौमिक विजय, नेतृत्व' },
  'Shravana':       { deity:'विष्णु',         quality:'सुनना, ज्ञान',       desc:'ज्ञान-पिपासु, परंपरा-प्रेमी' },
  'Dhanishtha':     { deity:'अष्टवसु',        quality:'धन, संगीत',          desc:'संगीतप्रिय, धनवान, साहसी' },
  'Shatabhisha':    { deity:'वरुण',           quality:'उपचार, रहस्य',       desc:'रहस्यमय, वैज्ञानिक, उपचारक' },
  'Purva Bhadrapada':{ deity:'अज एकपाद',     quality:'परिवर्तन, अग्नि',    desc:'तीव्र, परिवर्तनकारी, उग्र' },
  'Uttara Bhadrapada':{ deity:'अहिर्बुध्न्य', quality:'गहराई, शांति',       desc:'गहरा मन, असाधारण सहनशक्ति, आध्यात्मिक' },
  'Revati':         { deity:'पूषन',           quality:'यात्रा, सुरक्षा',    desc:'यात्री, सुरक्षक, दयालु, कलाप्रेमी' },
};

// ─── YOGA DETECTION ───────────────────────────────────────────
export function detectYogas(chart: ChartData): Yoga[] {
  const yogas: Yoga[] = [];
  const p = chart.planets;
  const lagnaIdx = SIGNS.indexOf(chart.lagna.sign_en);

  // Pancha Mahapurusha
  const exaltOwn: Record<string, { exalt: number[]; own: number[] }> = {
    Mars:    { exalt:[9], own:[0,7] }, Mercury: { exalt:[5], own:[2,5] },
    Jupiter: { exalt:[3], own:[8,11] }, Venus:   { exalt:[11], own:[1,6] },
    Saturn:  { exalt:[6], own:[9,10] },
  };
  const yogaNames: Record<string, string> = {
    Mars:'रुचक योग', Mercury:'भद्र योग', Jupiter:'हंस योग', Venus:'मालव्य योग', Saturn:'शश योग'
  };
  Object.entries(exaltOwn).forEach(([pl, d]) => {
    const pd = p[pl]; if (!pd) return;
    const signIdx = SIGNS.indexOf(pd.sign_en);
    const isExaltOwn = d.exalt.includes(signIdx) || d.own.includes(signIdx);
    if (isExaltOwn && [1,4,7,10].includes(pd.house)) {
      const yogaName = yogaNames[pl];
      yogas.push({ name: yogaName, nameHi: yogaName,
        description: PHALDIPIKA[`${yogaName.split(' ')[0].replace('योग','').trim()}_Yoga`] ||
          `${pd.name_hi} उच्च/स्वराशि में केंद्र भाव में — पंच महापुरुष योग। असाधारण सफलता और सम्मान।`,
        source: 'बृहज्जातकम् (वाराहमिहिर) + फलदीपिका', strength: 'Excellent' });
    }
  });

  // Neechabhanga
  const debilLord: Record<string, string> = {
    Sun:'Venus', Moon:'Saturn', Mars:'Moon', Mercury:'Jupiter',
    Jupiter:'Saturn', Venus:'Mercury', Saturn:'Sun'
  };
  Object.entries(p).forEach(([pl, pd]) => {
    if (pd.dignity !== 'Debilitated' || !debilLord[pl]) return;
    const lord = p[debilLord[pl]];
    if (lord && [1,4,7,10].includes(lord.house)) {
      yogas.push({ name:`${pl} नीचभंग राज योग`, nameHi:`${pd.name_hi} नीचभंग राज योग`,
        description:`${pd.name_hi} नीच है परंतु उनके स्वामी ${lord.name_hi} केंद्र भाव में हैं। नीचता भंग होकर राज योग बनता है। प्रारंभिक कठिनाइयों के बाद असाधारण सफलता।`,
        source:'बृहज्जातकम् + फलदीपिका', strength:'Good' });
    }
  });

  // Budha-Aditya
  if (p.Sun && p.Mercury && p.Sun.house === p.Mercury.house) {
    yogas.push({ name:'बुध-आदित्य योग', nameHi:'बुध-आदित्य योग',
      description:'सूर्य और बुध एक ही भाव में। तीव्र बुद्धि, वाकपटुता, करियर में सरकारी/प्रशासनिक सफलता।',
      source:'गर्ग होरा शास्त्र + फलदीपिका', strength:'Good' });
  }

  // Rahu 10th
  if (p.Rahu?.house === 10)
    yogas.push({ name:'राहु दशम योग', nameHi:'राहु दशम — सार्वजनिक नेतृत्व',
      description:'राहु दशम में — सार्वजनिक नेतृत्व, न्यायाधीश/मंत्री/विद्वान/धनवान का योग। विदेशी संस्थाओं से जुड़ाव। (गर्ग होरा शास्त्र, पृ. 150)',
      source:'गर्ग होरा शास्त्र', strength:'Good' });

  // Sangraha
  const hc: Record<number,number> = {};
  Object.values(p).forEach(pl => { hc[pl.house] = (hc[pl.house]||0)+1; });
  Object.entries(hc).forEach(([h,c]) => {
    if (c >= 3) yogas.push({ name:`संग्रह योग (${h}वाँ भाव)`, nameHi:`संग्रह योग (${h}वाँ भाव)`,
      description:`${h}वें भाव में ${c} ग्रह एकत्र हैं। इस भाव के विषय जातक के जीवन का केंद्र बन जाते हैं। (बृहज्जातकम्)`,
      source:'बृहज्जातकम् (वाराहमिहिर)', strength:'Moderate' });
  });

  // Moon + Venus same house — Chandra-Shukra
  if (p.Moon && p.Venus && p.Moon.house === p.Venus.house)
    yogas.push({ name:'चंद्र-शुक्र संयोग', nameHi:'चंद्र-शुक्र संयोग',
      description:'चंद्र और शुक्र एक भाव में — भावनात्मक परिपूर्णता, सौंदर्यबोध, और प्रेम में सुख।',
      source:'फलदीपिका', strength:'Good' });

  // Jupiter aspecting 5th from itself
  if (p.Jupiter) {
    const j5 = ((p.Jupiter.house - 1 + 4) % 12) + 1;
    yogas.push({ name:'गुरु पंचम दृष्टि', nameHi:'गुरु की पंचम दृष्टि',
      description:`गुरु अपनी विशेष दृष्टि से ${j5}वें भाव को देखते हैं — बुद्धि, संतान, और धर्म में शुभ प्रभाव।`,
      source:'फलदीपिका', strength:'Moderate' });
  }

  return yogas;
}

// ─── DASHA CALCULATION ────────────────────────────────────────
const DASHA_YRS: Record<string,number> = { Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17, Ketu:7, Venus:20 };
const DASHA_SEQ = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_COLORS: Record<string,string> = {
  Sun:'#FF8C42', Moon:'#74B9E6', Mars:'#E05252', Rahu:'#8B5CF6',
  Jupiter:'#F59E0B', Saturn:'#64748B', Mercury:'#34D399', Ketu:'#A78BFA', Venus:'#F472B6'
};
const DASHA_DESC: Record<string,string> = {
  Sun:'सत्ता, पिता, और आत्मा से जुड़े विषयों में सक्रियता। सरकारी कार्यों में सफलता।',
  Moon:'मन, माता, और भावनात्मक जीवन में परिवर्तन। यात्राएं और गृह-सुख।',
  Mars:'साहस, ऊर्जा, और संघर्ष की दशा। भूमि और संपत्ति के मामले।',
  Mercury:'बुद्धि, व्यापार, और संचार में विकास। शिक्षा और लेखन में सफलता।',
  Jupiter:'ज्ञान, धर्म, और विस्तार की दशा। संतान और गुरु-आशीर्वाद।',
  Venus:'प्रेम, कला, और भौतिक सुख की दशा। विवाह और संपत्ति।',
  Saturn:'कर्म, अनुशासन, और दीर्घकालीन फल। कठिन परिश्रम से टिकाऊ सफलता।',
  Rahu:'अप्रत्याशित परिवर्तन और भौतिक महत्वाकांक्षा। विदेश यात्रा संभव।',
  Ketu:'आध्यात्मिक जागरण और वैराग्य। अचानक परिवर्तन।',
};

export function calculateDashas(chart: ChartData, birthYear: number): DashaPeriod[] {
  const moonLord = chart.planets.Moon?.nakshatra.lord || 'Moon';
  const startIdx = DASHA_SEQ.indexOf(moonLord);
  const dashas: DashaPeriod[] = [];
  let age = 0;
  for (let i = 0; i < 9; i++) {
    const pl = DASHA_SEQ[(startIdx + i) % 9];
    const yrs = DASHA_YRS[pl];
    const pd = chart.planets[pl];
    const houseNote = pd ? ` ${PLANET_HI[pl]} आपके ${pd.house}वें भाव (${pd.sign_hi}) में हैं।` : '';
    dashas.push({ planet:pl, planetHi:PLANET_HI[pl]||pl, years:yrs,
      startAge:Math.round(age), endAge:Math.round(age+yrs),
      description: DASHA_DESC[pl] + houseNote, color:DASHA_COLORS[pl] });
    age += yrs;
    if (age > 120) break;
  }
  return dashas;
}

// ─── 26-TOPIC PREDICTION ENGINE ───────────────────────────────
export function generateAllPredictions(chart: ChartData): PredictionSection[] {
  const p = chart.planets;
  const L = chart.lagna;
  const lagnaIdx = SIGNS.indexOf(L.sign_en);

  function hPlnts(h: number) { return Object.entries(p).filter(([,v])=>v.house===h); }
  function lordOf(h: number): PlanetData | undefined {
    const signIdx = (lagnaIdx + h - 1) % 12;
    const lord: Record<number,string> = {0:'Mars',1:'Venus',2:'Mercury',3:'Moon',4:'Sun',5:'Mercury',6:'Venus',7:'Mars',8:'Jupiter',9:'Saturn',10:'Saturn',11:'Jupiter'};
    return p[lord[signIdx]];
  }
  function gargaFor(planet: string, house: number): Prediction | null {
    const txt = GARGA[planet]?.[house];
    if (!txt) return null;
    const pd = p[planet];
    const isGood = pd?.dignity === 'Exalted' || pd?.dignity === 'Own Sign';
    return { text:`${PLANET_HI[planet]} (${p[planet]?.sign_hi||''}) ${house}वें भाव में: ${txt}`,
      source:`गर्ग होरा शास्त्र`,
      type: isGood ? 'positive' : (planet === 'Saturn' || planet === 'Rahu' || planet === 'Ketu') ? 'caution' : 'neutral' };
  }

  const sections: PredictionSection[] = [];

  // 1. Lagna & Personality
  sections.push({ id:'lagna', titleHi:'व्यक्तित्व एवं स्वभाव', icon:'🧠', predictions:[
    { text:(PHALDIPIKA[`${L.sign_en}_Lagna`]||`${L.sign_hi} लग्न — लग्नेश ${L.lord}।`), source:'फलदीपिका', type:'neutral' },
    { text:`लग्न नक्षत्र: ${L.nakshatra.hi} (${L.nakshatra.en}), पद ${L.nakshatra.pada}। देवता: ${NAK_DATA[L.nakshatra.en]?.deity||'—'}। गुण: ${NAK_DATA[L.nakshatra.en]?.desc||''}`, source:'वेदांग ज्योतिष', type:'neutral' },
    { text:`लग्नेश ${L.lord} (${p[L.lord]?.name_hi||''}) — ${p[L.lord]?.sign_hi||''} राशि में ${p[L.lord]?.house||'?'}वें भाव में, ${p[L.lord]?.dignity||''}।`, source:'फलदीपिका', type:'neutral' },
  ] });

  // 2. Mental nature (Moon)
  const moonPreds: Prediction[] = [];
  if (p.Moon) {
    const gm = gargaFor('Moon', p.Moon.house); if (gm) moonPreds.push(gm);
    const mn = p.Moon.nakshatra;
    moonPreds.push({ text:`चंद्र नक्षत्र: ${mn.hi} (${mn.en}), पद ${mn.pada}। देवता: ${NAK_DATA[mn.en]?.deity||'—'}। ${NAK_DATA[mn.en]?.desc||''}`, source:'वेदांग ज्योतिष', type:'neutral' });
    if (BHRIGU[`Moon_${p.Moon.house}th`]) moonPreds.push({ text:BHRIGU[`Moon_${p.Moon.house}th`], source:'भृगु संहिता', type:'neutral' });
  }
  sections.push({ id:'mind', titleHi:'मन एवं भावनात्मक स्वभाव', icon:'🌙', predictions:moonPreds });

  // 3. Education
  const eduPreds: Prediction[] = [];
  hPlnts(4).forEach(([n,])=>{ const g=gargaFor(n,4); if(g) eduPreds.push(g); });
  hPlnts(5).forEach(([n,])=>{ const g=gargaFor(n,5); if(g) eduPreds.push(g); });
  const fifth_lord = lordOf(5);
  if (fifth_lord) eduPreds.push({ text:`पंचमेश ${fifth_lord.name_hi} ${fifth_lord.sign_hi} में ${fifth_lord.house}वें भाव में — बुद्धि और शिक्षा का विकास।`, source:'फलदीपिका', type:'neutral' });
  if (!eduPreds.length) eduPreds.push({ text:'चतुर्थ और पंचम भाव के स्वामी की स्थिति से शिक्षा का विश्लेषण करें।', source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'edu', titleHi:'शिक्षा एवं बुद्धि', icon:'📚', predictions:eduPreds });

  // 4. Career
  const careerPreds: Prediction[] = [];
  hPlnts(10).forEach(([n,])=>{ const g=gargaFor(n,10); if(g) careerPreds.push(g); });
  const tenth_lord = lordOf(10);
  if (tenth_lord) careerPreds.push({ text:`दशमेश ${tenth_lord.name_hi} ${tenth_lord.sign_hi} में ${tenth_lord.house}वें भाव में (${tenth_lord.dignity}) — करियर की दिशा निर्धारित करता है।`, source:'फलदीपिका', type:'neutral' });
  if (p.Saturn) { const g=gargaFor('Saturn',p.Saturn.house); if(g) careerPreds.push({...g, text:'शनि (कर्मकारक): '+g.text}); }
  if (!careerPreds.length) careerPreds.push({ text:'दशम भाव खाली है। दशमेश और शनि की स्थिति से करियर देखें।', source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'career', titleHi:'करियर एवं व्यवसाय', icon:'💼', predictions:careerPreds });

  // 5. Wealth
  const wealthPreds: Prediction[] = [];
  hPlnts(2).forEach(([n,])=>{ const g=gargaFor(n,2); if(g) wealthPreds.push(g); });
  hPlnts(11).forEach(([n,])=>{ const g=gargaFor(n,11); if(g) wealthPreds.push(g); });
  if (p.Jupiter) { const g=gargaFor('Jupiter',p.Jupiter.house); if(g) wealthPreds.push({...g, text:'गुरु (धन कारक): '+g.text}); }
  if (!wealthPreds.length) wealthPreds.push({ text:'धन भाव और लाभ भाव के स्वामी की स्थिति से आर्थिक जीवन देखें।', source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'wealth', titleHi:'धन एवं वित्त', icon:'💰', predictions:wealthPreds });

  // 6. Marriage
  const marriagePreds: Prediction[] = [];
  hPlnts(7).forEach(([n,])=>{ const g=gargaFor(n,7); if(g) marriagePreds.push(g); });
  if (p.Venus) { const g=gargaFor('Venus',p.Venus.house); if(g) marriagePreds.push({...g, text:'शुक्र (विवाह कारक): '+g.text}); }
  const seventh_lord = lordOf(7);
  if (seventh_lord) marriagePreds.push({ text:`सप्तमेश ${seventh_lord.name_hi} ${seventh_lord.sign_hi} में ${seventh_lord.house}वें भाव में — वैवाहिक जीवन की दिशा।`, source:'फलदीपिका', type:'neutral' });
  if (!marriagePreds.length) marriagePreds.push({ text:'सप्तम भाव खाली है। सप्तमेश और शुक्र की दशा में विवाह होगा।', source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'marriage', titleHi:'विवाह एवं प्रेम जीवन', icon:'❤️', predictions:marriagePreds });

  // 7. Children
  const childPreds: Prediction[] = [];
  hPlnts(5).forEach(([n,])=>{ const g=gargaFor(n,5); if(g) childPreds.push(g); });
  if (p.Jupiter) childPreds.push({ text:`गुरु (संतान कारक) ${p.Jupiter.house}वें भाव (${p.Jupiter.sign_hi}) में हैं। गुरु की दशा में संतान का योग।`, source:'गर्ग होरा शास्त्र', type:'neutral' });
  if (!childPreds.length) childPreds.push({ text:'पंचम भाव खाली है। पंचमेश और गुरु की दशा में संतान का योग।', source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'children', titleHi:'संतान सुख', icon:'👶', predictions:childPreds });

  // 8. Mother
  const motherPreds: Prediction[] = [];
  hPlnts(4).forEach(([n,])=>{ const g=gargaFor(n,4); if(g) motherPreds.push(g); });
  if (p.Moon) motherPreds.push({ text:`चंद्र (माता कारक) ${p.Moon.house}वें भाव में — माता का स्वभाव और स्वास्थ्य।`, source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'mother', titleHi:'माता एवं गृह-सुख', icon:'🏠', predictions:motherPreds.length ? motherPreds : [{ text:'चतुर्थ भाव के आधार पर माता और घर का विश्लेषण करें।', source:'फलदीपिका', type:'neutral' }] });

  // 9. Father
  const fatherPreds: Prediction[] = [];
  hPlnts(9).forEach(([n,])=>{ const g=gargaFor(n,9); if(g) fatherPreds.push(g); });
  if (p.Sun) fatherPreds.push({ text:`सूर्य (पिता कारक) ${p.Sun.house}वें भाव में — पिता का स्वभाव।`, source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'father', titleHi:'पिता एवं भाग्य', icon:'👨', predictions:fatherPreds.length ? fatherPreds : [{ text:'नवम भाव और सूर्य की स्थिति से पिता और भाग्य देखें।', source:'फलदीपिका', type:'neutral' }] });

  // 10. Siblings
  const sibPreds: Prediction[] = [];
  hPlnts(3).forEach(([n,])=>{ const g=gargaFor(n,3); if(g) sibPreds.push(g); });
  if (p.Mars) sibPreds.push({ text:`मंगल (भाई कारक) ${p.Mars.house}वें भाव में — भाइयों का सुख।`, source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'siblings', titleHi:'भाई-बहन', icon:'👫', predictions:sibPreds.length ? sibPreds : [{ text:'तृतीय भाव और मंगल की स्थिति से भाई-बहन का सुख।', source:'फलदीपिका', type:'neutral' }] });

  // 11. Property & Vehicles
  const propPreds: Prediction[] = [];
  hPlnts(4).forEach(([n,])=>{ const g=gargaFor(n,4); if(g) propPreds.push(g); });
  const bhrigu4v = BHRIGU[p.Venus?.house === 4 ? 'Venus_4th_Exalted' : p.Saturn?.house === 4 ? 'Saturn_4th' : 'Moon_4th'];
  if (bhrigu4v) propPreds.push({ text:bhrigu4v, source:'भृगु संहिता', type:'neutral' });
  sections.push({ id:'property', titleHi:'भूमि, घर एवं वाहन', icon:'🏡', predictions:propPreds.length ? propPreds : [{ text:'चतुर्थ भाव और उसके स्वामी की स्थिति से संपत्ति देखें।', source:'फलदीपिका', type:'neutral' }] });

  // 12. Health
  const healthPreds: Prediction[] = [];
  hPlnts(6).forEach(([n,])=>{ const g=gargaFor(n,6); if(g) healthPreds.push({...g, type:'caution'}); });
  hPlnts(8).forEach(([n,])=>{ const g=gargaFor(n,8); if(g) healthPreds.push({...g, type:'caution'}); });
  const lagnaHealth: Record<string,string> = {
    Aries:'सिर और मस्तिष्क', Taurus:'गला और गर्दन', Gemini:'फेफड़े और श्वास',
    Cancer:'पेट और पाचन', Leo:'हृदय और रीढ़', Virgo:'पाचन तंत्र', Libra:'गुर्दे',
    Scorpio:'प्रजनन अंग', Sagittarius:'जांघ, कूल्हे, और लीवर', Capricorn:'जोड़ और हड्डियाँ',
    Aquarius:'पैर और रक्त संचार', Pisces:'पैर और लसीका तंत्र',
  };
  healthPreds.push({ text:`${L.sign_hi} लग्न — संवेदनशील अंग: ${lagnaHealth[L.sign_en]||''}। इन पर विशेष ध्यान दें।`, source:'फलदीपिका', type:'caution' });
  if (p.Saturn) { const gs=gargaFor('Saturn',p.Saturn.house); if(gs) healthPreds.push({...gs, type:'caution', text:'शनि (दीर्घरोग कारक): '+gs.text}); }
  sections.push({ id:'health', titleHi:'स्वास्थ्य', icon:'🏥', predictions:healthPreds });

  // 13. Enemies & Competitors
  const enemyPreds: Prediction[] = [];
  hPlnts(6).forEach(([n,])=>{ const g=gargaFor(n,6); if(g) enemyPreds.push(g); });
  const sixth_lord = lordOf(6);
  if (sixth_lord) enemyPreds.push({ text:`षष्ठेश ${sixth_lord.name_hi} ${sixth_lord.sign_hi} में ${sixth_lord.house}वें भाव में — शत्रुओं की स्थिति।`, source:'फलदीपिका', type:'neutral' });
  sections.push({ id:'enemies', titleHi:'शत्रु एवं प्रतिस्पर्धा', icon:'⚔️', predictions:enemyPreds.length ? enemyPreds : [{ text:'षष्ठ भाव खाली है। मंगल और शनि की स्थिति से शत्रुओं का विश्लेषण।', source:'फलदीपिका', type:'neutral' }] });

  // 14. Loans & Legal
  const legalPreds: Prediction[] = [];
  hPlnts(6).forEach(([n,])=>{ if(n==='Saturn'||n==='Rahu') { const g=gargaFor(n,6); if(g) legalPreds.push(g); } });
  hPlnts(8).forEach(([n,])=>{ if(n==='Saturn'||n==='Rahu') { const g=gargaFor(n,8); if(g) legalPreds.push({...g,type:'caution'}); } });
  if (!legalPreds.length) legalPreds.push({ text:'षष्ठ और अष्टम भाव में कोई अशुभ ग्रह नहीं — ऋण और कानूनी मामलों से बचाव।', source:'फलदीपिका', type:'positive' });
  sections.push({ id:'legal', titleHi:'ऋण एवं कानूनी मामले', icon:'⚖️', predictions:legalPreds });

  // 15. Travel & Foreign
  const travelPreds: Prediction[] = [];
  hPlnts(9).forEach(([n,])=>{ const g=gargaFor(n,9); if(g) travelPreds.push(g); });
  hPlnts(12).forEach(([n,])=>{ const g=gargaFor(n,12); if(g) travelPreds.push(g); });
  if (p.Rahu) travelPreds.push({ text:`राहु (विदेश कारक) ${p.Rahu.house}वें भाव में — विदेश यात्रा और विदेशी सम्पर्क की संभावना।`, source:'गर्ग होरा शास्त्र', type:'neutral' });
  sections.push({ id:'travel', titleHi:'यात्रा एवं विदेश', icon:'✈️', predictions:travelPreds.length ? travelPreds : [{ text:'नवम और द्वादश भाव से यात्रा का विश्लेषण करें।', source:'फलदीपिका', type:'neutral' }] });

  // 16. Friends & Social Life
  const friendPreds: Prediction[] = [];
  hPlnts(11).forEach(([n,])=>{ const g=gargaFor(n,11); if(g) friendPreds.push(g); });
  sections.push({ id:'friends', titleHi:'मित्र एवं सामाजिक जीवन', icon:'🤝', predictions:friendPreds.length ? friendPreds : [{ text:'एकादश भाव खाली है। लाभेश की दशा में लाभ और मित्रता का योग।', source:'फलदीपिका', type:'neutral' }] });

  // 17. Hidden Enemies & Losses
  const hiddenPreds: Prediction[] = [];
  hPlnts(12).forEach(([n,])=>{ const g=gargaFor(n,12); if(g) hiddenPreds.push(g); });
  sections.push({ id:'losses', titleHi:'गुप्त शत्रु एवं हानि', icon:'🌑', predictions:hiddenPreds.length ? hiddenPreds : [{ text:'द्वादश भाव खाली है — गुप्त शत्रुओं से कम भय।', source:'फलदीपिका', type:'positive' }] });

  // 18. Spirituality
  const spiritPreds: Prediction[] = [];
  hPlnts(9).forEach(([n,])=>{ const g=gargaFor(n,9); if(g) spiritPreds.push(g); });
  hPlnts(12).forEach(([n,])=>{ const g=gargaFor(n,12); if(g) spiritPreds.push(g); });
  if (p.Ketu) { const gk=gargaFor('Ketu',p.Ketu.house); if(gk) spiritPreds.push({...gk,text:'केतु (मोक्षकारक): '+gk.text}); }
  sections.push({ id:'spirit', titleHi:'आध्यात्म एवं धर्म', icon:'🕉️', predictions:spiritPreds.length ? spiritPreds : [{ text:'नवम भाव के स्वामी और केतु से आध्यात्मिक जीवन देखें।', source:'भृगु संहिता', type:'neutral' }] });

  // 19. Longevity
  const longPreds: Prediction[] = [];
  hPlnts(8).forEach(([n,])=>{ const g=gargaFor(n,8); if(g) longPreds.push(g); });
  if (p.Saturn) longPreds.push({ text:`शनि (आयुकारक) ${p.Saturn.sign_hi} में ${p.Saturn.house}वें भाव में (${p.Saturn.dignity}) — आयु का संकेतक।`, source:'बृहज्जातकम्', type:'neutral' });
  if (p.Venus?.dignity === 'Exalted') longPreds.push({ text:BRIHAT.Longevity, source:'बृहज्जातकम्', type:'positive' });
  sections.push({ id:'longevity', titleHi:'आयु एवं दीर्घायु', icon:'⏰', predictions:longPreds.length ? longPreds : [{ text:'अष्टम भाव और शनि की स्थिति से आयु का अनुमान।', source:'बृहज्जातकम्', type:'neutral' }] });

  // 20. Fame & Reputation
  const famePreds: Prediction[] = [];
  hPlnts(10).forEach(([n,])=>{ const g=gargaFor(n,10); if(g) famePreds.push(g); });
  hPlnts(11).forEach(([n,])=>{ const g=gargaFor(n,11); if(g) famePreds.push(g); });
  sections.push({ id:'fame', titleHi:'कीर्ति एवं प्रसिद्धि', icon:'🌟', predictions:famePreds.length ? famePreds : [{ text:'दशम और एकादश भाव के स्वामी की दशा में कीर्ति का योग।', source:'फलदीपिका', type:'neutral' }] });

  // 21. Nakshatra deep-dive
  const nakPreds: Prediction[] = [];
  [['Sun','सूर्य'],['Moon','चंद्र'],['Mars','मंगल'],['Mercury','बुध'],['Jupiter','गुरु'],['Venus','शुक्र'],['Saturn','शनि'],['Rahu','राहु'],['Ketu','केतु']].forEach(([pl,hi])=>{
    const pd = p[pl]; if(!pd) return;
    const nd = NAK_DATA[pd.nakshatra.en];
    if (nd) nakPreds.push({ text:`${hi}: ${pd.nakshatra.hi} (पद ${pd.nakshatra.pada}) — देवता: ${nd.deity} | ${nd.desc}`, source:'वेदांग ज्योतिष', type:'neutral' });
  });
  sections.push({ id:'nakshatra', titleHi:'नक्षत्र विश्लेषण', icon:'⭐', predictions:nakPreds });

  // 22. Planetary strengths summary
  const strengthPreds: Prediction[] = [];
  Object.entries(p).forEach(([name,pd])=>{
    if (pd.dignity === 'Exalted') strengthPreds.push({ text:`${pd.name_hi} उच्च (${pd.sign_hi}) — ${pd.house}वें भाव में। अत्यंत बलशाली।`, source:'बृहज्जातकम्', type:'positive' });
    else if (pd.dignity === 'Own Sign') strengthPreds.push({ text:`${pd.name_hi} स्वराशि (${pd.sign_hi}) — ${pd.house}वें भाव में। बलशाली।`, source:'बृहज्जातकम्', type:'positive' });
    else if (pd.dignity === 'Debilitated') strengthPreds.push({ text:`${pd.name_hi} नीच (${pd.sign_hi}) — ${pd.house}वें भाव में। नीचभंग योग संभव।`, source:'बृहज्जातकम्', type:'caution' });
  });
  if (!strengthPreds.length) strengthPreds.push({ text:'सभी ग्रह तटस्थ राशियों में हैं।', source:'बृहज्जातकम्', type:'neutral' });
  sections.push({ id:'strength', titleHi:'ग्रह बल एवं स्थिति', icon:'💪', predictions:strengthPreds });

  // 23. Special combinations from Garga
  const comboPreds: Prediction[] = [];
  // Check Sun+Mercury same house (Budha-Aditya)
  if (p.Sun && p.Mercury && p.Sun.house === p.Mercury.house)
    comboPreds.push({ text:`बुध-आदित्य योग: सूर्य और बुध ${p.Sun.house}वें भाव में — तीव्र बुद्धि, वाकपटुता, और करियर में सफलता।`, source:'गर्ग होरा शास्त्र + फलदीपिका', type:'positive' });
  // Venus in Pisces
  if (p.Venus?.sign_en === 'Pisces')
    comboPreds.push({ text:`शुक्र मीन राशि (उच्च) — गर्ग होरा शास्त्र: मीन राशि में शुक्र + चंद्र + अन्य ग्रह = उच्च पद, सौभाग्य, और बड़े परिवार का योग।`, source:'गर्ग होरा शास्त्र, पृ. 33', type:'positive' });
  if (!comboPreds.length) comboPreds.push({ text:'आपके chart में उल्लेखनीय विशेष संयोग।', source:'गर्ग होरा शास्त्र', type:'neutral' });
  sections.push({ id:'combos', titleHi:'विशेष ग्रह-संयोग', icon:'✨', predictions:comboPreds });

  // 24. Summary of all 12 houses
  const houseSummary: Prediction[] = [];
  for (let h = 1; h <= 12; h++) {
    const housePlnts = hPlnts(h);
    const houseNames = ['प्रथम (स्व)', 'द्वितीय (धन)', 'तृतीय (पराक्रम)', 'चतुर्थ (सुख)', 'पंचम (संतान)', 'षष्ठ (शत्रु)', 'सप्तम (विवाह)', 'अष्टम (आयु)', 'नवम (भाग्य)', 'दशम (करियर)', 'एकादश (लाभ)', 'द्वादश (व्यय)'];
    if (housePlnts.length > 0) {
      houseSummary.push({ text:`${houseNames[h-1]} भाव: ${housePlnts.map(([n,d])=>`${d.name_hi}(${d.dignity==='Exalted'?'उच्च':d.dignity==='Debilitated'?'नीच':d.dignity==='Own Sign'?'स्वराशि':''})`).join(', ')}`, source:'जन्म कुंडली', type:'neutral' });
    } else {
      houseSummary.push({ text:`${houseNames[h-1]} भाव: खाली`, source:'जन्म कुंडली', type:'neutral' });
    }
  }
  sections.push({ id:'houses', titleHi:'सभी 12 भावों का सारांश', icon:'🏠', predictions:houseSummary });

  // 25. Bhrigu special notes
  const bhriguPreds: Prediction[] = [];
  Object.entries(BHRIGU).forEach(([key, val]) => {
    const relevant = Object.entries(p).some(([pname, pd]) => {
      if (key.includes(pname) || key.includes(String(pd.house))) return true;
      if (key === 'Venus_4th_Exalted' && pname === 'Venus' && pd.dignity === 'Exalted') return true;
      if (key === 'Saturn_4th' && pname === 'Saturn' && pd.house === 4) return true;
      if (key === 'Rahu_10th' && pname === 'Rahu' && pd.house === 10) return true;
      if (key === 'Mars_9th_Friendly' && pname === 'Mars' && pd.house === 9) return true;
      if (key === 'Mercury_5th' && pname === 'Mercury' && pd.house === 5) return true;
      if (key === 'Ketu_4th' && pname === 'Ketu' && pd.house === 4) return true;
      if (key === 'Moon_4th' && pname === 'Moon' && pd.house === 4) return true;
      if (key === 'Jupiter_Debilitated' && pname === 'Jupiter' && pd.dignity === 'Debilitated') return true;
      return false;
    });
    if (relevant) bhriguPreds.push({ text:val, source:'भृगु संहिता (अध्ययन से)', type:'neutral' });
  });
  if (!bhriguPreds.length) bhriguPreds.push({ text:'भृगु संहिता के आधार पर कोई विशेष नोट नहीं।', source:'भृगु संहिता', type:'neutral' });
  sections.push({ id:'bhrigu', titleHi:'भृगु संहिता — विशेष नोट', icon:'📖', predictions:bhriguPreds });

  // 26. Life summary
  const summaryPreds: Prediction[] = [];
  const goodYogas = detectYogas(chart).filter(y => y.strength === 'Excellent' || y.strength === 'Good');
  summaryPreds.push({ text:`आपके chart में ${goodYogas.length} शुभ योग हैं: ${goodYogas.map(y=>y.nameHi).join(', ')}।`, source:'पंच-ग्रंथ संयुक्त', type:'positive' });
  const exaltedPlanets = Object.values(p).filter(pd => pd.dignity === 'Exalted');
  if (exaltedPlanets.length) summaryPreds.push({ text:`उच्च ग्रह: ${exaltedPlanets.map(pd=>pd.name_hi).join(', ')} — इनकी दशाओं में विशेष सफलता।`, source:'बृहज्जातकम्', type:'positive' });
  const debilPlanets = Object.values(p).filter(pd => pd.dignity === 'Debilitated');
  if (debilPlanets.length) summaryPreds.push({ text:`नीच ग्रह: ${debilPlanets.map(pd=>pd.name_hi).join(', ')} — नीचभंग की स्थिति और दशा पर ध्यान दें।`, source:'बृहज्जातकम्', type:'caution' });
  summaryPreds.push({ text:`लग्न: ${L.sign_hi} | लग्नेश: ${L.lord} | चंद्र नक्षत्र: ${p.Moon?.nakshatra.hi||'—'} | आयु: ${new Date().getFullYear()} के अनुसार दशा देखें।`, source:'जन्म कुंडली', type:'neutral' });
  sections.push({ id:'summary', titleHi:'सम्पूर्ण जीवन सारांश', icon:'🌟', predictions:summaryPreds });

  return sections;
}
