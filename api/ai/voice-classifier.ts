import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";



const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
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
 


export default async function handler(req: Request, res: Response) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  

  // 4. Voice-First Bhashini simulation and multi-dialect Classifier

  const { spokenText, language } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Local fallback classifier
    const lower = (spokenText || "").toLowerCase();
    
    let action = "CHAT";
    let type = "GENERAL";
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
  }const { spokenText, language } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Local fallback classifier
    const lower = (spokenText || "").toLowerCase();
    
    let action = "CHAT";
    let type = "GENERAL";
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
  const { spokenText, language } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Local fallback classifier
    const lower = (spokenText || "").toLowerCase();
    
    let action = "CHAT";
    let type = "GENERAL";
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
  const { spokenText, language } = req.body;
const ai = getGeminiClient();

const lower = (spokenText || "").toLowerCase().trim();

// Only handle greetings
if (
  lower === "hello" ||
  lower === "hi" ||
  lower === "hey" ||
  lower === "namaste" ||
  lower === "नमस्ते"
) {
  return res.json({
    success: true,
    mode: "chat",
    analyzedAction: "CHAT",
    confidenceScore: 0.95,
    extractedEntities: {
      keyword: lower,
      classification: "GENERAL"
    },
    responseAudioTranscript:
      "Namaste! I am Voice Saathi. Please tell me how I can help you."
  });
}

if (!ai) {
  // Local fallback classifier
    
    let action = "CHAT";
    let type = "GENERAL";
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


}