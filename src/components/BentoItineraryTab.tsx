import { Clock, DollarSign, MapPin, Utensils } from "lucide-react";

interface Activity {
  time?: string;
  title: string;
  description: string;
  location: string;
  estimatedDuration?: string;
  costEstimate?: string;
}

interface Meal {
  type: string;
  recommendation: string;
  cuisineDescription: string;
}

interface ItineraryDay {
  dayNumber: number;
  theme: string;
  activities: Activity[];
  meals: Meal[];
}

interface BentoItineraryTabProps {
  activeTrip: {
    itinerary: ItineraryDay[];
  };
  selectedDayNum: number;
  setSelectedDayNum: (num: number) => void;
}

export default function BentoItineraryTab({ activeTrip, selectedDayNum, setSelectedDayNum }: BentoItineraryTabProps) {
  const activeDay = activeTrip.itinerary.find((d) => d.dayNumber === selectedDayNum) || activeTrip.itinerary[0];

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* GRID CONTAINER - Split into responsive panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* PANEL 1: Day selectors (1 Column on Desktop, Horizontal Scroll on Mobile) - Bento styled */}
        <div className="lg:col-span-1 space-y-3.5">
          <span className="text-[10px] tracking-widest font-black uppercase text-slate-400 block lg:px-1">
            Days Roadmap
          </span>

          {/* Mobile horizontal scroll selector bar */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 scrollbar-hide py-1">
            {activeTrip.itinerary.map((it) => (
              <button
                key={it.dayNumber}
                id={`day-select-btn-${it.dayNumber}-mobile`}
                type="button"
                onClick={() => setSelectedDayNum(it.dayNumber)}
                className={`px-5 py-2 rounded-full text-xs font-bold border transition duration-150 flex-shrink-0 cursor-pointer ${
                  selectedDayNum === it.dayNumber
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium"
                }`}
              >
                Day {it.dayNumber}
              </button>
            ))}
          </div>

          {/* Desktop vertical grid panel */}
          <div className="hidden lg:flex flex-col gap-2.5">
            {activeTrip.itinerary.map((it) => {
              const isActive = selectedDayNum === it.dayNumber;
              return (
                <button
                  key={it.dayNumber}
                  id={`day-select-btn-${it.dayNumber}-desktop`}
                  type="button"
                  onClick={() => setSelectedDayNum(it.dayNumber)}
                  className={`w-full text-left p-4 rounded-2xl border transition duration-200 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-white border-slate-200/90 hover:bg-slate-50 hover:border-slate-350 text-slate-800"
                  }`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-amber-400" : "text-[#2563eb]"}`}>
                    Day {it.dayNumber} Focus
                  </p>
                  <h4 className="font-bold text-xs mt-1.5 line-clamp-2 leading-snug font-serif">
                    {it.theme}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: Active Timeline & Gastronomy (3 Columns on Desktop) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Day Header Canvas banner */}
          {activeDay && (
            <div className="bg-slate-900 text-white p-6 rounded-[22px] space-y-1.5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="absolute inset-0 bento-grid-mesh opacity-10 pointer-events-none"></div>
              <div className="space-y-1 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#bfdbfe]">
                  Chronicle Day {activeDay.dayNumber} Spectrum
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif leading-tight">
                  {activeDay.theme}
                </h3>
              </div>
              <div className="bg-slate-800 px-3.5 py-1.5 rounded-xl text-[10px] font-mono uppercase font-bold tracking-widest border border-slate-750 self-start sm:self-auto relative z-10 text-emerald-400">
                Pacing Calibrated
              </div>
            </div>
          )}

          {/* Hour milestones scheduler */}
          <div className="space-y-5">
            <span className="text-[10px] tracking-widest font-black uppercase text-slate-400 block">
              Curated Milestones Schedule
            </span>

            {activeDay && activeDay.activities.length > 0 ? (
              <div className="relative border-l border-slate-200/90 ml-3.5 pl-5 space-y-6">
                {activeDay.activities.map((act, actIdx) => (
                  <div key={actIdx} className="relative space-y-1">
                    {/* Timeline locator node node */}
                    <div className="absolute -left-[29px] top-1.5 bg-white border-2 border-[#2563eb] rounded-full w-4 h-4 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-205 p-5 space-y-3 hover:shadow-xxs transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-100 pb-2.5">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded-md text-[9px] bg-slate-100 font-mono font-bold text-slate-500 uppercase tracking-widest">
                            {act.time || "Event Milestone"}
                          </span>
                          <h5 id={`act-title-${actIdx}`} className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {act.title}
                          </h5>
                        </div>

                        {/* Cost estimates tags */}
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                          <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {act.estimatedDuration || "Flexible"}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            {act.costEstimate || "Sights Complimentary"}
                          </span>
                        </div>
                      </div>

                      {/* Map Location pin */}
                      <p className="text-[10px] text-blue-900 font-bold flex items-center gap-1 bg-blue-50/50 py-1 px-2.5 rounded-lg border border-blue-105 w-max leading-none">
                        <MapPin className="w-3 h-3 text-[#2563eb]" />
                        <span>{act.location}</span>
                      </p>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif">
                        {act.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                Hourly milestones pending.
              </div>
            )}
          </div>

          {/* Gastronomer dining boards */}
          {activeDay && activeDay.meals && activeDay.meals.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-[22px] p-5 sm:p-6 space-y-4">
              <span className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-700" />
                Gastronomer Recommendations for Day {activeDay.dayNumber}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeDay.meals.map((meal, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 relative hover:border-[#bfdbfe] transition">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider">
                        {meal.type}
                      </span>
                      <Utensils className="w-3.5 h-3.5 text-emerald-600/70" />
                    </div>
                    <h5 className="text-[11px] font-bold text-slate-900 font-serif leading-tight">
                      {meal.recommendation}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-normal italic">
                      {meal.cuisineDescription}
                    </p>
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
