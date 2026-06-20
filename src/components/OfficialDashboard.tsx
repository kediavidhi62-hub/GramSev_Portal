import React, { useState } from "react";
import { UserRole, AppLanguage, CertificateApplication, GrievanceComplaint, PanchayatAsset, NREGAMusterWorker, FundAllocation } from "../types";
import { TRANSLATIONS } from "../translations";
import Certificates from "./Certificates";
import Grievances from "./Grievances";
import GeoTagging from "./GeoTagging";
import GramSabha from "./GramSabha";
import Transparency from "./Transparency";
import AnalyticsDashboard from "./AnalyticsDashboard";

import { 
  FileText, 
  Hammer, 
  Map, 
  Calendar, 
  Coins, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  CheckSquare, 
  Users, 
  Clock, 
  AlertTriangle,
  Activity
} from "lucide-react";

export const OFFICIAL_TRANSLATIONS = {
  [AppLanguage.EN]: {
    secTitle: "OFFICIAL COMMAND STATION - GRAM SACHIV",
    secAuth: "SECRETARIAT AUTHENTICATED",
    pendingAppsLabel: "Pending Seal Applications",
    unassignedGrievances: "Unassigned Grievances",
    mnregaMusterLabel: "MNREGA Muster Today",
    complianceStatusLabel: "Compliance Status",
    egpdpStable: "e-GPDP STABLE",
    documents: "Documents",
    complaints: "Complaint Cases",
    present: "Present",
    officialWorkspaces: "Official Workspaces",
    taskBoardSummary: "Task Board Summary",
    analyticsDashboard: "Analytics Dashboard",
    digitalDocumentDesk: "Digital Document Desk",
    grievanceDesk: "Grievance Desk",
    mnregaAssetAudit: "MNREGA & Asset Audit",
    gramsabhaModerator: "Sabha Moderator (AI)",
    budgetLedgers: "Budget Ledgers",
    secPriorityChecklist: "Official Priority Checklist",
    pendingApproval: "PENDING APPROVAL",
    aadhaarDocumentSealQueue: "Aadhaar Document Seal Queue",
    thereArePendingAadhaar: "There are {count} citizen certificates awaiting certification approval.",
    processDocumentDrawer: "Process Document Drawer",
    coordinationAlert: "COORDINATION ALERT",
    activeWardInfra: "Active Ward Infrastructure Work",
    weHaveUnresolvedGrievances: "We have {count} unresolved grievances. Ward solar pump and electrical Insulators cases require immediate engineer allocation.",
    assignFieldOperators: "Assign Field Operators",
    mnregaMusterQuickVerification: "MNREGA Muster Quick Verification",
    attendanceDate: "Attendance Date: June 17, 2026",
    checkIn: "CHECK-IN",
    absent: "ABSENT",
    aiVoiceSyncReady: "AI VOICE SYNC READY",
    verifySabhaTapeTranscription: "Verify Sabha Tape Transcription",
    sanganerVillageRecordsInfo: "Sanganer village assembly records can be structured using the SabhaSaar verbal minutes compilation desk. Convert local tapes into official resolutions instantly.",
    launchRecordingDesk: "Launch Recording Desk",
  },
  [AppLanguage.HI]: {
    secTitle: "प्रशासनिक कमांड स्टेशन: ग्राम सचिव",
    secAuth: "सचिवालय प्रमाणित",
    pendingAppsLabel: "लंबित सील आवेदन",
    unassignedGrievances: "अनसुलझी शिकायत मामले",
    mnregaMusterLabel: "मनरेगा मस्टर रोल आज",
    complianceStatusLabel: "अनुपालन स्थिति",
    egpdpStable: "ई-जीपीडीपी सुचारू रूप से सक्रिय",
    documents: "दस्तावेज़",
    complaints: "शिकायत मामले",
    present: "उपस्थित",
    officialWorkspaces: "आधिकारिक कार्यक्षेत्र",
    taskBoardSummary: "कार्य बोर्ड सारांश",
    analyticsDashboard: "विश्लेषण डैशबोर्ड",
    digitalDocumentDesk: "डिजिटल दस्तावेज़ डेस्क",
    grievanceDesk: "शिकायत निवारण डेस्क",
    mnregaAssetAudit: "मनरेगा एवं संपत्ति ऑडिट",
    gramsabhaModerator: "ग्राम सभा संचालक (AI)",
    budgetLedgers: "बजट बही-खाता",
    secPriorityChecklist: "सचिव एवं सरपंच प्राथमिकता सूची",
    pendingApproval: "स्वीकृति लंबित",
    aadhaarDocumentSealQueue: "आधार दस्तावेज़ सील कतार",
    thereArePendingAadhaar: "आपके पास ई-स्वराज सत्यापित डिजिटल हस्ताक्षर और मुहर अनुमोदन के लिए {count} नागरिक प्रमाणपत्र लंबित हैं।",
    processDocumentDrawer: "दस्तावेज़ दराज व्यवस्थित करें",
    coordinationAlert: "समन्वय चेतावनी",
    activeWardInfra: "सक्रिय वार्ड बुनियादी ढांचा कार्य",
    weHaveUnresolvedGrievances: "हमारे पास {count} अनसुलझी शिकायतें हैं। वार्ड सौर पंप और विद्युत प्रणालियों के मामलों में तत्काल आवंटन की आवश्यकता है।",
    assignFieldOperators: "क्षेत्रीय संचालक नियुक्त करें",
    mnregaMusterQuickVerification: "मनरेगा मस्टर त्वरित सत्यापन",
    attendanceDate: "उपस्थिति तिथि: 17 जून, 2026",
    checkIn: "चेक-इन",
    absent: "अनुपस्थित",
    aiVoiceSyncReady: "AI वॉयस सिंक तैयार",
    verifySabhaTapeTranscription: "ग्राम सभा रिकॉर्डिंग प्रतिलेखन सत्यापित करें",
    sanganerVillageRecordsInfo: "सभासार वर्बल मिनट्स संकलन डेस्क का उपयोग करके ग्राम सभा की कार्यवाही को व्यवस्थित करें। रिकॉर्डिंग्स को तुरंत सरकारी प्रस्तावों में बदलें।",
    launchRecordingDesk: "रिकॉर्डिंग डेस्क शुरू करें",
  },
  [AppLanguage.MW]: {
    secTitle: "प्रशासनिक कमांड स्टेशन: ग्राम सचिव सा",
    secAuth: "सचिवालय द्वारा प्रमाणित सा",
    pendingAppsLabel: "सील-ठप्पा बाकी आवेदन सा",
    unassignedGrievances: "बच्योड़ी गांवा री शिकायतां",
    mnregaMusterLabel: "मनरेगा हाजिरी रोल आज",
    complianceStatusLabel: "सरकारी अनुपालन स्थिति",
    egpdpStable: "ई-जीपीडीपी एकदम ठीक है सा",
    documents: "प्रमाण पत्र सा",
    complaints: "शिकायत रा मामला",
    present: "हाजिर है सा",
    officialWorkspaces: "सरकारी काम रो ब्यौरो सा",
    taskBoardSummary: "मुख्य काम रो बोर्ड",
    analyticsDashboard: "कार्य विश्लेषण (डैशबोर्ड)",
    digitalDocumentDesk: "दस्तावेज मंजूरी डेस्क",
    grievanceDesk: "शिकायत निवारण डेस्क",
    mnregaAssetAudit: "मनरेगा अर संपत जांच",
    gramsabhaModerator: "ग्राम सभा संचालक (AI)",
    budgetLedgers: "तिजोरी रो बही-खातो",
    secPriorityChecklist: "सरपंच अर सचिव सा री मुख्य कार्य सूची",
    pendingApproval: "मंजूरी बाकी है सा",
    aadhaarDocumentSealQueue: "दस्तावेज सील-ठप्पा कतार",
    thereArePendingAadhaar: "नागरिकां रा कुल {count} प्रमाणपत्र थारी ई-स्वराज डिजिटल दसकत अर मुहर सारू बाकी पड्या है सा।",
    processDocumentDrawer: "कागजात मंजूर करो सा",
    coordinationAlert: "विकास काम री चेतावणी सा",
    activeWardInfra: "वार्ड रा विकास काम सा",
    weHaveUnresolvedGrievances: "कुल {count} शिकायतां अनसुलझी पड़ी है सा। वार्ड सोलर पंप अर बिजली काम सारू इंजीनियर भेजण री जरूरत है सा।",
    assignFieldOperators: "मजदूर नक्की करो सा",
    mnregaMusterQuickVerification: "मनरेगा मस्टर रोल री झटपट जांच",
    attendanceDate: "हाजिरी री तारीख: १७ जून, २०२६",
    checkIn: "हाजिर है (चेक-इन)",
    absent: "अनुपस्थित",
    aiVoiceSyncReady: "AI बोली सिंक तैयार है सा",
    verifySabhaTapeTranscription: "सभा री रिकॉर्डिंग री जांच करो सा",
    sanganerVillageRecordsInfo: "सभासार बोली अनुवाद डेस्क सूं ग्राम सभा रो ब्यौरो नक्की कर सको सा। टेप री रिकॉर्डिंग ने झटपट सरकारी प्रस्तावों में बदलो सा।",
    launchRecordingDesk: "बोलण वाळो डेस्क चालू करो सा",
  },
};

interface OfficialDashboardProps {
  user: { id: string; name: string; role: UserRole; designation?: string };
  language: AppLanguage;
  isOnline: boolean;
  applications: CertificateApplication[];
  setApplications: React.Dispatch<React.SetStateAction<CertificateApplication[]>>;
  complaints: GrievanceComplaint[];
  setComplaints: React.Dispatch<React.SetStateAction<GrievanceComplaint[]>>;
  assets: PanchayatAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PanchayatAsset[]>>;
  workers: NREGAMusterWorker[];
  setWorkers: React.Dispatch<React.SetStateAction<NREGAMusterWorker[]>>;
  meetings: any[];
  setMeetings: React.Dispatch<React.SetStateAction<any[]>>;
  fundAllocations: FundAllocation[];
  onQueueSync: (type: any, data: any) => void;
  onLogout: () => void;
}

export default function OfficialDashboard({
  user,
  language,
  isOnline,
  applications,
  setApplications,
  complaints,
  setComplaints,
  assets,
  setAssets,
  workers,
  setWorkers,
  meetings,
  setMeetings,
  fundAllocations,
  onQueueSync,
  onLogout
}: OfficialDashboardProps) {
  const t = TRANSLATIONS[language];
  const st = OFFICIAL_TRANSLATIONS[language];
  const [tab, setTab] = useState<string>("overview");

  // Filter metrics
  const pendingApps = applications.filter(a => a.status === "PENDING");
  const openComplaints = complaints.filter(c => c.status !== "RESOLVED");
  const activeWorkers = workers.filter(w => w.status === "PRESENT");

  return (
    <div className="space-y-6">
      
      {/* Official Dashboard Header Banner */}
      <div className="bg-white border text-slate-800 border-slate-200 border-l-4 border-orange-500 p-6 rounded-r-2xl shadow-sm space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start space-x-3">
            <div className="bg-orange-50 text-orange-700 p-2 text-center rounded-xl border border-orange-100">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-md font-extrabold text-orange-650 uppercase tracking-wider font-mono">
                {st.secTitle}
              </h2>
              <h3 className="text-lg font-bold text-slate-900 font-sans mt-0.5">
                {user.name} <span className="text-xs text-slate-500 font-mono">({user.designation || "Gram Sachiv"})</span>
              </h3>
            </div>
          </div>
          
          <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-center">
            <span className="text-[10px] text-orange-755 font-bold font-mono px-3 py-1.5 uppercase bg-white rounded-lg shadow-2xs border border-orange-200/50">
              {st.secAuth}
            </span>
            <button
              onClick={onLogout}
              className="hover:bg-slate-200/60 text-slate-700 text-xs font-bold font-sans py-1.5 px-3 rounded-lg transition flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Dynamic Micro Ratios widget bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[9px] text-slate-450 block uppercase font-mono font-bold">{st.pendingAppsLabel}</span>
            <strong className="text-md font-bold font-sans text-orange-600">
              {pendingApps.length} {st.documents}
            </strong>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[9px] text-slate-450 block uppercase font-mono font-bold">{st.unassignedGrievances}</span>
            <strong className="text-md font-bold font-sans text-orange-600">
              {openComplaints.length} {st.complaints}
            </strong>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[9px] text-slate-450 block uppercase font-mono font-bold">{st.mnregaMusterLabel}</span>
            <strong className="text-md font-bold font-sans text-orange-600">
              {activeWorkers.length}/{workers.length} {st.present}
            </strong>
          </div>
          <div className="p-3 bg-orange-50/35 rounded-xl border border-orange-200/50 text-orange-800">
            <span className="text-[9px] text-orange-400 block uppercase font-mono font-bold">{st.complianceStatusLabel}</span>
            <strong className="text-xs font-extrabold uppercase font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span>
              {st.egpdpStable}
            </strong>
          </div>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="col-span-1 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-1">
          <span className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase px-3.5 mb-2 font-mono">
            {st.officialWorkspaces}
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
            <CheckSquare className={`h-4.5 w-4.5 ${tab === "overview" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{st.taskBoardSummary}</span>
          </button>

          {/* Panchayat Dashboard -> Analytics */}
          <button
            onClick={() => setTab("analytics")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "analytics"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Activity className={`h-4.5 w-4.5 ${tab === "analytics" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{st.analyticsDashboard}</span>
          </button>

          {/* Certificates approval */}
          <button
            onClick={() => setTab("certificates")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "certificates"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className={`h-4.5 w-4.5 ${tab === "certificates" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{st.digitalDocumentDesk}</span>
          </button>

          {/* Grievance Desk */}
          <button
            onClick={() => setTab("grievances")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "grievances"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Hammer className={`h-4.5 w-4.5 ${tab === "grievances" ? "text-orange-600" : "text-slate-400"}`} />
            <span className="flex-1">{st.grievanceDesk}</span>
            {openComplaints.length > 0 && (
              <span className="bg-rose-600 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center animate-pulse min-w-[18px] px-1">
                {openComplaints.length}
              </span>
            )}
          </button>

          {/* MNREGA assets geotag */}
          <button
            onClick={() => setTab("geotagging")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "geotagging"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Map className={`h-4.5 w-4.5 ${tab === "geotagging" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{st.mnregaAssetAudit}</span>
          </button>

          {/* Gram Sabha minutes processor */}
          <button
            onClick={() => setTab("gramsabha")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "gramsabha"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar className={`h-4.5 w-4.5 ${tab === "gramsabha" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{st.gramsabhaModerator}</span>
          </button>

          {/* Public Treasury ledger */}
          <button
            onClick={() => setTab("transparency")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "transparency"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Coins className={`h-4.5 w-4.5 ${tab === "transparency" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{st.budgetLedgers}</span>
          </button>
        </nav>

        {/* Dynamic Inner Display */}
        <div className="col-span-1 lg:col-span-9">
          
          {tab === "analytics" && (
            <AnalyticsDashboard
              language={language}
              applications={applications}
              complaints={complaints}
            />
          )}

          {/* Official Task Board Summary */}
          {tab === "overview" && (
            <div className="space-y-6">
              
              {/* Highlight Action items for Gram Sachiv */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Sparkles className="h-4.5 w-4.5 text-orange-500" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    {st.secPriorityChecklist}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Certificates check */}
                  <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full uppercase border border-orange-150">
                        {st.pendingApproval}
                      </span>
                      <h4 className="font-bold text-slate-950 text-xs">{st.aadhaarDocumentSealQueue}</h4>
                      <p className="text-[11px] text-slate-505 leading-relaxed font-sans mt-1">
                        {st.thereArePendingAadhaar.replace("{count}", String(pendingApps.length))}
                      </p>
                    </div>
                    <button
                      onClick={() => setTab("certificates")}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] py-2 px-3 rounded-lg transition text-center mt-2 cursor-pointer uppercase tracking-wider"
                    >
                      {st.processDocumentDrawer}
                    </button>
                  </div>

                  {/* Grievance check */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full uppercase border border-rose-150">
                        {st.coordinationAlert}
                      </span>
                      <h4 className="font-bold text-slate-950 text-xs">{st.activeWardInfra}</h4>
                      <p className="text-[11px] text-slate-505 leading-relaxed font-sans mt-1">
                        {st.weHaveUnresolvedGrievances.replace("{count}", String(openComplaints.length))}
                      </p>
                    </div>
                    <button
                      onClick={() => setTab("grievances")}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] py-2 px-3 rounded-lg transition text-center mt-2 cursor-pointer uppercase tracking-wider"
                    >
                      {st.assignFieldOperators}
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance quick checker */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      {st.mnregaMusterQuickVerification}
                    </h3>
                  </div>
                  <span className="text-[9px] text-slate-450 font-mono font-bold">
                    {st.attendanceDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {workers.map((worker) => (
                    <div 
                      key={worker.id} 
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        worker.status === "PRESENT" 
                          ? "bg-emerald-50/40 border-emerald-150/80 text-slate-800"
                          : "bg-slate-50 border-slate-200/80 text-slate-450"
                      }`}
                    >
                      <div className="space-y-1">
                        <strong className="text-xs font-bold block leading-snug">{worker.name}</strong>
                        <span className="text-[8px] font-mono block uppercase">Card: {worker.jobCardId}</span>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[9px]">
                        <span>{worker.status === "PRESENT" ? st.checkIn : st.absent}</span>
                        <span className="font-bold">{worker.checkInTime || "--"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SabhaSaar Audio reminder */}
              <div className="bg-orange-50 text-slate-850 rounded-3xl p-5 border border-orange-200/80 flex items-center justify-between flex-wrap gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600 shrink-0" />
                    <span className="text-[9px] font-bold text-orange-700 uppercase font-mono tracking-wide">{st.aiVoiceSyncReady}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{st.verifySabhaTapeTranscription}</h4>
                  <p className="text-[10px] text-slate-600 max-w-lg leading-relaxed">
                    {st.sanganerVillageRecordsInfo}
                  </p>
                </div>
                <button
                  onClick={() => setTab("gramsabha")}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[10px] py-2 px-4 rounded-lg shrink-0 transition duration-150 cursor-pointer uppercase hover:scale-[1.01]"
                >
                  {st.launchRecordingDesk}
                </button>
              </div>

            </div>
          )}

          {tab === "certificates" && (
            <Certificates
              language={language}
              role={UserRole.OFFICIAL}
              isOnline={isOnline}
              applications={applications}
              setApplications={setApplications}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "grievances" && (
            <Grievances
              language={language}
              role={UserRole.OFFICIAL}
              isOnline={isOnline}
              complaints={complaints}
              setComplaints={setComplaints}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "geotagging" && (
            <GeoTagging
              language={language}
              role={UserRole.OFFICIAL}
              isOnline={isOnline}
              assets={assets}
              setAssets={setAssets}
              workers={workers}
              setWorkers={setWorkers}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "gramsabha" && (
            <GramSabha
              language={language}
              role={UserRole.OFFICIAL}
              isOnline={isOnline}
              meetings={meetings}
              setMeetings={setMeetings}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "transparency" && (
            <Transparency language={language} fundAllocations={fundAllocations} />
          )}

        </div>

      </div>

    </div>
  );
}
