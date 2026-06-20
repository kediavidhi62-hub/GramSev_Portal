import React, { useState } from "react";
import { TRANSLATIONS } from "../translations";
import { AppLanguage, UserRole, PanchayatAsset, NREGAMusterWorker } from "../types";
import { Map, MapPin, Camera, Sparkles, Sliders, Users, Landmark, Hammer, Plus, ShieldAlert } from "lucide-react";

interface GeoTaggingProps {
  language: AppLanguage;
  role: UserRole;
  isOnline: boolean;
  assets: PanchayatAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PanchayatAsset[]>>;
  workers: NREGAMusterWorker[];
  setWorkers: React.Dispatch<React.SetStateAction<NREGAMusterWorker[]>>;
  onQueueSync: (type: "WORK_ATTENDANCE" | "ASSET_TAGGING", data: any) => void;
}

export default function GeoTagging({
  language,
  role,
  isOnline,
  assets,
  setAssets,
  workers,
  setWorkers,
  onQueueSync
}: GeoTaggingProps) {
  const t = TRANSLATIONS[language];

  // Forms Geo-tag asset
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState<"WELL" | "ROAD" | "SCHOOL" | "TOILET" | "STREETLIGHT" | "HEALTH_CENTRE">("WELL");
  const [selectedWard, setSelectedWard] = useState<number>(3);
  const [currLat, setCurrLat] = useState<number>(26.8145);
  const [currLon, setCurrLon] = useState<number>(75.8025);

  // Active Worker Checkin Form
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [simulatedSelfie, setSimulatedSelfie] = useState(false);

  // Interactive Map click to fetch coordinates
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixels to relative Jaipur/Sanganer coords
    const mappedLat = 26.8120 + (y / rect.height) * 0.005;
    const mappedLon = 75.8000 + (x / rect.width) * 0.005;

    setCurrLat(mappedLat);
    setCurrLon(mappedLon);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();

    const newAsset: PanchayatAsset = {
      id: "ASSET-" + Math.floor(1000 + Math.random() * 9000),
      name: newAssetName || "Ward Community Well",
      type: newAssetType,
      lat: currLat,
      lon: currLon,
      status: "FUNCTIONAL",
      wardId: selectedWard,
      lastChecked: new Date().toISOString().split("T")[0],
      verifiedBy: "Sarpanch Sanganer"
    };

    if (!isOnline) {
      onQueueSync("ASSET_TAGGING", newAsset);
      const offlineAsset = { ...newAsset, name: `[OFFLINE QUEUE] ${newAsset.name}` };
      setAssets(prev => [...prev, offlineAsset]);
    } else {
      setAssets(prev => [...prev, newAsset]);
    }

    setNewAssetName("");
  };

  const handleWorkerCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId) return;

    const workerLat = 26.8132 + Math.random() * 0.002;
    const workerLon = 75.85 + Math.random() * 0.002;

    const updatedWorkerData = {
      status: "PRESENT" as const,
      checkInTime: new Date().toLocaleTimeString("en-IN"),
      lat: workerLat,
      lon: workerLon,
      selfieUrl: "selfie-verified-worker.png"
    };

    if (!isOnline) {
      onQueueSync("WORK_ATTENDANCE", { workerId: selectedWorkerId, ...updatedWorkerData });
      setWorkers(prev => prev.map(w => {
        if (w.id === selectedWorkerId) {
          return {
            ...w,
            status: "PRESENT" as const,
            checkInTime: `[OFFLINE] ${new Date().toLocaleTimeString("en-IN")}`,
            lat: workerLat,
            lon: workerLon,
            selfieUrl: "offline-cached-face.png"
          };
        }
        return w;
      }));
    } else {
      setWorkers(prev => prev.map(w => {
        if (w.id === selectedWorkerId) {
          return {
            ...w,
            status: "PRESENT",
            ...updatedWorkerData
          };
        }
        return w;
      }));
    }

    setSelectedWorkerId("");
    setSimulatedSelfie(false);
  };

  const getAssetColor = (type: string) => {
    switch (type) {
      case "WELL": return "#0284c7"; // Drinking Blue
      case "ROAD": return "#475569"; // Slate gray
      case "SCHOOL": return "#b45309"; // Yellow gold
      case "TOILET": return "#0d9488"; // Teal
      case "STREETLIGHT": return "#ca8a04"; // Yellow
      default: return "#c084fc"; // Purple
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper info banners */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start space-x-3">
          <div className="bg-orange-50 text-orange-700 p-2 rounded-xl shrink-0 border border-orange-100">
            <Map className="h-6 w-6 text-orange-655" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              {t.assetMappingTitle}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Ensuring public audit transparency through location geo-pinning and certified attendance records.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INTERACTIVE MAP SVG CANVAS */}
        <div className="col-span-1 lg:col-span-7 bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-sans uppercase">
              🗺️ Sanganer Gram Panchayat Spatial Map
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Click anywhere on land map to grab lat/lon coords
            </span>
          </div>

          {/* Map canvas wrapping SVG */}
          <div className="relative border-4 border-slate-100 rounded-xl bg-slate-950 overflow-hidden select-none">
            
            {/* Legend guide overlaid on map */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm p-3.5 rounded-lg border border-slate-800 z-10 space-y-1.5 text-[9px] text-slate-300 font-mono shadow-md">
              <p className="font-bold text-white uppercase text-[8px] tracking-wider mb-1">Asset Map Pins</p>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-sky-500"></span><span>Water Wells / Borewell (WELL)</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-slate-500"></span><span>Road Infrastructure (ROAD)</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-yellow-600"></span><span>School Building (SCHOOL)</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-teal-600"></span><span>Sanitation Facility (TOILET)</span></div>
            </div>

            <svg
              onClick={handleMapClick}
              viewBox="0 0 600 400"
              className="w-full h-auto cursor-crosshair transition hover:opacity-95"
            >
              {/* Background abstract landscape of village */}
              <rect width="600" height="400" fill="#2d3748" />
              <path d="M 0 100 Q 150 150 300 120 T 600 240 L 600 400 L 0 400 Z" fill="#1a202c" />
              <path d="M 0 300 Q 100 250 250 350 T 600 280 L 600 400 L 0 400 Z" fill="#131722" fillOpacity="0.4" />
              
              {/* Simulated main village roads (Grey lines) */}
              <path d="M 120 0 L 150 180 Q 200 240 380 280 L 600 300" stroke="#4a5568" strokeWidth="8" fill="none" opacity="0.6" />
              <path d="M 0 150 Q 80 140 250 210 L 400 400" stroke="#4a5568" strokeWidth="6" fill="none" opacity="0.4" />

              {/* Village river/canal boundaries */}
              <path d="M 0 50 Q 180 80 400 30 T 600 80" stroke="#3182ce" strokeWidth="3" fill="none" opacity="0.3" />

              {/* Dynamic Coordinate Target Indicator (When clicked) */}
              {currLat && currLon && (
                <g>
                  {/* Coordinates projected onto map pixels:
                      We reverse relative ratios inside 600/400 range:
                      mappedLat = 26.8120 + (y / rect.height) * 0.005;  -> y = (mappedLat - 26.8120)/0.005 * 400
                      mappedLon = 75.8000 + (x / rect.width) * 0.005;   -> x = (mappedLon - 75.8000)/0.005 * 600
                  */}
                  <circle
                    cx={((currLon - 75.80) / 0.005) * 600}
                    cy={((currLat - 26.8120) / 0.005) * 400}
                    r="12"
                    fill="#ca8a04"
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    cx={((currLon - 75.80) / 0.005) * 600}
                    cy={((currLat - 26.8120) / 0.005) * 400}
                    r="4"
                    fill="#eab308"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Render existing assets as styled map pins */}
              {assets.map((asset) => {
                const pxX = ((asset.lon - 75.80) / 0.005) * 600;
                const pxY = ((asset.lat - 26.8120) / 0.005) * 400;
                return (
                  <g key={asset.id} className="cursor-pointer group">
                    <circle
                      cx={pxX}
                      cy={pxY}
                      r="7"
                      fill={getAssetColor(asset.type)}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={pxX}
                      cy={pxY}
                      r="14"
                      fill={getAssetColor(asset.type)}
                      opacity="0"
                      className="group-hover:opacity-20 transition duration-150"
                    />
                    {/* Tooltip on hover */}
                    <text
                      x={pxX}
                      y={pxY - 14}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition pointer-events-none fill-slate-200 bg-slate-900 border"
                      style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))" }}
                    >
                      {asset.name} ({asset.type})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* GEO-TAG FORM PANEL — Only active for officials inside the UI block */}
          <div className={`p-4 border border-slate-150 rounded-xl bg-slate-50 relative ${role !== UserRole.OFFICIAL ? "opacity-60 cursor-not-allowed" : ""}`}>
            {role !== UserRole.OFFICIAL && (
              <div className="absolute inset-0 bg-slate-200/40 backdrop-blur-[1px] z-15 flex items-center justify-center rounded-xl">
                <span className="bg-slate-900 text-white font-mono text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg border border-slate-700">
                  {language === AppLanguage.HI ? "सिर्फ पंचायत अधिकारी ही संपत्ति जियो-टैग कर सकते हैं" : "OFFICIAL ROLE ONLY REQUIRED TO GEOTAG"}
                </span>
              </div>
            )}

            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div className="flex items-center space-x-1.5 mb-2.5">
                <Plus className="h-4 w-4 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-800 font-sans uppercase">
                  {t.tagNewAsset}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Asset Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-sans">
                    {t.assetName}
                  </label>
                  <input
                    required
                    type="text"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    placeholder="E.g., Deep Borewell, Primary School Ground"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs font-sans focus:outline-none"
                  />
                </div>

                {/* Asset Category */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-sans">
                    {t.assetType}
                  </label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs font-sans"
                  >
                    <option value="WELL">Drinking water (WELL)</option>
                    <option value="ROAD">Paved Roadway (ROAD)</option>
                    <option value="SCHOOL">School Yard (SCHOOL)</option>
                    <option value="TOILET">Public Toilet Block (TOILET)</option>
                    <option value="STREETLIGHT">Solar Light Post (STREETLIGHT)</option>
                    <option value="HEALTH_CENTRE">Primary Care Clinic (HEALTH_CENTRE)</option>
                  </select>
                </div>

                {/* Coord indicators */}
                <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono">
                  <span>Pin Lat: <strong>{currLat.toFixed(5)}</strong></span>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono">
                  <span>Pin Lon: <strong>{currLon.toFixed(5)}</strong></span>
                </div>

              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-orange-400 font-bold text-xs py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
              >
                Register Tagged Village Asset
              </button>

            </form>
          </div>

        </div>

        {/* WORKER ATTENDANCE ACTIVE MUSTER */}
        <div className="col-span-1 lg:col-span-5 bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans uppercase flex items-center space-x-1.5">
              <Users className="h-4 w-4 text-orange-650" />
              <span>{t.workerSelfieCheckIn}</span>
            </h3>
            <span className="bg-rose-50/70 text-rose-700 text-[9px] uppercase font-bold py-0.5 px-2 rounded-full border border-rose-200">
              Muster Active
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Ensure zero fake attendance logs. Farmers and laborers perform daily check-in with GPS validation & face selfie snap.
          </p>

          {/* ATTENDANCE CHECKIN CONTROLS — Only for citizen roles */}
          <div className={`p-4 border border-rose-100 rounded-xl bg-rose-500/5 relative ${role !== UserRole.CITIZEN ? "opacity-60 cursor-not-allowed" : ""}`}>
            {role !== UserRole.CITIZEN && (
              <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1.5px] z-20 flex items-center justify-center rounded-xl">
                <span className="bg-slate-900 text-white font-mono text-[9px] uppercase font-bold p-1.5 rounded border border-slate-700 text-center shadow-lg">
                  SWITCH CITIZEN ROLE BELOW TO SUBMIT ATTENDANCE
                </span>
              </div>
            )}

            <form onSubmit={handleWorkerCheckin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase font-sans">
                  Select Registered MNREGA Worker Name
                </label>
                <select
                  required
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs font-sans font-medium"
                >
                  <option value="">-- Choose Worker Profile --</option>
                  {workers.filter(w => w.status !== "PRESENT").map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} (ID: {w.jobCardId})
                    </option>
                  ))}
                </select>
              </div>

              {/* simulated GPS coordinate snapshot button */}
              <div className="flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setSimulatedSelfie(true)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-[11px] font-sans font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                    simulatedSelfie
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>{simulatedSelfie ? "✓ Selfie Captured" : "Snap Verification Selfie"}</span>
                </button>

                <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-[9px] text-rose-800 font-mono text-center">
                  📍 SANGANER-BLOCK GPS OK
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedWorkerId}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-lg transition cursor-pointer shadow disabled:opacity-50"
              >
                Log Attendance e-CheckIn
              </button>
            </form>
          </div>

          {/* ATTENDANCE ROSTER BOARD */}
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {workers.map((worker) => (
              <div key={worker.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 font-sans">{worker.name}</p>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">JobCard: {worker.jobCardId}</span>
                </div>

                <div className="text-right">
                  {worker.status === "PRESENT" ? (
                    <div className="space-y-0.5">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold py-0.5 px-2 rounded-full uppercase">
                        PRESENT (✓)
                      </span>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Time: {worker.checkInTime}</p>
                    </div>
                  ) : (
                    <span className="bg-rose-50 text-rose-500 border border-rose-200 text-[9px] font-bold py-0.5 px-2.5 rounded-full uppercase">
                      ABSENT (✗)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
