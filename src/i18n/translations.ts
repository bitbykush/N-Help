export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'or'; // Odia

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isFullySupported: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', isFullySupported: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isFullySupported: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isFullySupported: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isFullySupported: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isFullySupported: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isFullySupported: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isFullySupported: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isFullySupported: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', isFullySupported: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isFullySupported: false },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isFullySupported: false },
];

export interface TranslationDictionary {
  tagline: string;
  emergencyNow: string;
  emergencyMesh: string;
  safetyGuide: string;
  blackoutMode: string;
  emergencyKit: string;
  emergencyMap: string;
  stayCalm: string;
  checkOfficialInfo: string;
  shelterGuidance: string;
  evacuationGuidance: string;
  decontamGuidance: string;
  foodWaterGuidance: string;
  medicalHelp: string;
  online: string;
  internetDown: string;
  meshMode: string;
  battery: string;
  officialWarning: string;
  demoSimulation: string;
  communityMessage: string;
  verifiedOfficial: string;
  searchNearby: string;
  familyReconnect: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    tagline: 'KNOW. PREPARE. RESPOND.',
    emergencyNow: 'EMERGENCY NOW',
    emergencyMesh: 'EMERGENCY MESH',
    safetyGuide: 'SAFETY GUIDE',
    blackoutMode: 'BLACKOUT MODE',
    emergencyKit: 'EMERGENCY KIT',
    emergencyMap: 'EMERGENCY MAP',
    stayCalm: 'STAY CALM & DO NOT PANIC',
    checkOfficialInfo: 'CHECK VERIFIED OFFICIAL BROADCASTS',
    shelterGuidance: 'SHELTER GUIDANCE',
    evacuationGuidance: 'EVACUATION GUIDANCE',
    decontamGuidance: 'DECONTAMINATION GUIDANCE',
    foodWaterGuidance: 'SAFE FOOD & WATER',
    medicalHelp: 'MEDICAL HELP & TRIAGE',
    online: 'ONLINE',
    internetDown: 'INTERNET UNAVAILABLE',
    meshMode: 'MESH MODE ACTIVE',
    battery: 'BATTERY',
    officialWarning: 'FOLLOW VERIFIED OFFICIAL EMERGENCY INSTRUCTIONS',
    demoSimulation: 'DEMONSTRATION / SIMULATION',
    communityMessage: 'COMMUNITY MESSAGE (UNVERIFIED)',
    verifiedOfficial: 'VERIFIED OFFICIAL',
    searchNearby: 'Searching nearby compatible devices...',
    familyReconnect: 'FAMILY RECONNECT'
  },
  hi: {
    tagline: 'जानें। तैयार रहें। सुरक्षित प्रतिक्रिया दें।',
    emergencyNow: 'आपातकाल अभी (तुरंत कदम)',
    emergencyMesh: 'आपातकालीन मेश संचार',
    safetyGuide: 'सुरक्षा मार्गदर्शिका',
    blackoutMode: 'ब्लैकआउट मोड (कम बैटरी)',
    emergencyKit: 'आपातकालीन किट चेकलिस्ट',
    emergencyMap: 'आपातकालीन मानचित्र',
    stayCalm: 'शांत रहें और घबराएं नहीं',
    checkOfficialInfo: 'सत्यापित आधिकारिक रेडियो निर्देश सुनें',
    shelterGuidance: 'आश्रय (अंदर रहने) के निर्देश',
    evacuationGuidance: 'निकासी (स्थान छोड़ने) के निर्देश',
    decontamGuidance: 'विकिरण स्वच्छता (कपड़े उतारना)',
    foodWaterGuidance: 'सुरक्षित भोजन और जल सुरक्षा',
    medicalHelp: 'चिकित्सा सहायता और प्राथमिक उपचार',
    online: 'ऑनलाइन (इंटरनेट उपलब्ध)',
    internetDown: 'इंटरनेट अनुपलब्ध (ऑफलाइन)',
    meshMode: 'मेश संचार सक्रिय',
    battery: 'बैटरी',
    officialWarning: 'सक्षम आपातकालीन अधिकारियों के निर्देशों का पालन करें',
    demoSimulation: 'शैक्षणिक प्रदर्शन / सिमुलेशन',
    communityMessage: 'नागरिक संदेश (असत्यापित)',
    verifiedOfficial: 'सत्यापित आधिकारिक',
    searchNearby: 'आस-पास के संगत उपकरणों की खोज जारी...',
    familyReconnect: 'परिवार पुनर्मिलन पिंग'
  },
  bn: {
    tagline: 'জানুন। প্রস্তুত থাকুন। প্রতিক্রিয়া জানান।',
    emergencyNow: 'জরুরী পদক্ষেপ',
    emergencyMesh: 'জরুরী জাল যোগাযোগ',
    safetyGuide: 'সুরক্ষা নির্দেশিকা',
    blackoutMode: 'ব্ল্যাকআউট মোড',
    emergencyKit: 'জরুরী কিট',
    emergencyMap: 'জরুরী মানচিত্র',
    stayCalm: 'শান্ত থাকুন এবং আতঙ্কিত হবেন না',
    checkOfficialInfo: 'সরকারী সম্প্রচার শুনুন',
    shelterGuidance: 'আশ্রয় নির্দেশিকা',
    evacuationGuidance: 'উচ্ছেদ নির্দেশিকা',
    decontamGuidance: 'দূষণমুক্তকরণ নির্দেশিকা',
    foodWaterGuidance: 'নিরাপদ খাদ্য ও জল',
    medicalHelp: 'চিকিৎসা সহায়তা',
    online: 'অনলাইন',
    internetDown: 'ইন্টারনেট অনুপলব্ধ',
    meshMode: 'মেশ মোড সক্রিয়',
    battery: 'ব্যাটারি',
    officialWarning: 'সরকারী নির্দেশাবলী মেনে চলুন',
    demoSimulation: 'ডেমো সিমুলেশন',
    communityMessage: 'নাগরিক বার্তা',
    verifiedOfficial: 'যাচাইকৃত সরকারী',
    searchNearby: 'কাছের ডিভাইস খোঁজা হচ্ছে...',
    familyReconnect: 'পরিবার পুনর্মিলন'
  },
  ta: {
    tagline: 'அறிந்து கொள். தயார் செய். எதிர்கொள்.',
    emergencyNow: 'அவசர நிலை இப்போது',
    emergencyMesh: 'அவசர மெஷ் தொடர்பு',
    safetyGuide: 'பாதுகாப்பு வழிகாட்டி',
    blackoutMode: 'பிளாக்அவுட் பயன்முறை',
    emergencyKit: 'அவசர கிட்',
    emergencyMap: 'அவசர வரைபடம்',
    stayCalm: 'அமைதியாக இருங்கள், பதற்றமடைய வேண்டாம்',
    checkOfficialInfo: 'அதிகாரப்பூர்வ தகவலைப் பின்பற்றவும்',
    shelterGuidance: 'புகலிட வழிகாட்டுதல்',
    evacuationGuidance: 'வெளியேற்ற வழிகாட்டுதல்',
    decontamGuidance: 'கதிர்வீச்சு நீக்க வழிகாட்டுதல்',
    foodWaterGuidance: 'பாதுகாப்பான உணவு மற்றும் நீர்',
    medicalHelp: 'மருத்துவ உதவி',
    online: 'ஆன்லைன்',
    internetDown: 'இணையம் இல்லை',
    meshMode: 'மெஷ் பயன்முறை இயங்குகிறது',
    battery: 'பேட்டரி',
    officialWarning: 'அதிகாரப்பூர்வ எச்சரிக்கைகளைப் பின்பற்றவும்',
    demoSimulation: 'டெமோ விளக்கம்',
    communityMessage: 'பொது செய்தி',
    verifiedOfficial: 'சரிபார்க்கப்பட்ட அதிகாரம்',
    searchNearby: 'சாதனங்களைத் தேடுகிறது...',
    familyReconnect: 'குடும்ப இணைப்பு'
  },
  te: {
    tagline: 'తెలుసుకోండి. సిద్ధంగా ఉండండి. స్పందించండి.',
    emergencyNow: 'అత్యవసర చర్యలు',
    emergencyMesh: 'ఎమర్జెన్సీ మెష్ నెట్‌వర్క్',
    safetyGuide: 'భద్రతా గైడ్',
    blackoutMode: 'బ్లాక్‌అవుట్ మోడ్',
    emergencyKit: 'ఎమర్జెన్సీ కిట్',
    emergencyMap: 'ఎమర్జెన్సీ మ్యాప్',
    stayCalm: 'ప్రశాంతంగా ఉండండి, భయపడకండి',
    checkOfficialInfo: 'అధికారిక ఆదేశాలు వినండి',
    shelterGuidance: 'ఆశ్రయ మార్గదర్శకాలు',
    evacuationGuidance: 'తరలింపు మార్గదర్శకాలు',
    decontamGuidance: 'డికంటామినేషన్ సలహాలు',
    foodWaterGuidance: 'సురక్షిత ఆహారం & నీరు',
    medicalHelp: 'వైద్య సహాయం',
    online: 'ఆన్‌లైన్',
    internetDown: 'ఇంటర్నెట్ అందుబాటులో లేదు',
    meshMode: 'మెష్ మోడ్ యాక్టివ్',
    battery: 'బ్యాటరీ',
    officialWarning: 'అధికారిక ఆదేశాలను పాటించండి',
    demoSimulation: 'డెమో సిమ్యులేషన్',
    communityMessage: 'పౌర సందేశం',
    verifiedOfficial: 'ధృవీకరించబడిన అధికారిక',
    searchNearby: 'పరికరాల కోసం శోధిస్తోంది...',
    familyReconnect: 'కుటుంబ రీకనెక్ట్'
  },
  mr: {
    tagline: 'जाणा. तयार राहा. प्रतिसाद द्या.',
    emergencyNow: 'तातडीची पावले',
    emergencyMesh: 'आपत्कालीन मेश संवाद',
    safetyGuide: 'सुरक्षा मार्गदर्शक',
    blackoutMode: 'ब्लॅकआउट मोड',
    emergencyKit: 'आपत्कालीन किट',
    emergencyMap: 'आपत्कालीन नकाशा',
    stayCalm: 'शांत राहा आणि घाबरू नका',
    checkOfficialInfo: 'अधिकृत सूचनांचे पालन करा',
    shelterGuidance: 'निवारा मार्गदर्शन',
    evacuationGuidance: 'स्थलांतर मार्गदर्शन',
    decontamGuidance: 'स्वच्छता मार्गदर्शन',
    foodWaterGuidance: 'सुरक्षित अन्न व पाणी',
    medicalHelp: 'वैद्यकीय मदत',
    online: 'ऑनलाइन',
    internetDown: 'इंटरनेट अनुपलब्ध',
    meshMode: 'मेश मोड सक्रिय',
    battery: 'बॅटरी',
    officialWarning: 'अधिकृत सूचनांचे पालन करा',
    demoSimulation: 'डेमो सिम्युलेशन',
    communityMessage: 'नागरी संदेश',
    verifiedOfficial: 'प्रमाणित अधिकृत',
    searchNearby: 'जवळपासची उपकरणे शोधत आहे...',
    familyReconnect: 'कुटुंब रीकनेक्ट'
  },
  gu: {
    tagline: 'જાણો. તૈયાર રહો. પ્રતિક્રિયા આપો.',
    emergencyNow: 'તાત્કાલિક પગલાં',
    emergencyMesh: 'ઇમરજન્સી મેશ સંચાર',
    safetyGuide: 'સુરક્ષા માર્ગદર્શિકા',
    blackoutMode: 'બ્લેકઆઉટ મોડ',
    emergencyKit: 'ઇમરજન્સી કીટ',
    emergencyMap: 'ઇમરજન્સી નકશો',
    stayCalm: 'શાંત રહો અને ગભરાશો નહીં',
    checkOfficialInfo: 'સત્તાવાર સૂચનાઓનું પાલન કરો',
    shelterGuidance: 'આશ્રય માર્ગદર્શન',
    evacuationGuidance: 'સ્થળાંતર માર્ગદર્શન',
    decontamGuidance: 'ડિકોન્ટામિનેશન સલાહ',
    foodWaterGuidance: 'સુરક્ષિત ખોરાક અને પાણી',
    medicalHelp: 'તબીબી સહાય',
    online: 'ઓનલાઇન',
    internetDown: 'ઇન્ટરનેટ અનુપલબ્ધ',
    meshMode: 'મેશ મોડ સક્રિય',
    battery: 'બેટરી',
    officialWarning: 'સત્તાવાર સૂચનાઓ અનુસરો',
    demoSimulation: 'ડેમો સિમ્યુલેશન',
    communityMessage: 'નાગરિક સંદેશ',
    verifiedOfficial: 'પ્રમાણિત સત્તાવાર',
    searchNearby: 'ઉપકરણો શોધી રહ્યાં છીએ...',
    familyReconnect: 'પરિવાર રિકનેક્ટ'
  },
  pa: {
    tagline: 'ਜਾਣੋ। ਤਿਆਰ ਰਹੋ। ਜਵਾਬ ਦਿਓ।',
    emergencyNow: 'ਐਮਰਜੈਂਸੀ ਹੁਣੇ',
    emergencyMesh: 'ਐਮਰਜੈਂਸੀ ਮੈਸ਼ ਸੰਚਾਰ',
    safetyGuide: 'ਸੁਰੱਖਿਆ ਗਾਈਡ',
    blackoutMode: 'ਬਲੈਕਆਊਟ ਮੋਡ',
    emergencyKit: 'ਐਮਰਜੈਂਸੀ ਕਿੱਟ',
    emergencyMap: 'ਐਮਰਜੈਂਸੀ ਨਕਸ਼ਾ',
    stayCalm: 'ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਘਬਰਾਓ ਨਾ',
    checkOfficialInfo: 'ਸਰਕਾਰੀ ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ',
    shelterGuidance: 'ਸ਼ੈਲਟਰ ਗਾਈਡੈਂਸ',
    evacuationGuidance: 'ਨਿਕਾਸੀ ਗਾਈਡੈਂਸ',
    decontamGuidance: 'ਸਫਾਈ ਦੇ ਨਿਯਮ',
    foodWaterGuidance: 'ਸੁਰੱਖਿਅਤ ਭੋਜਨ ਅਤੇ ਪਾਣੀ',
    medicalHelp: 'ਮੈਡੀਕਲ ਮਦਦ',
    online: 'ਆਨਲਾਈਨ',
    internetDown: 'ਇੰਟਰਨੈੱਟ ਅਣਉਪਲਬਧ',
    meshMode: 'ਮੈਸ਼ ਮੋਡ ਐਕਟਿਵ',
    battery: 'ਬੈਟਰੀ',
    officialWarning: 'ਸਰਕਾਰੀ ਆਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ',
    demoSimulation: 'ਡੈਮੋ ਸਿਮੂਲੇਸ਼ਨ',
    communityMessage: 'ਨਾਗਰਿਕ ਸੁਨੇਹਾ',
    verifiedOfficial: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਰਕਾਰੀ',
    searchNearby: 'ਉਪਕਰਣਾਂ ਦੀ ਖੋਜ ਜਾਰੀ...',
    familyReconnect: 'ਪਰਿਵਾਰ ਰੀਕਨੈਕਟ'
  },
  ml: {
    tagline: 'അറിയുക. തയ്യാറെടുക്കുക. പ്രതികരിക്കുക.',
    emergencyNow: 'അടിയന്തര നടപടികൾ',
    emergencyMesh: 'എമർജൻസി മെഷ് ആശയവിനിമയം',
    safetyGuide: 'സുരക്ഷാ ഗൈഡ്',
    blackoutMode: 'ബ്ലാക്ക്ഔട്ട് മോഡ്',
    emergencyKit: 'എമർജൻസി കിറ്റ്',
    emergencyMap: 'എമർജൻസി മാപ്പ്',
    stayCalm: 'ശാന്തത പാലിക്കുക, പരിഭ്രാന്തരാകരുത്',
    checkOfficialInfo: 'ഔദ്യോഗിക അറിയിപ്പുകൾ ശ്രദ്ധിക്കുക',
    shelterGuidance: 'അഭയ മാർഗ്ഗനിർദ്ദേശം',
    evacuationGuidance: 'ഒഴിപ്പിക്കൽ മാർഗ്ഗനിർദ്ദേശം',
    decontamGuidance: 'ശുചീകരണ മാർഗ്ഗനിർദ്ദേശങ്ങൾ',
    foodWaterGuidance: 'സുരക്ഷിത ഭക്ഷണവും വെള്ളവും',
    medicalHelp: 'ചികിത്സാ സഹായം',
    online: 'ഓൺലൈൻ',
    internetDown: 'ഇന്റർനെറ്റ് ലഭ്യമല്ല',
    meshMode: 'മെഷ് മോഡ് സജീവം',
    battery: 'ബാറ്ററി',
    officialWarning: 'ഔദ്യോഗിക നിർദ്ദേശങ്ങൾ പാലിക്കുക',
    demoSimulation: 'ഡെമോ സിമുലേഷൻ',
    communityMessage: 'കമ്മ്യൂണിറ്റി സന്ദേശം',
    verifiedOfficial: 'പരിശോധിച്ച ഔദ്യോഗികം',
    searchNearby: 'ഉപകരണങ്ങൾ തിരയുന്നു...',
    familyReconnect: 'കുടുംബ റീകണക്റ്റ്'
  },
  kn: {
    tagline: 'ತಿಳಿಯಿರಿ. ಸಿದ್ಧರಾಗಿ. ಪ್ರತಿಕ್ರಿಯಿಸಿ.',
    emergencyNow: 'ತುರ್ತು ಕ್ರಮಗಳು',
    emergencyMesh: 'ಎಮರ್ಜೆನ್ಸಿ ಮೆಶ್ ಸಂಪರ್ಕ',
    safetyGuide: 'ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿ',
    blackoutMode: 'ಬ್ಲ್ಯಾಕ್‌ಔಟ್ ಮೋಡ್',
    emergencyKit: 'ತುರ್ತು ಕಿಟ್',
    emergencyMap: 'ತುರ್ತು ನಕ್ಷೆ',
    stayCalm: 'ಶಾಂತರಾಗಿರಿ, ಗಾಬರಿಯಾಗಬೇಡಿ',
    checkOfficialInfo: 'ಅಧಿಕೃತ ಆದೇಶಗಳನ್ನು ಆಲಿಸಿ',
    shelterGuidance: 'ಆಶ್ರಯ ಮಾರ್ಗದರ್ಶನ',
    evacuationGuidance: 'ಸ್ಥಳಾಂತರ ಮಾರ್ಗದರ್ಶನ',
    decontamGuidance: 'ಶುದ್ಧೀಕರಣ ನಿಯಮಗಳು',
    foodWaterGuidance: 'ಸುರಕ್ಷಿತ ಆಹಾರ ಮತ್ತು ನೀರು',
    medicalHelp: 'ವೈದ್ಯಕೀಯ ನೆರವು',
    online: 'ಆನ್‌ಲೈನ್',
    internetDown: 'ಇಂಟರ್ನೆಟ್ ಲಭ್ಯವಿಲ್ಲ',
    meshMode: 'ಮೆಶ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
    battery: 'ಬ್ಯಾಟರಿ',
    officialWarning: 'ಅಧಿಕೃತ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಾಲಿಸಿ',
    demoSimulation: 'ಡೆಮೊ ಸಿಮ್ಯುಲೇಶನ್',
    communityMessage: 'ಸಾರ್ವಜನಿಕ ಸಂದೇಶ',
    verifiedOfficial: 'ದೃಢೀಕೃತ ಅಧಿಕೃತ',
    searchNearby: 'ಸಾಧನಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    familyReconnect: 'ಕುಟುಂಬ ಸಂಪರ್ಕ'
  },
  or: {
    tagline: 'ଜାଣନ୍ତୁ। ପ୍ରସ୍ତୁତ ରୁହନ୍ତୁ। ପ୍ରତିକ୍ରିୟା ଦିଅନ୍ତୁ।',
    emergencyNow: 'ଜରୁରୀ ପଦକ୍ଷେପ',
    emergencyMesh: 'ଜରୁରୀ ମେସ୍ ଯୋଗାଯୋଗ',
    safetyGuide: 'ସୁରକ୍ଷା ଗାଇଡ୍',
    blackoutMode: 'ବ୍ଲାକଆଉଟ୍ ମୋଡ୍',
    emergencyKit: 'ଜରୁରୀ କିଟ୍',
    emergencyMap: 'ଜରୁରୀ ମାନଚିତ୍ର',
    stayCalm: 'ଶାନ୍ତ ରୁହନ୍ତୁ ଏବଂ ଭୟଭୀତ ହୁଅନ୍ତୁ ନାହିଁ',
    checkOfficialInfo: 'ସରକାରୀ ନିର୍ଦ୍ଦେଶ ଅନୁସରଣ କରନ୍ତୁ',
    shelterGuidance: 'ଆଶ୍ରୟ ନିର୍ଦ୍ଦେଶାବଳୀ',
    evacuationGuidance: 'ସ୍ଥାନାନ୍ତର ନିର୍ଦ୍ଦେଶାବଳୀ',
    decontamGuidance: 'ପରିଷ୍କାରତା ନିର୍ଦ୍ଦେଶାବଳୀ',
    foodWaterGuidance: 'ନିରାପଦ ଖାଦ୍ୟ ଓ ଜଳ',
    medicalHelp: 'ଡାକ୍ତରୀ ସାହାଯ୍ୟ',
    online: 'ଅନଲାଇନ୍',
    internetDown: 'ଇଣ୍ଟରନେଟ୍ ଉପଲବ୍ଧ ନାହିଁ',
    meshMode: 'ମେସ୍ ମୋଡ୍ ସକ୍ରିୟ',
    battery: 'ବ୍ୟାଟେରୀ',
    officialWarning: 'ସରକାରୀ ନିର୍ଦ୍ଦେଶ ପାଳନ କରନ୍ତୁ',
    demoSimulation: 'ଡେମୋ ସିମୁଲେସନ୍',
    communityMessage: 'ନାଗରିକ ବାର୍ତ୍ତା',
    verifiedOfficial: 'ଯାଞ୍ଚ ହୋଇଥିବା ସରକାରୀ',
    searchNearby: 'ଉପକରଣ ଖୋଜୁଛି...',
    familyReconnect: 'ପରିବାର ପୁନଃସଂଯୋଗ'
  }
};
