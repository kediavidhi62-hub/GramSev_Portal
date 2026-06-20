import React from "react";
import { UserRole, AppLanguage } from "../types";
import { TRANSLATIONS } from "../translations";
import { Wifi, WifiOff, RefreshCw, Layers, Shield, Users, Landmark, Globe, Sun, Moon, Volume2, VolumeX } from "lucide-react";

interface HeaderProps {
  role: UserRole;
  currentUser: { id: string; name: string; role: UserRole; designation?: string } | null;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  syncQueueLength: number;
  onSync: () => void;
  onLogout: () => void;
  setIsLandingActive?: (val: boolean) => void;
  setActiveTab?: (val: string) => void;
  setActiveSubTab?: (val: string) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  isReadAloudActive?: boolean;
  toggleReadAloud?: () => void;
}

export default function Header({
  role,
  currentUser,
  language,
  setLanguage,
  isOnline,
  setIsOnline,
  syncQueueLength,
  onSync,
  onLogout,
  setIsLandingActive: propsSetIsLandingActive,
  setActiveTab: propsSetActiveTab,
  setActiveSubTab: propsSetActiveSubTab,
  darkMode = false,
  setDarkMode,
  isReadAloudActive = false,
  toggleReadAloud
}: HeaderProps) {
  const t = TRANSLATIONS[language];

  const setIsLandingActive = (val: boolean) => {
    if (typeof propsSetIsLandingActive === "function") propsSetIsLandingActive(val);
  };
  const setActiveTab = (val: string) => {
    if (typeof propsSetActiveTab === "function") propsSetActiveTab(val);
  };
  const setActiveSubTab = (val: string) => {
    if (typeof propsSetActiveSubTab === "function") propsSetActiveSubTab(val);
  };

  return (
    <header className="bg-white text-slate-800 shadow-xs border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
          
          {/* Left Block: Original Rajasthan Map with inside website name */}
          <div 
            onClick={() => {
              setIsLandingActive(true);
              setActiveTab("home");
              setActiveSubTab("home");
            }}
            className="flex items-center space-x-1.5 cursor-pointer group select-none shrink-0"
            title="Gram Panchayat Connect - Rajasthan Portal"
          >
            <div className="relative h-18 w-20 flex items-center justify-center p-1 overflow-visible">
              <svg 
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,163,115,0.25)] group-hover:scale-[1.02] transition-transform duration-300" 
                viewBox="0 0 210 170" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Saffron & Sandstone gradient inspired by the Thar Desert and Rajasthani palaces */}
                  <linearGradient id="rajasthan-gradient" x1="18" y1="18" x2="196" y2="166" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFDFC" />
                    <stop offset="35%" stopColor="#FFF8ED" />
                    <stop offset="70%" stopColor="#FAF1E3" />
                    <stop offset="100%" stopColor="#F5E4C9" />
                  </linearGradient>
                  
                  {/* Subtle royal pattern fill */}
                  <pattern id="heritage-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="6" cy="6" r="1" fill="#D4A373" opacity="0.25" />
                  </pattern>
                </defs>

                {/* Main Geographic State Outline of Rajasthan */}
                <path 
                  d="M 105 10 C 111 9, 117 14, 122 11 Q 128 11, 131 18 C 135 22, 128 31, 134 36 C 138 39, 145 34, 150 39 Q 154 44, 146 51 C 151 56, 157 51, 163 56 C 168 59, 172 56, 182 61 C 186 65, 191 67, 196 73 Q 199 77, 189 83 C 186 86, 182 91, 177 90 C 173 94, 178 100, 180 105 C 184 109, 190 111, 189 118 C 187 122, 179 120, 174 122 C 171 126, 166 132, 163 137 C 159 142, 153 150, 149 145 C 145 140, 148 132, 144 128 C 142 124, 137 128, 133 125 C 128 129, 120 131, 116 136 C 112 141, 110 148, 107 156 C 104 161, 102 169, 97 166 C 93 164, 95 156, 93 151 C 89 146, 87 153, 83 150 C 79 145, 74 149, 70 154 C 66 158, 61 154, 59 149 C 58 144, 63 139, 59 134 C 55 130, 49 134, 45 129 C 41 124, 32 127, 27 121 C 23 117, 18 112, 18 107 C 21 102, 28 105, 30 99 C 32 94, 25 89, 23 84 C 19 79, 11 81, 9 76 C 6 71, 14 66, 18 61 C 21 56, 27 58, 32 53 C 36 48, 48 42, 43 38 C 47 34, 55 35, 60 30 C 64 25, 69 22, 76 22 C 81 22, 87 19, 91 14 Z"
                  fill="url(#rajasthan-gradient)" 
                  stroke="#C2410C" 
                  strokeWidth="2.5" 
                  strokeLinejoin="round"
                />

                {/* Traditional Heritage Micro-pattern Overlay Inside the Map */}
                <path 
                  d="M 105 10 C 111 9, 117 14, 122 11 Q 128 11, 131 18 C 135 22, 128 31, 134 36 C 138 39, 145 34, 150 39 Q 154 44, 146 51 C 151 56, 157 51, 163 56 C 168 59, 172 56, 182 61 C 186 65, 191 67, 196 73 Q 199 77, 189 83 C 186 86, 182 91, 177 90 C 173 94, 178 100, 180 105 C 184 109, 190 111, 189 118 C 187 122, 179 120, 174 122 C 171 126, 166 132, 163 137 C 159 142, 153 150, 149 145 C 145 140, 148 132, 144 128 C 142 124, 137 128, 133 125 C 128 129, 120 131, 116 136 C 112 141, 110 148, 107 156 C 104 161, 102 169, 97 166 C 93 164, 95 156, 93 151 C 89 146, 87 153, 83 150 C 79 145, 74 149, 70 154 C 66 158, 61 154, 59 149 C 58 144, 63 139, 59 134 C 55 130, 49 134, 45 129 C 41 124, 32 127, 27 121 C 23 117, 18 112, 18 107 C 21 102, 28 105, 30 99 C 32 94, 25 89, 23 84 C 19 79, 11 81, 9 76 C 6 71, 14 66, 18 61 C 21 56, 27 58, 32 53 C 36 48, 48 42, 43 38 C 47 34, 55 35, 60 30 C 64 25, 69 22, 76 22 C 81 22, 87 19, 91 14 Z"
                  fill="url(#heritage-dots)" 
                  pointerEvents="none"
                />

                {/* Smart Connected Hubs (Dots showing main districts linked) */}
                {/* Jodhpur (West/Center Hub) */}
                <circle cx="82" cy="85" r="4" fill="#1565C0" className="animate-pulse" />
                <circle cx="82" cy="85" r="1.5" fill="white" />
                
                {/* Jaipur (East Hub) */}
                <circle cx="148" cy="68" r="4" fill="#FF9933" />
                <circle cx="148" cy="68" r="1.5" fill="white" />

                {/* Sikar/Mandawa (Northeast Hub) */}
                <circle cx="132" cy="46" r="3" fill="#2E7D32" />
                
                {/* Connecting smart network lines representing e-governance paths */}
                <line x1="82" y1="85" x2="148" y2="68" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                <line x1="148" y1="68" x2="132" y2="46" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                <line x1="82" y1="85" x2="132" y2="46" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />

                {/* WEBSITE NAME EMBEDDED DIRECTLY INSIDE THE RAJASTHAN MAP BORDER */}
                <g className="select-none pointer-events-none">
                  {/* Hindi Main Label - Premium stylized typography */}
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
                    ग्राम पंचायत
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
                    कनेक्ट
                  </text>

                  {/* English sub-label with wide modern tracking */}
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
                  
                  {/* Official State Subtext */}
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

          {/* Network Simulator & Language Toggles */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Sync Queue Badge / Sync Action */}
            {syncQueueLength > 0 && (
              <button
                onClick={onSync}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition animate-pulse duration-1000 cursor-pointer shadow-sm"
                title="Click to manually push cached offline items"
              >
                <RefreshCw className="h-3 w-3 animate-spin duration-[3s]" />
                <span>
                  {t.syncQueue} ({syncQueueLength}) — SYNC NOW
                </span>
              </button>
            )}

            {/* Simulated Connectivity Switch */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                isOnline
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  : "bg-rose-550/10 border-rose-200 text-rose-600 hover:bg-rose-50 animate-pulse"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  <span>{t.onlineMode}</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span>{t.offlineMode}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setLanguage(AppLanguage.EN)}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
                  language === AppLanguage.EN
                    ? "text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                style={{ backgroundColor: language === AppLanguage.EN ? "#b33d26" : undefined }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage(AppLanguage.HI)}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold font-sans transition-all ${
                  language === AppLanguage.HI
                    ? "text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                style={{ backgroundColor: language === AppLanguage.HI ? "#b33d26" : undefined }}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage(AppLanguage.MW)}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold font-sans transition-all ${
                  language === AppLanguage.MW
                    ? "text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                style={{ backgroundColor: language === AppLanguage.MW ? "#b33d26" : undefined }}
              >
                मारवाड़ी
              </button>
            </div>

            {/* Quick Access Accessibility Controls inside header */}
            <div className="flex items-center gap-1.5 border-l border-slate-200/90 pl-3">
              {/* Dark Mode Icon Toggle */}
              <button
                onClick={() => setDarkMode && setDarkMode(!darkMode)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-orange-850/10 border-orange-200 text-orange-400 hover:bg-orange-800"
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

              {/* Read Aloud Icon Toggle */}
              <button
                onClick={() => toggleReadAloud && toggleReadAloud()}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isReadAloudActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                }`}
                title={language === AppLanguage.HI ? "रीड अलाउड चालू/बंद करें" : "Toggle Read Aloud Support"}
              >
                {isReadAloudActive ? (
                  <Volume2 className="h-4 w-4 animate-bounce" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Roles Navigator Sub-row */}
        <div className="border-t border-slate-150 py-3 flex flex-wrap justify-between items-center gap-3">
          <div className="text-xs text-slate-500 font-sans font-medium">
            <span>{t.tagline}</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {currentUser ? (
              <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span>
                <span className="text-slate-500 font-sans font-medium">Active:</span>
                <strong className="text-slate-800 font-bold font-sans">{currentUser.name}</strong>
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md uppercase ${
                  currentUser.role === UserRole.ADMIN 
                    ? "bg-rose-100 text-rose-800 border border-rose-200/55" 
                    : currentUser.role === UserRole.OFFICIAL 
                    ? "bg-orange-100 text-orange-850 border border-orange-200/55" 
                    : "bg-blue-105/90 text-blue-900 border border-blue-200/55 font-sans"
                }`}>
                  {currentUser.role === UserRole.ADMIN ? "District Admin" : currentUser.role === UserRole.OFFICIAL ? "Gram Sachiv" : "Citizen"}
                </span>
                
                <button
                  onClick={onLogout}
                  className="text-rose-600 hover:text-rose-700 font-bold ml-2 pl-2 border-l border-slate-200 uppercase text-[10px] tracking-wide cursor-pointer font-sans"
                >
                  {language === AppLanguage.MW ? "बाहर जावो" : language === AppLanguage.HI ? "लॉगआउट" : "Sign Out"}
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-450 uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 block animate-pulse"></span>
                <span>AUTHENTICATION PENDING</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
