import React, { useState, useEffect, useRef } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, WhatsAppMessage, CertificateApplication, GrievanceComplaint } from "../types";
import { MessageSquare, Send, X, PhoneCall, Sparkles, UserCheck2, RefreshCw } from "lucide-react";

interface WhatsAppBotProps {
  language: AppLanguage;
  isOnline: boolean;
  applications: CertificateApplication[];
  complaints: GrievanceComplaint[];
}

export default function WhatsAppBot({
  language,
  isOnline,
  applications,
  complaints
}: WhatsAppBotProps) {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<WhatsAppMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: t.whatsappGreeting,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: WhatsAppMessage = {
      id: "msg-usr-" + Date.now(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Bot response delay
    setTimeout(async () => {
      const normalMsg = userMsg.text.toLowerCase().trim();
      let replyText = "";

      // 1. Check certificate status lookup command
      if (normalMsg.includes("status cert-") || normalMsg.startsWith("cert-")) {
        const certId = normalMsg.match(/cert-\d+/i)?.[0]?.toUpperCase();
        if (certId) {
          const matchApp = applications.find(a => a.id.toUpperCase() === certId);
          if (matchApp) {
            replyText = language === AppLanguage.MW 
              ? `📄 प्रमाण पत्र मिल गियो सा! (ID: ${certId})\n\n👤 नागरिक को नाम: ${matchApp.citizenName}\n📋 दस्तावेज़: ${matchApp.type}\n📍 स्थिति: ${matchApp.status}\n⏰ SLA बाकी दिन: ${matchApp.slaDaysRemaining}\n✍️ ग्राम सचिव टिप्पणी: ${matchApp.remarks || "जांच जारी है सा"}`
              : language === AppLanguage.HI 
              ? `📄 प्रमाण पत्र मिल गया! (ID: ${certId})\n\n👤 नागरिक का नाम: ${matchApp.citizenName}\n📋 दस्तावेज़: ${matchApp.type}\n📍 स्थिति: ${matchApp.status}\n⏰ SLA शेष दिन: ${matchApp.slaDaysRemaining}\n✍️ ग्राम सचिव टिप्पणी: ${matchApp.remarks || "जांच जारी है"}`
              : `📄 Application matched! (ID: ${certId})\n\n👤 Name: ${matchApp.citizenName}\n📋 Type: ${matchApp.type}\n📍 Status: ${matchApp.status}\n⏰ SLA Days Left: ${matchApp.slaDaysRemaining}\n✍️ Sachiv Note: ${matchApp.remarks || "Pending verification."}`;
          } else {
            replyText = language === AppLanguage.MW
              ? `❌ अमान्य खोज सा! प्रमाण पत्र संख्या "${certId}" ग्राम पंचायत रे डेटाबेस में नहीं मिल्यो सा। कृपया पुनः जांचें।`
              : language === AppLanguage.HI
              ? `❌ अमान्य खोज! प्रमाण पत्र संख्या "${certId}" ग्राम पंचायत के डेटाबेस में नहीं मिला। कृपया पुनः जांचें।`
              : `❌ Record not found! Certificate ID "${certId}" could not be matched. Please double-check your application code.`;
          }
        }
      } 
      // 2. Check grievance status lookup command
      else if (normalMsg.includes("status griev-") || normalMsg.startsWith("griev-")) {
        const grievId = normalMsg.match(/griev-\d+/i)?.[0]?.toUpperCase();
        if (grievId) {
          const matchComplaint = complaints.find(c => c.id.toUpperCase() === grievId);
          if (matchComplaint) {
            replyText = language === AppLanguage.MW
              ? `🚨 शिकायत मिली सा! (ID: ${grievId})\n\n👤 आवेदक: ${matchComplaint.citizenName}\n📂 श्रेणी: ${matchComplaint.category}\n🏢 विभाग स्तर: ${matchComplaint.escalationLevel}\n📍 स्थिति: ${matchComplaint.status}\n🛠️ विवरण: ${matchComplaint.resolutionText || "कार्यवाही जल्दी ही होसी सा।"}`
              : language === AppLanguage.HI
              ? `🚨 शिकायत मिली! (ID: ${grievId})\n\n👤 आवेदक: ${matchComplaint.citizenName}\n📂 श्रेणी: ${matchComplaint.category}\n🏢 विभाग स्तर: ${matchComplaint.escalationLevel}\n📍 स्थिति: ${matchComplaint.status}\n🛠️ विवरण: ${matchComplaint.resolutionText || "कार्यवाही विचाराधीन है।"}`
              : `🚨 Grievance matched! (ID: ${grievId})\n\n👤 Reporter: ${matchComplaint.citizenName}\n📂 Sector: ${matchComplaint.category}\n🏢 Esc level: ${matchComplaint.escalationLevel}\n📍 Status: ${matchComplaint.status}\n🛠️ Resolution Details: ${matchComplaint.resolutionText || "Action under review."}`;
          } else {
            replyText = language === AppLanguage.MW
              ? `❌ अमान्य नंबर सा! शिकायत कोड "${grievId}" दर्ज कोनी है सा।`
              : language === AppLanguage.HI
              ? `❌ अमान्य नंबर! शिकायत कोड "${grievId}" दर्ज नहीं है।`
              : `❌ No record found! No grievance matches code "${grievId}".`;
          }
        }
      } 
      // 3. Simple greeting Fallback
      else if (normalMsg === "hello" || normalMsg === "hi" || normalMsg === "नमस्ते" || normalMsg === "राम राम") {
        replyText = language === AppLanguage.MW
          ? "राम राम सा! मैं पंच-सखा बॉट हूँ सा। आप म्हार सु आपली प्रमाण पत्र री स्थिति जांच सको हो। लिखो: 'status [Application ID]' (उदा. status CERT-902341) या अपनी शिकायत सारू लिखो: 'status [Complaint ID]' (उदा. status GRIEV-102914)."
          : language === AppLanguage.HI
          ? "राम राम सा! मैं पंच-सखा बॉट हूँ। आप मुझसे अपने प्रमाण पत्र की स्थिति की जांच कर सकते हैं। लिखे: 'status [Application ID]' (उदा. status CERT-902341) या अपनी शिकायत के लिए लिखे: 'status [Complaint ID]' (उदा. status GRIEV-102914)."
          : "Ram Ram Sa! I am PanchaSakhā bot. You can verify your application status by sending: 'status [Application ID]' (e.g., status CERT-202391) or check complaints by sending: 'status [Complaint ID]' (e.g., status GRIEV-10291). Try asking a general query too!";
      } 
      // 4. Conversational API call
      else {
        if (isOnline) {
          try {
            // Build simple context array
            const chatCtx = chatMessages.concat(userMsg).slice(-4).map(m => ({
              sender: m.sender,
              text: m.text
            }));
            const response = await fetch("/api/ai/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages: chatCtx, language })
            });
            const data = await response.json();
            replyText = data.reply || "Connection issue";
          } catch (err) {
            console.error(err);
            replyText = "Offline mode holds default rules.";
          }
        } else {
          replyText = language === AppLanguage.HI
            ? "ऑफ़लाइन मोड (सिम्युलेटेड) में केवल 'status' कमांड या नमस्ते ही काम करेंगे। सक्रिय सिंक के बाद अन्य जानकारी देखें।"
            : "In offline mode, only status check commands (e.g., status CERT-XXXXXX) or general greetings are validated until reconnected.";
        }
      }

      const botReply: WhatsAppMessage = {
        id: "msg-bot-" + Date.now(),
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      };

      setChatMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1500);

  };

  return (
    <>
      {/* Floating launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all scale-100 hover:scale-110 cursor-pointer active:scale-95 z-40 flex items-center justify-center border-2 border-white"
        title="Check status on simulated WhatsApp companion"
      >
        <MessageSquare className="h-6 w-6" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide out WhatsApp sidebar drawer */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-stone-100 shadow-2xl border-l border-slate-200 z-50 flex flex-col font-sans animate-in slide-in-from-right duration-250">
          
          {/* WhatsApp Header bar */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600/80 p-2 rounded-full border border-emerald-500">
                <UserCheck2 className="h-5 w-5 text-emerald-100" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">पंचा-सखा (WhatsApp Helper)</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></span>
                  <span className="text-[10px] text-emerald-100 font-medium font-mono">ONLINE - INSTANT STATUS BOT</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white transition p-1.5 rounded-lg hover:bg-emerald-600/50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages display area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50">
            
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-lg p-3 shadow-sm text-xs leading-relaxed ${
                  msg.sender === "bot"
                    ? "bg-white text-slate-800 self-start border border-slate-100"
                    : "bg-emerald-100 text-slate-900 self-end border border-emerald-200/50"
                }`}
                style={{ alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end" }}
              >
                {msg.sender === "bot" && (
                  <div className="flex items-center space-x-1 text-[9px] font-bold text-emerald-800 uppercase font-mono mb-1">
                    <Sparkles className="h-3 w-3 text-orange-500" />
                    <span>PanchaSakhā AI</span>
                  </div>
                )}
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                <span className="block text-[8px] text-slate-400 font-mono text-right mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="self-start bg-white text-slate-400 rounded-lg py-2 px-3 text-[11px] font-mono border border-slate-150 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-200"></span>
                <span>PanchaSakhā typing...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick replies checklist for quick usability */}
          <div className="bg-white px-3 py-2 border-t border-slate-200 flex flex-wrap gap-1.5 shrink-0">
            <button
              onClick={() => setInputText("नमस्ते")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] py-1 px-2.5 rounded-full border border-slate-300 font-sans cursor-pointer"
            >
              नमस्ते (Hi)
            </button>
            <button
              onClick={() => setInputText("status CERT-102914")}
              className="bg-slate-105 hover:bg-slate-200 text-emerald-850 font-bold text-[10px] py-1 px-2.5 rounded-full border border-emerald-200/60 font-mono cursor-pointer"
            >
              Verify Certificate Status
            </button>
            <button
              onClick={() => setInputText("status GRIEV-4091")}
              className="bg-slate-105 hover:bg-slate-200 text-rose-850 font-bold text-[10px] py-1 px-2.5 rounded-full border border-rose-200/60 font-mono cursor-pointer font-sans"
            >
              Verify Grievance Case
            </button>
          </div>

          {/* Input control box */}
          <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.whatsappPlaceholder}
              className="flex-1 bg-slate-100 border border-slate-200 text-slate-805 text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-sans"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
