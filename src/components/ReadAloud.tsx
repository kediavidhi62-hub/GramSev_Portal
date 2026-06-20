import React, { useState, useEffect, useRef } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage } from "../types";
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Square, 
  Settings, 
  ChevronDown, 
  Sparkles,
  Volume1,
  Mic
} from "lucide-react";

const LOCALIZED = {
  [AppLanguage.EN]: {
    panelTitle: "Read Aloud Panel",
    stop: "Stop",
    resume: "Resume",
    pause: "Pause",
    speed: "Speed:",
    volume: "Volume Control",
    volumeLabel: "Volume",
    systemVoice: "System Voice",
    readingNow: "Reading Now:",
    readAloud: "Read Aloud",
    notSupported: "Text-to-Speech not supported in this browser.",
    smartChunking: "Smart sentence chunking ensures stable, continuous play.",
    slow: "Slow",
    normal: "Normal",
    fast: "Fast",
    voiceStyleChange: "Change Voice Style",
    close: "Close",
  },
  [AppLanguage.HI]: {
    panelTitle: "सस्वर पाठ नियंत्रक",
    stop: "बंद करें",
    resume: "प्रारंभ",
    pause: "रोकें",
    speed: "गति:",
    volume: "आवाज की मात्रा",
    volumeLabel: "आवाज",
    systemVoice: "ध्वनि प्रणाली",
    readingNow: "पढ़ा जा रहा है:",
    readAloud: "बोलकर सुनें",
    notSupported: "इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।",
    smartChunking: "स्मार्ट वाक्य-विभाजन तकनीक सक्रिय है।",
    slow: "धीमा",
    normal: "सामान्य",
    fast: "तेज़",
    voiceStyleChange: "आवाज शैली",
    close: "बंद करें",
  },
  [AppLanguage.MW]: {
    panelTitle: "बोलकर सुणो नियंत्रक",
    stop: "बंद करो सा",
    resume: "शुरू करो सा",
    pause: "रोको सा",
    speed: "गति:",
    volume: "आवाज स्तर",
    volumeLabel: "आवाज",
    systemVoice: "कम्प्यूटर री आवाज",
    readingNow: "अबे सुणो सा:",
    readAloud: "बोलकर सुणो सा",
    notSupported: "इण ब्राउज़र माथे बोलण री मशीन कोनी चालै सा।",
    smartChunking: "स्मार्ट वाक्य-विभाजन तकनीक काम करै सा।",
    slow: "धीमो",
    normal: "सामान्य",
    fast: "बेगो",
    voiceStyleChange: "नयी आवाज चुणो सा",
    close: "बंद करो",
  },
};

interface ReadAloudProps {
  language: AppLanguage;
  targetSelector: string; // CSS selector of section to read (e.g. "#scheme-results")
  title?: string;
  className?: string;
  variant?: "default" | "minimal";
  darkMode?: boolean;
}

export default function ReadAloud({
  language,
  targetSelector,
  title,
  className = "",
  variant = "default",
  darkMode = false
}: ReadAloudProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Audio Controls
  const [speed, setSpeed] = useState<number>(1.0); // 0.8 | 1.0 | 1.2
  const [volume, setVolume] = useState<number>(1.0); // 0 to 1
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Core reading states
  const sentencesRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(0);
  const playStateRef = useRef<{ isPlaying: boolean; isPaused: boolean }>({ isPlaying: false, isPaused: false });
  const [currentSentenceText, setCurrentSentenceText] = useState<string>("");

  const t = TRANSLATIONS[language];
  const loc = LOCALIZED[language] || LOCALIZED[AppLanguage.EN];

  // Populate browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      
      // Select preferred voice based on active language
      const isHiOrMw = language === AppLanguage.HI || language === AppLanguage.MW;
      const langPrefix = isHiOrMw ? "hi" : "en";
      const regionMatch = isHiOrMw ? "IN" : "IN";

      const preferred = allVoices.find(v => 
        v.lang.toLowerCase().includes(langPrefix) && 
        v.lang.toUpperCase().includes(regionMatch)
      ) || allVoices.find(v => 
        v.lang.toLowerCase().startsWith(langPrefix)
      ) || allVoices.find(v => 
        v.lang.toLowerCase().includes("in")
      );

      if (preferred) {
        setSelectedVoice(preferred);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  // Sync state refs to avoid closure stale values on speechSynthesis callbacks
  useEffect(() => {
    playStateRef.current = { isPlaying, isPaused };
  }, [isPlaying, isPaused]);

  // Clean and extract readable text from target element
  const getCleanReadableText = (): string => {
    const el = document.querySelector(targetSelector) as HTMLElement;
    if (!el) {
      return "";
    }

    let extractedText = "";

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textCont = node.textContent?.trim();
        if (textCont) {
          extractedText += textCont + " ";
        }
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);

        // Ignore hidden, none blocks
        if (style.display === "none" || style.visibility === "hidden" || element.hasAttribute("hidden")) {
          return;
        }

        const tag = element.tagName.toUpperCase();

        // Check if element belongs to typical navigation, sidebar, or interactive controls
        if (
          tag === "BUTTON" ||
          tag === "A" ||
          tag === "NAV" ||
          tag === "FOOTER" ||
          tag === "LABEL" ||
          tag === "SCRIPT" ||
          tag === "STYLE" ||
          tag === "INPUT" ||
          tag === "SELECT" ||
          tag === "TEXTAREA" ||
          element.closest("button") ||
          element.closest("a") ||
          element.closest(".accessibility-exclude") ||
          element.classList.contains("hidden") ||
          element.classList.contains("sr-only")
        ) {
          return;
        }

        for (let i = 0; i < element.childNodes.length; i++) {
          walk(element.childNodes[i]);
        }
      }
    };

    walk(el);

    // Clean emojis & extra duplicate spaces
    return extractedText
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Speaks a given sentence by index
  const speakSentence = (index: number) => {
    if (index >= sentencesRef.current.length) {
      // Finished all sentences!
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceText("");
      return;
    }

    currentIndexRef.current = index;
    const textToSpeak = sentencesRef.current[index];
    setCurrentSentenceText(textToSpeak);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.volume = volume;
    utterance.rate = speed;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = (language === AppLanguage.HI || language === AppLanguage.MW) ? "hi-IN" : "en-IN";
    }

    utterance.onend = () => {
      // Proceed to next sentence only if we are still marked as active and not explicitly paused
      if (playStateRef.current.isPlaying && !playStateRef.current.isPaused) {
        speakSentence(index + 1);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis utterance error:", e);
      // Suppress issue where quick cancels triggers 'interrupted' error
      if (e.error !== "interrupted" && playStateRef.current.isPlaying && !playStateRef.current.isPaused) {
        speakSentence(index + 1);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayStart = () => {
    setErrorMsg(null);
    window.speechSynthesis.cancel();

    const rawText = getCleanReadableText();
    if (!rawText) {
      setErrorMsg(
        language === AppLanguage.HI 
          ? "पढ़ने के लिए कोई वैध जानकारी नहीं मिली।" 
          : language === AppLanguage.MW 
          ? "सुणबा सारूँ कोई खबर कोनी मिली सा।" 
          : "No readable content found in this section."
      );
      return;
    }

    // Split text into readable sentences using standard delimiters (EN, HI, MW punctuation)
    const rawSentences = rawText
      .split(/[.।!?|]\s*/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (rawSentences.length === 0) {
      setErrorMsg(
        language === AppLanguage.HI 
          ? "पढ़ने के लिए कोई पाठ नहीं मिला।" 
          : "No sentences detected to read."
      );
      return;
    }

    sentencesRef.current = rawSentences;
    setIsPlaying(true);
    setIsPaused(false);
    speakSentence(0);
  };

  const handlePause = () => {
    if (!isPlaying) return;
    setIsPaused(true);
    window.speechSynthesis.cancel(); // Clears current voice queue safely with state set to paused
  };

  const handleResume = () => {
    if (!isPlaying || !isPaused) return;
    setIsPaused(false);
    speakSentence(currentIndexRef.current);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceText("");
    window.speechSynthesis.cancel();
  };

  // Filter voices that match the active page language
  const getLanguageFilteredVoices = (): SpeechSynthesisVoice[] => {
    const isHiOrMw = language === AppLanguage.HI || language === AppLanguage.MW;
    const targetCode = isHiOrMw ? "hi" : "en";
    return voices.filter(v => v.lang.toLowerCase().startsWith(targetCode));
  };

  const availableLangVoices = getLanguageFilteredVoices();

  if (!isSupported) {
    return (
      <div className="text-[10px] text-rose-500 font-mono italic px-2 py-1 bg-rose-50 rounded border border-rose-100 flex items-center space-x-1">
        <span>⚠️ {loc.notSupported}</span>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`relative accessibility-exclude select-none ${className}`}>
        {/* Same styling as dark mode toggle button */}
        <button
          type="button"
          onClick={isPlaying ? handleStop : handlePlayStart}
          title={loc.readAloud}
          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
            isPlaying
              ? "bg-orange-100 border-orange-300 text-orange-650 dark:bg-orange-955/30 dark:border-orange-800/40 dark:text-orange-400"
              : darkMode
              ? "bg-amber-955/30 border-orange-850/20 text-orange-455 hover:bg-amber-955/50"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          {isPlaying ? (
            <VolumeX className="h-4 w-4 text-orange-600 dark:text-orange-405 animate-pulse" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>

        {/* Floating popover/control panel below the button when it is playing */}
        {isPlaying && (
          <div className="absolute right-0 top-full mt-2 z-[99] bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-3 flex flex-col gap-2.5 min-w-[280px] sm:min-w-[320px] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                {loc.panelTitle}
              </span>
              <button 
                onClick={handleStop}
                className="text-[10px] bg-rose-955 text-rose-300 border border-rose-900 px-1.5 py-0.5 rounded hover:bg-rose-900 transition hover:text-white cursor-pointer"
              >
                {loc.stop}
              </button>
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              {isPaused ? (
                <button
                  type="button"
                  onClick={handleResume}
                  className="flex items-center space-x-1 py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>{loc.resume}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePause}
                  className="flex items-center space-x-1 py-1 px-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition cursor-pointer"
                >
                  <Pause className="h-3 w-3 fill-current" />
                  <span>{loc.pause}</span>
                </button>
              )}

              {/* Speed selector */}
              <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
                <span className="text-[9px] text-slate-400 font-mono">{loc.speed}</span>
                <select
                  value={speed}
                  onChange={(e) => {
                    const newSpeed = parseFloat(e.target.value);
                    setSpeed(newSpeed);
                    if (isPlaying && !isPaused) {
                      speakSentence(currentIndexRef.current);
                    }
                  }}
                  className="bg-slate-800 border border-slate-700 text-white text-[10px] rounded px-1 py-0.5 font-mono cursor-pointer focus:outline-none"
                >
                  <option value="0.8">0.8x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.2">1.2x</option>
                </select>
              </div>

              {/* Settings Cog */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1 rounded border text-slate-400 hover:text-white transition cursor-pointer ml-auto ${isMenuOpen ? "bg-slate-800 border-slate-700" : "bg-transparent border-transparent"}`}
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Advanced voice list inside popover menu */}
            {isMenuOpen && (
              <div className="bg-slate-955 rounded-lg p-2 border border-slate-800 space-y-2 text-[10px] text-slate-300">
                <div className="space-y-1">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wide">
                    {loc.volumeLabel}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const nv = parseFloat(e.target.value);
                      setVolume(nv);
                      if (isPlaying && !isPaused) {
                        speakSentence(currentIndexRef.current);
                      }
                    }}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {availableLangVoices.length > 0 && (
                  <div className="space-y-1">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wide">
                      {loc.systemVoice}
                    </span>
                    <select
                      value={selectedVoice?.name || ""}
                      onChange={(e) => {
                        const voc = availableLangVoices.find(v => v.name === e.target.value);
                        if (voc) {
                          setSelectedVoice(voc);
                          if (isPlaying && !isPaused) {
                            setTimeout(() => speakSentence(currentIndexRef.current), 50);
                          }
                        }
                      }}
                      className="w-full text-[10px] p-1 rounded border border-slate-850 bg-slate-900 text-slate-300 focus:outline-none"
                    >
                      {availableLangVoices.slice(0, 15).map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name.substring(0, 22)}...
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Currently playing sentence */}
            {currentSentenceText && (
              <div className="text-[10px] bg-slate-950 border border-slate-800 rounded-lg p-2 max-w-full text-slate-300 italic font-medium leading-relaxed">
                <span className="font-bold text-orange-400 not-italic uppercase mr-1 text-[8.5px] font-mono block mb-0.5">
                  {loc.readingNow}
                </span>
                {currentSentenceText}
              </div>
            )}

            {errorMsg && (
              <div className="text-[9px] font-bold text-rose-455 bg-rose-955/40 border border-rose-900 rounded p-1.5 flex items-center space-x-1">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`accessibility-exclude select-none flex flex-col space-y-1.5 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Main large touch-friendly triggers */}
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlayStart}
            aria-label={loc.readAloud}
            className="flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition shadow-sm border border-orange-655 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 hover:scale-[1.01] active:scale-[0.98]"
          >
            <Volume2 className="h-4 w-4" />
            <span>
              {title || `🔊 ${loc.readAloud}`}
            </span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-md">
            {/* Play/Pause control state wrapper */}
            {isPaused ? (
              <button
                type="button"
                onClick={handleResume}
                aria-label={loc.resume}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{loc.resume}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                aria-label={loc.pause}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer"
              >
                <Pause className="h-3 w-3 fill-current" />
                <span>{loc.pause}</span>
              </button>
            )}

            {/* Stop control button */}
            <button
              type="button"
              onClick={handleStop}
              aria-label={loc.stop}
              className="flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer"
            >
              <Square className="h-3 w-3 fill-current" />
              <span>{loc.stop}</span>
            </button>

            {/* Quick Speed Selector */}
            <div className="flex items-center border-l border-slate-700 pl-2 pr-1 space-x-1">
              <span className="text-[10px] text-slate-400 font-mono">{loc.speed}</span>
              <select
                aria-label="Reading Speed Selector"
                value={speed}
                onChange={(e) => {
                  const newSpeed = parseFloat(e.target.value);
                  setSpeed(newSpeed);
                  if (isPlaying && !isPaused) {
                    // Instantly patch active utterance to new speed
                    speakSentence(currentIndexRef.current);
                  }
                }}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-white text-[11px] rounded-md px-1.5 py-0.5 font-mono focus:outline-none cursor-pointer"
              >
                <option value="0.8">0.8x ({loc.slow})</option>
                <option value="1.0">1.0x ({loc.normal})</option>
                <option value="1.2">1.2x ({loc.fast})</option>
              </select>
            </div>

            {/* Setting Drawer toggle icon */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle TTS Settings"
              className={`p-1.5 rounded-lg border text-slate-400 hover:text-white transition cursor-pointer ${isMenuOpen ? "bg-slate-800 border-slate-650" : "bg-transparent border-transparent"}`}
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Quick simple Volume level toggler when playing */}
        {isPlaying && (
          <button
            type="button"
            onClick={() => {
              const nextVol = volume === 1.0 ? 0.4 : volume === 0.4 ? 0.0 : 1.0;
              setVolume(nextVol);
              if (isPlaying && !isPaused) {
                speakSentence(currentIndexRef.current);
              }
            }}
            aria-label="Volume shortcut"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-xs"
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-rose-500" />
            ) : volume < 0.6 ? (
              <Volume1 className="h-4 w-4 text-orange-600" />
            ) : (
              <Volume2 className="h-4 w-4 text-orange-600" />
            )}
          </button>
        )}
      </div>

      {/* Advanced Drawer for Selecting Specific custom Browser voices and exact volumes */}
      {isMenuOpen && isPlaying && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 space-y-3.5 max-w-sm animate-fadeIn">
          {/* Volume slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
              <span>{loc.volume}</span>
              <span className="font-mono">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const nv = parseFloat(e.target.value);
                setVolume(nv);
                if (isPlaying && !isPaused) {
                  speakSentence(currentIndexRef.current);
                }
              }}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* Voice selection */}
          {availableLangVoices.length > 0 && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                {loc.voiceStyleChange}
              </label>
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const voc = availableLangVoices.find(v => v.name === e.target.value);
                  if (voc) {
                    setSelectedVoice(voc);
                    if (isPlaying && !isPaused) {
                      setTimeout(() => speakSentence(currentIndexRef.current), 50);
                    }
                  }
                }}
                className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800"
              >
                {availableLangVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-[10px] text-slate-400 font-sans italic flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-orange-500" />
            <span>{loc.smartChunking}</span>
          </div>
        </div>
      )}

      {/* Real-time reading highlights or state messages */}
      {isPlaying && currentSentenceText && (
        <div className="text-[10px] bg-orange-50/70 border border-orange-100 rounded-lg p-2 max-w-lg text-slate-655 italic font-medium leading-relaxed animate-fadeIn">
          <span className="font-bold text-orange-850 not-italic uppercase mr-1 text-[9px] font-mono">{loc.readingNow}</span>
          {currentSentenceText}
        </div>
      )}

      {errorMsg && (
        <div className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-center space-x-1">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}
    </div>
  );
}
