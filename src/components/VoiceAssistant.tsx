import React, { useState } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, UserRole } from "../types";
import { Mic, MicOff, Send, HelpCircle, AudioLines, Sparkles, Navigation2 } from "lucide-react";

interface VoiceAssistantProps {
  language: AppLanguage;
  setTab: (tab: string) => void;
  onClassifyResult: (data: { action: string; category?: string; spokenText: string }) => void;
  isOnline: boolean;
}

export default function VoiceAssistant({
  language,
  setTab,
  onClassifyResult,
  isOnline
}: VoiceAssistantProps) {
  const t = TRANSLATIONS[language];
  const [typingInput, setTypingInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const speakOutLoud = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Simple emoji cleaner
      const clean = textToSpeak.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      if (language === AppLanguage.HI || language === AppLanguage.MW) {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-IN";
      }
      utterance.rate = 0.90;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis failed:", e);
    }
  };

  const initialGreeting = language === AppLanguage.MW
    ? "राम राम सा! मैं थारो ग्राम पंचायत बोली-सहायक हूँ। आप मारवाड़ी, हिन्दी या अंग्रेजी में बोलकर शिकायत दर्ज कर सको या प्रमाण-पत्र फ़ॉर्म भर सको सा।"
    : language === AppLanguage.HI 
    ? "राम राम सा! मैं थारो ग्राम पंचायत आवाज-सहायक हूँ। आप राजस्थानी, हिन्दी या अंग्रेजी में बोलकर शिकायत कर सको या प्रमाण-पत्र फ़ॉर्म भर सको।" 
    : "Ram Ram Sa! I am your Voice Assistant. Tap the mic or type in Hindi/Rajasthani or English to route or apply instantly.";

  const [voiceLog, setVoiceLog] = useState<{ text: string; sender: "citizen" | "ai" }[]>([
    {
      sender: "ai",
      text: initialGreeting
    }
  ]);

  // Speak greeting on mount
  React.useEffect(() => {
    // Small delay to allow browser thread to settle
    const t = setTimeout(() => {
      speakOutLoud(initialGreeting);
    }, 400);
    return () => clearTimeout(t);
  }, [language]);

  const [isProcessing, setIsProcessing] = useState(false);

  // Suggested Dialect Commands for users to simulate low-literacy speaking
  const DIALECT_COMMUNDS = [
    {
      dialect: "Marwari (मारवाड़ी)",
      text: "म्हारा वार्ड २ में पानी रो बोरिंग खोटी होग्यो है, पाणी कोनी आवे सा",
      translation: "Drinking water borewell broken in Ward 2, water supply halted.",
      routeTab: "grievances",
      category: "WATER"
    },
    {
      dialect: "Dhundhari/Jaipuri (ढूंढाड़ी)",
      text: "म्हाने मूल निवास प्रमाण पत्र बणवाणो है, फॉर्म कटे मिलेगो?",
      translation: "I need to apply for a Domicile Certificate, show form please.",
      routeTab: "certificates",
      category: "DOMICILE"
    },
    {
      dialect: "Shekhawati (शेखावाटी)",
      text: "विधवा प्रमाण पत्र अर बीपीएल कार्ड बणवाणो है सा, मदद करो",
      translation: "I want to apply for a Widow certificate and BPL card, please help.",
      routeTab: "certificates",
      category: "WIDOW"
    },
    {
      dialect: "Mewati (मेवाती)",
      text: "बुढ़ापा पेंशन योजना में हमारो नाम कैसे जुड़ेगो, काय योग्यता है?",
      translation: "How to apply for Old Age Pension Scheme, what is eligibility?",
      routeTab: "schemes",
      category: "SCHEME"
    },
    {
      dialect: "Standard Hindi (हिन्दी)",
      text: "सड़क पर पानी भरा हुआ है और स्ट्रीट लाइट खराब है",
      translation: "Waterlogged roads and broken streetlights require maintenance.",
      routeTab: "grievances",
      category: "ELECTRICITY"
    }
  ];

  // Browser Speech Recognition Setup (Web Speech API)
  const runRealSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakOutLoud("आपका ब्राउज़र वॉइस रिकग्निशन को सपोर्ट नहीं करता। कृपया नीचे दिए गए उदाहरणों का उपयोग करें।");
      setVoiceLog(prev => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Speech recognition is not supported on this browser context. Please use our convenient low-literacy Rajasthani dialect voice demos below to simulate speaking, or type directly in Hindi/English!"
        }
      ]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === AppLanguage.HI ? "hi-IN" : language === AppLanguage.MW ? "hi-IN" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        speakOutLoud("मैं सुण हूँ सा, बोलो सा");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          speakOutLoud("माइक्रोफोन की अनुमति अस्वीकृत की गई है। कृपया नीचे दिए गए राजस्थान बोली बटनों पर टैप करें!");
          setVoiceLog(prev => [
            ...prev,
            {
              sender: "ai",
              text: "⚠️ Microphone access was blocked by browser frame security in this sandboxed preview. No problem at all! You can still test the complete automation flows by tapping any of the Rajasthani dialect voice templates below, which simulate real spoken speech classification & fill target forms instantly!"
            }
          ]);
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleVoiceInputProcessing(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const handleVoiceInputProcessing = async (text: string) => {
    if (!text.trim()) return;

    setVoiceLog(prev => [...prev, { sender: "citizen", text }]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/ai/voice-classifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spokenText: text, language })
      });

      const data = await response.json();
      if (data.success) {
        setVoiceLog(prev => [...prev, { sender: "ai", text: data.responseAudioTranscript }]);
        // Play the AI directions out loud to give crystal clear offline/online guidance
        speakOutLoud(data.responseAudioTranscript);
        
        // Trigger page navigation based on classified action
        setTimeout(() => {
          let tab = "voice";

if (data.analyzedAction === "CERTIFICATE") {
  tab = "certificates";
}
else if (data.analyzedAction === "COMPLAINT") {
  tab = "grievances";
}
else if (data.analyzedAction === "SCHEME") {
  tab = "schemes";
}
else if (data.analyzedAction === "CHAT") {
  tab = "voice";
}
console.log("VOICE RESULT:", data);
console.log("ACTION:", data.analyzedAction);

          if (tab !== "voice") {
            setTab(tab);
            onClassifyResult({
              action: data.analyzedAction,
              category: data.extractedEntities?.classification,
              spokenText: text
            });
          }
        }, 3800); // 3.8s ensures citizen fully hears verbal feedback instructions first!
      }
    } catch (err) {
      console.error("Voice classification failed:", err);
    } finally {
      setIsProcessing(false);
      setTypingInput("");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col space-y-6">
      
      {/* Title block */}
      <div className="flex items-center space-x-3">
        <div className="bg-orange-50 text-orange-700 p-2.5 rounded-xl border border-orange-100">
          <AudioLines className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display">
            {language === AppLanguage.MW 
              ? "🗣️ आपणो बोली संवाद सहायक (Bhashini AI)" 
              : language === AppLanguage.HI 
              ? "🗣️ वॉयस-फर्स्ट संवाद सहायक (Bhashini AI)" 
              : "🗣️ Voice-First Dialog Sathi (Bhashini AI)"}
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Empowering low-literacy citizens via audio dialects translation
          </p>
        </div>
      </div>

      {/* Voice Assistant Explanation / Instructions */}
      <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-500/10 text-xs text-slate-700 leading-relaxed">
        <p className="font-sans font-bold text-slate-800 mb-1">
          {language === AppLanguage.MW 
            ? "खास निर्देश:" 
            : language === AppLanguage.HI 
            ? "महत्वपूर्ण निर्देश:" 
            : "Instructions:"}
        </p>
        {t.voiceInstructions}
      </div>

      {/* Interactive Logs Dialogue Box */}
      <div 
        className="rounded-xl p-4 h-64 overflow-y-auto flex flex-col space-y-3 shadow-inner"
        style={{ backgroundColor: "#e4d9b9" }}
      >
        {voiceLog.map((log, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
              log.sender === "ai"
                ? "bg-slate-800 text-orange-200 self-start border border-slate-700 font-medium"
                : "bg-orange-650 text-white font-semibold self-end shadow-xs"
            }`}
          >
            {log.sender === "ai" ? (
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles 
                    className="h-3.5 w-3.5 shrink-0 text-orange-400" 
                    style={{ color: "#b33d26" }}
                  />
                  <span 
                    className="text-[10px] font-mono text-slate-400"
                    style={{ color: "#b33d26" }}
                  >
                    भारा-सहायक (BHASHINI AI)
                  </span>
                </div>
                <p>{log.text}</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-mono text-orange-200/80 mb-0.5">YOU SPOKE / नागरिक वाक्य</p>
                <p>{log.text}</p>
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="self-start bg-slate-800 text-slate-300 rounded-lg p-3 text-xs flex items-center space-x-2 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="font-mono text-slate-400">Processing dialect soundwaves via Bhashini...</span>
          </div>
        )}
      </div>

      {/* Real Speak & Manual Input Area */}
      <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <button
          onClick={runRealSpeechRecognition}
          className={`p-4 rounded-full shadow-md text-white transition-all cursor-pointer shrink-0 ${
            isRecording
              ? "bg-rose-600 animate-pulse scale-110"
              : "hover:bg-[#972E1B] ring-2 ring-orange-100"
          }`}
          style={{ backgroundColor: isRecording ? undefined : "#b33d26" }}
          title="Hold/Click to speak into Mic"
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        <input
          type="text"
          value={typingInput}
          onChange={(e) => setTypingInput(e.target.value)}
          placeholder={
            language === AppLanguage.MW 
              ? "या आपणी बात अठै लिखो सा..." 
              : language === AppLanguage.HI 
              ? "या अपनी भाषा में यहाँ लिखें..." 
              : "Or type your rural matter here..."
          }
          className="flex-1 bg-transparent text-slate-800 text-sm focus:outline-none px-2 font-sans py-2"
          onKeyDown={(e) => e.key === "Enter" && handleVoiceInputProcessing(typingInput)}
        />

        <button
          onClick={() => handleVoiceInputProcessing(typingInput)}
          className="p-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Suggested Dialect Templates */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {language === AppLanguage.MW 
              ? "बिना लिख्या-पढ्या बोध रो बोलचाल उदाहरण" 
              : language === AppLanguage.HI 
              ? "कम साक्षरता हेतु बोलचाल के उदाहरण" 
              : "Low-Literacy Dialect Voice Demos"}
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DIALECT_COMMUNDS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleVoiceInputProcessing(item.text)}
              className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/60 hover:from-orange-50 hover:to-orange-100/30 rounded-xl border border-slate-200 transition-all cursor-pointer text-left group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100/60">
                  {item.dialect}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-orange-700 flex items-center space-x-0.5 font-mono">
                  <Navigation2 className="h-2.5 w-2.5 rotate-45" />
                  <span>ROUTE</span>
                </span>
              </div>
              <p className="text-xs font-sans font-medium text-slate-800 line-clamp-2">
                &ldquo;{item.text}&rdquo;
              </p>
              <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-1">
                Hindi: {item.translation}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
