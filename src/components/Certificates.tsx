import React, { useState, useRef, useCallback } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, UserRole, CertificateType, CertificateApplication, ApplicationStatus } from "../types";
import { PlusCircle, FileText, CheckCircle2, XCircle, Clock, ShieldCheck, User2, Upload, AlertCircle, Sparkles, X, ImageIcon } from "lucide-react";
import ReadAloud from "./ReadAloud";

interface CertificatesProps {
  language: AppLanguage;
  role: UserRole;
  isOnline: boolean;
  applications: CertificateApplication[];
  setApplications: React.Dispatch<React.SetStateAction<CertificateApplication[]>>;
  onQueueSync: (type: "CERT_APPLICATION", data: any) => void;
  voicePreFill?: any;
}

export default function Certificates({
  language,
  role,
  isOnline,
  applications,
  setApplications,
  onQueueSync,
  voicePreFill
}: CertificatesProps) {
  const t = TRANSLATIONS[language];

  // Forms states
  const [certType, setCertType] = useState<CertificateType>(CertificateType.DOMICILE);
  const [citizenName, setCitizenName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileDataUrl, setSelectedFileDataUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [aadhaarError, setAadhaarError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const certFileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFileName(file.name);
    setSelectedFile(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFileDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Automated form pre-filling from Bhashini Voice Sathi extraction & user intents
  React.useEffect(() => {
    if (voicePreFill?.action === "CERTIFICATE") {
      const targetCategory = voicePreFill?.category || "";
      if (Object.values(CertificateType).includes(targetCategory as CertificateType)) {
        setCertType(targetCategory as CertificateType);
      } else {
        // Safe intelligent classification fallback based on transcription matches
        const lowerText = (voicePreFill?.spokenText || "").toLowerCase();
        if (lowerText.includes("widow") || lowerText.includes("vidhwa") || lowerText.includes("विधवा")) {
          setCertType(CertificateType.WIDOW);
        } else if (lowerText.includes("ews") || lowerText.includes("general selection") || lowerText.includes("जनरल") || lowerText.includes("ई.डब्ल्यू.एस.")) {
          setCertType(CertificateType.EWS);
        } else if (lowerText.includes("bpl") || lowerText.includes("गरीबी") || lowerText.includes("बीपीएल") || lowerText.includes("बी.पी.एल.")) {
          setCertType(CertificateType.BPL);
        } else if (lowerText.includes("noc") || lowerText.includes("अनापत्ति")) {
          setCertType(CertificateType.NOC);
        } else if (lowerText.includes("resident") || lowerText.includes("residential") || lowerText.includes("आवासीय") || lowerText.includes("निवास")) {
          setCertType(CertificateType.RESIDENTIAL);
        } else if (lowerText.includes("caste") || lowerText.includes("jati") || lowerText.includes("जाति")) {
          setCertType(CertificateType.CASTE);
        } else if (lowerText.includes("income") || lowerText.includes("aay") || lowerText.includes("आय")) {
          setCertType(CertificateType.INCOME);
        } else if (lowerText.includes("birth") || lowerText.includes("janam") || lowerText.includes("जन्म")) {
          setCertType(CertificateType.BIRTH);
        } else {
          setCertType(CertificateType.DOMICILE);
        }
      }

      setCitizenName("Ram Chandra Meena");
      setAadhaar("987654321012");
      setSelectedFile("verified_jan_aadhaar_sync_packet.pdf");
    }
  }, [voicePreFill]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (aadhaar.length !== 12 || isNaN(Number(aadhaar))) {
      setAadhaarError(language === AppLanguage.HI ? "अमान्य आधार! कृपया 12 अंकों का वैध आधार दर्ज करें।" : "Invalid Aadhaar! Please input exactly 12 numerical digits.");
      return;
    }
    setAadhaarError("");

    const newApp: CertificateApplication = {
      id: "CERT-" + Math.floor(100000 + Math.random() * 900000),
      type: certType,
      citizenName: citizenName || "Ram Chandra Meena",
      citizenAadhaar: aadhaar,
      docUrl: selectedFileDataUrl || undefined,
      status: ApplicationStatus.PENDING,
      submissionDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      officerInCharge: "Smt. Kavita Sharma (Gram Sachiv)",
      slaDaysRemaining: 7,
      remarks: "Self-declaration validated."
    };

    if (!isOnline) {
      // Create packet in offline queue
      onQueueSync("CERT_APPLICATION", newApp);
      // Append locally with temporary state indicator
      const offlineApp = { ...newApp, remarks: "SAVED OFFLINE — WAITING FOR NETWORK SYNC" };
      setApplications(prev => [offlineApp, ...prev]);
    } else {
      // Instantly apply
      setApplications(prev => [newApp, ...prev]);
    }

    // Reset fields
    setCitizenName("");
    setAadhaar("");
    setSelectedFile(null);
    setSelectedFileDataUrl(null);
    setSelectedFileName(null);
    if (certFileRef.current) certFileRef.current.value = "";
  };

  // Sign & Approve action for Panchayat officials
  const handleSignApprove = (appId: string, remark: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: ApplicationStatus.APPROVED,
          lastUpdated: new Date().toISOString().split("T")[0],
          remarks: remark || "Verification passed. Digitally signed via Aadhaar eSign."
        };
      }
      return app;
    }));
  };

  // Reject action for Panchayat officials
  const handleReject = (appId: string, remark: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: ApplicationStatus.REJECTED,
          lastUpdated: new Date().toISOString().split("T")[0],
          remarks: remark || "Documents mismatched under verification guidelines."
        };
      }
      return app;
    }));
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{t.statusApproved}</span>
          </span>
        );
      case ApplicationStatus.REJECTED:
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle className="h-3.5 w-3.5" />
            <span>{t.statusRejected}</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-orange-650 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60 animate-pulse font-sans">
            <Clock className="h-3.5 w-3.5 text-orange-600" />
            <span>{t.statusPending}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black font-sans text-slate-900 tracking-tight leading-none uppercase">
            {language === AppLanguage.HI ? "आधिकारिक प्रमाण-पत्र सेवाएँ" : "Official Certificates & Applications"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === AppLanguage.HI ? "सरकारी दस्तावेजों के लिए आवेदन करें और अपने आवेदन की स्थिति ट्रैक करें" : "Apply for official village credentials and trace your e-Sign validations."}
          </p>
        </div>
        <ReadAloud language={language} targetSelector="#certificates-page-content" />
      </div>

      <div id="certificates-page-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* application Form Column — Only active as submission panel for Citizens */}
      <div className={`col-span-1 lg:col-span-5 space-y-6 ${role !== UserRole.CITIZEN ? "opacity-60 cursor-not-allowed" : ""}`}>
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 relative overflow-hidden">
          {role !== UserRole.CITIZEN && (
            <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-slate-900/90 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 shadow-lg font-mono">
                {language === AppLanguage.HI ? "सिर्फ नागरिक मोड में सक्रिय" : "ONLY ACTIVE IN CITIZEN PORTAL MODE"}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2.5 mb-5">
            <PlusCircle className="h-5 w-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 font-sans text-md">
              {language === AppLanguage.HI ? "नया प्रमाण-पत्र आवेदन पत्र" : "Apply for New Official Document"}
            </h3>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            
             {/* Form Pre-filled Alert from voice assistant */}
            {voicePreFill?.action === "CERTIFICATE" && (
              <div className="bg-orange-50/90 text-slate-900 text-xs p-4 rounded-xl border border-orange-200 shadow-sm space-y-2 animate-fadeIn dark:bg-amber-950/40 dark:border-orange-900/60">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="font-extrabold text-slate-800 dark:text-orange-200">
                    {language === AppLanguage.HI ? "✨ वॉयस साथी मार्गदर्शन (Voice Sathi Guide)" : "✨ Voice Sathi Form Guide"}
                  </span>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-orange-700 dark:text-orange-300">
                    {language === AppLanguage.HI 
                      ? "आपके द्वारा बोले गए शब्दों के आधार पर फॉर्म स्वचालित रूप से भर दिया गया है।" 
                      : "Based on your spoken words, the form has been automatically prefilled."}
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      <strong>{language === AppLanguage.HI ? "प्रमाण-पत्र का प्रकार:" : "Certificate Type:"}</strong>{" "}
                      {certType === CertificateType.DOMICILE ? "Domicile Certificate (मूल निवास)" : ""}
                      {certType === CertificateType.CASTE ? "Caste Certificate (जाति प्रमाण)" : ""}
                      {certType === CertificateType.INCOME ? "Income Certificate (आय प्रमाण)" : ""}
                      {certType === CertificateType.BIRTH ? "Birth Certificate (जन्म प्रमाण)" : ""}
                      {certType === CertificateType.WIDOW ? "Widow Certificate (विधवा प्रमाण)" : ""}
                      {certType === CertificateType.EWS ? "EWS Certificate (ई.डब्ल्यू.एस. प्रमाण)" : ""}
                      {certType === CertificateType.BPL ? "BPL Certificate (बी.पी.एल. प्रमाण)" : ""}
                      {certType === CertificateType.NOC ? "NOC Certificate (अनापत्ति प्रमाण / NOC)" : ""}
                      {certType === CertificateType.RESIDENTIAL ? "Residential Certificate (आवासीय प्रमाण)" : ""}
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "नागरिक नाम:" : "Citizen Name:"}</strong>{" "}
                      {citizenName}
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "आधार नंबर:" : "Aadhaar Card:"}</strong>{" "}
                      {aadhaar}
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "दस्तावेज़ स्थिति:" : "Documents attached:"}</strong>{" "}
                      {selectedFile ? "सत्यापित (Jan Aadhaar Packet Loaded)" : "नहीं"}
                    </li>
                  </ol>
                  <p className="mt-2 text-[11px] font-bold text-[#b33d26] dark:text-orange-400">
                    {language === AppLanguage.HI 
                      ? "👉 विवरण सही होने पर नीचे 'ई-साइन करें और जमा करें' बटन दबाएं।" 
                      : "👉 Review details and click 'e-Sign and Submit Form' below to dispatch instantly."}
                  </p>
                </div>
              </div>
            )}

            {/* Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.selectCertType}
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateType)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans font-medium focus:ring-2 focus:ring-orange-500 shadow-sm"
              >
                <option value={CertificateType.DOMICILE}>Domicile Certificate (मूल निवास प्रमाण-पत्र)</option>
                <option value={CertificateType.CASTE}>Caste Certificate (जाति प्रमाण-पत्र)</option>
                <option value={CertificateType.INCOME}>Income Certificate (आय प्रमाण-पत्र)</option>
                <option value={CertificateType.BIRTH}>Birth Certificate (जन्म प्रमाण-पत्र)</option>
                <option value={CertificateType.WIDOW}>Widow Certificate (विधवा प्रमाण-पत्र)</option>
                <option value={CertificateType.EWS}>EWS Certificate (ई.डब्ल्यू.एस. प्रमाण-पत्र)</option>
                <option value={CertificateType.BPL}>BPL Certificate (बी.पी.एल. प्रमाण-पत्र)</option>
                <option value={CertificateType.NOC}>NOC Certificate (अनापत्ति प्रमाण-पत्र / NOC)</option>
                <option value={CertificateType.RESIDENTIAL}>Residential Certificate (आवासीय प्रमाण-पत्र / Residential)</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.fullName}
              </label>
              <input
                required
                type="text"
                placeholder="E.g., Ram Chandra Gurjar"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.aadhaarNumber}
              </label>
              <input
                required
                type="text"
                pattern="\d*"
                maxLength={12}
                placeholder="12 digit Aadhaar 0005 0000 0000"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {aadhaarError && <p className="text-[10px] text-rose-600 mt-1">{aadhaarError}</p>}
            </div>

            {/* Document Upload - Real file picker with drag-and-drop */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.photoDoc}
              </label>
              <input
                ref={certFileRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              {selectedFileDataUrl ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
                  {selectedFileDataUrl.startsWith("data:image") ? (
                    <img src={selectedFileDataUrl} alt="Document preview" className="w-full h-28 object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-20 bg-orange-50">
                      <ImageIcon className="h-8 w-8 text-orange-400" />
                    </div>
                  )}
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold font-sans truncate max-w-[180px]">✓ {selectedFileName}</span>
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setSelectedFileDataUrl(null); setSelectedFileName(null); if (certFileRef.current) certFileRef.current.value = ""; }}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer ml-2"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => certFileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                    isDragging ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-orange-300 hover:bg-slate-50"
                  }`}
                >
                  <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium font-sans">
                    {language === AppLanguage.MW ? "कागज खींचो/छोड़ो या टेप करो सा" : language === AppLanguage.HI ? "दस्तावेज़ खींचें/छोड़ें या टैप करें" : "Drag & drop document or tap to upload"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{language === AppLanguage.HI ? "JPG, PNG, PDF समर्थित" : "JPG, PNG, PDF supported"}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-orange-700 transition shadow-sm cursor-pointer"
            >
              {t.submitApplication}
            </button>
          </form>
        </div>
      </div>

      {/* Applications Tracking & Officials Approval Actions Panel */}
      <div className="col-span-1 lg:col-span-7 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 font-sans text-md flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span>{t.trackStatus}</span>
            </h3>
            
            {role === UserRole.OFFICIAL && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase font-bold py-1 px-2.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>SIGNING COMMAND</span>
              </span>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`p-4 rounded-xl border border-slate-150 relative transition-all ${
                  app.remarks?.includes("OFFLINE")
                    ? "bg-rose-50/50 border-rose-200/50"
                    : "bg-slate-50/70 hover:bg-slate-50"
                }`}
              >
                {/* Upper row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-slate-400 mr-2 uppercase">#{app.id}</span>
                    <span className="text-xs font-bold text-slate-800 font-sans">
                      {app.type === CertificateType.DOMICILE ? "Domicile Certificate (मूल निवास)" : ""}
                      {app.type === CertificateType.CASTE ? "Caste Certificate (जाति प्रमाण)" : ""}
                      {app.type === CertificateType.INCOME ? "Income Certificate (आय प्रमाण)" : ""}
                      {app.type === CertificateType.BIRTH ? "Birth Certificate (जन्म प्रमाण)" : ""}
                      {app.type === CertificateType.WIDOW ? "Widow Certificate (विधवा प्रमाण)" : ""}
                      {app.type === CertificateType.EWS ? "EWS Certificate (ई.डब्ल्यू.एस. प्रमाण)" : ""}
                      {app.type === CertificateType.BPL ? "BPL Certificate (बी.पी.एल. प्रमाण)" : ""}
                      {app.type === CertificateType.NOC ? "NOC Certificate (अनापत्ति प्रमाण / NOC)" : ""}
                      {app.type === CertificateType.RESIDENTIAL ? "Residential Certificate (आवासीय प्रमाण)" : ""}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <User2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Citizen: <strong className="text-slate-800 font-medium">{app.citizenName}</strong></span>
                  </div>
                  <div>
                    <span>Aadhaar: <code className="text-slate-800">XXXX-XXXX-{app.citizenAadhaar.slice(-4)}</code></span>
                  </div>
                  <div>
                    <span>Submit: <strong className="text-slate-800 font-mono">{app.submissionDate}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-orange-500" />
                    <span>
                      {t.daysRemaining}: <strong className="text-orange-650 font-bold">{app.slaDaysRemaining} Days</strong>
                    </span>
                  </div>
                </div>

                {/* Uploaded document preview (visible to Sachiv) */}
                {app.docUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-slate-200">
                    {app.docUrl.startsWith("data:image") ? (
                      <img src={app.docUrl} alt="Submitted document" className="w-full h-28 object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-16 bg-orange-50">
                        <ImageIcon className="h-6 w-6 text-orange-400" />
                      </div>
                    )}
                    <div className="bg-slate-50 px-3 py-1.5 flex items-center space-x-1.5 text-[10px] text-slate-500 font-sans border-t border-slate-100">
                      <Upload className="h-3 w-3 text-slate-400" />
                      <span>{language === AppLanguage.HI ? "नागरिक द्वारा अपलोड किया गया दस्तावेज़" : "Document uploaded by citizen"}</span>
                    </div>
                  </div>
                )}

                {/* Official remarks panel / Notification details */}
                <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-200/60 text-[11px] text-slate-500 leading-relaxed font-sans mb-3 flex items-start space-x-2">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-700">{language === AppLanguage.HI ? "अधिकारी समीक्षा टिप्पणी:" : "Official Audit Note:"}</p>
                    <p className="italic">{app.remarks || "No pending remarks reported."}</p>
                  </div>
                </div>

                {/* OFFICIAL APPROVE / REJECT PORTAL MODULE */}
                {role === UserRole.OFFICIAL && app.status === ApplicationStatus.PENDING && (
                  <div className="bg-orange-50 border border-orange-200/50 rounded-xl p-3.5 mt-3 space-y-3">
                    <p className="text-xs font-bold text-orange-850 font-sans font-sans">
                      {language === AppLanguage.HI ? "ग्राम सचिव डिजिटल मंजूरी पैनल:" : "Gram Sachiv Seal & Signature Approval:"}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSignApprove(app.id, `Approved by Sanganer GP Gram Sachiv. Digital Signature Certificate e-Signed securely on ${new Date().toLocaleDateString("en-IN")}.`)}
                        className="bg-emerald-600 text-white font-bold text-xs py-2 px-3.5 rounded-lg hover:bg-emerald-700 transition cursor-pointer flex items-center space-x-1.5"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Sign & Approve</span>
                      </button>

                      <button
                        onClick={() => handleReject(app.id, "Rejected. Citizen needs to submit income declarations certified by two gazetted officers.")}
                        className="bg-rose-600 text-white font-semibold text-xs py-2 px-3 rounded-lg hover:bg-rose-700 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
      
      </div>
    </div>
  );
}
