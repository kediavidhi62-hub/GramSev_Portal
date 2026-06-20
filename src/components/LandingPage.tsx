import React from "react";
import { motion } from "motion/react";
import { 
  Landmark, Sparkles, Languages, ArrowRight, User, Users, 
  Calendar, CheckCircle2, UserCheck, Megaphone, Activity, 
  FileText, ShieldCheck, HeartHandshake, Volume2, CloudLightning,
  Sun, Moon
} from "lucide-react";
import { AppLanguage, UserRole, CertificateApplication, GrievanceComplaint } from "../types";
import { TRANSLATIONS } from "../translations";
import ReadAloud from "./ReadAloud";

interface LandingPageProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onEnterPortal: (directRole?: UserRole) => void;
  currentUser?: { id: string; name: string; role: UserRole; designation?: string } | null;
  onReturnToDashboard?: () => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
  applications?: CertificateApplication[];
  complaints?: GrievanceComplaint[];
}

export default function LandingPage({ 
  language, 
  setLanguage, 
  onEnterPortal,
  currentUser = null,
  onReturnToDashboard,
  darkMode = false,
  setDarkMode,
  applications = [],
  complaints = []
}: LandingPageProps) {
  const t = TRANSLATIONS[language];

  // Interactive manual selector to test different times of the day
  const [timeOverride, setTimeOverride] = React.useState<"morning" | "day" | "evening" | "night" | null>(null);

  // Real IST (Asia/Kolkata) time tracker
  const [istTime, setIstTime] = React.useState(() => {
    const now = new Date();
    // UTC milliseconds offset by 5.5 hours for IST
    const istOffset = 5.5 * 3600000;
    return new Date(now.getTime() + istOffset);
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const istOffset = 5.5 * 3600000;
      setIstTime(new Date(now.getTime() + istOffset));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Timezone-safe calculations using getUTCHours & getUTCMinutes
  const istHours = istTime.getUTCHours();
  const istMinutes = istTime.getUTCMinutes();
  const decimalHours = istHours + istMinutes / 60;

  // Set the dynamic period of day strictly based on real IST hour
  const realPeriod = (decimalHours >= 5 && decimalHours < 11) 
    ? "morning"
    : (decimalHours >= 11 && decimalHours < 17)
      ? "day"
      : (decimalHours >= 17 && decimalHours < 19.5)
        ? "evening"
        : "night";

  const activePeriod = timeOverride || realPeriod;

  const isMorning = activePeriod === "morning";
  const isDay = activePeriod === "day";
  const isEvening = activePeriod === "evening";
  const isNight = activePeriod === "night";

  let currentPeriod = activePeriod;

  // Dynamic homepage performance calculations
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === "RESOLVED").length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;
  
  const certificatesIssuedCount = applications.filter(
    a => a.status === "APPROVED" && ["BIRTH", "DOMICILE", "INCOME", "CASTE", "RESIDENTIAL", "NOC"].includes(a.type)
  ).length;

  const schemeAppsApprovedCount = applications.filter(
    a => a.status === "APPROVED" && ["WIDOW", "BPL", "EWS"].includes(a.type)
  ).length;

  // Subtle list of custom features for Rajasthan digital panchayat
  const features = [
    {
      icon: <Volume2 className="h-5 w-5 text-amber-700" />,
      title: language === AppLanguage.MW ? "बोली साथी एआई सहायक" : (language === AppLanguage.HI ? "वाणी-प्रथम एआई सहायक" : "Voice-First AI Assistant"),
      desc: language === AppLanguage.MW
        ? "मारवाड़ी, हिंदी अर अंग्रेजी भासावां में दोरी वॉयस सुणकर प्रमाण पत्र अर शिकायत बणावण री सुविधा।"
        : language === AppLanguage.HI 
        ? "मारवाड़ी, हिंदी और अंग्रेजी भाषाओं में सहज वॉयस रिपोर्टिंग और प्रमाण पत्र आवेदन।" 
        : "Speak naturally in Marwari, Hindi, or English to lodge complaints or draft letters instantly."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-amber-700" />,
      title: language === AppLanguage.MW ? "सीधौ आधार ई-सही कागजात" : (language === AppLanguage.HI ? "सीधे आधार ई-हस्ताक्षर" : "Aadhaar e-Sign Certs"),
      desc: language === AppLanguage.MW
        ? "सरकारी दफ्तर जाबा री जरूरत नी, सीधौ आधार सूं वेरीफाईड कागजात सटपट मळ जावेला सा।"
        : language === AppLanguage.HI 
        ? "बिना सरकारी कार्यालयों के चक्कर काटे सीधे डिजिटल सत्यापित मूल प्रमाण पत्र प्राप्त करें।" 
        : "Receive verified digital caste, income, or birth certificates powered by secure Aadhaar e-Sign."
    },
    {
      icon: <UserCheck className="h-5 w-5 text-amber-700" />,
      title: language === AppLanguage.MW ? "स्मार्ट मस्टर रोल हाजिरी" : (language === AppLanguage.HI ? "स्मार्ट मस्टर उपस्थिति" : "Geo-Tag Muster Ledger"),
      desc: language === AppLanguage.MW
        ? "मनरेगा मजदूरां वास्ते बिना नेट री सुविधा, सीधौ सेल्फी अर जियो-लोकेशन हाजिरी।"
        : language === AppLanguage.HI 
        ? "मनरेगा श्रमिकों के लिए ऑफ़लाइन-अनुकूल डिजिटल सेल्फी भू-टैगिंग और स्वचालित वेतन पत्रक।" 
        : "Failsafe offline-buffered facial selfie check-ins for MNREGA workers directly synchronizing with NIC."
    },
    {
      icon: <Activity className="h-5 w-5 text-amber-700" />,
      title: language === AppLanguage.MW ? "साफ बजट अर पारदर्शिता" : (language === AppLanguage.HI ? "पारदर्शी निधि आवंटन" : "Panchayat Trust Funds"),
      desc: language === AppLanguage.MW
        ? "१५वां वित्त आयोग रा सरकारी बजट अर वित्ती काम रो सरेआम ऑनलाइन ब्यौरा देखो।"
        : language === AppLanguage.HI 
        ? "15वें वित्त आयोग अनुदानों एवं ग्राम सभा विकास योजनाओं का पारदर्शी ऑनलाइन सार्वजनिक ऑडिट।" 
        : "Public ledger auditing of spent sanitations, solar pipelines, and community concrete pathways."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FBF8F2] text-slate-800 overflow-x-hidden select-none font-sans" id="homepage-main-content">
      
      {/* 5-8% opacity Traditional Mandana background art layer */}
      <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(#b45309 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      
      <div className="absolute top-20 left-10 w-96 h-96 z-0 opacity-7 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-800">
          {/* Traditional Mandana Chowk Motif */}
          <path d="M100 10 L190 100 L100 190 L10 100 Z" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" />
          <rect x="40" y="40" width="120" height="120" stroke="currentColor" strokeWidth="2" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          {/* Lotus Petals */}
          <path d="M100 70 C105 70 110 80 100 90 C90 90 95 70 100 70 Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M100 130 C105 130 110 120 100 110 C90 110 95 130 100 130 Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M70 100 C70 105 80 110 90 100 C90 90 70 95 70 100 Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M130 100 C130 105 120 110 110 100 C110 90 130 95 130 100 Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute top-[45%] right-5 w-80 h-80 z-0 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-800">
          {/* Hawa Mahal Inspired Jharokha motif */}
          <path d="M40 180 V80 Q100 20 160 80 V180 Z" stroke="currentColor" strokeWidth="2.5" />
          <path d="M60 180 V100 Q100 50 140 100 V180 Z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M40 140 H160" stroke="currentColor" strokeWidth="2" />
          <path d="M40 100 H160" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="65" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M100 15 L100 40" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute bottom-[10%] left-12 w-64 h-64 z-0 opacity-[0.04] pointer-events-none">
        {/* Beautiful Peacock Mandana outline */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-900">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
          <path d="M35 60 C35 40, 50 30, 60 30 C70 30, 75 42, 65 55 C55 65, 45 70, 35 60 Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M60 30 C65 20, 55 10, 50 20 Z" stroke="currentColor" strokeWidth="1" />
          <circle cx="58" cy="25" r="1.5" fill="currentColor" />
          <path d="M35 62 Q25 65 15 50 Q28 45 34 58" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Main Landing Top Navigation Bar */}
      <header className="relative z-20 w-full bg-white/80 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:pl-4 lg:pr-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Website name with map logo as shown in the given image */}
            <div className="flex items-center space-x-1.5 cursor-pointer select-none shrink-0" title="Gram Panchayat Connect - Rajasthan Portal">
              <div className="relative h-18 w-20 flex items-center justify-center p-1 overflow-visible">
                <svg 
                  className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,163,115,0.25)] hover:scale-[1.02] transition-transform duration-300" 
                  viewBox="0 0 210 170" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Saffron & Sandstone gradient inspired by the Thar Desert and Rajasthani palaces */}
                    <linearGradient id="rajasthan-gradient-landing" x1="18" y1="18" x2="196" y2="166" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFDFC" />
                      <stop offset="35%" stopColor="#FFF8ED" />
                      <stop offset="70%" stopColor="#FAF1E3" />
                      <stop offset="100%" stopColor="#F5E4C9" />
                    </linearGradient>
                    
                    {/* Subtle royal pattern fill */}
                    <pattern id="heritage-dots-landing" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                      <circle cx="6" cy="6" r="1" fill="#D4A373" opacity="0.25" />
                    </pattern>
                  </defs>

                  {/* Main Geographic State Outline of Rajasthan */}
                  <path 
                    d="M 105 10 C 111 9, 117 14, 122 11 Q 128 11, 131 18 C 135 22, 128 31, 134 36 C 138 39, 145 34, 150 39 Q 154 44, 146 51 C 151 56, 157 51, 163 56 C 168 59, 172 56, 182 61 C 186 65, 191 67, 196 73 Q 199 77, 189 83 C 186 86, 182 91, 177 90 C 173 94, 178 100, 180 105 C 184 109, 190 111, 189 118 C 187 122, 179 120, 174 122 C 171 126, 166 132, 163 137 C 159 142, 153 150, 149 145 C 145 140, 148 132, 144 128 C 142 124, 137 128, 133 125 C 128 129, 120 131, 116 136 C 112 141, 110 148, 107 156 C 104 161, 102 169, 97 166 C 93 164, 95 156, 93 151 C 89 146, 87 153, 83 150 C 79 145, 74 149, 70 154 C 66 158, 61 154, 59 149 C 58 144, 63 139, 59 134 C 55 130, 49 134, 45 129 C 41 124, 32 127, 27 121 C 23 117, 18 112, 18 107 C 21 102, 28 105, 30 99 C 32 94, 25 89, 23 84 C 19 79, 11 81, 9 76 C 6 71, 14 66, 18 61 C 21 56, 27 58, 32 53 C 36 48, 48 42, 43 38 C 47 34, 55 35, 60 30 C 64 25, 69 22, 76 22 C 81 22, 87 19, 91 14 Z"
                    fill="url(#rajasthan-gradient-landing)" 
                    stroke="#C2410C" 
                    strokeWidth="2.5" 
                    strokeLinejoin="round"
                  />

                  {/* Traditional Heritage Micro-pattern Overlay Inside the Map */}
                  <path 
                    d="M 105 10 C 111 9, 117 14, 122 11 Q 128 11, 131 18 C 135 22, 128 31, 134 36 C 138 39, 145 34, 150 39 Q 154 44, 146 51 C 151 56, 157 51, 163 56 C 168 59, 172 56, 182 61 C 186 65, 191 67, 196 73 Q 199 77, 189 83 C 186 86, 182 91, 177 90 C 173 94, 178 100, 180 105 C 184 109, 190 111, 189 118 C 187 122, 179 120, 174 122 C 171 126, 166 132, 163 137 C 159 142, 153 150, 149 145 C 145 140, 148 132, 144 128 C 142 124, 137 128, 133 125 C 128 129, 120 131, 116 136 C 112 141, 110 148, 107 156 C 104 161, 102 169, 97 166 C 93 164, 95 156, 93 151 C 89 146, 87 153, 83 150 C 79 145, 74 149, 70 154 C 66 158, 61 154, 59 149 C 58 144, 63 139, 59 134 C 55 130, 49 134, 45 129 C 41 124, 32 127, 27 121 C 23 117, 18 112, 18 107 C 21 102, 28 105, 30 99 C 32 94, 25 89, 23 84 C 19 79, 11 81, 9 76 C 6 71, 14 66, 18 61 C 21 56, 27 58, 32 53 C 36 48, 48 42, 43 38 C 47 34, 55 35, 60 30 C 64 25, 69 22, 76 22 C 81 22, 87 19, 91 14 Z"
                    fill="url(#heritage-dots-landing)" 
                    pointerEvents="none"
                  />

                  {/* Smart Connected Hubs */}
                  <circle cx="82" cy="85" r="4" fill="#1565C0" className="animate-pulse" />
                  <circle cx="82" cy="85" r="1.5" fill="white" />
                  <circle cx="148" cy="68" r="4" fill="#FF9933" />
                  <circle cx="148" cy="68" r="1.5" fill="white" />
                  <circle cx="132" cy="46" r="3" fill="#2E7D32" />
                  
                  <line x1="82" y1="85" x2="148" y2="68" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                  <line x1="148" y1="68" x2="132" y2="46" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                  <line x1="82" y1="85" x2="132" y2="46" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />

                  {/* Text labels inside the map logo */}
                  <g className="select-none pointer-events-none">
                    <text 
                      x="108" 
                      y="76" 
                      textAnchor="middle" 
                      fontFamily="Georgia, serif" 
                      fontWeight="900" 
                      fontSize="13.5" 
                      fill="#5D0E23"
                      className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                    >
                      {language === AppLanguage.HI ? "ग्राम पंचायत" : "ग्राम पंचायत"}
                    </text>
                    <text 
                      x="108" 
                      y="93" 
                      textAnchor="middle" 
                      fontFamily="Georgia, serif" 
                      fontWeight="900" 
                      fontSize="13.5" 
                      fill="#5D0E23"
                      className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                    >
                      {language === AppLanguage.HI ? "कनेक्ट" : "कनेक्ट"}
                    </text>

                    <text 
                      x="108" 
                      y="108" 
                      textAnchor="middle" 
                      fontFamily="monospace" 
                      fontWeight="900" 
                      fontSize="7" 
                      fill="#1565C0" 
                      letterSpacing="1.2"
                    >
                      GP CONNECT
                    </text>
                    
                    <text 
                      x="108" 
                      y="120" 
                      textAnchor="middle" 
                      fontFamily="sans-serif" 
                      fontWeight="700" 
                      fontSize="5" 
                      fill="#A16207" 
                      letterSpacing="0.8"
                    >
                      GOVT. OF RAJASTHAN
                    </text>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col pl-1 leading-none justify-center">
                <span className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-amber-950 via-[#B33D26] to-orange-800 bg-clip-text text-transparent">
                  Gram<span className="font-light text-orange-700">Seva</span>
                </span>
                <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-[#B33D26] mt-1.5 flex items-center space-x-1">
                  <span>RAJASTHAN</span>
                  <span className="h-1 w-1 bg-amber-500 rounded-full inline-block animate-pulse"></span>
                  <span>PORTAL</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              
              {/* Language Selection bar */}
              <div className="hidden md:flex items-center bg-amber-950/5 rounded-xl p-0.5 border border-amber-900/10">
                <button
                  onClick={() => setLanguage(AppLanguage.EN)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                    language === AppLanguage.EN
                      ? "text-white shadow-xs"
                      : "text-amber-900/70 hover:text-amber-950"
                  }`}
                  style={{ backgroundColor: language === AppLanguage.EN ? "#b33d26" : undefined }}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage(AppLanguage.HI)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-sans font-bold transition-all ${
                    language === AppLanguage.HI
                      ? "text-white shadow-xs"
                      : "text-amber-900/70 hover:text-amber-950"
                  }`}
                  style={{ backgroundColor: language === AppLanguage.HI ? "#b33d26" : undefined }}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguage(AppLanguage.MW)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-sans font-bold transition-all ${
                    language === AppLanguage.MW
                      ? "text-white shadow-xs"
                      : "text-amber-900/70 hover:text-amber-950"
                  }`}
                  style={{ backgroundColor: language === AppLanguage.MW ? "#b33d26" : undefined }}
                >
                  मारवाड़ी
                </button>
              </div>

              {/* Dark Mode Icon Toggle */}
              <button
                onClick={() => setDarkMode && setDarkMode(!darkMode)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-amber-950/25 border-orange-800/20 text-orange-400 hover:bg-amber-950/45"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                title={language === AppLanguage.HI ? "डार्क मोड बदलें" : "Toggle Dark Mode"}
              >
                {darkMode ? (
                  <Moon className="h-4 w-4 text-amber-500 animate-pulse" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>

              {/* Speak/Read Aloud Widget */}
              <ReadAloud language={language} targetSelector="#homepage-main-content" variant="minimal" darkMode={darkMode} />

              {/* Dynamic Action Access Buttons */}
              {currentUser ? (
                <button 
                  onClick={onReturnToDashboard}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans py-2.5 px-5 rounded-xl transition-all hover:scale-[1.02] shadow-md cursor-pointer flex items-center space-x-2 border border-emerald-950/20"
                >
                  <span>
                    {language === AppLanguage.MW
                      ? `डैशबोर्ड: ${currentUser.name}`
                      : language === AppLanguage.HI 
                      ? `डैशबोर्ड: ${currentUser.name}` 
                      : `Dashboard: ${currentUser.name.split(" ")[0]}`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button 
                  onClick={() => onEnterPortal()}
                  className="bg-[#B33D26] hover:bg-[#942C18] text-white text-xs font-bold font-sans py-2.5 px-5 rounded-xl transition-all hover:scale-[1.02] shadow-md cursor-pointer flex items-center space-x-2 border border-orange-950/20"
                >
                  <span>
                    {language === AppLanguage.MW
                      ? "लॉगिन सा"
                      : language === AppLanguage.HI 
                      ? "पोर्टल लॉगिन" 
                      : "Portal Login"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
 
      {/* Main Two-Column Hero Container */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 md:pt-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Hand Column: Heading, Slogan, CTA and Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 space-y-6 flex flex-col justify-center"
        >
          {/* Government Ribbon */}
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-500/20 px-3.5 py-1.5 rounded-full w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-amber-900 tracking-wider uppercase">
              {language === AppLanguage.MW
                ? "स्वायत्त शासन विभाग • राजस्थान सरकार (आपणो राज)"
                : language === AppLanguage.HI 
                ? "स्वायत्त शासन विभाग • राजस्थान सरकार" 
                : "Dept. of Panchayati Raj • Govt. of Rajasthan"}
            </span>
          </div>
 
          {/* GraamSeva Heading */}
          <div className="space-y-1">
            {/* GrabSeva Heading deleted */}
            
            {/* Massive Governance Slogan */}
            <h1 
              className="text-amber-950 tracking-tight"
              style={{ fontFamily: "Times New Roman", fontSize: "59px", fontStyle: "normal", textDecorationLine: "none", lineHeight: "55.8px" }}
            >
              {language === AppLanguage.MW ? (
                <>
                  ग्रामसेवा <span className="text-[#B33D26]">राजस्थान</span>
                </>
              ) : language === AppLanguage.HI ? (
                <>
                  ग्रामसेवा <span className="text-[#B33D26]">राजस्थान</span>
                </>
              ) : (
                <>
                  GramSeva <span className="text-[#B33D26]">Rajasthan</span>
                </>
              )}
            </h1>
            <p className="text-amber-900/80 font-sans text-[15px] md:text-base font-semibold tracking-wide pt-1.5 leading-relaxed">
              Transparent Governance. Connected Villages. Empowered Citizens.
            </p>
          </div>
 
          
 
          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {currentUser ? (
              <button
                onClick={onReturnToDashboard}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-sm py-4 px-8 rounded-2xl shadow-lg transition duration-200 hover:scale-[1.01] flex items-center justify-center space-x-2.5 cursor-pointer border border-emerald-800"
              >
                <span>
                  {language === AppLanguage.MW
                    ? "डैशबोर्ड माथै पाछा आवो सा"
                    : language === AppLanguage.HI 
                    ? "डैशबोर्ड पर लौटें" 
                    : "Return to My Dashboard"}
                </span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            ) : (
              <button
                onClick={() => onEnterPortal()}
                className="bg-[#B33D26] hover:bg-[#972E1B] text-white font-sans font-bold text-sm py-4 px-8 rounded-2xl shadow-lg transition duration-200 hover:scale-[1.01] flex items-center justify-center space-x-2.5 cursor-pointer border border-[#8C2310]"
              >
                <span>
                  {language === AppLanguage.MW
                    ? "अधिकारी पोर्टल प्रवेश करो सा"
                    : language === AppLanguage.HI 
                    ? "अधिकारी पोर्टल प्रवेश करें" 
                    : "Access Admin Command"}
                </span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {/* Four rich feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-left">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-900/10 hover:border-amber-900/20 hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-3 mb-2.5">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors">
                    {feat.icon}
                  </div>
                  <h3 className="text-xs font-display font-extrabold text-amber-950 tracking-wide uppercase">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed pl-1">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Right Hand Column: Detailed semi-realistic Rajasthani village SVG & Sarpanch holding a tablet */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="lg:col-span-6 relative w-full h-[450px] sm:h-[550px] flex items-center justify-center mt-6 lg:mt-0"
        >
          
          {/* Subtle moving birds in background */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {[1, 2, 3].map((b) => (
              <motion.div
                key={b}
                initial={{ x: -100 - b * 50, y: 50 + b * 40, opacity: 0.8 }}
                animate={{ 
                  x: "110%", 
                  y: [50 + b * 40, 20 + b * 32, 60 + b * 44, 40 + b * 20] 
                }}
                transition={{ 
                  duration: 22 + b * 6, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: b * 2 
                }}
                className="absolute text-amber-800"
              >
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" opacity="0.3">
                  <path d="M0,6 Q6,0 12,6 Q18,0 24,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* MAIN ILLUSTRATION CONTAINER */}
          <div className="relative w-full h-full max-w-[500px]">
            <svg 
              viewBox="0 0 500 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full drop-shadow-[0_12px_40px_rgba(139,92,26,0.15)]"
            >
              <defs>
                {/* Sun & Sky Gradients */}
                <radialGradient id="skyGrad" cx="250" cy="250" r="220" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF4E0" />
                  <stop offset="50%" stopColor="#FAF1E0" />
                  <stop offset="100%" stopColor="#E9DDC2" stopOpacity="0" />
                </radialGradient>
                
                <linearGradient id="skyGradMorning" x1="250" y1="20" x2="250" y2="440" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF2C2" />
                  <stop offset="60%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#F87171" stopOpacity="0.85" />
                </linearGradient>

                <linearGradient id="skyGradDay" x1="250" y1="20" x2="250" y2="440" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#BAE6FD" />
                </linearGradient>

                <linearGradient id="skyGradEvening" x1="250" y1="20" x2="250" y2="440" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#411579" />
                  <stop offset="45%" stopColor="#D946EF" />
                  <stop offset="85%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>

                <linearGradient id="skyGradNight" x1="250" y1="20" x2="250" y2="440" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#05070F" />
                  <stop offset="60%" stopColor="#0C152E" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>

                <clipPath id="skyClip">
                  <circle cx="250" cy="230" r="210" />
                </clipPath>

                <linearGradient id="hillGrad" x1="100" y1="300" x2="400" y2="450" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#E5C79E" />
                  <stop offset="50%" stopColor="#CCA475" />
                  <stop offset="100%" stopColor="#A87F52" />
                </linearGradient>

                <linearGradient id="bhawanGrad" x1="50" y1="180" x2="250" y2="350">
                  <stop offset="0%" stopColor="#FFFBF5" />
                  <stop offset="100%" stopColor="#F5E3CD" />
                </linearGradient>

                <linearGradient id="turbanGrad" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stopColor="#EF4444" /> {/* Bright Red */}
                  <stop offset="50%" stopColor="#F59E0B" /> {/* Marigold Yellow */}
                  <stop offset="100%" stopColor="#D97706" /> {/* Saffron Accent */}
                </linearGradient>

                <linearGradient id="jacketGrad" x1="50" y1="350" x2="220" y2="480">
                  <stop offset="0%" stopColor="#9A3412" /> {/* Intense Terracotta */}
                  <stop offset="100%" stopColor="#431407" />
                </linearGradient>

                <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>

                <linearGradient id="tankGrad" x1="300" y1="150" x2="380" y2="300">
                  <stop offset="0%" stopColor="#D1D5DB" />
                  <stop offset="100%" stopColor="#9CA3AF" />
                </linearGradient>
              </defs>

              {/* Dynamic Animated Sky Background Layer (Clip to standard radius) */}
              <g clipPath="url(#skyClip)">
                {/* 1. Gradient Sky Faders */}
                <circle cx="250" cy="230" r="210" fill="url(#skyGradMorning)" opacity={isMorning ? 0.95 : 0} style={{ transition: "opacity 2s ease-in-out" }} />
                <circle cx="250" cy="230" r="210" fill="url(#skyGradDay)" opacity={isDay ? 0.95 : 0} style={{ transition: "opacity 2s ease-in-out" }} />
                <circle cx="250" cy="230" r="210" fill="url(#skyGradEvening)" opacity={isEvening ? 0.95 : 0} style={{ transition: "opacity 2s ease-in-out" }} />
                <circle cx="250" cy="230" r="210" fill="url(#skyGradNight)" opacity={isNight ? 0.98 : 0} style={{ transition: "opacity 2s ease-in-out" }} />

                {/* 2. Twinkling Stars (Night only) */}
                {isNight && [
                  { x: 140, y: 90, size: 4.5, delay: 0 },
                  { x: 180, y: 70, size: 3.5, delay: 0.4 },
                  { x: 220, y: 60, size: 5.0, delay: 0.1 },
                  { x: 250, y: 45, size: 4.0, delay: 0.7 },
                  { x: 280, y: 55, size: 4.5, delay: 0.3 },
                  { x: 320, y: 70, size: 5.5, delay: 0.9 },
                  { x: 360, y: 95, size: 3.8, delay: 0.2 },
                  { x: 120, y: 130, size: 3.2, delay: 1.1 },
                  { x: 160, y: 110, size: 4.0, delay: 0.5 },
                  { x: 200, y: 100, size: 5.0, delay: 0.8 },
                  { x: 250, y: 95, size: 3.5, delay: 0.2 },
                  { x: 290, y: 105, size: 4.2, delay: 1.3 },
                  { x: 340, y: 115, size: 3.8, delay: 0.6 },
                  { x: 150, y: 155, size: 3.5, delay: 0.3 },
                  { x: 190, y: 145, size: 4.5, delay: 1.0 },
                  { x: 240, y: 135, size: 3.0, delay: 0.1 },
                  { x: 300, y: 145, size: 4.2, delay: 0.7 }
                ].map((star, i) => (
                  <g key={i} transform={`translate(${star.x}, ${star.y})`}>
                    <motion.path
                      d={`M 0,-${star.size} Q 0,0 ${star.size},0 Q 0,0 0,${star.size} Q 0,0 -${star.size},0 Q 0,0 0,-${star.size} Z`}
                      fill="#FFFFFF"
                      initial={{ opacity: 0.2, scale: 0.4 }}
                      animate={{ 
                        opacity: [0.2, 1.0, 0.2], 
                        scale: [0.4, 1.3, 0.4] 
                      }}
                      transition={{
                        duration: 1.4 + (i % 3) * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.delay
                      }}
                    />
                  </g>
                ))}

                {/* 3. Solar Body (Moving Sun with soft glow based on current period) */}
                {(!isNight && (
                  <g>
                    {/* Outer glow circle animators */}
                    <motion.circle 
                      animate={{ 
                        cx: isMorning ? 130 : isDay ? 250 : 370, 
                        cy: isMorning ? 170 : isDay ? 90 : 160,
                        r: isMorning ? 42 : isDay ? 48 : 44
                      }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      fill={isEvening ? "#EA580C" : "#FBBF24"} 
                      opacity={0.2} 
                    />
                    <motion.circle 
                      animate={{ 
                        cx: isMorning ? 130 : isDay ? 250 : 370, 
                        cy: isMorning ? 170 : isDay ? 90 : 160,
                        r: isMorning ? 30 : isDay ? 35 : 32
                      }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      fill={isEvening ? "#F97316" : "#FBBF24"} 
                      opacity={0.4} 
                    />
                    <motion.circle 
                      animate={{ 
                        cx: isMorning ? 130 : isDay ? 250 : 370, 
                        cy: isMorning ? 170 : isDay ? 90 : 160,
                        r: isMorning ? 20 : isDay ? 24 : 22
                      }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      fill={isEvening ? "#FDBA74" : "#FCD34D"} 
                      opacity={0.9} 
                    />
                  </g>
                ))}

                {/* 4. Lunar Body (Moon visible at Night with glow and path crescent) */}
                {isNight && (
                  <g>
                    <motion.circle 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.15, scale: 1 }}
                      transition={{ duration: 2 }}
                      cx={350} 
                      cy={110} 
                      r={28} 
                      fill="#FFFFFF" 
                    />
                    <motion.circle 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.35, scale: 1 }}
                      transition={{ duration: 2 }}
                      cx={350} 
                      cy={110} 
                      r={20} 
                      fill="#FFFFFF" 
                    />
                    <motion.path 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 2.2 }}
                      transform="translate(350, 110)"
                      d="M -10 -15 A 18 18 0 1 0 15 10 A 14 14 0 1 1 -10 -15 Z" 
                      fill="#FFFFFF" 
                    />
                  </g>
                )}

                {/* 5. Light moving / drifting clouds */}
                {[
                  { y: 55, scale: 0.65, duration: 48, delay: 0 },
                  { y: 105, scale: 0.45, duration: 72, delay: -24 },
                  { y: 130, scale: 0.55, duration: 60, delay: -12 }
                ].map((cloud, i) => {
                  const cloudColor = isMorning 
                    ? "#FFE4E6" 
                    : isDay 
                    ? "#FFFFFF" 
                    : isEvening 
                    ? "#FED7AA" 
                    : "#475569";
                  const cloudOpacity = isNight ? 0.18 : isDay ? 0.48 : 0.38;

                  return (
                    <motion.g
                      key={i}
                      initial={{ x: -120 }}
                      animate={{ x: 550 }}
                      transition={{
                        duration: cloud.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: cloud.delay
                      }}
                      transform={`translate(0, ${cloud.y}) scale(${cloud.scale})`}
                    >
                      <path 
                        d="M30 50 C 35 38, 50 38, 55 50 C 65 42, 80 50, 75 62 C 85 70, 75 82, 65 80 C 55 85, 40 85, 35 78 C 20 78, 20 62, 30 50 Z" 
                        fill={cloudColor} 
                        opacity={cloudOpacity} 
                        style={{ transition: "fill 2.5s ease-in-out, opacity 2.5s ease-in-out" }}
                      />
                    </motion.g>
                  );
                })}
              </g>

              {/* Aravalli Dunes/Mountains */}
              <path d="M 50 350 Q 150 280 250 330 T 450 310 V 460 H 50 Z" fill="url(#hillGrad)" />
              <path d="M -10 380 Q 110 320 220 370 T 510 330 V 460 H -10 Z" fill="#936D42" opacity="0.4" />
              <path d="M 120 400 Q 250 360 380 410 T 520 380 V 460 H 120 Z" fill="#FAF6EE" opacity="0.2" />

              {/* LUSH GREEN TREES */}
              {/* Tree 1 Left */}
              <circle cx="90" cy="330" r="28" fill="#15803D" opacity="0.9" />
              <circle cx="75" cy="315" r="22" fill="#166534" />
              <circle cx="105" cy="320" r="18" fill="#22C55E" opacity="0.85" />
              <rect x="86" y="340" width="8" height="35" fill="#78350F" />

              {/* Tree 2 Right background */}
              <circle cx="410" cy="320" r="24" fill="#166534" opacity="0.8" />
              <circle cx="425" cy="315" r="18" fill="#15803D" />
              <rect x="412" y="330" width="6" height="30" fill="#78350F" />

              {/* PANCHAYAT BHAWAN BUILDING */}
              <g id="panchayat-bhawan" transform="translate(140, 240)">
                {/* Main sandstone base */}
                <rect x="0" y="40" width="160" height="85" fill="url(#bhawanGrad)" rx="8" stroke="#B45309" strokeWidth="1.5" />
                
                {/* Steps */}
                <rect x="40" y="115" width="80" height="5" fill="#D4A373" stroke="#B45309" strokeWidth="1.2" />
                <rect x="30" y="120" width="100" height="7" fill="#A16207" stroke="#B45309" strokeWidth="1.2" />

                {/* Royal Rajasthani pillars */}
                <rect x="15" y="60" width="8" height="55" fill="#E5C79E" stroke="#B45309" strokeWidth="1" />
                <rect x="50" y="60" width="8" height="55" fill="#E5C79E" stroke="#B45309" strokeWidth="1" />
                <rect x="102" y="60" width="8" height="55" fill="#E5C79E" stroke="#B45309" strokeWidth="1" />
                <rect x="137" y="60" width="8" height="55" fill="#E5C79E" stroke="#B45309" strokeWidth="1" />

                {/* Arches (Pillar top decorations) */}
                <path d="M 10 60 Q 32.5 45 55 60" fill="none" stroke="#B45309" strokeWidth="1.5" />
                <path d="M 50 60 Q 76 45 102 60" fill="none" stroke="#B45309" strokeWidth="1.5" />
                <path d="M 97 60 Q 122 45 147 60" fill="none" stroke="#B45309" strokeWidth="1.5" />

                {/* Main entrance Arch gate */}
                <path d="M 65 115 V 75 Q 80 60 95 75 V 115 Z" fill="#78350F" stroke="#B45309" strokeWidth="1" />

                {/* Gokhla/Jharokhas (Side windows) */}
                <rect x="25" y="70" width="15" height="25" fill="#5C3615" rx="3" stroke="#B45309" strokeWidth="1" />
                <rect x="120" y="70" width="15" height="25" fill="#5C3615" rx="3" stroke="#B45309" strokeWidth="1" />
                
                {/* Traditional Chhatri (Central Dome) on roof */}
                <path d="M 60 40 C 60 10, 100 10, 100 40 Z" fill="#E5C79E" stroke="#B45309" strokeWidth="1.5" />
                <line x1="80" y1="10" x2="80" y2="0" stroke="#B45309" strokeWidth="2" />
                <circle cx="80" cy="-2" r="2.5" fill="#FBBF24" />

                {/* Mini Side Domes */}
                <path d="M 15 40 C 15 25, 35 25, 35 40 Z" fill="#E5C79E" stroke="#B45309" strokeWidth="1" />
                <path d="M 125 40 C 125 25, 145 25, 145 40 Z" fill="#E5C79E" stroke="#B45309" strokeWidth="1" />

                {/* Signboard wording */}
                <rect x="40" y="44" width="80" height="12" fill="#B33D26" rx="2" />
                <text x="80" y="52" fill="#FFFDFC" fontSize="5.5" fontWeight="950" textAnchor="middle" fontFamily="sans-serif">पंचायत भवन सांगानेर</text>

                {/* Indian Flag on roof top! */}
                <g id="indian-flag" transform="translate(80, 0)">
                  <line x1="0" y1="0" x2="0" y2="-45" stroke="#4B5563" strokeWidth="1.5" />
                  {/* Flag fabric waving */}
                  <path d="M 0 -45 C 10 -47, 18 -41, 28 -44 V -32 C 18 -29, 10 -35, 0 -33 Z" fill="#FF9933" />
                  <path d="M 0 -33 C 10 -35, 18 -29, 28 -32 V -20 C 18 -17, 10 -23, 0 -21 Z" fill="#FFFFFF" />
                  <path d="M 0 -21 C 10 -23, 18 -17, 28 -20 V -8 C 18 -5, 10 -11, 0 -9 Z" fill="#128807" />
                  {/* Ashoka Chakra */}
                  <circle cx="14" cy="-26" r="3.5" stroke="#000080" strokeWidth="0.4" />
                  <circle cx="14" cy="-26" r="0.5" fill="#000080" />
                </g>
              </g>

              {/* SOVEREIGN CONCRETE WATER TANK */}
              <g id="water-tank" transform="translate(320, 210)">
                {/* Structural columns */}
                <line x1="20" y1="90" x2="20" y2="150" stroke="#9CA3AF" strokeWidth="4" />
                <line x1="40" y1="90" x2="40" y2="150" stroke="#9CA3AF" strokeWidth="4" />
                <line x1="60" y1="90" x2="60" y2="150" stroke="#9CA3AF" strokeWidth="4" />
                {/* Braces */}
                <line x1="16" y1="110" x2="64" y2="110" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="16" y1="130" x2="64" y2="130" stroke="#9CA3AF" strokeWidth="2" />
                
                {/* Main cylindrical reservoir */}
                <rect x="10" y="40" width="60" height="50" fill="url(#tankGrad)" rx="3" stroke="#4B5563" strokeWidth="1.2" />
                {/* Domed roof of water tank */}
                <path d="M 10 40 C 10 20, 70 20, 70 40 Z" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1.2" />
                
                {/* Pipings and details */}
                <line x1="15" y1="90" x2="15" y2="150" stroke="#1D4ED8" strokeWidth="1.5" />
                
                {/* Ladder notches */}
                <line x1="63" y1="45" x2="63" y2="85" stroke="#4B5563" strokeWidth="1" />
                <line x1="61" y1="50" x2="65" y2="50" stroke="#4B5563" strokeWidth="0.8" />
                <line x1="61" y1="60" x2="65" y2="60" stroke="#4B5563" strokeWidth="0.8" />
                <line x1="61" y1="70" x2="65" y2="70" stroke="#4B5563" strokeWidth="0.8" />
                <line x1="61" y1="80" x2="65" y2="80" stroke="#4B5563" strokeWidth="0.8" />

                {/* Sanganer Har Ghar Jal signage logo */}
                <circle cx="40" cy="65" r="9" fill="#1E3A8A" />
                <path d="M 40 59 Q 44 65 40 69 Q 36 65 40 59 Z" fill="#60A5FA" />
              </g>

              {/* INDUSTRIAL SOLAR PANELS ARRAY */}
              <g id="solar-panels" transform="translate(45, 370)">
                {/* Support metal struts */}
                <line x1="20" y1="35" x2="10" y2="55" stroke="#4B5563" strokeWidth="2.5" />
                <line x1="50" y1="35" x2="40" y2="55" stroke="#4B5563" strokeWidth="2.5" />
                <line x1="80" y1="35" x2="70" y2="55" stroke="#4B5563" strokeWidth="2.5" />
                
                {/* Grid plate tilted */}
                <polygon points="5,42 85,25 95,5 15,22" fill="url(#panelGrad)" stroke="#E5E7EB" strokeWidth="1.2" />
                
                {/* Reflective grid matrices */}
                <line x1="25" y1="21" x2="45" y2="40" stroke="#60A5FA" strokeWidth="0.7" opacity="0.7" />
                <line x1="45" y1="17" x2="65" y2="36" stroke="#60A5FA" strokeWidth="0.7" opacity="0.7" />
                <line x1="65" y1="13" x2="85" y2="32" stroke="#60A5FA" strokeWidth="0.7" opacity="0.7" />

                <line x1="10" y1="31" x2="80" y2="15" stroke="#60A5FA" strokeWidth="0.7" opacity="0.7" />
                <line x1="16" y1="41" x2="90" y2="25" stroke="#60A5FA" strokeWidth="0.7" opacity="0.7" />
              </g>

              {/* THE RESPECTED SARPANCH CHARACTER (Traditional Rajasthani & Digitized) */}
              <g id="sarpanch-hero" transform="translate(230, 275)">
                
                {/* Sarpanch Body - Traditional Nehru Jacket over crisp White Kurta */}
                <path d="M 15 130 C -15 130, -38 175, -45 220 H 125 C 115 175, 95 130, 65 130 Z" fill="#F9FAFB" /> {/* Kurta Sleeves Base */}
                
                {/* Terracotta/Saffron Nehru Jacket (Sleeveless vest cutout) */}
                <path d="M -22 145 C -25 180, -28 200, -30 220 H 110 C 108 200, 105 180, 102 145 C 92 140, 80 142, 65 145 C 55 140, 25 140, 15 145 C 0 142, -12 140, -22 145 Z" fill="url(#jacketGrad)" stroke="#7C2D12" strokeWidth="1" />
                
                {/* Dark Brass Buttons on front crease */}
                <circle cx="40" cy="165" r="2.5" fill="#FBBF24" />
                <circle cx="40" cy="180" r="2.5" fill="#FBBF24" />
                <circle cx="40" cy="195" r="2.5" fill="#FBBF24" />
                <circle cx="40" cy="210" r="2.5" fill="#FBBF24" />

                {/* Pocket and royal pocket-squared handkerchief */}
                <path d="M 68 158 H 85 V 170 H 68 Z" fill="#7C2D12" />
                <path d="M 72 158 L 76.5 150 L 81 158 Z" fill="#EF4444" /> {/* Red pocket square */}

                {/* Neck collar notch */}
                <path d="M 28 142 L 40 152 L 52 142 V 130 H 28 Z" fill="#F9FAFB" />
                <path d="M 23 130 L 28 145 H 52 L 57 130 Z" fill="url(#jacketGrad)" /> {/* Nehru Mandarin Collar */}

                {/* Face & Ears (Rich, warm tone) */}
                <circle cx="17" cy="100" r="9" fill="#EAB308" opacity="0.15" /> {/* shadow */}
                <circle cx="40" cy="98" r="25" fill="#F5C493" />
                <circle cx="13" cy="98" r="5" fill="#F5C493" /> {/* Left ear */}
                <circle cx="67" cy="98" r="5" fill="#F5C493" /> {/* Right ear */}

                {/* Intelligent warm eyes, active brow whiskers */}
                <ellipse cx="30" cy="94" rx="3" ry="1.8" fill="#1F2937" />
                <ellipse cx="50" cy="94" rx="3" ry="1.8" fill="#1F2937" />
                {/* Eyebrows */}
                <path d="M 24 89 Q 30 85 36 90" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 44 90 Q 50 85 56 89" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />

                {/* Traditional prominent mustache (Proud Rajasthani twirl) */}
                <path d="M 20 110 Q 32 108 40 115 Q 48 108 60 110 Q 67 106 68 100 Q 58 116 40 116 Q 22 116 12 100 Q 13 106 20 110 Z" fill="#111827" stroke="#030712" strokeWidth="1" />

                {/* Gentle smiling mouth */}
                <path d="M 34 122 Q 40 126 46 122" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

                {/* Traditional Round Golden Earrings (Kundal) */}
                <circle cx="13" cy="103" r="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
                <circle cx="67" cy="103" r="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" />

                {/* SPECTACULAR TRADITIONAL RAJASTHANI MULTI-TIER PLEATED TURBAN (PAGRI) */}
                {/* Built out of curved overlay slices for rich density */}
                <g id="rajasthani-pagri">
                  <path d="M 12 82 C 12 55, 68 55, 68 82 Z" fill="url(#turbanGrad)" /> {/* Base dome */}
                  
                  {/* Diagonal twisted pleats */}
                  <path d="M 10 80 Q 40 45 68 76" fill="none" stroke="#FBBF24" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 10 73 Q 38 38 72 63" fill="none" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 8 64 Q 40 28 72 52" fill="none" stroke="#F59E0B" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 12 54 Q 42 22 68 40" fill="none" stroke="#B45309" strokeWidth="10" strokeLinecap="round" />
                  
                  {/* Decorative gemstone piece (Kalgi) on center brow */}
                  <path d="M 40 68 L 40 38 Q 40 25 46 12 Q 52 25 52 38 Z" fill="#DC2626" />
                  <circle cx="46" cy="38" r="4" fill="#FBBF24" />
                  <circle cx="46" cy="38" r="1.5" fill="#1D4ED8" />
                  <line x1="46" y1="12" x2="46" y2="4" stroke="#D97706" strokeWidth="1" />
                  <circle cx="46" cy="2" r="1.5" fill="#EF4444" />
                </g>

                {/* ACTIVE LUMINOUS TABLET HELD BY SARPANCH */}
                <g id="sarpanch-tablet" transform="translate(48, 140)">
                  {/* Floating wireless beam circles background indicator */}
                  <circle cx="35" cy="40" r="50" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,6" opacity="0.25" className="animate-spin" style={{ transformOrigin: "35px 40px" }} />
                  <circle cx="35" cy="40" r="30" stroke="#10B981" strokeWidth="1.2" strokeDasharray="5,3" opacity="0.35" />

                  {/* Tablet frame */}
                  <rect x="0" y="5" width="72" height="60" rx="6" fill="#1E2937" stroke="#D1D5DB" strokeWidth="2.5" transform="rotate(-12)" />
                  {/* Glowing dynamic glass display window */}
                  <rect x="4" y="9" width="64" height="52" rx="4" fill="#0F172A" stroke="#000000" strokeWidth="0.8" transform="rotate(-12)" />

                  {/* Tech dashboard UI on screen (simulated with paths) */}
                  {/* Grid layout */}
                  <g opacity="0.9" transform="rotate(-12, 35, 35)">
                    {/* Header bar and green battery */}
                    <rect x="8" y="12" width="28" height="3" fill="#D4A373" rx="1" />
                    <rect x="48" y="12" width="10" height="3" fill="#10B981" rx="0.5" />
                    
                    {/* Map matrix radar sweep */}
                    <circle cx="20" cy="36" r="12" fill="none" stroke="#2563EB" strokeWidth="1" />
                    <line x1="20" y1="24" x2="20" y2="48" stroke="#10B981" strokeWidth="0.6" opacity="0.8" />
                    <line x1="8" y1="36" x2="32" y2="36" stroke="#10B981" strokeWidth="0.6" opacity="0.8" />
                    
                    {/* Glowing bar chart nodes representing development works */}
                    <rect x="42" y="22" width="4" height="24" fill="#EF4444" rx="1" />
                    <rect x="49" y="28" width="4" height="18" fill="#FBBF24" rx="1" />
                    <rect x="56" y="18" width="4" height="28" fill="#10B981" rx="1" />
                    
                    {/* Connect telemetry ticks */}
                    <text x="36" y="55" fill="#6EE7B7" fontSize="4.2" fontWeight="900" fontFamily="monospace">ONLINE GPS</text>
                  </g>
                </g>

                {/* Hand knuckles wrapping over tablet edge */}
                <path d="M 38 185 Q 43 178 52 181 L 53 197 Q 44 198 38 190 Z" fill="#F5C493" stroke="#B45309" strokeWidth="0.8" />
                <circle cx="48" cy="183" r="2.2" fill="#F5C493" stroke="#B45309" strokeWidth="0.5" />
                <circle cx="50" cy="188" r="2.2" fill="#F5C493" stroke="#B45309" strokeWidth="0.5" />
                <circle cx="48" cy="193" r="2.2" fill="#F5C493" stroke="#B45309" strokeWidth="0.5" />

              </g>

            </svg>

            {/* FLOATING TELEMETRY DASHBOARD GLASS CARDS AROUND SARPANCH */}
            
            {/* Card 1: Upcoming Meeting (Top Right) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-6 md:-right-12 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-500/20 max-w-[170px] pointer-events-auto hover:scale-105 transition-transform"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="p-1 bg-amber-50 rounded-lg">
                  <Users className="h-4 w-4 text-[#B33D26]" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">UPCOMING MEETING</span>
                  <span className="block text-[11px] font-display font-extrabold text-amber-950">Gram Sabha</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium text-left leading-tight pl-1 border-l-2 border-amber-600">
                25 Jun • 11:00 AM<br/>
                <span className="text-[8px] text-slate-400 font-mono">Monsoon Water Prep</span>
              </p>
            </motion.div>

            {/* Card 2: Complaint Tracker (Bottom Left) */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-500/20 max-w-[180px] pointer-events-auto hover:scale-105 transition-transform"
            >
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">GRIEVANCE TIMELINE</span>
                  <span className="block text-[11px] font-display font-extrabold text-amber-950">98% Resolved</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-left leading-snug pl-1.5 border-l-2 border-emerald-500">
                Ward 4 solar pipe leakage repaired successfully.
              </p>
            </motion.div>

            {/* Card 3: Attendance Register (Top Left) */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-24 -left-12 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-500/20 max-w-[155px] pointer-events-auto hover:scale-105 transition-transform"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="p-1 bg-blue-50 rounded-lg">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">MUSTER SECURE</span>
                  <span className="block text-[11px] font-display font-extrabold text-amber-950">Selfie Match</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-left leading-normal pl-1.5 border-l-2 border-blue-500 font-mono">
                Worksite RJ-04-1002<br/>
                <span className="text-blue-700 font-bold font-sans">42 Present Geotagged</span>
              </p>
            </motion.div>

            {/* Card 4: Public Notice (Middle Right) */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-1/2 -right-8 md:-right-14 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-500/20 max-w-[170px] pointer-events-auto hover:scale-105 transition-transform"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="p-1 bg-violet-50 rounded-lg">
                  <Megaphone className="h-4 w-4 text-violet-600" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">PUBLIC BULLETIN</span>
                  <span className="block text-[11px] font-display font-extrabold text-amber-950">Water Bores</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-left leading-tight pl-1.5 border-l-2 border-violet-500">
                Tender opened for solar tubewell motor casing.
              </p>
            </motion.div>

            {/* Card 5: Development Project (Bottom Right) */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-2 -right-6 md:-right-12 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-500/20 max-w-[175px] pointer-events-auto hover:scale-105 transition-transform"
            >
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1 bg-orange-50 rounded-lg">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">INFRA SCHEME</span>
                  <span className="block text-[11px] font-display font-extrabold text-amber-950">Brick Paving</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-left leading-snug pl-1.5 border-l-2 border-orange-500 font-mono">
                Allocated: ₹1,400,000<br/>
                <span className="text-orange-700 font-sans font-bold">85% Work Done</span>
              </p>
            </motion.div>

            {/* Time of Day Tester Controls */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-amber-500/20 flex items-center space-x-1.5 pointer-events-auto shrink-0 select-none z-30">
              <span className="text-[9px] font-extrabold font-mono tracking-wider opacity-70 text-amber-950 uppercase mr-1">Sky Simulator:</span>
              {[
                { id: null, label: "Live", icon: "🕒" },
                { id: "morning", label: "Morning", icon: "🌅" },
                { id: "day", label: "Day", icon: "☀️" },
                { id: "evening", label: "Evening", icon: "🌆" },
                { id: "night", label: "Night", icon: "🌙" }
              ].map((item) => (
                <button
                  key={item.id ?? "auto"}
                  onClick={() => setTimeOverride(item.id as any)}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center space-x-1 border ${
                    timeOverride === item.id 
                      ? "bg-amber-600 border-amber-700 text-white shadow-sm scale-105" 
                      : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100/90 active:scale-95"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

          </div>

        </motion.div>

      </section>

      {/* Thick human-designed straight boundary replacing the folk-art waves */}
      <div className="relative z-15 w-full bg-amber-800 h-2 select-none" id="hero-thick-boundary"></div>

      {/* Seamless Folk Art Footline Banner */}
      <footer className="bg-amber-950 font-sans text-amber-100 py-12 relative z-10 border-t border-amber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-amber-900">
            <div className="flex items-center space-x-3.5">
              <div className="bg-amber-900 p-2.5 rounded-xl border border-amber-700">
                <Landmark className="h-5.5 w-5.5 text-amber-100" />
              </div>
              <div className="text-left">
                <span className="block font-display font-black text-white text-base">GraamSeva Connect</span>
                <span className="block text-[9px] text-amber-400 font-mono tracking-widest uppercase">OFFICIAL PANCHAYAT PORTAL</span>
              </div>
            </div>
            
            <p className="text-xs text-amber-300 font-medium font-sans">
              Designed dynamically according to National e-Governance standards. Seamless Offline Outbox synchronization certified.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-amber-400 gap-4 font-mono">
            <p>© 2026 National Informatics Centre (NIC), Rajasthan Local Self-Gov & Panchayati Raj Dept.</p>
            <div className="flex space-x-6">
              <a href="#privacy" className="hover:text-white transition">Privacy Guidelines</a>
              <a href="#audit" className="hover:text-white transition">Public Audit Tenders</a>
              <a href="#sadhana" className="hover:text-white transition">NIC eGramSwaraj</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
