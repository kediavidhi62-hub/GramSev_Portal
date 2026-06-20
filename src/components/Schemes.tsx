import React, { useState } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage } from "../types";
import { HeartHandshake, Shield, Layers, HelpCircle, FileCheck, Check, Landmark, ArrowRight, Sparkles } from "lucide-react";
import ReadAloud from "./ReadAloud";

interface SchemesProps {
  language: AppLanguage;
  isOnline: boolean;
}

interface SchemeResult {
  name: string;
  authority: string;
  benefit: string;
  eligibilityReason: string;
  requiredDocuments: string[];
  recommended: boolean;
}

export default function Schemes({ language, isOnline }: SchemesProps) {
  const t = TRANSLATIONS[language];

  // Citizen demographics states
  const [age, setAge] = useState<number>(32);
  const [caste, setCaste] = useState<string>("BPL / OBC");
  const [income, setIncome] = useState<number>(65000);
  const [land, setLand] = useState<string>("LESS_THAN_2_HECTARES");
  const [gender, setGender] = useState<string>("FEMALE");
  const [extraQuestion, setExtraQuestion] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SchemeResult[] | null>(null);
  const [summary, setSummary] = useState<string>("");

  const handleSearchSchemes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/scheme-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          caste,
          annualIncome: income,
          landOwnership: land,
          gender,
          queryEN: extraQuestion,
          language
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.recommendations || []);
        setSummary(data.summary || "");
      }
    } catch (err) {
      console.error("Scheme eligibility failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start space-x-3">
          <div className="bg-orange-50 text-orange-700 p-2 rounded-xl shrink-0 border border-orange-100">
            <HeartHandshake className="h-6 w-6 text-orange-655" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              {t.schemeEligibilityTitle}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Empowering widows, farmers, and underprivileged families through AI scheme discoverability.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ReadAloud language={language} targetSelector="#schemes-page-content" />
          <div className="flex items-center space-x-2 bg-orange-50 text-orange-850 text-[11px] font-sans px-3 py-1.5 rounded-lg border border-orange-200">
            <Sparkles className="h-4 w-4 animate-spin text-orange-600 duration-[5s]" />
            <span>{isOnline ? "AI Match Engine Live" : "Local Rules-Engine Fallback Active"}</span>
          </div>
        </div>
      </div>

      <div id="schemes-page-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Profile Settings */}
        <div className="col-span-1 lg:col-span-5 bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <form onSubmit={handleSearchSchemes} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                  {t.schemeAgePlaceholder}
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  max={110}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                  {t.genderSelect}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="MALE">{language === AppLanguage.HI ? "पुरुष" : "Male"}</option>
                  <option value="FEMALE">{language === AppLanguage.HI ? "महिला" : "Female"}</option>
                  <option value="OTHER">{language === AppLanguage.HI ? "अन्य" : "Other"}</option>
                </select>
              </div>
            </div>

            {/* Income Input with visual reference */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase font-sans">
                  {t.schemeIncomePlaceholder}
                </label>
                <span className="text-xs font-bold text-orange-600 font-mono">₹{income.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>₹10,000 (Low BPL)</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Caste / Category */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.casteCategory}
              </label>
              <select
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:ring-2 focus:ring-orange-500 font-medium"
              >
                <option value="SC (Scheduled Caste)">SC (Scheduled Caste)</option>
                <option value="ST (Scheduled Tribe)">ST (Scheduled Tribe)</option>
                <option value="OBC / MBC Non-Creamy Layer">OBC / MBC Non-Creamy Layer</option>
                <option value="General Category (EWS Welfare)">General Eligible (EWS)</option>
                <option value="BPL / Antyodaya Cardholder">BPL / Antyodaya Special</option>
              </select>
            </div>

            {/* Land ownership */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {t.schemeLandPlaceholder}
              </label>
              <select
                value={land}
                onChange={(e) => setLand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:ring-2 focus:ring-orange-500 font-medium"
              >
                <option value="NONE">{t.landNone}</option>
                <option value="LESS_THAN_2_HECTARES">{t.landSmall}</option>
                <option value="MORE_THAN_2_HECTARES">{t.landLarge}</option>
                <option value="ANY">{t.landAny}</option>
              </select>
            </div>

            {/* Freeform question */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-sans">
                {language === AppLanguage.HI ? "विशेष विवरण (वैकल्पिक)" : "Any Special Household Criteria (Optional)"}
              </label>
              <input
                type="text"
                value={extraQuestion}
                onChange={(e) => setExtraQuestion(e.target.value)}
                placeholder="E.g. widow pension or cattle insurance"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-orange-700 transition shadow-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>AI Matching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{t.findSchemes}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panels */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          {isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center space-y-3">
              <Sparkles className="h-10 w-10 text-orange-500 animate-spin" />
              <h4 className="font-bold text-slate-800 font-sans">Analyzing scheme guidelines via Gemini AI...</h4>
              <p className="text-xs text-slate-500">Checking eligibility matrices and exclusion indexes of 45 central departments.</p>
            </div>
          )}

          {!isLoading && !results && (
            <div className="bg-slate-50/50 rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-3">
              <HeartHandshake className="h-12 w-12 text-slate-350" />
              <h4 className="font-bold text-slate-700 font-sans">No search queries performed yet</h4>
              <p className="text-xs text-slate-400 max-w-sm">Enter your local demographic criteria on the left to instantly find matched government schemes without middleman commissions.</p>
            </div>
          )}

          {!isLoading && results && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{language === AppLanguage.HI ? "योग्य योजना सूची" : "MATCHED SCHEMES CARDS"}</span>
                <ReadAloud 
                  language={language} 
                  targetSelector="#scheme-results-container" 
                  title={language === AppLanguage.HI ? "🔊 परिणाम सुनें (Read Results)" : "🔊 Read Matched Schemes"}
                />
              </div>

              {/* Summary note block */}
              <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-200">
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  <strong className="text-orange-850 font-bold">Matched Summary: </strong>
                  {summary}
                </p>
              </div>

              {/* Individual matched blocks */}
              <div id="scheme-results-container" className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {results.map((scheme, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-150 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition relative overflow-hidden">
                    
                    {/* Status marker */}
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] uppercase font-bold py-0.5 px-3 rounded-br-lg font-mono">
                      {language === AppLanguage.HI ? "पात्र (ELIGIBLE)" : "ELIGIBLE"}
                    </div>

                    <div className="flex-1 space-y-3 pt-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Landmark className="h-4 w-4 text-orange-600" />
                          <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">{scheme.authority}</span>
                        </div>
                        <h4 className="font-bold text-md text-slate-900 font-sans mt-0.5">{scheme.name}</h4>
                      </div>

                      {/* Benefit */}
                      <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                        <strong className="text-[10px] font-bold text-slate-500 uppercase block font-sans mb-0.5">Benefit of Scheme / लाभ</strong>
                        <p className="text-xs text-slate-705 leading-relaxed">{scheme.benefit}</p>
                      </div>

                      {/* Matching reason */}
                      <div className="text-xs text-slate-600 leading-relaxed font-sans">
                        <strong className="text-[10px] font-bold text-orange-700 uppercase block">Why You Qualify:</strong>
                        <p className="italic">{scheme.eligibilityReason}</p>
                      </div>

                      {/* Required document checklist */}
                      <div>
                        <strong className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Required Documents / आवश्यक दस्तावेज</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {scheme.requiredDocuments.map((doc, dIdx) => (
                            <span key={dIdx} className="bg-slate-100 text-slate-650 text-[10px] py-1 px-2.5 rounded-md border border-slate-200/50 flex items-center space-x-1 font-sans">
                              <FileCheck className="h-3 w-3 text-emerald-600" />
                              <span>{doc}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="shrink-0 flex items-end justify-end md:justify-center md:items-center">
                      <button className="bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-800 font-bold text-xs py-3.5 px-5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow">
                        <span>{t.applyNow}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
