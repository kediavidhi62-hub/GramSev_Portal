import React from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, FundAllocation } from "../types";
import { Landmark, AlertTriangle, Coins, Receipt, ArrowUpRight, CheckSquare, Sparkles } from "lucide-react";
import ReadAloud from "./ReadAloud";

interface TransparencyProps {
  language: AppLanguage;
  fundAllocations: FundAllocation[];
}

// Map for translating seeded/preloaded fund entries to each language nicely, preventing mixed language.
const SEED_FUND_TRANSLATIONS: Record<string, {
  title: { EN: string; HI: string; MW: string };
  description: { EN: string; HI: string; MW: string };
}> = {
  "FUND-01": {
    title: {
      EN: "Drinking water solar pump installations & upkeep",
      HI: "पेयजल सौर पंप स्थापना और रखरखाव",
      MW: "पीवण रा पाणी रो सूरज वाळो पंप लगावणो अर संभालणो सा"
    },
    description: {
      EN: "Installation of borewell sets, piping linkages to remote households in Ward 4 & 5.",
      HI: "वार्ड 4 और 5 में दूरदराज के घरों में पाइपिंग कनेक्शन के साथ बोरवेल सेट की स्थापना।",
      MW: "वार्ड ४ अर ५ माथै दूर-दूर बण्या घरां तईं पाणी रो पाईप अर बोरिंग लगावणो सा।"
    }
  },
  "FUND-02": {
    title: {
      EN: "Concrete pathway and brick lanes laying",
      HI: "कंक्रीट और ईंटों के मुख्य रास्ते का निर्माण",
      MW: "पक्की सड़क अर ईंटां रा खड़ंजा रो निर्माण"
    },
    description: {
      EN: "Paving dusty loose pathways near schools to ensure safe walkability for elderly and kids.",
      HI: "बुजुर्गों और बच्चों के लिए सुरक्षित चलने को सुनिश्चित करने के लिए स्कूलों के पास धूल भरे कच्चे रास्तों को पक्का करना।",
      MW: "बूढ़ा-बाळ अर टाबरां रे स्कूल जावे जको रस्ते री कीचड़ अर धूळ साफ़ कर पक्को रस्तो बणावणो सा।"
    }
  },
  "FUND-03": {
    title: {
      EN: "Old-age Social Security Pensions disbursement",
      HI: "वृद्धावस्था सामाजिक सुरक्षा पेंशन संवितरण",
      MW: "बूढ़ा लोगां री बुढ़ापा पेंशन रो बंटवारो सा"
    },
    description: {
      EN: "Allocating monthly budget credits of ₹1000 to qualified elderly residents directly.",
      HI: "पात्र वृद्ध निवासियों को सीधे ₹1000 का मासिक पेंशन बजट आवंटित करना।",
      MW: "योग्य बुज़ुर्ग दादा-दादी ने महीना री १००० रुपया री पेंशन रो बजट खता में सिधो भेजणो सा।"
    }
  }
};

export default function Transparency({ language, fundAllocations }: TransparencyProps) {
  const t = TRANSLATIONS[language];

  // Calculate Aggregates
  const totalAllocated = fundAllocations.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
  const totalSpent = fundAllocations.reduce((acc, curr) => acc + curr.spentAmount, 0);
  const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  // Compliance warning parameters
  const complianceChecklist = [
    {
      text: {
        EN: "Uploaded Sanganer Gram Panchayat annual Gram Panchayat Development Plan (GPDP) to eGramSwaraj portal.",
        HI: "ई-ग्रामस्वराज पोर्टल पर सांगानेर ग्राम पंचायत की वार्षिक विकास योजना (GPDP) अपलोड की गई।",
        MW: "ई-ग्रामस्वराज पोर्टल माथै सांगानेर ग्राम पंचायत री सालाना विकास योजना (GPDP) अपलोड कर दी है सा।"
      },
      passed: true
    },
    {
      text: {
        EN: "Aadhaar authentication of 100% active MNREGA worker job cards mapped securely.",
        HI: "सभी सक्रिय मनरेगा श्रमिकों के जॉब कार्ड का आधार प्रमाणीकरण सुरक्षित रूप से मैप किया गया।",
        MW: "सगळा चालू मनरेगा कामगारां रा जॉब कार्ड रो आधार सत्यापन मळाय दियो है सा।"
      },
      passed: true
    },
    {
      text: {
        EN: "Geo-tagged photograph verification of all works under the 15th Finance Commission completed.",
        HI: "15वें वित्त आयोग के तहत सभी कार्यों का जियो-टैग्ड फोटो सत्यापन पूरा हुआ।",
        MW: "१५वां वित्त आयोग रा सगळा कामां री जियो-टैग वाली फोटो री जांच पूरी होग्यारी है सा।"
      },
      passed: true
    },
    {
      text: {
        EN: "Submission of audited finance statement and utilization certificates to the Union District Treasury for Jaipur Block.",
        HI: "जयपुर ब्लॉक के लिए जिला ट्रेजरी को परीक्षित वित्तीय विवरण और उपयोगिता प्रमाण पत्र प्रस्तुत करना।",
        MW: "जयपुर ब्लॉक सारू जिला ट्रेजरी ने जांची ग्याड़ी रुपियां रो हिसाब (U.C.) भेजणो बाकी है सा।"
      },
      passed: false
    }
  ];

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "INFRASTRUCTURE": return "bg-slate-100 text-slate-800 border-slate-200";
      case "WELFARE": return "bg-rose-50 text-rose-850 border-rose-200";
      case "WATER_SANITATION": return "bg-sky-50 text-sky-850 border-sky-00";
      default: return "bg-orange-50 text-orange-850 border-orange-200";
    }
  };

  const getCategoryLabel = (type: string) => {
    if (language === AppLanguage.MW) {
      switch (type) {
        case "INFRASTRUCTURE": return "रस्तो-मकान";
        case "WELFARE": return "लोक भलाई";
        case "WATER_SANITATION": return "पाणी अर सफ़ाई";
        default: return "दूजी बातां";
      }
    } else if (language === AppLanguage.HI) {
      switch (type) {
        case "INFRASTRUCTURE": return "बुनियादी ढांचा";
        case "WELFARE": return "जनकल्याण";
        case "WATER_SANITATION": return "पेयजल एवं स्वच्छता";
        default: return "अन्य";
      }
    }
    return type;
  };

  const getFundTitle = (alloc: FundAllocation) => {
    const seed = SEED_FUND_TRANSLATIONS[alloc.id];
    if (seed) {
      if (language === AppLanguage.MW) return seed.title.MW;
      if (language === AppLanguage.HI) return seed.title.HI;
      return seed.title.EN;
    }
    return alloc.title;
  };

  const getFundDescription = (alloc: FundAllocation) => {
    const seed = SEED_FUND_TRANSLATIONS[alloc.id];
    if (seed) {
      if (language === AppLanguage.MW) return seed.description.MW;
      if (language === AppLanguage.HI) return seed.description.HI;
      return seed.description.EN;
    }
    return alloc.description;
  };

  // Safe Text Selectors for Multi-lingual Support
  const subHeaderPara = language === AppLanguage.MW
    ? "गांव रा रुपियां री जांच अर सरकारी खजाने सूं आयेड़ा बजट री पूरी संभाल सा।"
    : language === AppLanguage.HI
    ? "ग्राम ऑडिट को सशक्त बनाना और सीधे केंद्रीय अनुदान से आवक को ट्रैक करना।"
    : "Empowering village audits and tracking inflows from Union grants directly.";

  const inflowGrantsSub = language === AppLanguage.MW
    ? "१५वां वित्त आयोग + राज्य सरकार रो अनुदान सा"
    : language === AppLanguage.HI
    ? "15वां वित्त आयोग + राज्य अनुदान"
    : "15th Finance Commission + State Grants";

  const spentGrantsSub = language === AppLanguage.MW
    ? "सगळो जांच्योड़ो खर्चो मंजूर होग्यो सा"
    : language === AppLanguage.HI
    ? "सभी जाँचे गए खर्चे स्वीकृत"
    : "All Audited Spending Cleared";

  const approvedSuffix = language === AppLanguage.MW
    ? "पूरो मंजूर सा"
    : language === AppLanguage.HI
    ? "स्वीकृत"
    : "APPROVED";

  const complianceBlockHeader = language === AppLanguage.MW
    ? "बजट रोकण री चेतावणी अर नियम सा"
    : language === AppLanguage.HI
    ? "अनुदान रुकने का जोखिम एवं अनुपालन चेतावनी"
    : "FUND BLOCKADE RISK COMPLIANCE ALERTS";

  const complianceAlertDesc = language === AppLanguage.MW
    ? "ऑडिट करीड़ी ग्राम विकास योजनावां (GPDP) अर फोटो री टैगिंग टेम माथै चढ़ावणो घणो जरुरी है सा, नीं तो सरकार आगली किश्त रोक देसी सा।"
    : language === AppLanguage.HI
    ? "ऑडिट की गई ग्राम विकास योजनाओं (GPDP) और जियो-टैग संरचनाओं को समय पर अपलोड करना सीधे बाद के वित्त आयोग के अनुदान को नियंत्रित करता है। विफलता से बजट रुक जाता है।"
    : "Timely uploading of audited village development plans (GPDP) and geo-tagged structures directly governs subsequent tranches of Finance Commission grants. Failure triggers fund blocks.";

  const complianceMet = language === AppLanguage.MW
    ? "✓ नियम पूरा कर दिया सा"
    : language === AppLanguage.HI
    ? "✓ अनुपालन पूर्ण"
    : "✓ MET COMPLIANCE";

  const compliancePending = language === AppLanguage.MW
    ? "✗ कार्रवाई करणी पड़सी सा"
    : language === AppLanguage.HI
    ? "✗ कार्रवाई आवश्यक"
    : "✗ ACTION REQUIRED";

  const ledgerHeader = language === AppLanguage.MW
    ? "बजट रो बही-खातो अर बांटण रो नकसो सा"
    : language === AppLanguage.HI
    ? "बजट बही-खाता एवं आवंटन प्रदर्शक"
    : "Budget Ledger & Allocation Visualizer";

  const chartTitle = language === AppLanguage.MW
    ? "१५वां वित्त आयोग श्रेणीवार रुपियां रो खर्चो (₹ लाख में) सा"
    : language === AppLanguage.HI
    ? "15वें वित्त आयोग श्रेणीवार व्यय विवरण (₹ लाख में)"
    : "15th Finance Commission Category Expenditure Breakdown (₹ Lakhs)";

  const chartLabelWater = language === AppLanguage.MW ? "पाणी सा" : language === AppLanguage.HI ? "पानी" : "WATER";
  const chartLabelRoads = language === AppLanguage.MW ? "रस्तो सा" : language === AppLanguage.HI ? "सड़क" : "ROADS";
  const chartLabelWelfare = language === AppLanguage.MW ? "भलाई सा" : language === AppLanguage.HI ? "कल्याण" : "WELFARE";

  const chartAllocatedRingText = language === AppLanguage.MW
    ? "सगळो बांट्योड़ो बजट सा"
    : language === AppLanguage.HI
    ? "कुल आवंटित बजट सीमा"
    : "Total Allocated Budget Ring";

  const utilizationInsightsHeader = language === AppLanguage.MW
    ? "बजट री समझ सा:"
    : language === AppLanguage.HI
    ? "उपयोगिता विश्लेषण:"
    : "Utilization Insights:";

  const utilizationInsightsDesc = language === AppLanguage.MW
    ? "पीवण रा पाणी अर सफ़ाई माथै सगळो सूं बत्तो खर्चो कर्यो है सा, जणूं पाछै रस्ता रो काम है सा। कम बजट री चेतावणी खाता में अपने आप दीख जावे सा।"
    : language === AppLanguage.HI
    ? "पेयजल और स्वच्छता में सबसे अधिक भुगतान हुआ है, इसके बाद सड़क निर्माण कार्य हैं। कम बजट की चेतावनी वित्तीय खातों में स्वचालित रूप से आती है।"
    : "Water and Sanitation enjoys the highest payout index, closely followed by Road laying assets. Underfunded block warnings occur automatically in secondary accounting ledgers.";

  const spentLabel = language === AppLanguage.MW ? "खर्चो:" : language === AppLanguage.HI ? "खर्च:" : "Spent:";
  const allocatedLabel = language === AppLanguage.MW ? "बांट्योड़ो बजट:" : language === AppLanguage.HI ? "आवंटित:" : "Allocated:";

  const financialYearText = language === AppLanguage.MW
    ? "(वर्ष: २०२५-२६) सा"
    : language === AppLanguage.HI
    ? "(वित्तीय वर्ष: 2025-26)"
    : "(FY: 2025-26)";

  return (
    <div id="transparency-page-content" className="space-y-6">
      
      {/* Upper header block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start space-x-3">
          <div className="bg-orange-50 text-orange-700 p-2 rounded-xl shrink-0 border border-orange-100">
            <Coins className="h-6 w-6 text-orange-650" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans mt-0.5">
              {t.revenueDashboard}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {subHeaderPara}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <ReadAloud language={language} targetSelector="#transparency-page-content" />
        </div>
      </div>

      {/* Aggregate KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        
        {/* KPI Inflow */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-150 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">{t.inflowGrants} {financialYearText}</span>
            <strong className="text-xl font-bold font-sans text-slate-900">₹{totalAllocated.toLocaleString("en-IN")}</strong>
            <p className="text-[10px] text-slate-400 font-mono">{inflowGrantsSub}</p>
          </div>
          <div className="bg-orange-50 text-orange-700 p-3 rounded-xl border border-orange-100">
            <Landmark className="h-6 w-6" />
          </div>
        </div>

        {/* KPI spent */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-150 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">{t.spentGrants} {financialYearText}</span>
            <strong className="text-xl font-bold font-sans text-slate-900">₹{totalSpent.toLocaleString("en-IN")}</strong>
            <p className="text-[10px] text-emerald-600 font-mono">{spentGrantsSub}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100">
            <Receipt className="h-6 w-6" />
          </div>
        </div>

        {/* KPI utilization */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-150 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">{t.utilizationIndex}</span>
            <strong className="text-xl font-bold font-sans text-orange-700">{utilizationRate.toFixed(1)}% {approvedSuffix}</strong>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 max-w-[120px]">
              <div
                className="bg-orange-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${utilizationRate}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-sky-50 text-sky-700 p-3 rounded-xl border border-sky-150">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        {/* COMPLIANCE BLOCK ALERT MATRIX */}
        <div className="col-span-1 lg:col-span-4 bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-rose-800">
            <AlertTriangle className="h-5 w-5 text-rose-600 animate-bounce" />
            <strong className="text-sm font-bold font-sans uppercase">{complianceBlockHeader}</strong>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            {complianceAlertDesc}
          </p>

          <div className="space-y-3">
            {complianceChecklist.map((item, idx) => {
              const itemText = language === AppLanguage.MW 
                ? item.text.MW 
                : language === AppLanguage.HI 
                ? item.text.HI 
                : item.text.EN;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs transition duration-150 ${
                    item.passed
                      ? "bg-emerald-500/5 border-emerald-100 text-emerald-850"
                      : "bg-rose-500/5 border-rose-100 text-rose-850 animate-pulse"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 rounded-full p-0.5 border ${
                    item.passed ? "text-emerald-700 border-emerald-300 bg-emerald-50" : "text-rose-700 border-rose-300 bg-rose-50"
                  }`}>
                    <CheckSquare className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold">
                      {item.passed ? complianceMet : compliancePending}
                    </p>
                    <p className="text-slate-550 leading-relaxed mt-0.5 italic">{itemText}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* CUSTOM BESPOKE SVG ANIMATED BAR CHART & BUDGET LIST */}
        <div className="col-span-1 lg:col-span-8 bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-sans uppercase flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-orange-500" />
              <span>{ledgerHeader}</span>
            </h3>
          </div>

          {/* Interactive Chart drawing Area */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-150">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 text-center tracking-wider font-mono">
              {chartTitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* Chart SVG */}
              <div className="flex justify-center">
                <svg width="250" height="180" viewBox="0 0 250 180" className="w-full max-w-[250px]">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="230" y2="20" stroke="#e2e8f0" strokeDasharray="3" />
                  <line x1="40" y1="60" x2="230" y2="60" stroke="#e2e8f0" strokeDasharray="3" />
                  <line x1="40" y1="100" x2="230" y2="100" stroke="#e2e8f0" strokeDasharray="3" />
                  <line x1="40" y1="140" x2="230" y2="140" stroke="#94a3b8" />

                  {/* Allocated bars */}
                  {/* Water sanitation: Allocated 12L (Ratio relative to 12L maximum, we adjust height) */}
                  <rect x="70" y="40" width="22" height="100" fill="#1e293b" rx="2" />
                  <rect x="70" y="65" width="22" height="75" fill="#0284c7" rx="2" />

                  {/* Infra roads: Allocated 14L, spent 11L */}
                  <rect x="130" y="24" width="22" height="116" fill="#1e293b" rx="2" />
                  <rect x="130" y="49" width="22" height="91" fill="#475569" rx="2" />

                  {/* Welfare pensions: Allocated 8L, spent 8L */}
                  <rect x="190" y="72" width="22" height="68" fill="#1e293b" rx="2" />
                  <rect x="190" y="72" width="22" height="68" fill="#e11d48" rx="2" />

                  {/* Labels */}
                  <text x="81" y="156" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">{chartLabelWater}</text>
                  <text x="141" y="156" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">{chartLabelRoads}</text>
                  <text x="201" y="156" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">{chartLabelWelfare}</text>

                  {/* Axis Legend numbers */}
                  <text x="32" y="24" textAnchor="end" fontSize="8" fontWeight="bold" fill="#94a3b8" className="font-mono">14L</text>
                  <text x="32" y="64" textAnchor="end" fontSize="8" fontWeight="bold" fill="#94a3b8" className="font-mono">10L</text>
                  <text x="32" y="104" textAnchor="end" fontSize="8" fontWeight="bold" fill="#94a3b8" className="font-mono">5L</text>
                  <text x="32" y="144" textAnchor="end" fontSize="8" fontWeight="bold" fill="#94a3b8" className="font-mono">0</text>
                </svg>
              </div>

              {/* Chart Legend description */}
              <div className="space-y-3 shrink-0 text-left">
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <span className="w-3 h-3 bg-slate-850 rounded"></span>
                  <span>{chartAllocatedRingText}</span>
                </div>

                <div className="space-y-1.5 font-sans">
                  <p className="text-xs font-semibold text-slate-800">{utilizationInsightsHeader}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">
                    {utilizationInsightsDesc}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Allocation itemized table view */}
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {fundAllocations.map((alloc) => (
              <div key={alloc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-bold font-mono text-slate-400">#{alloc.id}</span>
                    <span className={`text-[9px] font-extrabold uppercase py-0.5 px-2 rounded-full border ${getCategoryColor(alloc.type)}`}>
                      {getCategoryLabel(alloc.type)}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 font-sans">{getFundTitle(alloc)}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-1">{getFundDescription(alloc)}</p>
                </div>

                <div className="text-right sm:shrink-0 font-sans">
                  <p className="text-xs font-bold text-slate-800">
                    {spentLabel} <strong className="text-emerald-700 font-bold">₹{alloc.spentAmount.toLocaleString("en-IN")}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {allocatedLabel} ₹{alloc.allocatedAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
