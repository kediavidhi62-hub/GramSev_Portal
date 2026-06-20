import React, { useState, useEffect } from "react";
import { UserRole, AppLanguage, CertificateApplication, GrievanceComplaint, PanchayatAsset, NREGAMusterWorker, FundAllocation, SyncQueueItem, ApplicationStatus, CertificateType, GrievanceStatus, EscalationLevel, GrievanceCategory } from "./types";
import { TRANSLATIONS } from "./translations";

// Components
import Header from "./components/Header";
import Login from "./components/Login";
import CitizenDashboard from "./components/CitizenDashboard";
import OfficialDashboard from "./components/OfficialDashboard";
import AdminDashboard from "./components/AdminDashboard";
import WhatsAppBot from "./components/WhatsAppBot";
import LandingPage from "./components/LandingPage";

// Icons for navigation
import { Sparkles, Sun, Moon, Volume2, VolumeX, Eye, EyeOff, HelpCircle } from "lucide-react";

export default function App() {
  // Global settings
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: UserRole; designation?: string } | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [language, setLanguage] = useState<AppLanguage>(AppLanguage.EN);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [tab, setTab] = useState<string>("voice");
  const [isLandingActive, setIsLandingActive] = useState<boolean>(true);
  
  // Accessibility & Theme preferences
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("gramseva-dark-mode");
      return saved === "true";
    } catch {
      return false;
    }
  });
  const [isReadAloudActive, setIsReadAloudActive] = useState<boolean>(false);
  const [isAccPanelOpen, setIsAccPanelOpen] = useState<boolean>(false);

  // Sync dark mode preference with localStorage and html class
  useEffect(() => {
    try {
      localStorage.setItem("gramseva-dark-mode", String(darkMode));
    } catch (e) {}
    
    // Toggle on document element for global CSS utility support
    if (darkMode) {
      document.documentElement.classList.add("dark-mode-active");
    } else {
      document.documentElement.classList.remove("dark-mode-active");
    }
  }, [darkMode]);

  // Sync Queue State
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Preload pre-fill context from Voice Assistant
  const [voiceContext, setVoiceContext] = useState<{ action: string; category?: string; spokenText: string } | null>(null);

  const t = TRANSLATIONS[language];

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Clean emojis & extra symbols
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (language === AppLanguage.HI || language === AppLanguage.MW) {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Attempt to parse/match appropriate Indian voice
    try {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.includes("IN") && v.lang.startsWith(language === AppLanguage.EN ? "en" : "hi"));
      if (preferred) {
        utterance.voice = preferred;
      }
    } catch (e) {}

    window.speechSynthesis.speak(utterance);
  };

  const toggleReadAloud = () => {
    if (!isReadAloudActive) {
      setIsReadAloudActive(true);
      setTimeout(() => {
        if (language === AppLanguage.EN) {
          speakText("Read aloud is now active. Click any text on the screen to hear it spoken.");
        } else if (language === AppLanguage.HI) {
          speakText("रीड अलाउड सक्रिय है। सुनने के लिए स्क्रीन पर किसी भी टेक्स्ट पर क्लिक करें।");
        } else {
          speakText("बोली चालू है सा। सुणबा सारू लिख्योड़ा माथै क्लिक करो सा।");
        }
      }, 150);
    } else {
      window.speechSynthesis.cancel();
      setIsReadAloudActive(false);
    }
  };

  useEffect(() => {
    if (!isReadAloudActive) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Ignore if clicked on settings/accessibility controls or bots to prevent loop
      if (target.closest('.accessibility-exclude') || target.closest('[id="whatsapp-bot"]') || target.tagName === 'BUTTON' && target.classList.contains('accessibility-exclude')) {
        return;
      }

      const textToRead = target.innerText || target.getAttribute("placeholder") || target.title || target.getAttribute("aria-label");
      if (textToRead && textToRead.trim().length > 0 && textToRead.trim().length < 350) {
        speakText(textToRead.trim());
      }
    };

    document.addEventListener("click", handleGlobalClick, true);
    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [isReadAloudActive, language]);

  // SEED DATABASES
  const [applications, setApplications] = useState<CertificateApplication[]>([
    {
      id: "CERT-91028",
      type: CertificateType.CASTE,
      citizenName: "Ramesh Gurjar",
      citizenAadhaar: "453412348911",
      status: ApplicationStatus.PENDING,
      submissionDate: "2026-06-14",
      lastUpdated: "2026-06-14",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 4,
      remarks: "Caste verification document from Patwari pending."
    },
    {
      id: "CERT-48902",
      type: CertificateType.BIRTH,
      citizenName: "Sunita Bai",
      citizenAadhaar: "782298114532",
      status: ApplicationStatus.APPROVED,
      submissionDate: "2026-06-10",
      lastUpdated: "2026-06-12",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 0,
      remarks: "Issued on June 12, 2026. Certified copy synced with DigiLocker."
    },
    {
      id: "CERT-10291",
      type: CertificateType.INCOME,
      citizenName: "Harish Meena",
      citizenAadhaar: "901140552193",
      status: ApplicationStatus.APPROVED,
      submissionDate: "2026-06-16",
      lastUpdated: "2026-06-17",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 0,
      remarks: "Aadhaar e-Signed with verified BPL income threshold checklist."
    },
    {
      id: "CERT-20412",
      type: CertificateType.WIDOW,
      citizenName: "Maya Devi",
      citizenAadhaar: "883311224455",
      status: ApplicationStatus.PENDING,
      submissionDate: "2026-06-17",
      lastUpdated: "2026-06-17",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 6,
      remarks: "Verifying death certificate of spouse with gram health register."
    },
    {
      id: "CERT-30519",
      type: CertificateType.EWS,
      citizenName: "Devendra Sharma",
      citizenAadhaar: "234556781290",
      status: ApplicationStatus.APPROVED,
      submissionDate: "2026-06-15",
      lastUpdated: "2026-06-16",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 0,
      remarks: "Annual family income certificate matched; EWS criteria digitally approved."
    },
    {
      id: "CERT-40618",
      type: CertificateType.BPL,
      citizenName: "Shambu Lal",
      citizenAadhaar: "987654321012",
      status: ApplicationStatus.APPROVED,
      submissionDate: "2026-06-15",
      lastUpdated: "2026-06-16",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 0,
      remarks: "BPL family census record matched. Active Antyodaya checklist validated."
    },
    {
      id: "CERT-50720",
      type: CertificateType.NOC,
      citizenName: "Sanjay Kumar",
      citizenAadhaar: "112233445566",
      status: ApplicationStatus.PENDING,
      submissionDate: "2026-06-18",
      lastUpdated: "2026-06-18",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 14,
      remarks: "NOC requested for rural mini-grid solar pipeline setup."
    },
    {
      id: "CERT-60821",
      type: CertificateType.RESIDENTIAL,
      citizenName: "Asha Kanwar",
      citizenAadhaar: "445566778899",
      status: ApplicationStatus.APPROVED,
      submissionDate: "2026-06-13",
      lastUpdated: "2026-06-14",
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 0,
      remarks: "Residential proof eSync with Jan Aadhaar database verified."
    }
  ]);

  const [complaints, setComplaints] = useState<GrievanceComplaint[]>([
    {
      id: "GRIEV-8912",
      category: GrievanceCategory.WATER,
      description: "Ward 4 solar borewell water pipe cracked and leaking constantly, blocking water flow.",
      citizenName: "Sohan Lal Dev",
      phone: "9414022831",
      latitude: 26.8130,
      longitude: 75.8015,
      status: GrievanceStatus.ASSIGNED,
      submissionDate: "2026-06-12",
      lastUpdated: "2026-06-13",
      wardId: 4,
      officerAssigned: "Shri Mahendra Singh (Ward 4 Member)",
      escalationLevel: EscalationLevel.PANCHAYAT,
      slaDaysRemaining: 2
    },
    {
      id: "GRIEV-4091",
      category: GrievanceCategory.ELECTRICITY,
      description: "High-voltage electricity lines sparkling and power cutting off in Sanganer Ward 1 lane completely.",
      citizenName: "Kamla Devi",
      phone: "9829011452",
      latitude: 26.8122,
      longitude: 75.8034,
      status: GrievanceStatus.RESOLVED,
      submissionDate: "2026-06-08",
      lastUpdated: "2026-06-11",
      wardId: 1,
      officerAssigned: "Vidhyut Department Lineman Sanganer",
      resolutionText: "Transformer ceramic insulators replaced and cable lines double-shielded. Inspected OK.",
      escalationLevel: EscalationLevel.PANCHAYAT,
      slaDaysRemaining: 0
    },
    {
      id: "GRIEV-2910",
      category: GrievanceCategory.ROAD,
      description: "Puddles and slippery mud blocks the primary school entrance gate road, making children slip.",
      citizenName: "Bhagchand Lal",
      phone: "9166044738",
      latitude: 26.8142,
      longitude: 75.8011,
      status: GrievanceStatus.SUBMITTED,
      submissionDate: "2026-06-15",
      lastUpdated: "2026-06-15",
      wardId: 3,
      officerAssigned: "Sanganer Panchayat Engineering Team",
      escalationLevel: EscalationLevel.PANCHAYAT,
      slaDaysRemaining: 5
    }
  ]);

  const [assets, setAssets] = useState<PanchayatAsset[]>([
    {
      id: "ASSET-8012",
      name: "Ward 3 solar borewell drinking well pump",
      type: "WELL",
      lat: 26.8140,
      lon: 75.8012,
      status: "FUNCTIONAL",
      wardId: 3,
      lastChecked: "2026-06-10",
      verifiedBy: "Sarpanch Sanganer"
    },
    {
      id: "ASSET-1029",
      name: "Sanganer Primary Health Centre building structure",
      type: "HEALTH_CENTRE",
      lat: 26.8152,
      lon: 75.8040,
      status: "FUNCTIONAL",
      wardId: 6,
      lastChecked: "2026-06-12",
      verifiedBy: "Medical Board Sanganer"
    },
    {
      id: "ASSET-4811",
      name: "Ward 1 main sewage drainage outlet paving",
      type: "TOILET",
      lat: 26.8125,
      lon: 75.8020,
      status: "NEEDS_REPAIR",
      wardId: 1,
      lastChecked: "2026-06-16",
      verifiedBy: "Sachiv Kavita Sharma"
    }
  ]);

  const [workers, setWorkers] = useState<NREGAMusterWorker[]>([
    {
      id: "W-1",
      name: "Ramesh Gurjar",
      jobCardId: "RJ-04-10029",
      attendanceDate: "2026-06-17",
      checkInTime: "08:15 AM",
      status: "PRESENT",
      selfieUrl: "verified-face.png",
      lat: 26.8128,
      lon: 75.8011
    },
    {
      id: "W-2",
      name: "Smt. Champa Bai",
      jobCardId: "RJ-04-10034",
      attendanceDate: "2026-06-17",
      status: "ABSENT"
    },
    {
      id: "W-3",
      name: "Sohan Singh Gurjar",
      jobCardId: "RJ-04-10036",
      attendanceDate: "2026-06-17",
      checkInTime: "08:30 AM",
      status: "PRESENT",
      selfieUrl: "verified-face.png",
      lat: 26.8129,
      lon: 75.8012
    },
    {
      id: "W-4",
      name: "Meera Devi Meena",
      jobCardId: "RJ-04-10041",
      attendanceDate: "2026-06-17",
      status: "ABSENT"
    }
  ]);

  const [meetings, setMeetings] = useState<any[]>([
    {
      id: "GS-902",
      title: "Monsoon Drinking Water Preparedness Session",
      date: "2026-06-13",
      time: "11:00 AM",
      venue: "Gram Panchayat Sanganer Bhawan Sabha Hall",
      status: "COMPLETED",
      attendanceCount: 18,
      agenda: "Reviewing solar borewells leaks, pipeline repairs in drought-vulnerable Hamlets, and allocation of clean water funds under 15th FC grants.",
      attendees: ["Sarpanch Sanganer", "Sachiv Kavita Sharma", "6 Ward members"]
    },
    {
      id: "GS-903",
      title: "Welfare Schemes & MNREGA Muster Verification Sabha",
      date: "2026-06-25",
      time: "11:00 AM",
      venue: "Sanganer Secondary School Ground Hall",
      status: "SCHEDULED",
      attendanceCount: 0,
      agenda: "Direct physical audit of worker job cards, verifying age of pension applicants, and planning road leveling work.",
      attendees: ["Sarpanch Sanganer", "Sachiv", "7 Ward members", "Block Officer BDO representative"]
    }
  ]);

  const [fundAllocations, setFundAllocations] = useState<FundAllocation[]>([
    {
      id: "FUND-01",
      type: "WATER_SANITATION",
      title: "Drinking water solar pump installations & upkeep",
      description: "Installation of borewell sets, piping linkages to remote households in Ward 4 & 5.",
      allocatedAmount: 1200000,
      spentAmount: 950000,
      financialYear: "2025-26"
    },
    {
      id: "FUND-02",
      type: "INFRASTRUCTURE",
      title: "Concrete pathway and brick lanes laying",
      description: "Paving dusty loose pathways near schools to ensure safe walkability for elderly and kids.",
      allocatedAmount: 1400000,
      spentAmount: 1150000,
      financialYear: "2025-26"
    },
    {
      id: "FUND-03",
      type: "WELFARE",
      title: "Old-age Social Security Pensions disbursement",
      description: "Allocating monthly budget credits of ₹1000 to qualified elderly residents directly.",
      allocatedAmount: 800000,
      spentAmount: 800000,
      financialYear: "2025-26"
    }
  ]);

  // Queue item in localized states
  const handleQueueSyncItem = (type: any, data: any) => {
    const newItem: SyncQueueItem = {
      id: "SYNC-" + Date.now(),
      type,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setSyncQueue(prev => [...prev, newItem]);
    
    // Auto offline logs warning
    setSyncToast(language === AppLanguage.HI 
      ? `📴 इंटरनेट बाधित! आपका डेटा ग्राम पंचायत के ऑफ़लाइन डेटाबेस (लोकल सिंक कतार) में सुरक्षित संग्रहीत है।`
      : `📴 Offline Outbox Caching: Document transaction successfully queued locally until internet triggers sync.`
    );
  };

  // Sync Outbox packets instantly
  const handleTriggerSync = () => {
    if (syncQueue.length === 0) return;
    setIsOnline(true);
    setSyncToast(language === AppLanguage.HI 
      ? "📶 सभी ऑफ़लाइन पैकेट सर्वर पर सफलतापूर्वक स्थानांतरित हो रहे हैं..." 
      : "📶 Synchronizing local buffers with central NIC & eGramSwaraj portals..."
    );

    setTimeout(() => {
      // Clear offline visual markers
      setApplications(prev => prev.map(a => {
        if (a.remarks?.includes("WAITING FOR NETWORK SYNC")) {
          return { ...a, remarks: "Synchronized with central NIC servers successfully." };
        }
        return a;
      }));

      setComplaints(prev => prev.map(c => {
        if (c.description?.includes("[SAVED OFFLINE]")) {
          return { ...c, description: c.description.replace("[SAVED OFFLINE] ", ""), officerAssigned: "Mahendra Singh (Ward 4 Member)" };
        }
        return c;
      }));

      setSyncQueue([]);
      setSyncToast(language === AppLanguage.HI 
        ? "✓ सभी वॉयस फ़ाइलें, मस्टर उपस्थितियां एवं जिय-टैग विवरण सिंक हो गए हैं!" 
        : "✓ e-Services synced successfully! Real-time state ledger populated."
      );
    }, 2500);
  };

  // Auto clear toast notifications
  useEffect(() => {
    if (syncToast) {
      const timer = setTimeout(() => setSyncToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [syncToast]);

  const handleLoginSuccess = (userProfile: { id: string; name: string; role: UserRole; designation?: string }) => {
    setCurrentUser(userProfile);
    setRole(userProfile.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className={`min-h-screen bg-rajasthani-pattern text-slate-800 flex flex-col font-sans transition-colors duration-300 ${darkMode ? "dark-mode-active bg-amber-950/20" : ""}`}>
      
      {isLandingActive ? (
        <LandingPage
          language={language}
          setLanguage={setLanguage}
          currentUser={currentUser}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          applications={applications}
          complaints={complaints}
          onReturnToDashboard={() => setIsLandingActive(false)}
          onEnterPortal={(directRole) => {
            setIsLandingActive(false);
            if (directRole === UserRole.CITIZEN) {
              handleLoginSuccess({ id: "citizen", name: "Ramesh Gurjar", role: UserRole.CITIZEN });
            }
          }}
        />
      ) : currentUser === null ? (
        <Login
          language={language}
          setLanguage={setLanguage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLoginSuccess={handleLoginSuccess}
          setIsLandingActive={setIsLandingActive}
        />
      ) : (
        <div className="min-h-screen pb-12 flex flex-col w-full">
          {/* Dynamic Header Component */}
          <Header
            role={role}
            currentUser={currentUser}
            language={language}
            setLanguage={setLanguage}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            syncQueueLength={syncQueue.length}
            onSync={handleTriggerSync}
            onLogout={handleLogout}
            setIsLandingActive={setIsLandingActive}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isReadAloudActive={isReadAloudActive}
            toggleReadAloud={toggleReadAloud}
          />

          {/* Sync State Toast Indicator Banner */}
          {syncToast && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full animate-fadeIn">
              <div className="bg-slate-900 border-l-4 border-orange-500 text-white p-3.5 rounded-r-xl shadow-lg flex items-start space-x-3 text-xs leading-relaxed">
                <Sparkles className="h-4.5 w-4.5 text-orange-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-400">{language === AppLanguage.HI ? "सिस्टम अधिसूचना:" : "Panchayat System Notification:"}</p>
                  <p className="mt-0.5">{syncToast}</p>
                </div>
                <button onClick={() => setSyncToast(null)} className="text-slate-400 hover:text-white font-bold ml-2">×</button>
              </div>
            </div>
          )}

          {/* CHOOSE APPROPRIATE DASHBOARD ACCORDING TO SESSION */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full flex-1">
            {role === UserRole.CITIZEN && (
              <CitizenDashboard
                user={currentUser}
                language={language}
                isOnline={isOnline}
                applications={applications}
                setApplications={setApplications}
                complaints={complaints}
                setComplaints={setComplaints}
                fundAllocations={fundAllocations}
                onQueueSync={handleQueueSyncItem}
                voiceContext={voiceContext}
                setVoiceContext={setVoiceContext}
                onLogout={handleLogout}
                syncQueueLength={syncQueue.length}
              />
            )}

            {role === UserRole.OFFICIAL && (
              <OfficialDashboard
                user={currentUser}
                language={language}
                isOnline={isOnline}
                applications={applications}
                setApplications={setApplications}
                complaints={complaints}
                setComplaints={setComplaints}
                assets={assets}
                setAssets={setAssets}
                workers={workers}
                setWorkers={setWorkers}
                meetings={meetings}
                setMeetings={setMeetings}
                fundAllocations={fundAllocations}
                onQueueSync={handleQueueSyncItem}
                onLogout={handleLogout}
              />
            )}

            {role === UserRole.ADMIN && (
              <AdminDashboard
                user={currentUser}
                language={language}
                isOnline={isOnline}
                applications={applications}
                setApplications={setApplications}
                complaints={complaints}
                setComplaints={setComplaints}
                assets={assets}
                setAssets={setAssets}
                workers={workers}
                setWorkers={setWorkers}
                fundAllocations={fundAllocations}
                setFundAllocations={setFundAllocations}
                onQueueSync={handleQueueSyncItem}
                onLogout={handleLogout}
              />
            )}
          </div>

          {/* Floating simulated WhatsApp bot companion */}
          <WhatsAppBot
            language={language}
            isOnline={isOnline}
            applications={applications}
            complaints={complaints}
          />
        </div>
      )}

      {/* PERSISTENT FLOATING ACCESSIBILITY UTILITY PANEL */}
      <div className="fixed bottom-6 left-6 z-[120] accessibility-exclude">
        <div className="relative">
          {/* Main Floating Trigger Button */}
          <button
            onClick={() => setIsAccPanelOpen(!isAccPanelOpen)}
            className="w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-white cursor-pointer border border-orange-500 hover:border-orange-600 bg-orange-600"
            title={language === AppLanguage.HI ? "सुलभता केंद्र" : language === AppLanguage.MW ? "सुविधा द्वार" : "Preferences & Accessibility Help"}
          >
            {isReadAloudActive ? (
              <Volume2 className="h-5 w-5 animate-pulse" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>

          {/* Expanded Panel */}
          {isAccPanelOpen && (
            <div className="absolute bottom-16 left-0 w-64 bg-white/95 rounded-2xl p-4 shadow-2xl border border-slate-200/90 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-orange-600 animate-pulse" />
                  {language === AppLanguage.HI ? "सुलभता सहायक" : language === AppLanguage.MW ? "आपणी सुविधा" : "Accessibility Advisor"}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100/80 text-orange-850">
                  v2.0
                </span>
              </div>

              {/* 1. Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  {language === AppLanguage.HI ? "रात्रि मोड (Dark)" : language === AppLanguage.MW ? "अंधारो मोड (Dark)" : "Dark Mode Theme"}
                </span>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    darkMode ? "bg-orange-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {darkMode ? (
                      <Moon className="h-3 w-3 text-orange-700" />
                    ) : (
                      <Sun className="h-3 w-3 text-amber-500" />
                    )}
                  </span>
                </button>
              </div>

              {/* 2. Read Aloud Interceptor Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-600">
                    {language === AppLanguage.HI ? "रीड अलाउड (बोलें)" : language === AppLanguage.MW ? "सुणवा री सुविधा" : "Click-to-Read Aloud"}
                  </span>
                  <span className="text-[8px] text-slate-400">
                    {language === AppLanguage.HI ? "किसी भी पाठ पर क्लिक करें" : language === AppLanguage.MW ? "माथै क्लिक करो" : "Click any text to hear"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleReadAloud}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isReadAloudActive ? "bg-orange-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      isReadAloudActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {isReadAloudActive ? (
                      <Volume2 className="h-3 w-3 text-orange-700 animate-pulse" />
                    ) : (
                      <VolumeX className="h-3 w-3 text-slate-400" />
                    )}
                  </span>
                </button>
              </div>

              {/* 3. Speaking Test Announcement Button */}
              {isReadAloudActive && (
                <button
                  type="button"
                  onClick={() => {
                    const pageHeading = document.querySelector("h1")?.innerText || "Gram Panchayat Connect Portal";
                    speakText(pageHeading + ". " + (language === AppLanguage.HI ? "पोर्टल सुचारू रूप से कार्य कर रहा है।" : "Accessibility service online. Click anything to read."));
                  }}
                  className="w-full text-center py-1.5 px-2 bg-slate-50 text-[10px] font-extrabold border border-slate-250 rounded-lg hover:bg-slate-100 transition flex items-center justify-center space-x-1.5 cursor-pointer text-orange-650"
                >
                  <Volume2 className="h-3.5 w-3.5 animate-bounce" />
                  <span>{language === AppLanguage.HI ? "परीक्षण आवाज सुनें" : language === AppLanguage.MW ? "जांच आवाज सुणो" : "Test Voice Output"}</span>
                </button>
              )}

              {/* Helpful Guide Tip */}
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/40 text-[9px] text-slate-500 leading-normal flex items-start space-x-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {language === AppLanguage.HI
                    ? "स्मार्ट सुलभता साधन: हमारी भाषिणी आवाज तकनीक से आप राजस्थान पंचायत पोर्टल के किसी भी भाग पर क्लिक करके उसे सुन सकते हैं!"
                    : language === AppLanguage.MW
                    ? "आपणी बोली तकनीक सूं थे आपण राजस्थान पोर्टल रा सारा लिख्योड़ा भाग सुण सको सा!"
                    : "Accessible Reader: Simply click on any card, description, label, or header to read it out loud using standard synthesizers."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
