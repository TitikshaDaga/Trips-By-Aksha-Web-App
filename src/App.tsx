import { useState, useEffect, useRef, FormEvent, MouseEvent } from "react";
import { Compass, History, Plus, X, MapPin, Trash2, ChevronRight, MessageSquare, Clock } from "lucide-react";
import { PersonalizedTrip, Message } from "./types";
import BentoHomeView from "./components/BentoHomeView";
import BentoOverviewTab from "./components/BentoOverviewTab";
import BentoItineraryTab from "./components/BentoItineraryTab";
import BentoConciergeTab from "./components/BentoConciergeTab";

const LOADING_FACTS = [
  "Consulting local guides for secretly guarded neighborhoods...",
  "Sifting through regional menus to find the perfect signature dishes...",
  "Timing travel routes to avoid busy hours and maximize golden lighting...",
  "Unearthing little-known historical secrets and folklore legends...",
  "Polishing your bespoke travel docket for a flawless high-end journey...",
  "Arranging digital maps of cozy bakeries and artisan craft shops..."
];

export default function App() {
  // Trips state
  const [savedTrips, setSavedTrips] = useState<PersonalizedTrip[]>([]);
  const [activeTrip, setActiveTrip] = useState<PersonalizedTrip | null>(null);
  const [isSavedTripListOpen, setIsSavedTripListOpen] = useState(false);

  // Form State
  const [destination, setDestination] = useState("");
  const [durationDays, setDurationDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState("Curated Mid-Range");
  const [travelerType, setTravelerType] = useState("Couple");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Hidden Gems", "Gastronomy"]);
  const [timing, setTiming] = useState("Anytime");
  const [extraRequests, setExtraRequests] = useState("");

  // Plan generation process state
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingFactIndex, setLoadingFactIndex] = useState(0);
  const [planError, setPlanError] = useState<string | null>(null);

  // Itinerary View State
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "concierge">("overview");
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);

  // Concierge Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load Saved Trips from localStorage on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("trips_by_aksha_saved");
      if (stored) {
        const parsed: PersonalizedTrip[] = JSON.parse(stored);
        setSavedTrips(parsed);
        if (parsed.length > 0) {
          setActiveTrip(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load saved trips", e);
    }
  }, []);

  // Save Trips to localStorage helper
  const saveTripsToLocalStorage = (newTrips: PersonalizedTrip[]) => {
    try {
      localStorage.setItem("trips_by_aksha_saved", JSON.stringify(newTrips));
      setSavedTrips(newTrips);
    } catch (e) {
      console.error("Failed to persist trips to localStorage", e);
    }
  };

  // Fact rotation effect during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingFactIndex((prev) => (prev + 1) % LOADING_FACTS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Scroll to bottom of concierge chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  // Handler: Select Interest
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  // Handler: Generate Custom Trip
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsGenerating(true);
    setPlanError(null);
    setLoadingFactIndex(0);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          durationDays,
          budget: budgetTier,
          travelers: travelerType,
          interests: selectedInterests,
          timing,
          extraRequests
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to generate travel plan.");
      }

      const rawTrip: PersonalizedTrip = await response.json();
      
      const formattedTrip: PersonalizedTrip = {
        ...rawTrip,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        budgetTier,
        travelerType
      };

      const updated = [formattedTrip, ...savedTrips];
      saveTripsToLocalStorage(updated);
      
      setActiveTrip(formattedTrip);
      setActiveTab("overview");
      setSelectedDayNum(1);

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Welcome to your bespoke holiday in **${formattedTrip.destination}**! I am **Aksha**, your personal travel curator and digital concierge.\n\nI have crafted **"${formattedTrip.tripName}"** to perfectly match your desire for *${formattedTrip.budgetTier}* experiences as a *${formattedTrip.travelerType}*.\n\nBrowse through your personalized curated itinerary tabs, and ask me absolutely anything! I can offer quick restaurant suggestions, translate local phrases, find boutique shopping spots, or tweak your daily daily plans on the fly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } catch (err: any) {
      console.error(err);
      setPlanError(err.message || "Something went wrong while curating your design. Please check your network or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Send Message to Concierge
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSendingMessage) return;

    const userMsgText = inputText.trim();
    setInputText("");

    const newMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsSendingMessage(true);

    try {
      const chatHistory = updatedMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatHistory,
          userMessage: userMsgText,
          currentTripContext: activeTrip ? {
            tripName: activeTrip.tripName,
            destination: activeTrip.destination,
            overview: activeTrip.overview,
            highlights: activeTrip.highlights,
            estimatedBudget: activeTrip.estimatedBudget,
            packingEssentials: activeTrip.packingEssentials,
            localCustoms: activeTrip.localCustoms,
            itinerarySummary: activeTrip.itinerary.map(d => ({
              dayNum: d.dayNumber,
              theme: d.theme,
              meals: d.meals.map(m => `${m.type}: ${m.recommendation}`),
              activities: d.activities.map(a => a.title)
            }))
          } : null
        })
      });

      if (!res.ok) {
        throw new Error("Failed to get concierge reply.");
      }

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: data.reply || "I apologize, I lost connection to my travel logs temporarily. Feel free to ask again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "I had a bit of trouble reaching the local records server. Let's try that again! What else can I guide you on?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Delete Trip
  const handleDeleteTrip = (tripId: string, event: MouseEvent) => {
    event.stopPropagation();
    const updated = savedTrips.filter((t) => t.id !== tripId);
    saveTripsToLocalStorage(updated);
    
    if (activeTrip && activeTrip.id === tripId) {
      setActiveTrip(updated.length > 0 ? updated[0] : null);
    }
  };

  // Quick Start Destination
  const handleQuickDestination = (destName: string) => {
    setDestination(destName);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-blue-105 selection:text-blue-900 leading-normal">
      {/* Elegantly Curated Brand Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-205">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-[#2563eb] flex items-center justify-center animate-pulse">
              <Compass className="w-5.5 h-5.5 animate-spin-slow text-[#2563eb]" />
            </span>
            <div>
              <h1 id="brand-title" className="text-sm sm:text-base font-extrabold tracking-tight text-slate-950 font-serif leading-none">
                Trips By Aksha
              </h1>
              <p className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase mt-1 leading-none">
                AI-Bento Travel Architect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Saved History Button */}
            {savedTrips.length > 0 && (
              <button
                type="button"
                onClick={() => setIsSavedTripListOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 hover:border-slate-350 bg-white text-slate-705 rounded-xl text-[11px] font-bold transition cursor-pointer"
              >
                <History className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">My Dossiers ({savedTrips.length})</span>
              </button>
            )}

            {/* Clear/Reset creation button if activeTrip is loaded to design alternative */}
            {activeTrip && (
              <button
                id="reset-form-btn"
                type="button"
                onClick={() => {
                  setActiveTrip(null);
                  setDestination("");
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-[11px] transition flex items-center gap-1 cursor-pointer"
                title="Create a New Custom Trip"
              >
                <Plus className="w-4 h-4 text-amber-305" />
                <span className="hidden sm:inline tracking-wider uppercase">New Odyssey</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer Overlay for Saved Trips list (History panel) */}
      {isSavedTripListOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsSavedTripListOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl flex flex-col z-50 animate-fade-in border-l border-slate-200">
            <div className="px-5 py-4 border-b border-slate-205 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-blue-600" />
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 font-mono">Vacation Dossiers</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSavedTripListOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-505 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {savedTrips.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Compass className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs text-slate-500 font-medium font-serif leading-snug">No vacation dossiers compiled details yet.</p>
                </div>
              ) : (
                savedTrips.map((trip) => {
                  const isActive = activeTrip && activeTrip.id === trip.id;
                  return (
                    <div
                      key={trip.id}
                      onClick={() => {
                        setActiveTrip(trip);
                        setActiveTab("overview");
                        setSelectedDayNum(1);
                        setIsSavedTripListOpen(false);
                      }}
                      className={`text-left p-4 rounded-2xl border transition duration-150 cursor-pointer flex justify-between items-start group relative ${
                        isActive
                          ? "border-blue-500 bg-blue-50/45"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1.5 pr-6 max-w-[85%]">
                        <h5 className="font-serif font-bold text-xs text-slate-900 group-hover:text-blue-900 line-clamp-1">{trip.tripName}</h5>
                        <p className="text-[10px] font-sans font-semibold text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {trip.destination}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase font-mono mt-1 leading-none">
                          {trip.durationDays} Days • {trip.budgetTier || "Mid-Range"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e: MouseEvent) => handleDeleteTrip(trip.id, e)}
                        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-rose-50 hover:text-rose-700 text-slate-300 transition-colors cursor-pointer"
                        title="Delete Dossier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-150 text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Trips By Aksha © 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW A: Active LLM curation phase */}
        {isGenerating && (
          <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-fade-in flex flex-col items-center">
            
            {/* Spinning Compass frame */}
            <div className="relative h-24 w-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/30 animate-spin-slow"></div>
              <Compass className="w-12 h-12 text-[#2563eb]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight">
                Architecting Your Vacation Bento Box Suite...
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest leading-none">
                Bespoke algorithms evaluating local secrets
              </p>
            </div>

            {/* Rotating system state text */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 w-full min-h-[90px] flex items-center justify-center shadow-xs">
              <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed italic animate-pulse">
                "{LOADING_FACTS[loadingFactIndex]}"
              </p>
            </div>
            
            <div className="flex gap-1.5 justify-center items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>

          </div>
        )}

        {/* VIEW B: Fresh planner interface */}
        {!activeTrip && !isGenerating && (
          <BentoHomeView
            destination={destination}
            setDestination={setDestination}
            durationDays={durationDays}
            setDurationDays={setDurationDays}
            budgetTier={budgetTier}
            setBudgetTier={setBudgetTier}
            travelerType={travelerType}
            setTravelerType={setTravelerType}
            selectedInterests={selectedInterests}
            toggleInterest={toggleInterest}
            timing={timing}
            setTiming={setTiming}
            extraRequests={extraRequests}
            setExtraRequests={setExtraRequests}
            handleGenerate={handleGenerate}
            planError={planError}
            handleQuickDestination={handleQuickDestination}
          />
        )}

        {/* VIEW C: Handcrafted active trip workspace dashboard */}
        {activeTrip && !isGenerating && (
          <div className="space-y-6">
            
            {/* Horizontal Dashboard head controller bar */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-1 leading-none">
                  Active Custom Dossier
                </span>
                <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  {activeTrip.tripName}
                </h2>
              </div>

              {/* Bento Tab Toggle Navigation with correct styling and element labels */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {[
                  { id: "overview", label: "Overview Detail" },
                  { id: "itinerary", label: "Daily Timeline" },
                  { id: "concierge", label: "Concierge Chat" }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-btn-${tab.id}`}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4.5 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest transition cursor-pointer ${
                        isActive
                          ? "bg-white text-[#2563eb] shadow-xxs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-900 hover:bg-white/45"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Render selected workspace cells */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Leftern Main Screen content for the selected tab */}
              <div className="lg:col-span-3">
                {activeTab === "overview" && (
                  <BentoOverviewTab
                    activeTrip={activeTrip}
                    onActivateConcierge={() => setActiveTab("concierge")}
                    timing={timing}
                  />
                )}

                {activeTab === "itinerary" && (
                  <BentoItineraryTab
                    activeTrip={activeTrip}
                    selectedDayNum={selectedDayNum}
                    setSelectedDayNum={setSelectedDayNum}
                  />
                )}

                {activeTab === "concierge" && (
                  <BentoConciergeTab
                    activeTripName={activeTrip.tripName}
                    messages={messages}
                    inputText={inputText}
                    setInputText={setInputText}
                    handleSendMessage={handleSendMessage}
                    isSendingMessage={isSendingMessage}
                    chatEndRef={chatEndRef}
                  />
                )}
              </div>

              {/* Rightern sidebar widget section */}
              <div className="lg:col-span-1 space-y-4">
                
                {/* Micro timing advice box */}
                <div className="bg-white border border-slate-205 rounded-[22px] p-5 shadow-xxs space-y-3.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                    ⏱️ Timing & Pacing Constraints
                  </span>
                  <div className="text-xs text-slate-705 leading-relaxed font-semibold space-y-2.5 font-serif">
                    <p>
                      <strong>Serene Cadence rule:</strong> We strongly advice taking a 2-hour leisurely afternoon rest to preserve a vacation speed.
                    </p>
                    <p>
                      <strong>Access Pathways:</strong> Message Aksha inside the Curator box for step-free walkways or specific lane guidelines.
                    </p>
                  </div>
                </div>

                {/* Petite Recent List */}
                {savedTrips.length > 1 && (
                  <div className="bg-white border border-slate-200 rounded-[22px] p-5 shadow-xxs space-y-3.5 hidden lg:block">
                    <span className="text-[10px] font-black text-slate-405 uppercase tracking-widest block leading-none">
                      🗂️ Alternative Dossiers
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {savedTrips.map((other) => {
                        if (other.id === activeTrip.id) return null;
                        return (
                          <button
                            key={other.id}
                            type="button"
                            onClick={() => {
                              setActiveTrip(other);
                              setActiveTab("overview");
                              setSelectedDayNum(1);
                            }}
                            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition text-slate-805 text-xxs flex justify-between items-center group cursor-pointer"
                          >
                            <div className="space-y-0.5 max-w-[85%]">
                              <h5 className="font-serif font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1">
                                {other.tripName}
                              </h5>
                              <p className="text-[9px] text-slate-500 font-medium">{other.destination}</p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Styled Footpad */}
      <footer className="bg-slate-105 border-t border-slate-200 text-center py-7 px-4 text-xs text-slate-550 space-y-1 mt-10">
        <p className="font-serif italic text-slate-655">
          "Each journey is unique, each secret curated with ultimate intention."
        </p>
        <p className="font-sans font-bold tracking-widest text-[#94a3b8] text-[9px] uppercase">
          Trips By Aksha © 2026. All curated plans powered by AI.
        </p>
      </footer>

    </div>
  );
}
