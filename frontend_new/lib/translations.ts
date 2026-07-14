export type Language = 'en' | 'hi' | 'gu'

export const languageNames: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  hi: { name: 'हिंदी', flag: '🇮🇳' },
  gu: { name: 'ગુજરાતી', flag: '🇮🇳' },
}

type TranslationKeys =
  | 'nav_home'
  | 'nav_login'
  | 'nav_predict'
  | 'nav_results'
  | 'nav_dashboard'
  | 'nav_weather'
  | 'nav_voice'
  | 'nav_history'
  | 'nav_notifications'
  | 'nav_settings'
  | 'nav_contact'
  | 'nav_logout'
  | 'settings_title'
  | 'settings_subtitle'
  | 'settings_appearance'
  | 'settings_dark_mode'
  | 'settings_light_mode'
  | 'settings_language'
  | 'settings_language_subtitle'
  | 'home_badge'
  | 'home_title'
  | 'home_tagline'
  | 'home_what_todo'
  | 'home_card1_title'
  | 'home_card1_desc'
  | 'home_card2_title'
  | 'home_card2_desc'
  | 'home_card3_title'
  | 'home_card3_desc'
  | 'home_card4_title'
  | 'home_card4_desc'
  | 'home_how_title'
  | 'home_step1_title'
  | 'home_step1_desc'
  | 'home_step2_title'
  | 'home_step2_desc'
  | 'home_step3_title'
  | 'home_step3_desc'
  | 'home_cta_title'
  | 'home_cta_desc'
  | 'home_cta_button'
  | 'predict_title'
  | 'predict_subtitle'
  | 'predict_field_info'
  | 'predict_crop_type'
  | 'predict_growth_stage'
  | 'predict_soil_moisture'
  | 'predict_city'
  | 'predict_city_placeholder'
  | 'predict_submit'
  | 'predict_analyzing'
  | 'predict_how_title'
  | 'weather_title'
  | 'weather_refresh'
  | 'weather_refreshing'
  | 'weather_forecast'
  | 'weather_forecast_soon'
  | 'weather_condition_label'
  | 'weather_humidity'
  | 'weather_rain_chance'

export const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    nav_home: '🏠 Home',
    nav_login: '🔐 Login',
    nav_predict: '🤖 Predict',
    nav_results: '📊 Results',
    nav_dashboard: '📡 Dashboard',
    nav_weather: '🌤️ Weather',
    nav_voice: '🎤 Voice',
    nav_history: '🕐 History',
    nav_notifications: '🔔 Notifications',
    nav_settings: '⚙️ Settings',
    nav_contact: '📞 Contact Us',
    nav_logout: 'Logout',
    settings_title: 'Settings',
    settings_subtitle: 'Customize your AgriMind experience',
    settings_appearance: 'Appearance',
    settings_dark_mode: 'Dark Mode',
    settings_light_mode: 'Light Mode',
    settings_language: 'Language',
    settings_language_subtitle: 'Select your preferred language',
    home_badge: '💧 Smart Irrigation Platform',
    home_title: 'AgriMind AI — Smarter Farms',
    home_tagline: 'Soil · Weather · AI · Together',
    home_what_todo: 'What would you like to do?',
    home_card1_title: 'Get AI Recommendation',
    home_card1_desc: 'Get irrigation decision and water requirements for your field.',
    home_card2_title: 'View Results',
    home_card2_desc: 'See your last AI recommendation and analytics.',
    home_card3_title: 'History',
    home_card3_desc: 'All your past predictions.',
    home_card4_title: 'Contact Us',
    home_card4_desc: 'Reach the Semicolon team.',
    home_how_title: 'How AgriMind Works',
    home_step1_title: 'Enter Field Details',
    home_step1_desc: 'Select your crop, growth stage, soil moisture level, and city location for accurate analysis.',
    home_step2_title: 'AI Fetches Live Weather',
    home_step2_desc: 'AgriMind checks real-time temperature, humidity, weather conditions, and rain probability for your location.',
    home_step3_title: 'Get Irrigation Decision',
    home_step3_desc: 'The AI recommends when to irrigate and how much water to apply, along with a confidence score.',
    home_cta_title: 'Stop Guessing. Start Smart Irrigating.',
    home_cta_desc: 'AgriMind AI tells you exactly when to irrigate and how much water to use — reducing water wastage and protecting crop health.',
    home_cta_button: 'Get Started Now',
    predict_title: 'Irrigation Recommendation',
    predict_subtitle: 'Get AI-powered irrigation decisions based on your field conditions and live weather',
    predict_field_info: 'Field Information',
    predict_crop_type: 'Crop Type',
    predict_growth_stage: 'Growth Stage',
    predict_soil_moisture: 'Soil Moisture',
    predict_city: 'City',
    predict_city_placeholder: 'e.g. Bhopal, Jabalpur, Mumbai',
    predict_submit: 'Get AI Irrigation Recommendation',
    predict_analyzing: 'Analyzing...',
    predict_how_title: 'How It Works',
    weather_title: 'Live Weather Forecast',
    weather_refresh: 'Refresh Location',
    weather_refreshing: 'Detecting...',
    weather_forecast: '7-Day Forecast',
    weather_forecast_soon: 'Coming soon — backend forecast endpoint not built yet',
    weather_condition_label: 'Condition',
    weather_humidity: 'Humidity',
    weather_rain_chance: 'Rain Chance',
  },
  hi: {
    nav_home: '🏠 होम',
    nav_login: '🔐 लॉगिन',
    nav_predict: '🤖 पूर्वानुमान',
    nav_results: '📊 परिणाम',
    nav_dashboard: '📡 डैशबोर्ड',
    nav_weather: '🌤️ मौसम',
    nav_voice: '🎤 आवाज़',
    nav_history: '🕐 इतिहास',
    nav_notifications: '🔔 सूचनाएं',
    nav_settings: '⚙️ सेटिंग्स',
    nav_contact: '📞 संपर्क करें',
    nav_logout: 'लॉगआउट',
    settings_title: 'सेटिंग्स',
    settings_subtitle: 'अपने AgriMind अनुभव को अनुकूलित करें',
    settings_appearance: 'रूप-रंग',
    settings_dark_mode: 'डार्क मोड',
    settings_light_mode: 'लाइट मोड',
    settings_language: 'भाषा',
    settings_language_subtitle: 'अपनी पसंदीदा भाषा चुनें',
    home_badge: '💧 स्मार्ट सिंचाई प्लेटफॉर्म',
    home_title: 'AgriMind AI — स्मार्ट खेत',
    home_tagline: 'मिट्टी · मौसम · एआई · साथ में',
    home_what_todo: 'आप क्या करना चाहेंगे?',
    home_card1_title: 'एआई सिफारिश प्राप्त करें',
    home_card1_desc: 'अपने खेत के लिए सिंचाई निर्णय और पानी की आवश्यकता जानें।',
    home_card2_title: 'परिणाम देखें',
    home_card2_desc: 'अपनी पिछली एआई सिफारिश और विश्लेषण देखें।',
    home_card3_title: 'इतिहास',
    home_card3_desc: 'आपके सभी पिछले पूर्वानुमान।',
    home_card4_title: 'संपर्क करें',
    home_card4_desc: 'सेमीकोलन टीम से संपर्क करें।',
    home_how_title: 'AgriMind कैसे काम करता है',
    home_step1_title: 'खेत का विवरण दर्ज करें',
    home_step1_desc: 'सटीक विश्लेषण के लिए फसल, वृद्धि चरण, मिट्टी की नमी और शहर चुनें।',
    home_step2_title: 'एआई लाइव मौसम लाता है',
    home_step2_desc: 'AgriMind आपके स्थान के लिए तापमान, आर्द्रता और वर्षा संभावना जांचता है।',
    home_step3_title: 'सिंचाई निर्णय प्राप्त करें',
    home_step3_desc: 'एआई सुझाता है कि कब सिंचाई करें और कितना पानी दें, आत्मविश्वास स्कोर के साथ।',
    home_cta_title: 'अनुमान लगाना बंद करें। स्मार्ट सिंचाई शुरू करें।',
    home_cta_desc: 'AgriMind AI आपको बताता है कि कब सिंचाई करें और कितना पानी उपयोग करें — पानी की बर्बादी कम करते हुए।',
    home_cta_button: 'अभी शुरू करें',
    predict_title: 'सिंचाई सिफारिश',
    predict_subtitle: 'अपने खेत की स्थिति और लाइव मौसम के आधार पर एआई सिंचाई निर्णय पाएं',
    predict_field_info: 'खेत की जानकारी',
    predict_crop_type: 'फसल का प्रकार',
    predict_growth_stage: 'वृद्धि चरण',
    predict_soil_moisture: 'मिट्टी की नमी',
    predict_city: 'शहर',
    predict_city_placeholder: 'जैसे भोपाल, जबलपुर, मुंबई',
    predict_submit: 'एआई सिंचाई सिफारिश प्राप्त करें',
    predict_analyzing: 'विश्लेषण हो रहा है...',
    predict_how_title: 'यह कैसे काम करता है',
    weather_title: 'लाइव मौसम पूर्वानुमान',
    weather_refresh: 'स्थान रीफ्रेश करें',
    weather_refreshing: 'पता लगाया जा रहा है...',
    weather_forecast: '7-दिन का पूर्वानुमान',
    weather_forecast_soon: 'जल्द आ रहा है — बैकएंड पूर्वानुमान अभी तैयार नहीं है',
    weather_condition_label: 'स्थिति',
    weather_humidity: 'आर्द्रता',
    weather_rain_chance: 'बारिश की संभावना',
  },
  gu: {
    nav_home: '🏠 હોમ',
    nav_login: '🔐 લૉગિન',
    nav_predict: '🤖 આગાહી',
    nav_results: '📊 પરિણામો',
    nav_dashboard: '📡 ડેશબોર્ડ',
    nav_weather: '🌤️ હવામાન',
    nav_voice: '🎤 અવાજ',
    nav_history: '🕐 ઇતિહાસ',
    nav_notifications: '🔔 સૂચનાઓ',
    nav_settings: '⚙️ સેટિંગ્સ',
    nav_contact: '📞 સંપર્ક',
    nav_logout: 'લૉગઆઉટ',
    settings_title: 'સેટિંગ્સ',
    settings_subtitle: 'તમારા AgriMind અનુભવને કસ્ટમાઇઝ કરો',
    settings_appearance: 'દેખાવ',
    settings_dark_mode: 'ડાર્ક મોડ',
    settings_light_mode: 'લાઇટ મોડ',
    settings_language: 'ભાષા',
    settings_language_subtitle: 'તમારી પસંદગીની ભાષા પસંદ કરો',
    home_badge: '💧 સ્માર્ટ સિંચાઈ પ્લેટફોર્મ',
    home_title: 'AgriMind AI — સ્માર્ટ ખેતરો',
    home_tagline: 'માટી · હવામાન · AI · સાથે',
    home_what_todo: 'તમે શું કરવા માંગો છો?',
    home_card1_title: 'AI ભલામણ મેળવો',
    home_card1_desc: 'તમારા ખેતર માટે સિંચાઈ નિર્ણય અને પાણીની જરૂરિયાત મેળવો.',
    home_card2_title: 'પરિણામો જુઓ',
    home_card2_desc: 'તમારી છેલ્લી AI ભલામણ અને વિશ્લેષણ જુઓ.',
    home_card3_title: 'ઇતિહાસ',
    home_card3_desc: 'તમારી બધી ભૂતકાળની આગાહીઓ.',
    home_card4_title: 'સંપર્ક કરો',
    home_card4_desc: 'સેમિકોલન ટીમનો સંપર્ક કરો.',
    home_how_title: 'AgriMind કેવી રીતે કામ કરે છે',
    home_step1_title: 'ખેતરની વિગતો દાખલ કરો',
    home_step1_desc: 'ચોક્કસ વિશ્લેષણ માટે પાક, વૃદ્ધિ તબક્કો, જમીનની ભેજ અને શહેર પસંદ કરો.',
    home_step2_title: 'AI જીવંત હવામાન લાવે છે',
    home_step2_desc: 'AgriMind તમારા સ્થાન માટે તાપમાન, ભેજ અને વરસાદની સંભાવના તપાસે છે.',
    home_step3_title: 'સિંચાઈ નિર્ણય મેળવો',
    home_step3_desc: 'AI ભલામણ કરે છે કે ક્યારે સિંચાઈ કરવી અને કેટલું પાણી વાપરવું, વિશ્વાસ સ્કોર સાથે.',
    home_cta_title: 'અંદાજ લગાવવાનું બંધ કરો. સ્માર્ટ સિંચાઈ શરૂ કરો.',
    home_cta_desc: 'AgriMind AI તમને બરાબર જણાવે છે કે ક્યારે સિંચાઈ કરવી અને કેટલું પાણી વાપરવું.',
    home_cta_button: 'હમણાં શરૂ કરો',
    predict_title: 'સિંચાઈ ભલામણ',
    predict_subtitle: 'તમારા ખેતરની સ્થિતિ અને જીવંત હવામાનના આધારે AI સિંચાઈ નિર્ણયો મેળવો',
    predict_field_info: 'ખેતરની માહિતી',
    predict_crop_type: 'પાકનો પ્રકાર',
    predict_growth_stage: 'વૃદ્ધિ તબક્કો',
    predict_soil_moisture: 'જમીનની ભેજ',
    predict_city: 'શહેર',
    predict_city_placeholder: 'દા.ત. ભોપાલ, જબલપુર, મુંબઈ',
    predict_submit: 'AI સિંચાઈ ભલામણ મેળવો',
    predict_analyzing: 'વિશ્લેષણ ચાલી રહ્યું છે...',
    predict_how_title: 'તે કેવી રીતે કામ કરે છે',
    weather_title: 'જીવંત હવામાન આગાહી',
    weather_refresh: 'સ્થાન રિફ્રેશ કરો',
    weather_refreshing: 'શોધી રહ્યા છીએ...',
    weather_forecast: '7-દિવસની આગાહી',
    weather_forecast_soon: 'ટૂંક સમયમાં આવે છે — બેકએન્ડ આગાહી હજુ તૈયાર નથી',
    weather_condition_label: 'સ્થિતિ',
    weather_humidity: 'ભેજ',
    weather_rain_chance: 'વરસાદની શક્યતા',
  },
}