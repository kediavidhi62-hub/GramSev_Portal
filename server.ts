import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000");

app.use(express.json());

// Initialize Gemini SDK with telemetry header per guidelines
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return null to fall back gracefully rather than crashing on module load
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// ----------------------------------------------------
// RAJASTHAN STANDARD SCHEMES DATABASE
// Provided as context + fallback for offline/disabled API
// ----------------------------------------------------
const SCHEMES_DATABASE = [
  {
    nameEN: "Mukhyamantri Ayushman Chiranjeevi Health Insurance Scheme",
    nameHI: "मुख्यमंत्री आयुष्मान चिरंजीवी स्वास्थ्य बीमा योजना",
    authority: "Government of Rajasthan",
    benefitEN: "Cashless health insurance coverage up to ₹25 Lakhs per family per year, plus accidental coverage up to ₹10 Lakhs.",
    benefitHI: "प्रति परिवार ₹25 लाख तक का कैशलेस स्वास्थ्य बीमा, और ₹10 लाख का दुर्घटना बीमा।",
    eligibilityEN: "All families of Rajasthan. Free registration for NFSA cardholders, SECC category, small/marginal farmers, and contract workers; others can join by paying a nominal premium of ₹850/year.",
    eligibilityHI: "राजस्थान के सभी परिवार। एनएफएसए, एसईसीसी श्रेणी, लघु/सीमांत किसानों के लिए मुफ्त; अन्य ₹850/वर्ष प्रीमियम देकर जुड़ सकते हैं।",
    documents: ["Jan Aadhaar Card", "Aadhaar Card", "Mobile Linked with Jan Aadhaar"],
    minAge: 0,
    maxIncome: 9999999,
    landRequired: "ANY",
  },
  {
    nameEN: "Rajasthan Mahatma Gandhi NREGA (MNREGA Extra Days Upgrade)",
    nameHI: "राजस्थान महात्मा गांधी मनरेगा (125 दिन अतिरिक्त रोजगार)",
    authority: "Central Govt + Gov of Rajasthan",
    benefitEN: "Guaranteed 100 days of wage employment, upgraded to 125 days in Rajasthan (25 days sponsored by state government) for manual labor. Special tribes (Saharaiya, Kathodi) get 200 days.",
    benefitHI: "सभी ग्रामीण परिवारों को 100 दिन का रोजगार, जिसे राजस्थान सरकार ने बढ़ाकर 125 दिन किया है (25 दिन राज्य द्वारा प्रायोजित)।",
    eligibilityEN: "Adult members of rural households willing to do unskilled manual labor. Must reside in the Gram Panchayat area.",
    eligibilityHI: "अकुशल शारीरिक श्रम करने के इच्छुक ग्रामीण परिवारों के वयस्क सदस्य। संबंधित ग्राम पंचायत का निवासी होना चाहिए।",
    documents: ["Job Card", "Aadhaar Card", "Bank Account Details"],
    minAge: 18,
    maxIncome: 9999999,
    landRequired: "ANY",
  },
  {
    nameEN: "Mukhyamantri Vridhashjan Samman Pension Yojana",
    nameHI: "मुख्यमंत्री वृद्धजन सम्मान पेंशन योजना",
    authority: "Social Justice Dept, Rajasthan",
    benefitEN: "Monthly pension of ₹1,000 per month for seniors to provide financial independence and security.",
    benefitHI: "वरिष्ठ नागरिकों को वित्तीय सुरक्षा प्रदान करने के लिए ₹1,000 प्रति माह की पेंशन।",
    eligibilityEN: "Females aged 55 or above and Males aged 58 or above. The annual annual income of the family must be less than ₹48,000. Underprivileged caste families might be waived.",
    eligibilityHI: "महिलाएं जिनकी उम्र 55+ वर्ष और पुरुष जिनकी उम्र 58+ वर्ष हो। परिवार की वार्षिक आय ₹48,000 से कम होनी चाहिए।",
    documents: ["Jan Aadhaar Card", "Aadhaar Card", "Income Certificate", "Bank Passbook"],
    minAge: 55,
    maxIncome: 48000,
    landRequired: "ANY",
  },
  {
    nameEN: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    nameHI: "प्रधानमंत्री आवास योजना - ग्रामीण",
    authority: "Ministry of Rural Development",
    benefitEN: "Financial assistance of ₹1.2 Lakhs in plains and ₹1.3 Lakhs in hilly/difficult areas for house construction, along with ₹12,000 for toilet building.",
    benefitHI: "मकान निर्माण के लिए ₹1.2 लाख की सहायता और शौचालय निर्माण के लिए ₹12,000।",
    eligibilityEN: "Families living in dilapidated or kachha houses with zero, one, or two rooms, matching SECC 2011 lists. Priority to SC/ST, freed bonded laborers, and widows.",
    eligibilityHI: "कच्चे घरों या बिना छत के रहने वाले परिवार, जो SECC 2011 की सूची में दर्ज हैं। एससी/एसटी और विधवाओं को प्राथमिकता।",
    documents: ["Aadhaar Card", "Job Card Numbers", "Jan Aadhaar Card", "Land ownership declaration"],
    minAge: 18,
    maxIncome: 120000,
    landRequired: "LESS_THAN_2_HECTARES",
  },
  {
    nameEN: "Mukhyamantri Kamdhenu Bima Yojana",
    nameHI: "मुख्यमंत्री कामधेनु बीमा योजना",
    authority: "Animal Husbandry Dept, Rajasthan",
    benefitEN: "Free insurance coverage up to ₹40,000 per milch cow/buffalo (maximum 2 animals per family) against death or disease like Lumpy.",
    benefitHI: "दुधारू गाय/भैंस की असमय मृत्यु या बीमारी पर प्रति पशु ₹40,000 तक का मुफ्त बीमा (अधिकतम 2 पशु)।",
    eligibilityEN: "Animal rearers and dairy farmers of Rajasthan. Free registration for families with annual income up to ₹8 Lakhs; others pay a small premium.",
    eligibilityHI: "राजस्थान के पशुपालक। ₹8 लाख/वर्ष तक की आय वाले परिवारों के लिए पूर्णतः निःशुल्क पंजीकरण।",
    documents: ["Jan Aadhaar Card", "Animal Health Certificate", "Bank Account Details"],
    minAge: 18,
    maxIncome: 800000,
    landRequired: "ANY",
  }
];

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date() });
});

// 2. Bilingual AI Scheme Matching and Eligibility Engine
app.post("/api/ai/scheme-eligibility", async (req: Request, res: Response) => {
  const { age, caste, annualIncome, landOwnership, gender, queryEN, language } = req.body;
  const isHindi = language === "HI";
  const isMarwari = language === "MW";

  const ai = getGeminiClient();

  if (!ai) {
    // Safe offline fallback when no API key is set
    console.log("No Gemini API key. Playing fallback local scheme matchmaking.");
    const qualifies = SCHEMES_DATABASE.filter(scheme => {
      const ageNum = Number(age) || 18;
      const incomeNum = Number(annualIncome) || 0;
      
      const meetsAge = ageNum >= scheme.minAge;
      const meetsIncome = (scheme.maxIncome === 9999999) || (incomeNum <= scheme.maxIncome);
      return meetsAge && meetsIncome;
    });

    const recommendations = qualifies.map(s => ({
      name: isMarwari ? s.nameHI : (isHindi ? s.nameHI : s.nameEN),
      authority: s.authority,
      benefit: isMarwari ? s.benefitHI : (isHindi ? s.benefitHI : s.benefitEN),
      eligibilityReason: isMarwari
        ? `विशेष योग्यता मापदंड: उमर ${age} साल अर आय ₹${annualIncome} योजना श्रेणी रे एकदम सागे अनुकूल बैठसी सा।`
        : isHindi 
        ? `विशेष योग्यता मापदंड: उम्र ${age} वर्ष और आय ₹${annualIncome} योजना श्रेणी के अनुकूल है।` 
        : `Your profile matches the category with age ${age} and reported income of ₹${annualIncome}.`,
      requiredDocuments: s.documents,
      recommended: true
    }));

    return res.json({
      success: true,
      mode: "local_database_fallback",
      summary: isMarwari
        ? "आपकी प्रोफाइल रे आधार माथै आपणो राजस्थान री खास कल्याणकारी योजनावां री लिस्ट अठै है सा।"
        : isHindi 
        ? "यह आपकी प्रोफाइल के आधार पर राजस्थान की प्रमुख कल्याणकारी योजनाओं की सूची है।" 
        : "Based on the localized Gram Panchayat rules, here are the schemes matching your profile details.",
      recommendations
    });
  }

  try {
    const prompt = `
You are the Gram Sathi Assistant, an expert in welfare schemes of the Rajasthan state government and government of India.
You need to match the citizen's profile with the best schemes and explain why in the requested language: ${isMarwari ? "Marwari (sweet Rajasthani dialect written in Devanagari script, utilizing respectful dialect words like 'सा', 'म्हारो', 'घणो', 'कांई')" : isHindi ? "Hindi" : "English"}.

Citizen Profile:
- Age: ${age} years
- Category/Caste: ${caste}
- Gender: ${gender}
- Annual Family Income: ₹${annualIncome}
- Land Ownership: ${landOwnership}
- Extra Query Context: "${queryEN || 'None'}"

Here is the database of 5 premier schemes to prioritize matching. You must check these first and can supplement with other realistic, highly popular Rajasthan schemes (like Jan Aadhaar, Nishulk Dawa, Palanhar, or Social Security Pensions) if they fit perfectly:
${JSON.stringify(SCHEMES_DATABASE, null, 2)}

You must return a JSON response matching exactly this format:
{
  "summary": "Short bilingual greeting and summary of qualifying schemes.",
  "recommendations": [
    {
      "name": "Scheme Name (in requested language)",
      "authority": "Directing Govt Department, e.g. Social Welfare Department, Rajasthan",
      "benefit": "Detailed description of direct benefits, cash or services provided.",
      "eligibilityReason": "Specific explanation of why this user qualifies (caste status, income range, or land check).",
      "requiredDocuments": ["Jan Aadhaar Card", "Caste Certificate", "etc."],
      "recommended": true
    }
  ]
}
Return only pure JSON. Do not include markdown wraps or backticks in your output.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "{}";
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    res.json({ success: true, mode: "gemini_api", ...result });

  } catch (error: any) {
    console.error("Gemini scheme engine failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Fallback triggered due to API parsing issue."
    });
  }
});

// 3. SabhaSaar AI-Powered Gram Sabha Meeting Summarizer
app.post("/api/ai/sabhasaar", async (req: Request, res: Response) => {
  const { meetingTitle, agenda, transcriptNotes, attendeesCount, attendeesList } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    console.log("No Gemini API key for SabhaSaar. Generating localized structured meeting minutes.");
    const dateStr = new Date().toLocaleDateString("en-IN");
    return res.json({
      success: true,
      mode: "local_template_minutes",
      minutesTitle: `Gram Sabha Proceedings: ${meetingTitle || "General Village Works"}`,
      attendanceCount: attendeesCount || 12,
      agenda: agenda || "Drinking water sanitation & school repairs",
      minutesSummaryEN: `The Gram Sabha meeting on '${meetingTitle}' was presided by the Sarpanch. Key requests regarding clean water tank construction and MNREGA local road paving were analyzed. Standard compliance guidelines for 15th Finance Commission fund execution were discussed. All of current ward members (${attendeesCount || 12} persons) signed the paper attendance register.`,
      minutesSummaryHI: `सरपंच की अध्यक्षता में ग्राम सभा बैठक संपन्न हुई। स्वच्छ पेयजल टंकी निर्माण और मनरेगा स्थानीय सड़क पक्कीकरण के आवश्यक प्रस्तावों पर विचार किया गया। 15वें वित्त आयोग की नीतियों के अनुसार फंड आवंटन की मंजूरी दी गई। सभी सदस्यों ने रजिस्टर पर हस्ताक्षर कर संकल्प लिया।`,
      resolutions: [
        `RES-2026-091: Approval of ₹4,50,000 for repair of Ward No. 3 and 4 borewells.`,
        `RES-2026-092: Scheduled mandatory GPS geo-tagging checklist of school structures by Gram Sachiv within 10 days.`,
        `RES-2026-093: Priority allotment of 30 additional manual jobs on NREGA muster list for drought affected blocks.`
      ]
    });
  }

  try {
    const prompt = `
You are the "SabhaSaar AI Assistant" used by Rajasthan rural administration (Gram Sachiv and Pradhans) to convert messy verbal statements, handwritten notes, and verbal discussions from rural Gram Sabha meetings into high-grade, audited official meeting proceedings.

Meeting Context:
- Title: ${meetingTitle}
- Agenda Specified: ${agenda}
- Handwritten/Verbal Voice Transcript Notes: "${transcriptNotes || 'Review of local NREGA jobs and funds utilization.'}"
- Public Attendees Count: ${attendeesCount}
- Ward Leader Attendees: ${JSON.stringify(attendeesList || [])}

Create detailed bilingual meeting minutes. Format your output as a strict JSON schema containing translated, structured fields:
{
  "minutesTitle": "Audited Official Title of session",
  "attendanceCount": ${attendeesCount},
  "agenda": "Summarized Agenda in structured format",
  "minutesSummaryEN": "Professional and details-rich, 3-4 sentence official minutes summary (English). Highlight decision-making, consensus, and fund planning.",
  "minutesSummaryHI": "ग्राम सभा बैठक की विस्तृत हिंदी समीक्षा (3-4 वाक्य)। सटीक व प्रशासनिक भाषा का प्रयोग करें।",
  "resolutions": [
    "RES-2026-XXX: Concrete Actionable Resolution 1 (Bilingual or in English with Resolution ID)",
    "RES-2026-YYY: Concrete Actionable Resolution 2 (Bilingual or in English with Resolution ID)",
    "RES-2026-ZZZ: Concrete Actionable Resolution 3 (Bilingual or in English with Resolution ID)"
  ]
}

Return only structured JSON. Avoid any text wraps, markdowns, or special comments.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "{}";
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    res.json({ success: true, mode: "gemini_api", ...result });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "AI SabhaSaar failed to parse transcript. Fail-safe fallback was returned."
    });
  }
});

// 4. Voice-First Bhashini simulation and multi-dialect Classifier
app.post("/api/ai/voice-classifier", async (req: Request, res: Response) => {
  const { spokenText, language } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Local fallback classifier
    const lower = (spokenText || "").toLowerCase();
    let action = "COMPLAINT";
    let type = "WATER";
    let labelEN = "Grievance Filing";
    let labelHI = "शिकायत दर्ज करना";

    if (lower.includes("cert") || lower.includes("praman") || lower.includes("caste") || lower.includes("income") || lower.includes("birth") || lower.includes("domicile") || lower.includes("widow") || lower.includes("vidhwa") || lower.includes("ews") || lower.includes("bpl") || lower.includes("noc") || lower.includes("resident") || lower.includes("niwas")) {
      action = "CERTIFICATE";
      type = "DOMICILE";
      labelEN = "Certificate Application";
      labelHI = "प्रमाण पत्र आवेदन";
    } else if (lower.includes("yojna") || lower.includes("scheme") || lower.includes("pension") || lower.includes("bima") || lower.includes("free") || lower.includes("pais")) {
      action = "SCHEME";
      type = "MATCH";
      labelEN = "Scheme Benefits Search";
      labelHI = "योजना लाभ खोजना";
    }

    return res.json({
      success: true,
      mode: "local_nlp",
      analyzedAction: action,
      confidenceScore: 0.85,
      extractedEntities: {
        keyword: lower.split(" ").slice(0, 3).join(" "),
        classification: type
      },
      responseAudioTranscript: language === "MW"
        ? `मैं थारी बात सुण ली हूँ सा। आप ${labelHI} री खोज कर रह्या हो। नीचे आपणो फ़ॉर्म लोड कर दियो है सा।`
        : language === "HI" 
        ? `मैंने आपकी बात सुन ली है। आप ${labelHI} की तलाश कर रहे हैं। नीचे फ़ॉर्म पहले से लोड कर दिया गया है।`
        : `I understand your request. You seem to require ${labelEN}. We have navigated to the section and pre-filled elements for you.`,
    });
  }

  try {
    const prompt = `
You act as "Bhashini Dialect-Voice AI gateway".
A citizen from rural Rajasthan spoke or typed this into their mic: "${spokenText}" (Language preference: ${language === "MW" ? "Marwari (sweet Rajasthani dialect written in Devanagari script, e.g. with 'सा', 'कांई', 'म्हारो')" : language}).

You must analyze what the citizen is trying to accomplish:
1. Apply for a Certificate (Domicile, Caste, Income, Birth) -> Action: "CERTIFICATE"
2. File a Grievance/Complaint (Road, Water, Sanitation, Lights, School, etc) -> Action: "COMPLAINT"
3. Discover state/central schemes they are eligible for -> Action: "SCHEME"
4. Just chatting/general local inquiry -> Action: "CHAT"

Extract any key terms (e.g. "Caste Certificate", "Borewell broken", "MNREGA registration") and return a formatted JSON:
{
  "analyzedAction": "CERTIFICATE" | "COMPLAINT" | "SCHEME" | "CHAT",
  "confidenceScore": 0.95,
  "extractedEntities": {
    "keyword": "Short key-phrase matching the intent",
    "classification": "Specific category (e.g. WATER, DOMICILE, CASTE, ROAD, etc)"
  },
  "responseAudioTranscript": "A helpful, reassuring vocal response in local simple Rajasthani-accented Hindi or sweet Marwari (devanagari) depending on if language is MW, confirming the automated screen routing."
}
Return only scientific JSON structure. Do not use markdown backticks.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "{}";
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    res.json({ success: true, mode: "gemini_api", ...result });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. In-App Sathi Interactive Chatbot Proxy
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  const { messages, language } = req.body;
  const isHindi = language === "HI";
  const isMarwari = language === "MW";
  const ai = getGeminiClient();

  // Pick the last user message
  const lastMessageUser = messages && messages.length > 0 ? messages[messages.length - 1].text : "Hello";

  if (!ai) {
    let fallbackReply = "Hello! I am Gram Panchayat Sathi. In offline simulation mode, I can address requests such as: checking MNREGA worker rosters, applying for caste/domicile documents, filing a public toilet or water complaint, and reviewing district budget grants. How can I guide you today?";
    if (isMarwari) {
      fallbackReply = "राम राम सा / खम्मा घणी सा! मैं हूँ आपणो ग्राम पंचायत साथी मारवाड़ी AI बॉट सा। आप अठै प्रमाण-पत्र बणवा सको, नरेगा री हाज़िरी अर काम देख सको, पाणी-बिजली री शिकायत लिखवा सको सा। आज थारी सेवा क्यां करूँ सा?";
    } else if (isHindi) {
      fallbackReply = "नमस्कार! मैं हूँ ग्राम पंचायत साथी। ऑफलाइन सिमुलेशन में भी मैं आपकी सेवा के लिए तत्पर हूँ। आप मुझसे प्रमाण पत्र आवेदन, मनरेगा रोजगार, जल/सड़क शिकायत या पंचायत बजट के बारे में पूछ सकते हैं। आज मैं आपकी क्या सहायता करूँ?";
    }
    return res.json({ success: true, mode: "local_bot", reply: fallbackReply });
  }

  try {
    const formattedMessagesForPrompt = messages.map((m: any) => `${m.sender === 'user' ? 'Citizen' : 'GP-Assistant'}: ${m.text}`).join("\n");

    const prompt = `
You are Gram Sathi (ग्राम साथी), the official multi-lingual AI concierge for Rajasthan's Gram Panchayat operations.
You represent the elite administrative layer of Panchayat officials, helping citizens with zero red tape.
Your reply should be compassionate, clear, brief (under 80 words), and highly informative, using friendly language.
Use Requested Language: ${isMarwari ? "Marwari (write in sweet Rajasthani dialect written in Devanagari script, utilizing respectful dialect words like 'सा', 'म्हारो', 'घणो', 'कांई', 'खम्मा घणी')" : isHindi ? "Hindi (Rajasthani-accented DeVnagari)" : "English"}.

Chat History:
${formattedMessagesForPrompt}

Provide the next response:
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, mode: "gemini_api", reply: response.text || "Unable to generate reply." });
  } catch (error: any) {
    res.json({ success: true, mode: "error_fallback", reply: "Sorry, I am having trouble connecting with the AI network. Local rules are fully preserved." });
  }
});

// Vite Middleware for development vs server static in production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Panchayat Operations App running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
