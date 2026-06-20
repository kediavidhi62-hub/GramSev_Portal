import React, { useState } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, UserRole, GramSabhaMeeting } from "../types";
import { Calendar, Users, ListFilter, PlaySquare, Sparkles, Volume2, FileSpreadsheet, ArrowRight, CheckSquare } from "lucide-react";
import ReadAloud from "./ReadAloud";

interface GramSabhaProps {
  language: AppLanguage;
  role: UserRole;
  isOnline: boolean;
  meetings: GramSabhaMeeting[];
  setMeetings: React.Dispatch<React.SetStateAction<GramSabhaMeeting[]>>;
  onQueueSync: (type: "GRAM_SABHA_SCHEDULE", data: any) => void;
}

export default function GramSabha({
  language,
  role,
  isOnline,
  meetings,
  setMeetings,
  onQueueSync
}: GramSabhaProps) {
  const t = TRANSLATIONS[language];

  // Scheduling States
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [agenda, setAgenda] = useState("");
  const [venue, setVenue] = useState("Sanganer Panchayat Bhawan Sabha Hall");

  // SabhaSaar AI simulation states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState(
    "सरपंच साहब ने वार्ड 4 में पीने के कुएँ की बोरिंग मरम्मत का बजट ₹4,50,000 मंजूर किया। मनरेगा के 30 नए मजदूरों को शामिल करने का प्रस्ताव पारित हुआ। ग्राम पंचायत सचिव श्रीमती कविता जी द्वारा वित्त नियमों की व्याख्या की गई और ग्राम संघ के बैंक रजिस्टर पर सरपंच ने हस्ताक्षर किए।"
  );
  const [activeMeetingIdForAI, setActiveMeetingIdForAI] = useState<string | null>("GS-902");

  const [aiResult, setAiResult] = useState<any | null>(null);

  const handleScheduleSabha = (e: React.FormEvent) => {
    e.preventDefault();

    const newMeeting: GramSabhaMeeting = {
      id: "GS-" + Math.floor(100 + Math.random() * 900),
      title: meetingTitle || "Infrastructure Priority Debate",
      date: meetingDate || new Date().toISOString().split("T")[0],
      time: "11:00 AM",
      venue: venue,
      status: "SCHEDULED",
      attendanceCount: 15,
      agenda: agenda || "General developmental and financial guidelines allocations on NREGA muster.",
      attendees: ["Sarpanch", "Sachiv", "6 Ward Members", "Village Patwari"]
    };

    if (!isOnline) {
      onQueueSync("GRAM_SABHA_SCHEDULE", newMeeting);
      const offlineMeeting = { ...newMeeting, title: `[OFFLINE QUEUE] ${newMeeting.title}` };
      setMeetings(prev => [offlineMeeting, ...prev]);
    } else {
      setMeetings(prev => [newMeeting, ...prev]);
    }

    setMeetingTitle("");
    setMeetingDate("");
    setAgenda("");
  };

  const handleRunSabhaSaarAI = async (mId: string) => {
    setIsSummarizing(true);
    setActiveMeetingIdForAI(mId);

    try {
      const selectedMeet = meetings.find(m => m.id === mId);
      const response = await fetch("/api/ai/sabhasaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingTitle: selectedMeet?.title,
          agenda: selectedMeet?.agenda,
          transcriptNotes: voiceNotes,
          attendeesCount: selectedMeet?.attendanceCount || 18,
          attendeesList: selectedMeet?.attendees || []
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiResult(data);
        
        // Save the minutes into meeting state locally
        setMeetings(prev => prev.map(m => {
          if (m.id === mId) {
            return {
              ...m,
              status: "COMPLETED",
              minutesTitle: data.minutesTitle,
              minutesSummaryEN: data.minutesSummaryEN,
              minutesSummaryHI: data.minutesSummaryHI,
              resolutions: data.resolutions
            };
          }
          return m;
        }));
      }
    } catch (err) {
      console.error("SabhaSaar AI Summarizer failed:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black font-sans text-slate-900 tracking-tight leading-none uppercase">
            {language === AppLanguage.HI ? "ग्राम सभा विवरण एवं निर्णय" : "Gram Sabha Schedule & Resolutions"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === AppLanguage.HI ? "सभा बैठकों में भाग लें और एआई जनित मिनिट्स और प्रस्तावों को सुनें" : "Participate, schedule, and hear localized AI resolution minutes."}
          </p>
        </div>
        <ReadAloud language={language} targetSelector="#gramsabha-page-content" />
      </div>

      <div id="gramsabha-page-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Schedule meeting form — Locked for Citizen */}
      <div className={`col-span-1 lg:col-span-4 space-y-6 ${role !== UserRole.OFFICIAL ? "opacity-60 cursor-not-allowed" : ""}`}>
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 relative overflow-hidden">
          {role !== UserRole.OFFICIAL && (
            <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-slate-900/90 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 shadow-lg font-mono">
                {language === AppLanguage.HI ? "सिर्फ पंचायत अधिकारी ही ग्राम सभा रख सकते हैं" : "ONLY ACTIVE FOR PANCHAYAT OFFICIALS"}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2.5 mb-5">
            <Calendar className="h-5 w-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 font-sans text-md">
              {t.scheduleSabhaTitle}
            </h3>
          </div>

          <form onSubmit={handleScheduleSabha} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                Meeting Topic / विषय
              </label>
              <input
                required
                type="text"
                placeholder="E.g., Budget Planning, Drought Relief"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                Schedule Date / तिथि
              </label>
              <input
                required
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                Venue / स्थली
              </label>
              <input
                required
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.meetingAgenda}
              </label>
              <textarea
                required
                rows={3}
                placeholder="List major agenda items..."
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-orange-700 transition shadow-sm cursor-pointer"
            >
              Schedule Gram Sabha & Notify Ward Members
            </button>
          </form>

        </div>
      </div>

      {/* Sabha scheduler lists & SabhaSaar AI transcript generator */}
      <div className="col-span-1 lg:col-span-8 space-y-4">
        
        {/* Sabha notices list */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 font-sans text-md flex items-center space-x-2">
              <ListFilter className="h-5 w-5 text-orange-600" />
              <span>{t.villageNoticeBoard} (Active Gram Sabha Status)</span>
            </h3>
            <span className="bg-slate-150 text-slate-600 text-[10px] font-bold py-1 px-3 rounded-full font-sans uppercase">
              District Monitored
            </span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {meetings.map((meet) => (
              <div key={meet.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-4">
                
                {/* upper row status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-2.5">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase mr-1.5">#{meet.id}</span>
                    <strong className="text-slate-900 text-xs font-bold font-sans">{meet.title}</strong>
                  </div>
                  <div>
                    {meet.status === "COMPLETED" ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-extrabold py-0.5 px-2.5 rounded-full uppercase">
                        COMPLETED (कार्यवाही संपन्न)
                      </span>
                    ) : (
                      <span className="bg-orange-50 text-orange-800 border border-orange-200 text-[9px] font-extrabold py-0.5 px-2.5 rounded-full uppercase animate-pulse">
                        SCHEDULED (जल्द आ रहा है)
                      </span>
                    )}
                  </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-600 font-mono">
                  <span>📅 Date: <strong className="text-slate-800">{meet.date}</strong></span>
                  <span>⏰ Time: <strong className="text-slate-800">{meet.time || "11:00 AM"}</strong></span>
                  <span>📍 Hall: <strong className="text-slate-800">{meet.venue}</strong></span>
                </div>

                {/* Specified Agenda */}
                <div className="space-y-1">
                  <strong className="text-[10px] font-bold text-slate-400 uppercase block">Declared Agenda:</strong>
                  <p className="text-xs text-slate-705 font-sans leading-relaxed">{meet.agenda}</p>
                </div>

                {/* Attendees count */}
                <div className="flex items-center space-x-4 text-[10px] text-slate-550 border-t border-slate-200/50 pt-2.5">
                  <span>Signatures Registered: <strong className="text-slate-800">{meet.attendanceCount} Citizens</strong></span>
                  <span>Ward Leaders: <strong className="text-slate-700">{meet.attendees?.join(", ")}</strong></span>
                </div>

                {/* SABHASAAR AI COMPILED SECTION */}
                {meet.minutesTitle && (
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 space-y-3.5 mt-2.5">
                    <div className="flex items-center space-x-2 text-orange-950">
                      <Sparkles className="h-4.5 w-4.5 text-orange-655" />
                      <strong className="text-xs font-bold font-sans uppercase">SabhaSaar AI Proceedings Generated (सभासार)</strong>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* English review */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">English Digest</span>
                        <p className="text-xs text-slate-705 leading-relaxed font-sans">{meet.minutesSummaryEN}</p>
                      </div>

                      {/* Hindi review */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">हिंदी कार्यवाही संक्षेप</span>
                        <p className="text-xs text-slate-705 leading-relaxed font-sans font-medium">{meet.minutesSummaryHI}</p>
                      </div>
                    </div>

                    {/* Actionable resolutions */}
                    <div className="space-y-2 border-t border-orange-200/55 pt-3">
                      <span className="text-[9px] font-bold text-orange-850 uppercase block font-mono">Resolutions Catalogued (प्रस्ताव):</span>
                      <ul className="space-y-1">
                        {meet.resolutions?.map((res, rIdx) => (
                          <li key={rIdx} className="text-xs text-slate-705 flex items-start space-x-1.5 font-sans">
                            <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

                {/* ACTIVATE SABHASAAR AI AUDIOMINI TRANSLATION ENGINE */}
                {meet.status !== "COMPLETED" && (
                   <div className="bg-orange-50 text-slate-850 rounded-xl p-3.5 border border-orange-200/80 shadow-sm space-y-3">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                         <Volume2 className="h-4.5 w-4.5 text-orange-700 shrink-0" />
                         <span className="text-xs font-bold text-orange-700 font-sans uppercase">SabhaSaar Voice Minutes generator</span>
                       </div>
                       <span className="bg-orange-600 text-white text-[8px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                         AI Enabled
                       </span>
                     </div>
 
                     {/* Official mock recording tape note text */}
                     {role === UserRole.OFFICIAL ? (
                       <div className="space-y-2.5">
                         <p className="text-[10px] text-slate-600 leading-relaxed">
                           Provide verbal discussions notes recorded at the local meeting (or use our preloaded Sanganer village mock tape transcription note):
                         </p>
                         <textarea
                           rows={2}
                           value={voiceNotes}
                           onChange={(e) => setVoiceNotes(e.target.value)}
                           className="w-full bg-white border border-orange-200 text-slate-900 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                         />
                         
                         <button
                           onClick={() => handleRunSabhaSaarAI(meet.id)}
                           disabled={isSummarizing && activeMeetingIdForAI === meet.id}
                           className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] py-2 px-4 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                         >
                          {isSummarizing && activeMeetingIdForAI === meet.id ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Summarizing Audio via SabhaSaar AI...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5 shrink-0" />
                              <span>{t.generateMinutes}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-550 italic">
                        * Panchayat Officials can record audio recordings and click SabhaSaar AI to generate proceedings.
                      </p>
                    )}
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
