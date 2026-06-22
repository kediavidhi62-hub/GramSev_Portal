import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { spokenText, language } = req.body;
  const ai = getGeminiClient();

  const lower = (spokenText || "").toLowerCase().trim();

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
    let action = "CHAT";
    let type = "GENERAL";
    let labelEN = "Grievance Filing";
    let labelHI = "शिकायत दर्ज करना";

    if (
      lower.includes("cert") ||
      lower.includes("praman") ||
      lower.includes("caste") ||
      lower.includes("income") ||
      lower.includes("birth") ||
      lower.includes("domicile")
    ) {
      action = "CERTIFICATE";
      type = "DOMICILE";
      labelEN = "Certificate Application";
      labelHI = "प्रमाण पत्र आवेदन";
    } else if (
      lower.includes("yojna") ||
      lower.includes("scheme") ||
      lower.includes("pension")
    ) {
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
      responseAudioTranscript:
        language === "HI"
          ? `मैंने आपकी बात सुन ली है। आप ${labelHI} की तलाश कर रहे हैं।`
          : `I understand your request. You seem to require ${labelEN}.`
    });
  }

  try {
    const prompt = `Analyze this request: "${spokenText}" and return JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "{}";
    const result = JSON.parse(rawText);

    return res.json({
      success: true,
      mode: "gemini_api",
      ...result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}