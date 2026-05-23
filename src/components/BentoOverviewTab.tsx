import { useState } from "react";
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  DollarSign, 
  Briefcase, 
  Globe, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  CloudSun
} from "lucide-react";

interface BentoOverviewTabProps {
  activeTrip: {
    tripName: string;
    destination: string;
    durationDays: number;
    budgetTier: string;
    travelerType: string;
    overview: string;
    packingEssentials?: string[];
    localCustoms?: string[];
    estimatedBudget: {
      lodging: string;
      food: string;
      activities: string;
      transportation: string;
      currency?: string;
    };
    itinerary: any[];
  };
  onActivateConcierge: () => void;
  timing: string;
}

export default function BentoOverviewTab({ activeTrip, onActivateConcierge, timing }: BentoOverviewTabProps) {
  // Simple checkmark list state for the packing component to make it interactive!
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});

  const togglePacked = (idx: number) => {
    setPackedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Weather forecast lookup helper
  const getWeatherAdvice = () => {
    const season = timing.toLowerCase();
    if (season.includes("spring")) {
      return { temp: "18°C", text: "Spring Equinox", advice: "Crisp mornings, pleasant cherry blossom walks." };
    }
    if (season.includes("summer")) {
      return { temp: "28°C", text: "Golden Sun", advice: "Warm days. Recommend midday dining shelters." };
    }
    if (season.includes("autumn")) {
      return { temp: "14°C", text: "Crisp Foliage", advice: "Golden leaves, light layers recommended." };
    }
    if (season.includes("winter")) {
      return { temp: "6°C", text: "Moody Solstice", advice: "Brisk clean atmosphere; cozy tea rooms." };
    }
    return { temp: "21°C", text: "Serene Climate", advice: "Perfect mild atmosphere for walking tours." };
  };

  const weather = getWeatherAdvice();

  // Safe checks for arrays
  const essentials = activeTrip.packingEssentials || ["Comfortable walking shoes", "Local cash notes", "Reusable capsule water container", "A light seasonal jacket"];
  const customs = activeTrip.localCustoms || ["Greetings go a long way; say hello first", "Carry clean cash for local makers", "Keep voice volumes relaxed in public transit"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 animate-fade-in">
      
      {/* GRID HERO DIRECTIVE - Spans 4 Columns, 2 Rows equivalent on Desktop */}
      <div className="md:col-span-4 bg-slate-900 text-white rounded-[24px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 bento-grid-mesh opacity-15 pointer-events-none"></div>
        {/* Radial dark ambiance gradient */}
        <div className="absolute -right-28 -top-28 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-blue-500/20 text-blue-300 border border-blue-400/20">
              <Compass className="w-3 h-3 text-blue-400" />
              Bespoke Escape
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-slate-800 text-amber-400 border border-slate-700">
              <Sparkles className="w-3 h-3" />
              {activeTrip.durationDays} Days Odyssey
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif leading-tight">
              {activeTrip.tripName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-normal flex items-center gap-1.5 font-sans font-medium">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              {activeTrip.destination}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 relative z-10 space-y-2">
          <span className="text-[10px] tracking-widest font-black uppercase text-blue-400">Curator Vision Statement</span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
            {activeTrip.overview}
          </p>
        </div>
      </div>

      {/* CLIMATE VIBE CARD - Spans 2 Columns */}
      <div className="md:col-span-2 bg-white rounded-[24px] border border-slate-200/90 p-6 flex flex-col justify-between relative transition hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#94a3b8] flex items-center gap-1 mt-0.5">
            <CloudSun className="w-4 h-4 text-[#2563eb]" /> Climate Index
          </span>
          <ArrowUpRight className="w-4 h-4 text-slate-350" />
        </div>

        <div className="my-4">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{weather.temp}</span>
          <p className="text-xs font-bold text-slate-800 tracking-tight mt-1">{weather.text}</p>
        </div>

        <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
          <p className="text-[10px] text-slate-500 font-semibold leading-normal">
            🍂 {weather.advice}
          </p>
        </div>
      </div>

      {/* ESTIMATED BUDGET METER CARD - Spans 2 Columns */}
      <div className="md:col-span-2 bg-white rounded-[24px] border border-slate-200/90 p-6 flex flex-col justify-between relative transition hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#94a3b8] flex items-center gap-1.5 mt-0.5">
            <DollarSign className="w-4 h-4 text-[#2563eb]" /> Budget Ledger
          </span>
          <TrendingUp className="w-4 h-4 text-[#2563eb]" />
        </div>

        <div className="my-4">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {activeTrip.estimatedBudget.currency || "USD"} • {activeTrip.budgetTier === "Ultimate Luxury" ? "Luxury Tier" : activeTrip.budgetTier === "Curated Mid-Range" ? "Curated Tier" : "Eco Tier"}
          </span>
          {/* Animated custom progress visualizer mimicking the budget component in design block */}
          <div className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden flex">
            <div className="h-full bg-[#2563eb]" style={{ width: "35%" }}></div>
            <div className="h-full bg-emerald-500" style={{ width: "25%" }}></div>
            <div className="h-full bg-amber-500" style={{ width: "22%" }}></div>
            <div className="h-full bg-indigo-400" style={{ width: "18%" }}></div>
          </div>
          <p className="text-[9px] text-slate-400 font-mono text-right mt-1.5 uppercase font-bold">Divided allocation indicator</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></span>
            <span className="text-slate-500 font-semibold truncate leading-none">Bespoke Lodging</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="text-slate-500 font-semibold truncate leading-none">Fine Dining</span>
          </div>
        </div>
      </div>

      {/* DETAILED LEDGER BREAKDOWN BOX - Spans 4 Columns */}
      <div className="md:col-span-4 bg-white rounded-[24px] border border-slate-200/90 p-6 flex flex-col justify-between relative transition hover:border-slate-300">
        <span className="block text-[10px] uppercase font-black tracking-widest text-[#94a3b8] flex items-center gap-1">
          📊 Boutique Allocated Estimations
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
          {[
            { title: "Bespoke Lodging", value: activeTrip.estimatedBudget.lodging, color: "text-[#2563eb]", bg: "bg-blue-50/25 border-blue-100/60" },
            { title: "Dining & Drinks", value: activeTrip.estimatedBudget.food, color: "text-emerald-700", bg: "bg-emerald-50/25 border-emerald-100/50" },
            { title: "Curated Excursions", value: activeTrip.estimatedBudget.activities, color: "text-amber-800", bg: "bg-amber-50/25 border-amber-100/50" },
            { title: "Local Transports", value: activeTrip.estimatedBudget.transportation, color: "text-slate-800", bg: "bg-slate-50 border-slate-200" }
          ].map((item, index) => (
            <div key={index} className={`p-3 rounded-2xl border ${item.bg} flex flex-col justify-between`}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
              <p className={`text-xs font-bold leading-normal mt-1.5 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-450 italic font-mono leading-none">
          Note: Local currencies vary; we recommend utilizing dynamic cards.
        </p>
      </div>

      {/* PACKING ESSENTIALS CHECKLIST CARD - Spans 2 Columns, 2 Rows */}
      <div className="md:col-span-2 md:row-span-2 bg-white rounded-[24px] border border-slate-200/90 p-6 flex flex-col justify-between relative transition hover:border-slate-300">
        <div className="space-y-4">
          <span className="block text-[10px] uppercase font-black tracking-widest text-[#94a3b8] flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-4 h-4 text-[#2563eb]" /> Boutique Gear List
          </span>

          <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-hide">
            {essentials.map((item, idx) => {
              const checked = packedItems[idx] || false;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => togglePacked(idx)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-2.5 transition duration-150 cursor-pointer ${
                    checked 
                      ? "bg-slate-50 border-emerald-200/80 text-slate-450" 
                      : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checked ? 'text-emerald-600' : 'text-slate-305'}`} />
                  <span className={`text-[11px] font-medium leading-snug ${checked ? 'line-through text-slate-400' : ''}`}>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mt-4">
          Tap elements to pack.
        </p>
      </div>

      {/* CULTURE INSIDERS ETIQUETTE BULLETIN - Spans 2 Columns */}
      <div className="md:col-span-2 bg-gradient-to-tr from-[#eff6ff] to-[#f8fafc] rounded-[24px] border border-blue-150 p-6 flex flex-col justify-between transition hover:border-blue-300">
        <div className="space-y-3">
          <span className="block text-[10px] uppercase font-black tracking-widest text-blue-800 flex items-center gap-1 my-0.5">
            <Globe className="w-4 h-4" /> Insiders Culture Customs
          </span>
          <ul className="space-y-2.5">
            {customs.map((custom, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 leading-normal font-medium font-serif">
                <span className="text-blue-600 font-bold">●</span>
                <span>{custom}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-4">Culture Bulletins Verified</p>
      </div>

      {/* TRACKER SIMULATOR CARD - Spans 2 Columns */}
      <div className="md:col-span-2 bg-emerald-50/45 border border-emerald-200 rounded-[24px] p-6 flex flex-col justify-between transition hover:border-emerald-300 relative overflow-hidden">
        {/* Glowing abstract spot indicator for fidelity */}
        <span className="absolute top-4 right-4 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <div className="space-y-1">
          <span className="text-[10px] font-black text-emerald-805 uppercase tracking-widest">
            Coordinate Tracking Line
          </span>
          <h4 className="text-xs font-bold text-emerald-950 font-serif">Awaiting Live Feed</h4>
          <p className="text-[11px] text-emerald-700 leading-normal mt-1 leading-snug">
            Aksha has mapped local coordinates of {activeTrip.destination}. Ask your curator in the chatbot box to trace pathways dynamically!
          </p>
        </div>

        {/* Micro map mockup line */}
        <div className="h-9 border-b border-dashed border-emerald-300/80 relative flex items-center justify-between mt-4">
          <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">0.0 KM</span>
          <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Bespoke GPS Live</span>
        </div>
      </div>

      {/* QUICK CONCIERGE LAUNCH CARD - Spans 6 Columns */}
      <div className="md:col-span-6 bg-white border border-slate-205 rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 transition hover:border-slate-300">
        <div className="flex items-start gap-3.5">
          <span className="p-3 bg-blue-50 text-blue-700 rounded-2xl flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Digital Curator Companion Prompt</h4>
            <p className="text-xs text-slate-500 font-serif max-w-xl">
              Need instant changes, localized translation guides, or custom restaurants? The live concierge is pre-seeded with <strong>"{activeTrip.tripName}"</strong> facts.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onActivateConcierge}
          className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-serif font-bold tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto flex-shrink-0"
        >
          <span>Activate Ask-Aksha Desk</span>
          <ChevronRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

    </div>
  );
}
