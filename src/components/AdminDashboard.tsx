import React, { useState } from "react";
import { UserRole, AppLanguage, CertificateApplication, GrievanceComplaint, PanchayatAsset, NREGAMusterWorker, FundAllocation } from "../types";
import { TRANSLATIONS } from "../translations";
import Transparency from "./Transparency";
import GeoTagging from "./GeoTagging";
import Grievances from "./Grievances";
import Certificates from "./Certificates";
import AnalyticsDashboard from "./AnalyticsDashboard";

import { 
  Coins, 
  Map, 
  Hammer, 
  FileText, 
  LogOut, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Plus, 
  Bookmark, 
  Layers, 
  MapPin, 
  Wrench, 
  BellRing,
  Award,
  BookOpen
} from "lucide-react";

export const ADMIN_TRANSLATIONS = {
  [AppLanguage.EN]: {
    admTitle: "DISTRICT COLLECTOR / JAIPUR ZILA PARISHAD OVERSIGHT",
    admActive: "DISTRICT ADM PANEL ACTIVE",
    slaOverdue: "SLA Escalation (Overdue List)",
    payoutsTitle: "15th Finance Devoted Payouts",
    complianceBlockIndex: "Compliance Score (Block Index)",
    highPriorityEscalated: "High-Priority Complaint Tickets escalated",
    spentLakhsOf: "Lakhs spent of",
    allotmentsLakhs: "Lakhs allotments",
    blockRank: "#1 IN JAIPUR DISTRICT",
    districtControllerDir: "District Controller Directory",
    oversightCoreIndex: "Oversight Core Index",
    analyticsDashboard: "Analytics Dashboard",
    financesSimulator: "Finances & Simulator",
    panchayatGeoAssets: "Panchayat Geo-Assets",
    prioritySlaFaults: "Priority SLA Faults",
    allDocumentsTracker: "All Documents Tracker",
    disburserHeader: "District supplemental budget grants disburser",
    allotmentHead: "ALLOTMENT HEAD",
    allotmentHeadPlaceholder: "e.g. Ward 6 Primary School solar panels",
    financialYearCap: "FINANCIAL YEAR CAP",
    allotmentLabel: "Allotment",
    disburseActionBtn: "Disburse",
    waterSanitation: "Water & Sanitation",
    roadsInfrastructure: "Roads & Infrastructure",
    welfareSecurity: "Welfare & Security Pensions",
    verificationLogsHeader: "District Map Physical Audit verification logs",
    totalAssetsCountLabel: "Total: {count} Assets registered",
    complianceScorecardHeader: "Panchayati Raj Compliance Scorecard (Sanganer)",
    complianceIntegrationTitle: "Gram Sabha minutes online integration",
    complianceIntegrationDesc: "Sabha recordings correctly digitized under NIC server rules.",
    complianceTurnaroundTitle: "Average Document Verification turnaround",
    complianceTurnaroundDesc: "Local secretary responses fulfill district SLAs excellently.",
  },
  [AppLanguage.HI]: {
    admTitle: "जिला कलेक्टर / जयपुर जिला परिषद पर्यवेक्षण",
    admActive: "जिला प्रशासनिक नियंत्रण सक्रिय",
    slaOverdue: "SLA समय-सीमा उल्लंघन (अतिदेय सूची)",
    payoutsTitle: "15वीं वित्त आयोग आवंटित भुगतान",
    complianceBlockIndex: "अनुपालन स्कोर (पार्क/प्रखंड अनुक्रमणिका)",
    highPriorityEscalated: "अति-प्राथमिकता वाले शिकायत टिकट अग्रेषित",
    spentLakhsOf: "लाख खर्च हुए, कुल आवंटन:",
    allotmentsLakhs: "लाख में से",
    blockRank: "जयपुर जिले में प्रथम रैंक (नंबर #1)",
    districtControllerDir: "जिला नियंत्रक निर्देशिका",
    oversightCoreIndex: "पर्यवेक्षण मुख्य सूचकांक",
    analyticsDashboard: "विश्लेषण डैशबोर्ड",
    financesSimulator: "वित्त एवं बजट सिमुलेटर",
    panchayatGeoAssets: "पंचायत भू-संपत्ति रिकॉर्ड",
    prioritySlaFaults: "प्राथमिकता SLA उल्लंघन",
    allDocumentsTracker: "समग्र दस्तावेज़ ट्रैकर",
    disburserHeader: "जिला पूरक योजना बजट अनुदान संवितरक",
    allotmentHead: "आवंटन मद / शीर्षक",
    allotmentHeadPlaceholder: "जैसे: वार्ड 6 प्राथमिक विद्यालय सोलर पैनल",
    financialYearCap: "वित्तीय वर्ष मद सीमा",
    allotmentLabel: "आवंटन राशि (₹)",
    disburseActionBtn: "अनुदान वितरित करें",
    waterSanitation: "पेयजल एवं स्वच्छता",
    roadsInfrastructure: "सड़कें एवं बुनियादी ढांचा",
    welfareSecurity: "कल्याण एवं सुरक्षा पेंशन",
    verificationLogsHeader: "जिला मानचित्र भौतिक संपदा सत्यापन लॉग",
    totalAssetsCountLabel: "कुल पंजीकृत भौतिक संपदा: {count}",
    complianceScorecardHeader: "Panchayati Raj अनुपालन स्कोरकार्ड (सांगानेर)",
    complianceIntegrationTitle: "Gram Sabha वर्बल मिनट्स ऑनलाइन एकीकरण",
    complianceIntegrationDesc: "ग्राम सभा की सभी रिकॉर्डिंग एनआईसी नियमों के तहत सही ढंग से डिजिटल की गईं।",
    complianceTurnaroundTitle: "दस्तावेज़ सत्यापन का औसत समय",
    complianceTurnaroundDesc: "स्थानीय पंचायत सचिवों के प्रत्युत्तर जिला मानदंड समझौतों को उत्तम रूप से पूरा करते हैं।",
  },
  [AppLanguage.MW]: {
    admTitle: "जिल्ला कलक्टर सा अर जिल्ला परिषद जयपुर ओवरसाइट",
    admActive: "जिल्ला प्रशासनिक नियंत्रण चालू है सा",
    slaOverdue: "SLA बखत बारो उल्लंघन (बाकी शिकायतां)",
    payoutsTitle: "१५वां वित्त आयोग तिजोरी खर्च",
    complianceBlockIndex: "सरकारी नियम री पालण दर",
    highPriorityEscalated: "घणी जरूरी जन-शिकायतां जिल्ला माथै भेजी सा",
    spentLakhsOf: "लाख सरकारी खजाने सूं खरचिया, कुल ब्योरो:",
    allotmentsLakhs: "लाख री तिजोरी मां सूं",
    blockRank: "जयपुर जिल्ला मां प्रथम रैंक (नंबर #1) सा",
    districtControllerDir: "जिल्ला नियंत्रक बही-खातो",
    oversightCoreIndex: "पर्यवेक्षण मुख्य सूचिका सा",
    analyticsDashboard: "कार्य विश्लेषण (डैशबोर्ड)",
    financesSimulator: "खजाना अर बजट सिमुलेटर",
    panchayatGeoAssets: "पंचायत री संपदा री जांच",
    prioritySlaFaults: "अति-जरूरी जन-शिकायतां",
    allDocumentsTracker: "समग्र कागजात ट्रैकर सा",
    disburserHeader: "जिल्ला सुं पंचायत बजट अनुदान देवण वाळो सिमुलेटर",
    allotmentHead: "बजट रो नाम सा",
    allotmentHeadPlaceholder: "जैसे: वार्ड ६ प्राथमिक साला सोलर पंप",
    financialYearCap: "बजट रो मद सा",
    allotmentLabel: "आवंटन राशि (₹) सा",
    disburseActionBtn: "खजानो ट्रांसफर करो सा",
    waterSanitation: "पाणी अर साफ़-सफ़ाई सा",
    roadsInfrastructure: "मजबूत सड़क अर विकास काम सा",
    welfareSecurity: "बुढापा अर सुरक्षा पेंशन सा",
    verificationLogsHeader: "जिल्ला नक़्शे माथै गांव री संपत री जांच लॉग",
    totalAssetsCountLabel: "कुल जांची गई सरकारी संपत: {count} सा",
    complianceScorecardHeader: "पंचायती राज सरकारी नियम पालण ब्यौरो (सांगानेर)",
    complianceIntegrationTitle: "ग्राम सभा री रिकॉर्डिंग रो ऑनलाइन ब्यौरो",
    complianceIntegrationDesc: "सभा री सगळी रिकॉर्डिंग्स NIC सरकारी नियम रै अनुसार डिजिटाइज़ करी सा।",
    complianceTurnaroundTitle: "कागजात मंजूरी रो औसत बखत",
    complianceTurnaroundDesc: "सचिव सा रा प्रत्युत्तर जिल्ला स्तरीय मानकां ने उत्तम रूप सूं पूरा करै है सा।",
  },
};

interface AdminDashboardProps {
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
  fundAllocations: FundAllocation[];
  setFundAllocations: React.Dispatch<React.SetStateAction<FundAllocation[]>>;
  onQueueSync: (type: any, data: any) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
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
  fundAllocations,
  setFundAllocations,
  onQueueSync,
  onLogout
}: AdminDashboardProps) {
  const t = TRANSLATIONS[language];
  const sa = ADMIN_TRANSLATIONS[language];
  const [tab, setTab] = useState<string>("overview");
  
  // Custom interactive state for District budget simulator
  const [newAllocTitle, setNewAllocTitle] = useState("");
  const [newAllocAmount, setNewAllocAmount] = useState(500000);
  const [newAllocType, setNewAllocType] = useState("WATER_SANITATION");
  const [allocFeedback, setAllocFeedback] = useState<string | null>(null);

  // Stats calculators
  const totalBurnRate = fundAllocations.reduce((acc, f) => acc + f.spentAmount, 0);
  const totalAlloted = fundAllocations.reduce((acc, f) => acc + f.allocatedAmount, 0);
  const totalAssetsCount = assets.length;
  const healthClinicCount = assets.filter(a => a.type === "HEALTH_CENTRE").length;
  const criticalSlaOverdue = complaints.filter(c => c.slaDaysRemaining <= 1).length;

  const handleSimulateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllocTitle.trim()) return;

    const newAlloc: FundAllocation = {
      id: "FUND-0" + (fundAllocations.length + 1),
      scheme: "15th Finance Commission",
      type: newAllocType as any,
      title: newAllocTitle,
      description: "Zila Parishad fast-disbursed priority grants under 15th FC supplemental allocation.",
      allocatedAmount: newAllocAmount,
      spentAmount: 0,
      financialYear: "2025-26"
    };

    setFundAllocations(prev => [...prev, newAlloc]);
    setNewAllocTitle("");
    setAllocFeedback("✓ District discretionary funds transferred to Sanganer Village Swaraj Account!");
    
    setTimeout(() => {
      setAllocFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Zila Parishad Command Panel Head */}
      <div className="bg-white border text-slate-800 border-slate-200 border-l-4 border-rose-600 p-6 rounded-r-2xl shadow-sm space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start space-x-3">
            <div className="bg-rose-50 text-rose-700 p-2 text-center rounded-xl border border-rose-100">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-md font-extrabold text-rose-650 uppercase tracking-wider font-mono">
                {sa.admTitle}
              </h2>
              <h3 className="text-lg font-bold text-slate-900 font-sans mt-0.5">
                {user.name} <span className="text-xs text-slate-500 font-mono">({user.designation || "Jaipur DM"})</span>
              </h3>
            </div>
          </div>
          
          <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-center">
            <span className="text-[10px] text-rose-700 font-bold font-mono px-3 py-1.5 uppercase bg-white rounded-lg shadow-2xs border border-rose-100">
              {sa.admActive}
            </span>
            <button
              onClick={onLogout}
              className="hover:bg-slate-255 text-slate-700 text-xs font-bold font-sans py-1.5 px-3 rounded-lg transition flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Oversight performance index bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-150 text-slate-700">
            <span className="block text-[9px] text-slate-450 font-bold uppercase">{sa.slaOverdue}</span>
            <p className="text-rose-600 font-bold mt-1 text-md">
              {criticalSlaOverdue} {sa.highPriorityEscalated}
            </p>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-150 text-slate-700">
            <span className="block text-[9px] text-slate-450 font-bold uppercase">{sa.payoutsTitle}</span>
            <p className="text-emerald-700 font-bold mt-1 text-md">
              ₹{(totalBurnRate / 100000).toFixed(1)} {sa.spentLakhsOf} ₹{(totalAlloted / 100000).toFixed(1)} {sa.allotmentsLakhs}
            </p>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-150 text-slate-700">
            <span className="block text-[9px] text-slate-450 font-bold uppercase">{sa.complianceBlockIndex}</span>
            <p className="text-orange-600 font-bold mt-1 text-md">
              98.2% ({sa.blockRank})
            </p>
          </div>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="col-span-1 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-1">
          <span className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase px-3.5 mb-2 font-mono">
            {sa.districtControllerDir}
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
            <Layers className={`h-4.5 w-4.5 ${tab === "overview" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{sa.oversightCoreIndex}</span>
          </button>

          {/* Admin Dashboard -> Analytics */}
          <button
            onClick={() => setTab("analytics")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "analytics"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Activity className={`h-4.5 w-4.5 ${tab === "analytics" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{sa.analyticsDashboard}</span>
          </button>

          {/* Budget Audit */}
          <button
            onClick={() => setTab("transparency")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "transparency"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Coins className={`h-4.5 w-4.5 ${tab === "transparency" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{sa.financesSimulator}</span>
          </button>

          {/* GeoTagging Map assets */}
          <button
            onClick={() => setTab("geotagging")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "geotagging"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Map className={`h-4.5 w-4.5 ${tab === "geotagging" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{sa.panchayatGeoAssets}</span>
          </button>

          {/* Grievances escalations */}
          <button
            onClick={() => setTab("grievances")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "grievances"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Hammer className={`h-4.5 w-4.5 ${tab === "grievances" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{sa.prioritySlaFaults}</span>
          </button>

          {/* Certificates SLA status */}
          <button
            onClick={() => setTab("certificates")}
            className={`w-full flex items-center space-x-3 text-xs py-3 px-4 rounded-xl font-bold transition duration-155 cursor-pointer text-left ${
              tab === "certificates"
                ? "bg-orange-50 text-orange-900 border border-orange-200/50 shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className={`h-4.5 w-4.5 ${tab === "certificates" ? "text-orange-600" : "text-slate-400"}`} />
            <span>{sa.allDocumentsTracker}</span>
          </button>
        </nav>

        {/* Dynamic Display */}
        <div className="col-span-1 lg:col-span-9">
          
          {tab === "analytics" && (
            <AnalyticsDashboard
              language={language}
              applications={applications}
              complaints={complaints}
              assets={assets}
            />
          )}

          {/* Main Oversight Area */}
          {tab === "overview" && (
            <div className="space-y-6">
              
              {/* Interactive Budget Discretionary Allocator Simulator */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Sparkles className="h-4.5 w-4.5 text-rose-500" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    {sa.disburserHeader}
                  </h3>
                </div>

                {allocFeedback && (
                  <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
                    {allocFeedback}
                  </div>
                )}

                <form onSubmit={handleSimulateBudget} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-1">
                    <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase">{sa.allotmentHead}</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans font-medium focus:ring-1 focus:ring-rose-500"
                      placeholder={sa.allotmentHeadPlaceholder}
                      value={newAllocTitle}
                      onChange={(e) => setNewAllocTitle(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase">{sa.financialYearCap}</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans font-medium focus:ring-1 focus:ring-rose-500"
                      value={newAllocType}
                      onChange={(e) => setNewAllocType(e.target.value)}
                    >
                      <option value="WATER_SANITATION">{sa.waterSanitation}</option>
                      <option value="INFRASTRUCTURE">{sa.roadsInfrastructure}</option>
                      <option value="WELFARE">{sa.welfareSecurity}</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase">{sa.allotmentLabel} (₹)</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans font-medium focus:ring-1 focus:ring-rose-500"
                      value={newAllocAmount}
                      onChange={(e) => setNewAllocAmount(Number(e.target.value))}
                    >
                      <option value={200000}>₹2,00,000</option>
                      <option value={500000}>₹5,00,000</option>
                      <option value={800000}>₹8,00,000</option>
                      <option value={1500000}>₹15,00,000</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="md:col-span-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition text-center cursor-pointer flex items-center justify-center space-x-1 uppercase"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>{sa.disburseActionBtn}</span>
                  </button>
                </form>
              </div>

              {/* Physical Geo-Assets Audit list */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <Map className="h-5 w-5 text-rose-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      {sa.verificationLogsHeader}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                    {sa.totalAssetsCountLabel.replace("{count}", String(totalAssetsCount))}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl flex items-start space-x-2">
                      <div className="bg-white text-slate-600 p-2 rounded-lg border border-slate-150">
                        {asset.type === "WELL" ? (
                          <MapPin className="h-4.5 w-4.5 text-sky-600" />
                        ) : asset.type === "HEALTH_CENTRE" ? (
                          <Activity className="h-4.5 w-4.5 text-rose-500" />
                        ) : (
                          <Wrench className="h-4.5 w-4.5 text-orange-500" />
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <strong className="text-xs font-bold text-slate-900 block leading-snug">{asset.name}</strong>
                        <span className="text-[8px] font-mono text-slate-400 block">Tag: {asset.lat}, {asset.lon}</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${asset.status === "FUNCTIONAL" ? "bg-emerald-500" : "bg-orange-500"}`}></span>
                          <span className="text-[9px] font-bold font-mono tracking-tight uppercase text-slate-700">
                            {asset.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliances check scoreboard */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200">
                <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
                  <BookOpen className="h-5 w-5 text-rose-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    {sa.complianceScorecardHeader}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-rose-50/40 rounded-xl border border-rose-100">
                    <span className="text-xl font-extrabold text-rose-700">100%</span>
                    <div className="text-xs leading-snug">
                      <p className="font-bold text-slate-900">{sa.complianceIntegrationTitle}</p>
                      <p className="text-slate-500 font-sans mt-0.5">{sa.complianceIntegrationDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
                    <span className="text-xl font-extrabold text-emerald-800">4 Hours</span>
                    <div className="text-xs leading-snug">
                      <p className="font-bold text-slate-900">{sa.complianceTurnaroundTitle}</p>
                      <p className="text-slate-500 font-sans mt-0.5">{sa.complianceTurnaroundDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {tab === "transparency" && (
            <div className="space-y-6">
              <Transparency language={language} fundAllocations={fundAllocations} />
            </div>
          )}

          {tab === "geotagging" && (
            <GeoTagging
              language={language}
              role={UserRole.ADMIN}
              isOnline={isOnline}
              assets={assets}
              setAssets={setAssets}
              workers={workers}
              setWorkers={setWorkers}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "grievances" && (
            <Grievances
              language={language}
              role={UserRole.ADMIN}
              isOnline={isOnline}
              complaints={complaints}
              setComplaints={setComplaints}
              onQueueSync={onQueueSync}
            />
          )}

          {tab === "certificates" && (
            <Certificates
              language={language}
              role={UserRole.ADMIN}
              isOnline={isOnline}
              applications={applications}
              setApplications={setApplications}
              onQueueSync={onQueueSync}
            />
          )}

        </div>

      </div>

    </div>
  );
}
