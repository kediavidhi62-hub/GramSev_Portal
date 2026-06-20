import React, { useState } from "react";
import { UserRole, AppLanguage, CertificateApplication, GrievanceComplaint, FundAllocation, ApplicationStatus, GrievanceStatus } from "../types";
import { TRANSLATIONS } from "../translations";
import VoiceAssistant from "./VoiceAssistant";
import Certificates from "./Certificates";
import Schemes from "./Schemes";
import Grievances from "./Grievances";
import GramSabha from "./GramSabha";
import Transparency from "./Transparency";
import ReadAloud from "./ReadAloud";

import { 
  AudioLines, 
  FileText, 
  HeartHandshake, 
  Hammer, 
  Calendar, 
  Coins, 
  LogOut, 
  Sparkles, 
  User, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  Megaphone
} from "lucide-react";

interface CitizenDashboardProps {
  user: { id: string; name: string; role: UserRole };
  language: AppLanguage;
  isOnline: boolean;
  applications: CertificateApplication[];
  setApplications: React.Dispatch<React.SetStateAction<CertificateApplication[]>>;
  complaints: GrievanceComplaint[];
  setComplaints: React.Dispatch<React.SetStateAction<GrievanceComplaint[]>>;
  fundAllocations: FundAllocation[];
  onQueueSync: (type: any, data: any) => void;
  voiceContext: any;
  setVoiceContext: (ctx: any) => void;
  onLogout: () => void;
  syncQueueLength: number;
}

export default function CitizenDashboard({
  user,
  language,
  isOnline,
  applications,
  setApplications,
  complaints,
  setComplaints,
  fundAllocations,
  onQueueSync,
  voiceContext,
  setVoiceContext,
  onLogout,
  syncQueueLength
}: CitizenDashboardProps) {
  const t = TRANSLATIONS[language];
  const [tab, setTab] = useState<string>("overview");

  // Calculate user-specific overview stats
  const pendingCertsCount = applications.filter(a => a.status === ApplicationStatus.PENDING).length;
  const approvedCertsCount = applications.filter(a => a.status === ApplicationStatus.APPROVED).length;
  const activeGrievances = complaints.filter(c => c.status !== GrievanceStatus.RESOLVED).length;

  const handleClassifyResult = (data: { action: string; category?: string; spokenText: string }) => {
    setVoiceContext(data);
    if (data.action === "CERTIFICATE") {
      setTab("certificates");
    } else if (data.action === "COMPLAINT") {
      setTab("grievances");
    } else {
      setTab("schemes");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Citizen Dashboard Header Banner */}
      <div className="bg-[#eed583] text-amber-950 p-6 rounded-2xl shadow-md border border-amber-600/20 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
        <div className="space-y-1 z-10 font-sans">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-amber-900" />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-amber-950">
              {language === AppLanguage.MW
                ? `राम राम सा, ${user.name} (नागरिक)`
                : language === AppLanguage.HI 
                ? `नमस्ते, ${user.name} (नागरिक)` 
                : `Namaste, ${user.name}`}
            </h2>
          </div>
          <p className="text-xs text-amber-900 font-medium leading-relaxed max-w-2xl">
            {language === AppLanguage.MW
              ? "सांगानेर आपणो ग्राम पंचायत नागरिक पोर्टल चालू है सा। सीधे बोल'र या ऑनलाइन कागजात बणावा ने भेजो, सरकारी योजनावां में आपणो कदर देखो, या आपणी शिकायतां दर्ज करावो।"
              : language === AppLanguage.HI 
              ? "सांगानेर ग्राम पंचायत नागरिक पोर्टल सक्रिय है। सीधे बोलकर या ऑनलाइन फॉर्म से आवेदन करें, सरकारी योजनाओं में पात्रता जांचें, या अपने वॉर्ड की जन शिकायतें दर्ज करें।" 
              : "Citizen Portal active. Get certified documents with direct Aadhaar e-Sign, review local schemes, or file street infrastructure issues instantly."}
          </p>
        </div>
        
        <div className="flex sm:flex-col gap-2 shrink-0 z-10 w-full sm:w-auto">
          <span className="bg-amber-950/10 text-amber-950 text-[10px] font-bold font-mono px-3.5 py-1.5 rounded-full uppercase border border-amber-950/10 text-center flex-1">
            {language === AppLanguage.MW ? "नागरिक पोर्टल (आपणो)" : language === AppLanguage.HI ? "नागरिक पोर्टल" : "CITIZEN ACCESS"}
          </span>
          <button
            onClick={onLogout}
            className="bg-amber-950/10 hover:bg-amber-950/20 text-amber-950 text-[10px] sm:text-xs font-bold font-sans py-1.5 px-3.5 rounded-full uppercase border border-amber-950/20 transition flex items-center justify-center space-x-1.5 cursor-pointer flex-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{language === AppLanguage.MW ? "बाहर जावो" : language === AppLanguage.HI ? "लॉगआउट" : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar Drawer */}
        <nav className="col-span-1 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-1">
          <span className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase px-3.5 mb-2 font-mono">
            {language === AppLanguage.MW ? "नागरिक मेनू सा" : language === AppLanguage.HI ? "नागरिक मेनू" : "Citizen Directory"}
          </span>

          {/* Overview Landing */}
          <button
            onClick={() => setTab("overview")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "overview"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User className={`h-4.5 w-4.5 ${tab === "overview" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{language === AppLanguage.MW ? "मुख्य सारांश" : language === AppLanguage.HI ? "मुख्य सारांश" : "My Dashboard Home"}</span>
          </button>

          {/* Voice assistant */}
          <button
            onClick={() => {
              setTab("voice");
              setVoiceContext(null);
            }}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "voice"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <AudioLines className={`h-4.5 w-4.5 ${tab === "voice" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navVoice}</span>
          </button>

          {/* Certificates */}
          <button
            onClick={() => setTab("certificates")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "certificates"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className={`h-4.5 w-4.5 ${tab === "certificates" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navCertificates}</span>
          </button>

          {/* Scheme Eligibility */}
          <button
            onClick={() => setTab("schemes")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "schemes"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <HeartHandshake className={`h-4.5 w-4.5 ${tab === "schemes" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navSchemes}</span>
          </button>

          {/* Grievances */}
          <button
            onClick={() => setTab("grievances")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "grievances"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Hammer className={`h-4.5 w-4.5 ${tab === "grievances" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navGrievances}</span>
          </button>

          {/* Gram Sabha meetings */}
          <button
            onClick={() => setTab("gramsabha")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "gramsabha"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar className={`h-4.5 w-4.5 ${tab === "gramsabha" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navSabha}</span>
          </button>

          {/* Budget transparent */}
          <button
            onClick={() => setTab("transparency")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "transparency"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Coins className={`h-4.5 w-4.5 ${tab === "transparency" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navBudget}</span>
          </button>

          {/* Announcements */}
          <button
            onClick={() => setTab("announcements")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "announcements"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Megaphone className={`h-4.5 w-4.5 ${tab === "announcements" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{t.navAnnouncements}</span>
          </button>
        </nav>

        {/* Dynamic Display */}
        <div className="col-span-1 lg:col-span-9">
          
          {/* Dashboard Summary Home */}
          {tab === "overview" && (
            <div className="space-y-6">
              
              {/* Quick statistics widgets row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono tracking-tight">
                      {language === AppLanguage.MW ? "चालू कागजात सा" : language === AppLanguage.HI ? "सक्रिय दस्तावेज" : "Active Documents"}
                    </span>
                    <strong className="text-xl font-extrabold text-slate-900 font-sans block mt-1 tracking-tight">
                      {language === AppLanguage.MW 
                        ? `${pendingCertsCount + approvedCertsCount} अर्जी सा` 
                        : language === AppLanguage.HI 
                        ? `${pendingCertsCount + approvedCertsCount} आवेदन पत्र` 
                        : `${pendingCertsCount + approvedCertsCount} Applications`}
                    </strong>
                    <span className="text-[10px] text-orange-600 font-medium font-sans block mt-0.5">
                      {language === AppLanguage.MW 
                        ? `${pendingCertsCount} अटकीओड़ी सा • ${approvedCertsCount} बणगी सा`
                        : language === AppLanguage.HI 
                        ? `${pendingCertsCount} लंबित • ${approvedCertsCount} जारी`
                        : `${pendingCertsCount} pending • ${approvedCertsCount} issued`}
                    </span>
                  </div>
                  <div className="bg-orange-50 text-orange-700 p-2.5 rounded-xl border border-orange-100">
                    <FileCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono tracking-tight">
                      {language === AppLanguage.MW ? "म्हारी शिकायत अर्जी सा" : language === AppLanguage.HI ? "मेरी शिकायतें" : "My Complaint Tickets"}
                    </span>
                    <strong className="text-xl font-extrabold text-slate-900 font-sans block mt-1 tracking-tight">
                      {language === AppLanguage.MW 
                        ? `${complaints.length} दर्ज शिकायत सा` 
                        : language === AppLanguage.HI 
                        ? `${complaints.length} पंजीकृत शिकायतें` 
                        : `${complaints.length} Registered`}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-medium font-sans block mt-0.5">
                      {language === AppLanguage.MW 
                        ? `${complaints.filter(c => c.status === GrievanceStatus.RESOLVED).length} रो निपटारो होग्यो सा`
                        : language === AppLanguage.HI 
                        ? `${complaints.filter(c => c.status === GrievanceStatus.RESOLVED).length} का सफल निवारण`
                        : `${complaints.filter(c => c.status === GrievanceStatus.RESOLVED).length} Resolved successfully`}
                    </span>
                  </div>
                  <div className="bg-slate-50 text-slate-600 p-2.5 rounded-xl border border-slate-200">
                    <Hammer className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between col-span-1 sm:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono tracking-tight">
                      {language === AppLanguage.MW ? "रूपिया री जांच (ऑडिट) सा" : language === AppLanguage.HI ? "वित्तीय लेखा-जोखा (ऑडिट)" : "Financial Audits"}
                    </span>
                    <strong className="text-xl font-extrabold text-emerald-700 font-sans block mt-1 tracking-tight">
                      {language === AppLanguage.MW ? "१००% साफ़-सुथरो हिसाब सा" : language === AppLanguage.HI ? "100% पारदर्शी" : "100% Transparent"}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-medium font-mono block mt-0.5">
                      {language === AppLanguage.MW ? "१५वां वित्त आयोग बजट ऑनलाइन सा" : language === AppLanguage.HI ? "15वें वित्त आयोग अनुदान ऑनलाइन" : "15th Finance Grants Online"}
                    </span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100">
                    <Coins className="h-5 w-5" />
                  </div>
                </div>

              </div>

              {/* Bhashini Assistant Gateway Shortcut Card */}
              <div className="text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: "#e4d893" }}>
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-[8px] font-extrabold px-2 py-0.5 rounded uppercase font-mono" style={{ backgroundColor: "#b33d26" }}>BILINGUAL AI</span>
                    <h3 className="font-extrabold text-sm uppercase tracking-wide font-sans" style={{ borderColor: "#b33d26", color: "#b33d26" }}>
                      {language === AppLanguage.MW ? "पंचसखा मारवाड़ी एआई सारथी" : language === AppLanguage.HI ? "भाषिणी वॉयस-फर्स्ट सारथी" : "PanchaSakhā Bilingual AI Voice Sarthi"}
                    </h3>
                  </div>
                  <h4 className="text-lg font-bold tracking-tight text-amber-950">
                    {language === AppLanguage.MW ? "माइक पर आपणी स्थानीय बोली में बोलो सा" : language === AppLanguage.HI ? "माइक पर अपनी स्थानीय बोली में बोलें" : "Unsure which form to fill? Just speak in your regional dialect!"}
                  </h4>
                  <p className="text-xs leading-relaxed font-sans" style={{ color: "#b33d26" }}>
                    {language === AppLanguage.MW
                      ? "वॉयस-इंजन अपणी बोली सुणकर फॉर्म और शिकायत रो विवरण अपने आप भरदेसी सा।"
                      : language === AppLanguage.HI 
                      ? "वॉयस-इंजन स्वतः आपके वाक्यों का विश्लेषण करेगा और सही प्रपत्र (प्रमाण पत्र या शिकायत) खोलकर डाटा भर देगा।"
                      : "Our voice classification system listens to regional transcriptions, instantly opens the designated service widget, and pre-populates coordinates or text fields for you."}
                  </p>
                </div>
                <button
                  onClick={() => setTab("voice")}
                  className="text-white font-extrabold text-xs py-3 px-6 rounded-xl shrink-0 transition duration-150 flex items-center space-x-2 cursor-pointer shadow-md"
                  style={{ backgroundColor: "#b33d26" }}
                >
                  <AudioLines className="h-4.5 w-4.5" />
                  <span>{language === AppLanguage.MW ? "वॉयस माइक खोलो" : language === AppLanguage.HI ? "वॉयस माइक खोलें" : "Active Voice Assistant"}</span>
                </button>
              </div>

            </div>
          )}

          {tab === "voice" && (
            <VoiceAssistant
              language={language}
              setTab={setTab}
              onClassifyResult={handleClassifyResult}
              isOnline={isOnline}
            />
          )}

          {tab === "certificates" && (
            <Certificates
              language={language}
              role={UserRole.CITIZEN}
              isOnline={isOnline}
              applications={applications}
              setApplications={setApplications}
              onQueueSync={onQueueSync}
              voicePreFill={voiceContext}
            />
          )}

          {tab === "schemes" && (
            <Schemes language={language} isOnline={isOnline} />
          )}

          {tab === "grievances" && (
            <Grievances
              language={language}
              role={UserRole.CITIZEN}
              isOnline={isOnline}
              complaints={complaints}
              setComplaints={setComplaints}
              onQueueSync={onQueueSync}
              voicePreFill={voiceContext}
            />
          )}

          {tab === "gramsabha" && (
            <GramSabha
              language={language}
              role={UserRole.CITIZEN}
              isOnline={isOnline}
              meetings={[]} // simple view
              setMeetings={() => {}}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "transparency" && (
            <Transparency language={language} fundAllocations={fundAllocations} />
          )}

          {tab === "announcements" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black font-sans text-slate-900 tracking-tight leading-none uppercase">
                      {language === AppLanguage.MW ? "सूचन बोर्ड अर घोषणां" : language === AppLanguage.HI ? "कार्यालय घोषणाएँ एवं सूचना पट्ट" : "Panchayat Announcements & Bulletins"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === AppLanguage.MW ? "सांगानेर पंचायत री ताज़ा खबर अर आदेश" : language === AppLanguage.HI ? "सांगानेर पंचायत की ताज़ा सूचनाएं एवं आगामी सभाएं" : "Official bulletins, meeting rosters, and key developments"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#eed583] text-amber-950 font-bold px-3 py-1 rounded-full border border-amber-950/10">
                  {language === AppLanguage.MW ? "नया संदेश" : "LIVE FEED"}
                </span>
              </div>

              <div className="flex justify-end pt-1">
                <ReadAloud 
                  language={language} 
                  targetSelector="#announcements-content-container" 
                  title={language === AppLanguage.HI ? "🔊 समाचार सुनें (Listen News)" : "🔊 Read Announcements"}
                />
              </div>

              {/* Announcements grid/list stack */}
              <div id="announcements-content-container" className="space-y-4">
                
                {/* Notice 1: Meeting announcement */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/65 flex items-start space-x-4">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="text-xs space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold font-mono text-[9px] uppercase">
                        {language === AppLanguage.MW ? "सभा बैठक" : language === AppLanguage.HI ? "सभा बैठक" : "UPCOMING ASSEMBLY"}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">June 25, 2026</span>
                    </div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {language === AppLanguage.MW ? "ग्राम सभा री बैठक (२५ जून, २०२६)" : "Digital Gram Sabha Scheduled (June 25, 2026)"}
                    </p>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {language === AppLanguage.MW 
                        ? "नयी मनरेगा जॉब कार्ड री अर्जी, पाणि रो समाधान अर बजट रो रीव्यू। सब लोग पधारो सा।"
                        : "Audit of central agricultural welfare schemes, direct registration of new MNREGA job cards, and water pipeline repair proposals. All Ward residents are requested to participate physical or audio stream."}
                    </p>
                    <div className="pt-2 flex items-center space-x-2 text-[10px] font-bold text-amber-900">
                      <span>• Venue: Panchayat Bhawan Assembly Hall</span>
                      <span>• Time: 11:00 AM IST</span>
                    </div>
                  </div>
                </div>

                {/* Notice 2: Aadhaar biometric update */}
                <div className="p-5 rounded-2xl bg-orange-50/40 border border-orange-200/50 flex items-start space-x-4">
                  <div className="p-2 bg-orange-100 text-orange-850 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-xs space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-orange-100 text-orange-800 font-extrabold font-mono text-[9px] uppercase">
                        {language === AppLanguage.MW ? "नयो सिस्टम" : language === AppLanguage.HI ? "तकनीकी अपडेट" : "SYSTEM UPGRADE"}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">June 18, 2026</span>
                    </div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {language === AppLanguage.MW ? "सीधौ आधार ई-सही सिस्टम चालू" : "Aadhaar Verification System Updated"}
                    </p>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {language === AppLanguage.MW
                        ? "अब थे आपणो प्रमाण पत्र आधार सूं ऑनलाइन वेरीफाई कर सको सा।"
                        : "Citizens can now use localized biometric proxy keys to generate instant pre-authenticated verification certificates, eliminating visits to block office desks."}
                    </p>
                  </div>
                </div>

                {/* Notice 3: Public Water Tank cleaning */}
                <div className="p-5 rounded-2xl bg-sky-50/40 border border-sky-200/50 flex items-start space-x-4">
                  <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="text-xs space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-extrabold font-mono text-[9px] uppercase">
                        {language === AppLanguage.MW ? "लोकोपयोगी सुचना" : language === AppLanguage.HI ? "जन स्वास्थ्य" : "PUBLIC WORKS"}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">June 20, 2026</span>
                    </div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {language === AppLanguage.MW ? "बड़ो पानी रो टांक मरावत अर साफ-सफाई" : "Community Water Tank Cleaning Schedule"}
                    </p>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {language === AppLanguage.MW 
                        ? "वॉर्ड नंबर ३ अर ४ में पानी रो टांक २१ जून ने साफ़ करिजसी, ज्यूं पानी री सप्लाई बंद रेहवेला सा।"
                        : "The central drinking water reservoir will undergo quarterly manual sanitization on Sunday, June 21, 2026. Ward 3 and 4 residents are advised to store alternative water reserves."}
                    </p>
                  </div>
                </div>

                {/* Notice 4: Free Medical Camp */}
                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/50 flex items-start space-x-4">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="text-xs space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold font-mono text-[9px] uppercase">
                        {language === AppLanguage.MW ? "आरोग्य कैम्प" : language === AppLanguage.HI ? "स्वास्थ्य शिविर" : "HEALTH SIVIR"}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">June 22, 2026</span>
                    </div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {language === AppLanguage.MW ? "मुफ़्त आंख अर साधारण दवाई जांच कैम्प" : "Free Eye Treatment & General Health Camp"}
                    </p>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {language === AppLanguage.MW 
                        ? "डॉक्टर सुणकर मुफ़्त में चश्मा अर दवाई बांटेला सा। सारे ग्रामीण पधार सको सा।"
                        : "A specialized medical team from Jaipur will conduct free eye diagnostic screenings and issue subsidized clinical support, specs, and essential tablets at the school complex."}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
