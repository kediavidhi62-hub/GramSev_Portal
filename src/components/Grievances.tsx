import React, { useState, useRef, useCallback } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, UserRole, GrievanceCategory, GrievanceComplaint, GrievanceStatus, EscalationLevel } from "../types";
import { Hammer, MapPin, Camera, Shield, AlertTriangle, CheckCircle2, UserCircle2, Clock, Phone, Upload, X, ImageIcon } from "lucide-react";

interface GrievancesProps {
  language: AppLanguage;
  role: UserRole;
  isOnline: boolean;
  complaints: GrievanceComplaint[];
  setComplaints: React.Dispatch<React.SetStateAction<GrievanceComplaint[]>>;
  onQueueSync: (type: "GRIEVANCE_SUBMISSION", data: any) => void;
  voicePreFill?: any;
}

// Map for translating seeded/preloaded complaint entries to each language nicely, preventing mixed language.
const SEED_COMPLAINT_TRANSLATIONS: Record<string, {
  description: { EN: string; HI: string; MW: string };
  officerAssigned: { EN: string; HI: string; MW: string };
  resolutionText?: { EN: string; HI: string; MW: string };
}> = {
  "GRIEV-8912": {
    description: {
      EN: "Ward 4 solar borewell water pipe cracked and leaking constantly, blocking water flow.",
      HI: "वार्ड 4 में सोलर बोरवेल का पानी का पाइप फट गया है और लगातार पानी बह रहा है, जिससे पानी की आपूर्ति रुक गई है।",
      MW: "वार्ड ४ माथै सूरज वाळो बोरिंग रो प्यालो फुटग्यो है सा अर लगातार पाणी चूवे है, जणूसूं पाणी री सप्लाय बन्द पड़ी है सा।"
    },
    officerAssigned: {
      EN: "Shri Mahendra Singh (Ward 4 Member)",
      HI: "श्री महेंद्र सिंह (वार्ड 4 सदस्य)",
      MW: "श्री महेंद्र सिंह जी (वार्ड ४ रा पंच सा)"
    }
  },
  "GRIEV-4091": {
    description: {
      EN: "High-voltage electricity lines sparkling and power cutting off in Sanganer Ward 1 lane completely.",
      HI: "सांगानेर वार्ड 1 की गली में वोल्टेज की ऊंची बिजली की लाइनें चमक रही हैं और पूरी तरह से बिजली कट रही है।",
      MW: "सांगानेर वार्ड १ री गळी में बिजली रा मोटा तार चिणगारी छोड़े है सा अर पूरी गळी में बिजली बुझगी है सा।"
    },
    officerAssigned: {
      EN: "Vidhyut Department Lineman Sanganer",
      HI: "विद्युत विभाग लाइनमैन सांगानेर",
      MW: "बिजली विभाग रा लाईनमेन, सांगानेर सा"
    },
    resolutionText: {
      EN: "Transformer ceramic insulators replaced and cable lines double-shielded. Inspected OK.",
      HI: "ट्रांसफार्मर के सिरेमिक इंसुलेटर बदल दिए गए हैं और केबल लाइनों को डबल-शील्ड किया गया है। निरीक्षण ठीक रहा।",
      MW: "ट्रांसफार्मर रा चीनी का कुप्पा बदल दिया सा अर बिजली रा तारां माथै डबल कवर चढ़ा दियो सा। अब सब चोखो है सा।"
    }
  },
  "GRIEV-2910": {
    description: {
      EN: "Puddles and slippery mud blocks the primary school entrance gate road, making children slip.",
      HI: "प्राइमरी स्कूल के मुख्य गेट के रास्ते पर कीचड़ और फिसलन भरा पानी जमा है, जिससे बच्चें फिसल रहे हैं।",
      MW: "पेली क्लास री स्कूल रा मुख्य गेट कनै गारा अर कीचड़ रो पाणी भेळो होग्यो है सा, जणूसूं टाबर घणा फिसले है सा।"
    },
    officerAssigned: {
      EN: "Sanganer Panchayat Engineering Team",
      HI: "सांगानेर पंचायत इंजीनियरिंग टीम",
      MW: "सांगानेर पंचायत रा मिस्त्री अर कामगार टीम सा"
    }
  }
};

export default function Grievances({
  language,
  role,
  isOnline,
  complaints,
  setComplaints,
  onQueueSync,
  voicePreFill
}: GrievancesProps) {
  const t = TRANSLATIONS[language];

  // Forms
  const [category, setCategory] = useState<GrievanceCategory>(GrievanceCategory.WATER);
  const [description, setDescription] = useState("");
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [simLat, setSimLat] = useState<number | null>(null);
  const [simLon, setSimLon] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Automated form pre-filling from Bhashini Voice Sathi extraction & user intents
  React.useEffect(() => {
    if (voicePreFill?.action === "COMPLAINT") {
      const targetCategory = voicePreFill?.category || "";
      if (Object.values(GrievanceCategory).includes(targetCategory as GrievanceCategory)) {
        setCategory(targetCategory as GrievanceCategory);
      } else {
        const lower = (voicePreFill?.spokenText || "").toLowerCase();
        if (lower.includes("pani") || lower.includes("water") || lower.includes("bore") || lower.includes("drinking") || lower.includes("नल") || lower.includes("पेयजल")) {
          setCategory(GrievanceCategory.WATER);
        } else if (lower.includes("sadak") || lower.includes("road") || lower.includes("paving") || lower.includes("rasto") || lower.includes("gali") || lower.includes("सड़क") || lower.includes("रास्ता")) {
          setCategory(GrievanceCategory.ROAD);
        } else if (lower.includes("bijli") || lower.includes("light") || lower.includes("pole") || lower.includes("power") || lower.includes("lineman") || lower.includes("बिजली")) {
          setCategory(GrievanceCategory.ELECTRICITY);
        } else if (lower.includes("safai") || lower.includes("kachra") || lower.includes("drain") || lower.includes("toilet") || lower.includes("clean") || lower.includes("garbage") || lower.includes("nala") || lower.includes("nali") || lower.includes("सफाई") || lower.includes("कीचड़")) {
          setCategory(GrievanceCategory.SANITATION);
        } else if (lower.includes("school") || lower.includes("shiksha") || lower.includes("bhavan") || lower.includes("building") || lower.includes("class") || lower.includes("स्कूल")) {
          setCategory(GrievanceCategory.SCHOOL);
        } else {
          setCategory(GrievanceCategory.WATER);
        }
      }

      setDescription(voicePreFill?.spokenText || "");
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

      setCName(savedUser.name || savedUser.fullName || "");
      setCPhone(savedUser.phone || savedUser.mobile || "");
      setSimLat(26.8130 + Math.random() * 0.005);
      setSimLon(75.8010 + Math.random() * 0.005);
      setImageUrl("simulated-grev-leak.png");
    }
  }, [voicePreFill]);

  // Resolution
  const [activeResId, setActiveResId] = useState<string | null>(null);
  const [resText, setResText] = useState("");

  const handleSimulateGPS = () => {
    // Sanganer Area simulated coordinates
    setSimLat(26.8130 + Math.random() * 0.005);
    setSimLon(75.8010 + Math.random() * 0.005);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();

    // Default values translated safely
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const defaultCitizenName = user.name || user.fullName || "";

    const defaultOfficer = language === AppLanguage.MW 
      ? "वार्ड पंच / पंचायत सचिव सा" 
      : language === AppLanguage.HI 
      ? "वार्ड सदस्य / पंचायत सचिव" 
      : "Ward Member/Panchayat Sachiv";

    const newGrievance: GrievanceComplaint = {
      id: "GRIEV-" + Math.floor(10000 + Math.random() * 90000),
      category: category,
      description: description,
      citizenName: cName || defaultCitizenName,
      phone: cPhone || "9414000XXX",
      photoUrl: imageUrl || undefined,
      latitude: simLat || 26.8122,
      longitude: simLon || 75.8011,
      status: GrievanceStatus.SUBMITTED,
      submissionDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      wardId: Math.floor(1 + Math.random() * 8),
      officerAssigned: defaultOfficer,
      escalationLevel: EscalationLevel.PANCHAYAT,
      slaDaysRemaining: 7, // Initial SLA clock
    };

    if (!isOnline) {
      onQueueSync("GRIEVANCE_SUBMISSION", newGrievance);
      // Append local list with offline note
      const offlineMsg = language === AppLanguage.MW 
        ? "[बिना नेट रो सुरक्षित] " 
        : language === AppLanguage.HI 
        ? "[ऑफलाइन सुरक्षित] " 
        : "[SAVED OFFLINE] ";

      const pendingOfficerMsg = language === AppLanguage.MW 
        ? "सिंक बाकी है सा" 
        : language === AppLanguage.HI 
        ? "सिंक होना बाकी है" 
        : "PENDING CONNECTED SYNC";

      const offlineGriev = { 
        ...newGrievance, 
        description: `${offlineMsg}${newGrievance.description}`, 
        officerAssigned: pendingOfficerMsg 
      };
      setComplaints(prev => [offlineGriev, ...prev]);
    } else {
      setComplaints(prev => [newGrievance, ...prev]);
    }

    // Reset Form
    setDescription("");
    setCName("");
    setCPhone("");
    setSimLat(null);
    setSimLon(null);
    setImageUrl(null);
  };

  const handleResolveGrievance = (grievId: string) => {
    if (!resText.trim()) return;

    setComplaints(prev => prev.map(c => {
      if (c.id === grievId) {
        return {
          ...c,
          status: GrievanceStatus.RESOLVED,
          resolutionText: resText,
          lastUpdated: new Date().toISOString().split("T")[0],
          slaDaysRemaining: 0
        };
      }
      return c;
    }));

    setActiveResId(null);
    setResText("");
  };

  const triggerEscalationSimulation = (gId: string, level: EscalationLevel) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === gId) {
        const assignedOfficerText = level === EscalationLevel.BLOCK 
          ? (language === AppLanguage.MW ? "BDO सांगानेर ब्लॉक अधिकारी सा" : language === AppLanguage.HI ? "बीडीओ सांगानेर ब्लॉक अधिकारी" : "BDO Sanganer Block")
          : (language === AppLanguage.MW ? "जिल्ला कलेक्टर कार्यालय जयपुर सा" : language === AppLanguage.HI ? "जिला कलेक्टर कार्यालय, जयपुर" : "District Grievance Officer, Jaipur");

        return {
          ...c,
          escalationLevel: level,
          slaDaysRemaining: level === EscalationLevel.BLOCK ? 2 : 0,
          officerAssigned: assignedOfficerText
        };
      }
      return c;
    }));
  };

  const getEscalationStyleAndLabel = (c: GrievanceComplaint) => {
    if (c.status === GrievanceStatus.RESOLVED) {
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        label: language === AppLanguage.MW 
          ? "मामलो सुलझ ग्यो सा (RESOLVED)" 
          : language === AppLanguage.HI 
          ? "सुलझाया गया (RESOLVED)" 
          : "RESOLVED",
        icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
      };
    }

    switch (c.escalationLevel) {
      case EscalationLevel.DISTRICT:
        return {
          bg: "bg-rose-500 text-white border-rose-600 animate-pulse font-bold",
          label: language === AppLanguage.MW 
            ? "दर्जो ३: जिल्ला कलेक्टर सा (ESCALATED - DISTRICT)" 
            : language === AppLanguage.HI 
            ? "स्तर ३: जिला कलेक्टर (ESCALATED - DISTRICT)" 
            : "ESCALATED - DISTRICT",
          icon: <AlertTriangle className="h-3.5 w-3.5" />
        };
      case EscalationLevel.BLOCK:
        return {
          bg: "bg-orange-50 text-orange-850 border-orange-200 font-bold",
          label: language === AppLanguage.MW 
            ? "दर्जो २: खंड विकास अधिकारी (BDO) सा (ESCALATED - BLOCK)" 
            : language === AppLanguage.HI 
            ? "स्तर २: खंड विकास अधिकारी (ESCALATED - BLOCK)" 
            : "ESCALATED - BLOCK",
          icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
        };
      default:
        return {
          bg: "bg-teal-50 text-teal-850 border-teal-200",
          label: language === AppLanguage.MW 
            ? "दर्जो १: ग्राम पंचायत स्तर माथै सा (PANCHAYAT)" 
            : language === AppLanguage.HI 
            ? "स्तर १: पंचायत स्तर (PANCHAYAT)" 
            : "PANCHAYAT LEVEL",
          icon: <Shield className="h-3.5 w-3.5 text-teal-700" />
        };
    }
  };

  // Safe description selector mapping seeded data or showing user data
  const getComplaintDescription = (c: GrievanceComplaint) => {
    const translation = SEED_COMPLAINT_TRANSLATIONS[c.id];
    if (translation) {
      if (language === AppLanguage.MW) return translation.description.MW;
      if (language === AppLanguage.HI) return translation.description.HI;
      return translation.description.EN;
    }
    return c.description;
  };

  // Safe officer description mapping
  const getComplaintOfficer = (c: GrievanceComplaint) => {
    const translation = SEED_COMPLAINT_TRANSLATIONS[c.id];
    if (translation) {
      if (language === AppLanguage.MW) return translation.officerAssigned.MW;
      if (language === AppLanguage.HI) return translation.officerAssigned.HI;
      return translation.officerAssigned.EN;
    }

    // Dynamic translate for newly entered ones
    if (language === AppLanguage.MW) {
      if (c.officerAssigned === "Ward Member/Panchayat Sachiv" || c.officerAssigned === "Ward Member/Panchayat Sachiv सा") {
        return "वार्ड पंच / पंचायत सचिव सा";
      }
      if (c.officerAssigned === "PENDING CONNECTED SYNC" || c.officerAssigned === "सिंक होना बाकी है") {
        return "सिंक बाकी है सा";
      }
    } else if (language === AppLanguage.HI) {
      if (c.officerAssigned === "Ward Member/Panchayat Sachiv" || c.officerAssigned === "वार्ड पंच / पंचायत सचिव सा") {
        return "वार्ड सदस्य / पंचायत सचिव";
      }
      if (c.officerAssigned === "PENDING CONNECTED SYNC" || c.officerAssigned === "सिंक बाकी है सा") {
        return "सिंक होना बाकी है";
      }
    }
    return c.officerAssigned;
  };

  // Safe resolution text selector
  const getResolutionText = (c: GrievanceComplaint) => {
    const translation = SEED_COMPLAINT_TRANSLATIONS[c.id];
    if (translation && translation.resolutionText) {
      if (language === AppLanguage.MW) return translation.resolutionText.MW;
      if (language === AppLanguage.HI) return translation.resolutionText.HI;
      return translation.resolutionText.EN;
    }
    return c.resolutionText;
  };

  // Dynamic values translating localized titles
  const dashboardTitleText = language === AppLanguage.MW 
    ? "नवी शिकायत दर्ज कराओ सा" 
    : language === AppLanguage.HI 
    ? "नया शिकायत फॉर्म" 
    : "Lodge Village Complaint";

  const permissionOverlayText = language === AppLanguage.MW 
    ? "सिर्फ गांवां रा नागरिक पोर्टल मोड में चालू है सा" 
    : language === AppLanguage.HI 
    ? "सिर्फ नागरिक मोड में सक्रिय" 
    : "ONLY ACTIVE IN CITIZEN PORTAL MODE";

  const reporterText = language === AppLanguage.MW 
    ? "शिकायत करणिया" 
    : language === AppLanguage.HI 
    ? "शिकायतकर्ता" 
    : "Reporter";

  const contactCellText = language === AppLanguage.MW 
    ? "मोबाईळ" 
    : language === AppLanguage.HI 
    ? "मोबाइल" 
    : "Cell";

  const wardAssignmentText = language === AppLanguage.MW 
    ? "वार्ड बंटवारो" 
    : language === AppLanguage.HI 
    ? "वार्ड आवंटन" 
    : "Ward Assignment";

  const assignedOfficerText = language === AppLanguage.MW 
    ? "अधिकारी रो नाम" 
    : language === AppLanguage.HI 
    ? "नियुक्त अधिकारी" 
    : "Assigned Officer";

  const raisedDateText = language === AppLanguage.MW 
    ? "तारीख" 
    : language === AppLanguage.HI 
    ? "दर्ज तिथि" 
    : "Raised";

  const wardCountLabelText = language === AppLanguage.MW 
    ? "सांगानेर कुल वार्ड: ८" 
    : language === AppLanguage.HI 
    ? "सांगानेर वार्ड गणना: 8" 
    : "Sanganer Ward Count: 8";

  const slaRemainingLabelText = language === AppLanguage.MW 
    ? "दिन बच्या है आगे भेजण सूं पेली सा" 
    : language === AppLanguage.HI 
    ? "दिन बचे हैं SLA एस्केलेशन से पहले" 
    : "Days left before SLA escalation";

  const auditCompleteLabelText = language === AppLanguage.MW 
    ? "संभाल ऑडिट तारीख" 
    : language === AppLanguage.HI 
    ? "ऑडिट तिथि" 
    : "Audit complete on";

  // Simulation drill components translation
  const slamDrillLabel = language === AppLanguage.MW 
    ? "एस.एल.ए. आगे भेजण री जांच (जिल्ला कलेक्टर सिमुलेशन)" 
    : language === AppLanguage.HI 
    ? "SLA एस्केलेशन अभ्यास (जिला कलेक्टर सिमुलेशन)" 
    : "SLA Escalation Drill (District Admin simulation)";

  const escBlockButtonText = language === AppLanguage.MW 
    ? "समय बिताओ अर ब्लॉक BDO कने भेजो सा" 
    : language === AppLanguage.HI 
    ? "वय बढ़ाएं और ब्लॉक BDO को भेजें" 
    : "Age & Escalate to Block BDO";

  const escDistrictButtonText = language === AppLanguage.MW 
    ? "घणो जोर को काम: सीधा जिल्ला कलेक्टर ने भेजो सा" 
    : language === AppLanguage.HI 
    ? "समय सीमा समाप्त: जिला कलेक्टर को भेजें" 
    : "Overdue: Escalate to District Collector";

  const logLocalResolutionButtonText = language === AppLanguage.MW 
    ? "स्थानिक निवारण री रपट लिखो सा" 
    : language === AppLanguage.HI 
    ? "स्थानीय निवारण मामला दर्ज करें" 
    : "Log Local Resolution Case";

  const resolutionFormPlaceholderText = language === AppLanguage.MW 
    ? "काम री कार्रवाई लिखो सा (जैस्यां की: पाइप की मरम्मत करवा दी अर पाणी चालू होग्यो सा...)" 
    : language === AppLanguage.HI 
    ? "शिकायत निवारण की कार्यवाही लिखें (जैसे: बोरिंग टीम भेजकर पेयजल आपूर्ति बहाल की...)" 
    : "Type formal resolution action (e.g. Borewell repair team dispatched and water restored...)";

  const confirmResolutionButtonText = language === AppLanguage.MW 
    ? "निवारण नक्की करो सा" 
    : language === AppLanguage.HI 
    ? "निवारण स्वीकृत करें" 
    : "Confirm Resolution";

  const cancelButtonText = language === AppLanguage.MW 
    ? "रद्द करो सा" 
    : language === AppLanguage.HI 
    ? "रद्द करें" 
    : "Cancel";

  const submitFormButtonText = language === AppLanguage.MW 
    ? "शिकायत दर्ज कराओ सा" 
    : language === AppLanguage.HI 
    ? "शिकायत दर्ज करें (सबमिट)" 
    : "Raise Checked Complaint";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* File grievance panel */}
      <div className={`col-span-1 lg:col-span-5 space-y-6 ${role !== UserRole.CITIZEN ? "opacity-60 cursor-not-allowed" : ""}`}>
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 relative overflow-hidden">
          {role !== UserRole.CITIZEN && (
            <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-slate-900/90 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 shadow-lg font-mono">
                {permissionOverlayText}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2.5 mb-5">
            <Hammer className="h-5 w-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 font-sans text-md">
              {dashboardTitleText}
            </h3>
          </div>

          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            
            {/* Form Pre-filled Alert from voice assistant */}
            {voicePreFill?.action === "COMPLAINT" && (
              <div className="bg-orange-50/90 text-slate-900 text-xs p-4 rounded-xl border border-orange-200 shadow-sm space-y-2 animate-fadeIn dark:bg-amber-950/40 dark:border-orange-900/60">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600 dark:text-orange-400">✨</span>
                  <span className="font-extrabold text-slate-800 dark:text-orange-200">
                    {language === AppLanguage.HI ? "वॉयस साथी मार्गदर्शन (Voice Sathi Guide)" : "Voice Sathi Form Guide"}
                  </span>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-orange-700 dark:text-orange-300">
                    {language === AppLanguage.HI 
                      ? "आपके द्वारा बोले गए शब्दों के आधार पर जन शिकायत फॉर्म स्वचालित रूप से भर दिया गया है।" 
                      : "Based on your spoken words, the village grievance form is completed automatically."}
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      <strong>{language === AppLanguage.HI ? "समस्या श्रेणी:" : "Issue Category:"}</strong>{" "}
                      {category === GrievanceCategory.WATER ? "पेयजल एवं बोरिंग समस्या" : ""}
                      {category === GrievanceCategory.ROAD ? "टूटी सड़क और रास्ता निर्माण" : ""}
                      {category === GrievanceCategory.SANITATION ? "नाली एवं कचरा सफाई" : ""}
                      {category === GrievanceCategory.ELECTRICITY ? "ग्रामीण बिजली एवं स्ट्रीट लाइट" : ""}
                      {category === GrievanceCategory.SCHOOL ? "प्राथमिक स्कूल भवन एवं मरम्मत" : ""}
                      {category === GrievanceCategory.OTHERS ? "अन्य ग्रामीण विषय" : ""}
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "विवरण:" : "Description:"}</strong>{" "}
                      &ldquo;{description}&rdquo;
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "शिकायतकर्ता नाम:" : "Citizen Name:"}</strong>{" "}
                      {cName}
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "मोबाइल नंबर:" : "Contact Number:"}</strong>{" "}
                      {cPhone}
                    </li>
                    <li>
                      <strong>{language === AppLanguage.HI ? "GPS स्थिति व फोटो:" : "GPS & Photo:"}</strong>{" "}
                      {simLat ? "स्वचालित रूप से सिंक किया गया (Auto-geotagged)" : "प्रतीक्षा में..."} / फोटो संलग्न है
                    </li>
                  </ol>
                  <p className="mt-2 text-[11px] font-bold text-[#b33d26] dark:text-orange-400">
                    {language === AppLanguage.HI 
                      ? "👉 विवरण की जांच करें और नीचे 'शिकायत दर्ज करें (सबमिट)' बटन दबाएं।" 
                      : "👉 Review the details and hit the 'Raise Checked Complaint' button below."}
                  </p>
                </div>
              </div>
            )}

            {/* Sector Category */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.complainCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans font-medium focus:ring-2 focus:ring-orange-500 shadow-sm"
              >
                <option value={GrievanceCategory.WATER}>
                  {language === AppLanguage.MW 
                    ? "पीवण रा पाणी री सुविधा (पेयजल/बोरिंग)" 
                    : language === AppLanguage.HI 
                    ? "पेयजल एवं बोरिंग समस्या" 
                    : "Drinking Water Supply & Borewell"}
                </option>
                <option value={GrievanceCategory.ROAD}>
                  {language === AppLanguage.MW 
                    ? "टूटी सड़क अर रस्तो बणावणो (टूटी सड़क)" 
                    : language === AppLanguage.HI 
                    ? "टूटी सड़क और रास्ता निर्माण" 
                    : "Roads & Paving Repair"}
                </option>
                <option value={GrievanceCategory.SANITATION}>
                  {language === AppLanguage.MW 
                    ? "नाळी अर कचरा री सफ़ाई (नाळी-कचरो)" 
                    : language === AppLanguage.HI 
                    ? "नाली एवं कचरा सफाई" 
                    : "Public Sanitation & Drain"}
                </option>
                <option value={GrievanceCategory.ELECTRICITY}>
                  {language === AppLanguage.MW 
                    ? "बिजली अर पोल री बत्तियां री समस्या (बिजली-खंभो)" 
                    : language === AppLanguage.HI 
                    ? "ग्रामीण बिजली एवं स्ट्रीट लाइट" 
                    : "Rural Electricity & Streetlight"}
                </option>
                <option value={GrievanceCategory.SCHOOL}>
                  {language === AppLanguage.MW 
                    ? "स्कूल री इमारत अर मरम्मत (स्कूल बणावणो)" 
                    : language === AppLanguage.HI 
                    ? "प्राथमिक स्कूल भवन एवं मरम्मत" 
                    : "Primary School Building Reform"}
                </option>
                <option value={GrievanceCategory.OTHERS}>
                  {language === AppLanguage.MW 
                    ? "दूजा गांव का काम अर विषय (दूजी बातां)" 
                    : language === AppLanguage.HI 
                    ? "अन्य ग्रामीण विषय एवं मामले" 
                    : "Other Gram Panchayat Matters"}
                </option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.complainDesc}
              </label>
              <textarea
                required
                rows={3}
                placeholder={
                  language === AppLanguage.MW 
                    ? "जैस्यां की: वार्ड ४ में सूरज वाळो बोरिंग रो टांको पांच दिनां सूं पाणी चूवे है सा।"
                    : language === AppLanguage.HI 
                    ? "जैसे: वार्ड 4 में सौर बोरिंग जल पाइप कई दिनों से फटा हुआ है।"
                    : "E.g. The solar borewell tank has been leaking water for five days in ward 4."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.fullName}
              </label>
              <input
                required
                type="text"
                placeholder={
                  language === AppLanguage.MW 
                    ? "थारो पूरो नाम लिखो सा" 
                    : language === AppLanguage.HI 
                    ? "नागरिक का पूरा नाम दर्ज करें" 
                    : "Citizen Full Name"
                }
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {language === AppLanguage.MW 
                  ? "थारो मोबाईळ नंबर सा (संपर्क फोन)" 
                  : language === AppLanguage.HI 
                  ? "मोबाइल नंबर (संपर्क फोन)" 
                  : "Contact Phone Number"}
              </label>
              <input
                required
                type="text"
                placeholder={
                  language === AppLanguage.MW 
                    ? "जैस्यां की: 94140XXXXX" 
                    : language === AppLanguage.HI 
                    ? "जैसे: 94140XXXXX" 
                    : "E.g., 94140XXXXX"
                }
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* GPS button */}
            <button
              type="button"
              onClick={handleSimulateGPS}
              className={`w-full py-2 px-3 rounded-xl border text-[11px] font-sans font-semibold flex items-center justify-center space-x-1 transition cursor-pointer ${
                simLat
                  ? "bg-emerald-50 border-emerald-200 text-emerald-850"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 mr-0.5" />
              <span>
                {simLat 
                  ? `${simLat.toFixed(4)}, ${simLon?.toFixed(4)}` 
                  : t.locationGeo}
              </span>
            </button>

            {/* Real photo upload with drag-and-drop */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {language === AppLanguage.MW ? "फोटो जोड़ो सा (खींचो या अपलोड करो)" : language === AppLanguage.HI ? "फोटो संलग्न करें (खींचें या अपलोड करें)" : "Attach Photo (Drag & Drop or Upload)"}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
                  <img src={imageUrl} alt="Complaint photo" className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-emerald-700/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{language === AppLanguage.MW ? "फोटो जुड़ी सा" : language === AppLanguage.HI ? "फोटो संलग्न है" : "Photo Attached"}</span>
                  </span>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                    isDragging ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-orange-300 hover:bg-slate-50"
                  }`}
                >
                  <Camera className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600 font-medium font-sans">
                    {language === AppLanguage.MW ? "फोटो खींचो/छोड़ो या टेप करो सा" : language === AppLanguage.HI ? "फोटो खींचें/छोड़ें या टैप करें" : "Drag & drop or tap to upload photo"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{language === AppLanguage.HI ? "PNG, JPG, JPEG समर्थित" : "PNG, JPG, JPEG supported"}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-orange-700 transition shadow-sm cursor-pointer"
            >
              {submitFormButtonText}
            </button>
          </form>
        </div>
      </div>

      {/* Complaint monitor side column */}
      <div className="col-span-1 lg:col-span-7 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 font-sans text-md flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <span>{t.publicGrievancesWall}</span>
            </h3>
            <span className="hidden sm:inline-block bg-slate-100 text-slate-600 font-mono text-[9px] px-3 py-1 rounded-full border border-slate-200">
              {wardCountLabelText}
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {complaints.map((c) => {
              const esc = getEscalationStyleAndLabel(c);
              const customCategoryTranslation = language === AppLanguage.MW 
                ? (c.category === GrievanceCategory.WATER ? "पीवण रो पाणी" 
                  : c.category === GrievanceCategory.ROAD ? "रस्तो-सड़क" 
                  : c.category === GrievanceCategory.SANITATION ? "नाळी-सफ़ाई" 
                  : c.category === GrievanceCategory.ELECTRICITY ? "बिजली-खंभो" 
                  : c.category === GrievanceCategory.SCHOOL ? "स्कूल भवन" 
                  : "दूजी बातां")
                : language === AppLanguage.HI 
                ? (c.category === GrievanceCategory.WATER ? "पेयजल" 
                  : c.category === GrievanceCategory.ROAD ? "सड़क" 
                  : c.category === GrievanceCategory.SANITATION ? "स्वच्छता" 
                  : c.category === GrievanceCategory.ELECTRICITY ? "बिजली" 
                  : c.category === GrievanceCategory.SCHOOL ? "स्कूल भवन" 
                  : "अन्य विषय")
                : c.category;

              return (
                <div key={c.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50/70 hover:bg-slate-50 transition relative">
                  
                  {/* Category Tag Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold font-mono text-slate-400">#{c.id}</span>
                      <span className="bg-orange-50 text-orange-800 text-[10px] font-bold py-0.5 px-2.5 rounded-full border border-orange-200/50 font-sans uppercase">
                        {customCategoryTranslation}
                      </span>
                    </div>

                    {/* Esc Status badge */}
                    <span className={`text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-full border flex items-center space-x-1 ${esc.bg}`}>
                      {esc.icon}
                      <span>{esc.label}</span>
                    </span>
                  </div>

                  {/* NEW badge for freshly submitted complaints (visible to Sachiv) */}
                  {role === UserRole.OFFICIAL && c.status === GrievanceStatus.SUBMITTED && (
                    <div className="mb-2 flex items-center space-x-2">
                      <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full inline-block"></span>
                        <span>{language === AppLanguage.MW ? "नवी शिकायत सा" : language === AppLanguage.HI ? "नई शिकायत" : "NEW"}</span>
                      </span>
                      <span className="text-[10px] text-rose-600 font-semibold">
                        {language === AppLanguage.MW ? "तुरन्त ध्यान दो सा" : language === AppLanguage.HI ? "तत्काल कार्रवाई अपेक्षित" : "Awaiting Assignment"}
                      </span>
                    </div>
                  )}

                  {/* Body description */}
                  <p className="text-xs text-slate-705 leading-relaxed font-sans mb-3 pr-2 font-medium">
                    {getComplaintDescription(c)}
                  </p>

                  {/* Attached photo if present */}
                  {c.photoUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-200">
                      <img src={c.photoUrl} alt="Complaint evidence" className="w-full h-32 object-cover" />
                      <div className="bg-slate-50 px-3 py-1.5 flex items-center space-x-1.5 text-[10px] text-slate-500 font-sans border-t border-slate-100">
                        <ImageIcon className="h-3 w-3 text-slate-400" />
                        <span>{language === AppLanguage.MW ? "नागरिक द्वारा फोटो जोड़ी सा" : language === AppLanguage.HI ? "नागरिक द्वारा संलग्न फोटो" : "Photo evidence attached by citizen"}</span>
                      </div>
                    </div>
                  )}

                  {/* Citizen details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 border-t border-slate-200/50 pt-2.5 mb-3">
                    <div className="flex items-center space-x-1.5">
                      <UserCircle2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{reporterText}: <strong className="text-slate-800">{c.citizenName}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{contactCellText}: <strong className="text-slate-700">{c.phone}</strong></span>
                    </div>
                    <div>
                      <span>{wardAssignmentText}: <strong className="text-slate-800">
                        {language === AppLanguage.MW ? `वार्ड नंबर #${c.wardId}` : language === AppLanguage.HI ? `वार्ड नंबर #${c.wardId}` : `Ward #${c.wardId}`}
                      </strong></span>
                    </div>
                    <div>
                      <span>{assignedOfficerText}: <strong className="text-slate-800">{getComplaintOfficer(c)}</strong></span>
                    </div>
                  </div>

                  {/* SLA progress information */}
                  <div className="flex items-center space-x-4 text-xs font-sans pb-2">
                    <span className="text-slate-400 text-[10px]">{raisedDateText}: <strong className="font-mono text-slate-600">{c.submissionDate}</strong></span>
                    {c.status !== GrievanceStatus.RESOLVED && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span className="text-rose-600 font-bold">{c.slaDaysRemaining} {slaRemainingLabelText}</span>
                      </span>
                    )}
                  </div>

                  {/* Resolution Text display */}
                  {c.status === GrievanceStatus.RESOLVED && (
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-250 mt-2 text-[11px] text-emerald-800 leading-relaxed font-sans">
                      <p className="font-bold">{t.resolutionDetails}:</p>
                      <p className="italic">{getResolutionText(c)}</p>
                      <p className="text-[10px] text-emerald-600 font-mono mt-1">
                        {auditCompleteLabelText} {c.lastUpdated}.
                      </p>
                    </div>
                  )}

                  {/* SLA ESCALATION CONTROLLER (Simulate aged complaints for districts admins) */}
                  {role === UserRole.ADMIN && c.status !== GrievanceStatus.RESOLVED && (
                    <div className="bg-orange-50 border border-orange-200/50 rounded-xl p-3 mt-3">
                      <p className="text-[11px] font-bold text-orange-800 font-sans mb-2 flex items-center space-x-1">
                        <Shield className="h-3.5 w-3.5 text-orange-600" />
                        <span>{slamDrillLabel}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => triggerEscalationSimulation(c.id, EscalationLevel.BLOCK)}
                          className="bg-slate-900 text-orange-400 border border-slate-800 text-[10px] py-1.5 px-3 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        >
                          {escBlockButtonText}
                        </button>
                        <button
                          onClick={() => triggerEscalationSimulation(c.id, EscalationLevel.DISTRICT)}
                          className="bg-rose-600 text-white text-[10px] py-1.5 px-3 rounded-lg hover:bg-rose-700 transition cursor-pointer"
                        >
                          {escDistrictButtonText}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* RESOLVE ACTIONS PANEL (For Sachiv/Ward member roles) */}
                  {role === UserRole.OFFICIAL && c.status !== GrievanceStatus.RESOLVED && (
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      {activeResId === c.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={resText}
                            onChange={(e) => setResText(e.target.value)}
                            placeholder={resolutionFormPlaceholderText}
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleResolveGrievance(c.id)}
                              className="bg-emerald-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                            >
                              {confirmResolutionButtonText}
                            </button>
                            <button
                              onClick={() => setActiveResId(null)}
                              className="text-slate-500 text-xs py-1.5 px-3 hover:text-slate-800 transition cursor-pointer"
                            >
                              {cancelButtonText}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveResId(c.id);
                            setResText("");
                          }}
                          className="bg-slate-800 text-white font-semibold text-xs py-2 px-3.5 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                        >
                          {logLocalResolutionButtonText}
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
