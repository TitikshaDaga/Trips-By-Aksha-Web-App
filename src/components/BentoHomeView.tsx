import { MapPin, Calendar, DollarSign, Users, Sparkles, Globe, Languages, AlertTriangle } from "lucide-react";

interface PopularDestination {
  name: string;
  image: string;
}

const POPULAR_DESTINATIONS: PopularDestination[] = [
  { name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=300&auto=format&fit=crop" },
  { name: "Amalfi Coast, Italy", image: "https://images.unsplash.com/photo-1486082570281-d96ccad6c171?q=80&w=300&auto=format&fit=crop" },
  { name: "Reykjavík, Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=300&auto=format&fit=crop" },
  { name: "Oaxaca, Mexico", image: "https://images.unsplash.com/photo-1512813583145-baaa340ef29f?q=80&w=300&auto=format&fit=crop" }
];

const INTERESTS_LIST = [
  { id: "Hidden Gems", label: "Secret Speakeasies & Hidden Alleyways", icon: "✨" },
  { id: "Gastronomy", label: "Local Eateries & Fine Dining", icon: "🍱" },
  { id: "Living History", label: "Ancient Landmarks & Local Lore", icon: "🏛️" },
  { id: "Nature & Hikes", label: "Scenic Trails & Hidden Beaches", icon: "⛰️" },
  { id: "Artisan Shopping", label: "Boutique Craftsmanship & Flea Markets", icon: "🧣" },
  { id: "Relax & Wellness", label: "Traditional Spas, Onsens, or Cafes", icon: "🛁" }
];

const TRAVEL_TIMINGS = [
  { id: "Anytime", label: "Whenever is Best (Bespoke recommendation)" },
  { id: "Spring Blossoms", label: "Springtime Calm" },
  { id: "Golden Summer", label: "Sunlit Summer Days" },
  { id: "Crisp Autumn", label: "Autumn Colors" },
  { id: "Winter Coziness", label: "Moody Winter Light" }
];

interface BentoHomeViewProps {
  destination: string;
  setDestination: (d: string) => void;
  durationDays: number;
  setDurationDays: (d: number) => void;
  budgetTier: string;
  setBudgetTier: (b: string) => void;
  travelerType: string;
  setTravelerType: (t: string) => void;
  selectedInterests: string[];
  toggleInterest: (i: string) => void;
  timing: string;
  setTiming: (t: string) => void;
  extraRequests: string;
  setExtraRequests: (r: string) => void;
  handleGenerate: (e: any) => void;
  planError: string | null;
  handleQuickDestination: (d: string) => void;
}

export default function BentoHomeView({
  destination,
  setDestination,
  durationDays,
  setDurationDays,
  budgetTier,
  setBudgetTier,
  travelerType,
  setTravelerType,
  selectedInterests,
  toggleInterest,
  timing,
  setTiming,
  extraRequests,
  setExtraRequests,
  handleGenerate,
  planError,
  handleQuickDestination
}: BentoHomeViewProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in mt-2">
      {/* Header banner / title */}
      <div className="text-center space-y-3.5 py-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-150">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>AI-Engineered Bespoke Travel Architecture</span>
        </span>
        <h2 className="text-3xl sm:text-5xl text-slate-900 font-extrabold tracking-tight font-serif">
          Where shall we script your memories?
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Provide your dream parameters. Aksha's intelligence will handcraft a personalized adventure complete with boutique stays, local secrets, and a live companion concierge.
        </p>
      </div>

      {/* Quick Destination Ideas Grid (Row of Bento Cards) */}
      <div className="space-y-3.5">
        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block text-center">
          Need Instant Inspiration?
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              id={`quick-dest-${dest.name.replace(/\s+/g, '-').toLowerCase()}`}
              type="button"
              onClick={() => handleQuickDestination(dest.name)}
              className="group relative h-28 rounded-2xl overflow-hidden shadow-xs hover:shadow-xs hover:border-blue-400 transition duration-250 text-left cursor-pointer border border-slate-200"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300 brightness-70 group-hover:brightness-55"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-4 bottom-3 text-white z-10">
                <p className="text-[10px] uppercase font-bold text-slate-300 flex items-center gap-0.5 tracking-wider">
                  <MapPin className="w-3 h-3 text-amber-400" /> Curated By Aksha
                </p>
                <h4 className="font-semibold text-sm sm:text-base tracking-tight leading-tight mt-0.5">
                  {dest.name}
                </h4>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* The main generator form built as a stunning bento grid layout */}
      <form onSubmit={handleGenerate} id="curator-form" className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Grid Card 1: Main Destination (col-span-4) */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition duration-200">
          <div className="space-y-1">
            <label htmlFor="input-destination" className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Bespoke Destination
            </label>
            <p className="text-xxs text-slate-400 mt-1">Enter any local city, landmark, region, or dream country.</p>
          </div>
          <input
            id="input-destination"
            type="text"
            required
            placeholder="e.g., Kyoto, Amalfi Coast, Reykjavík..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4.5 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-2xl transition text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-hidden mt-3"
          />
        </div>

        {/* Grid Card 2: Duration Slider (col-span-2) */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition duration-200">
          <div className="space-y-1">
            <label htmlFor="input-duration" className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Duration Pace
            </label>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-blue-600 tracking-tight">{durationDays}</span>
              <span className="text-xxs font-extrabold text-slate-500 uppercase tracking-widest">Days Odyssey</span>
            </div>
          </div>
          <div className="pt-2">
            <input
              id="input-duration"
              type="range"
              min="1"
              max="10"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
            />
            <div className="flex justify-between text-[10px] text-slate-450 mt-1.5 font-mono px-1">
              <span>1 Day</span>
              <span>5 Days</span>
              <span>10 Days</span>
            </div>
          </div>
        </div>

        {/* Grid Card 3: Budget Architecture (col-span-3) */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 hover:border-blue-300 hover:shadow-xs transition duration-200">
          <span className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            Budget Architecture
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Boutique Economy", text: "Backpack & street eats", label: "Economy" },
              { id: "Curated Mid-Range", text: "Charming cafes & stays", label: "Curated" },
              { id: "Ultimate Luxury", text: "Fine dining & helipads", label: "Luxury" }
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setBudgetTier(tier.id)}
                className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  budgetTier === tier.id
                    ? "border-blue-500 bg-blue-50/55 text-blue-900 ring-2 ring-blue-100/50"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white"
                }`}
              >
                <p className="text-xs font-bold leading-none">{tier.label}</p>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug line-clamp-1">{tier.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Card 4: Traveler Configuration (col-span-3) */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 hover:border-blue-300 hover:shadow-xs transition duration-200">
          <span className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            Traveler Configuration
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "Solo", text: "Solo" },
              { id: "Couple", text: "Couple" },
              { id: "Friends", text: "Friends" },
              { id: "Family", text: "Family" }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTravelerType(t.id)}
                className={`py-3.5 px-1 text-center rounded-2xl border transition-all cursor-pointer ${
                  travelerType === t.id
                    ? "border-blue-500 bg-blue-50/55 text-blue-900 ring-2 ring-blue-100/50"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white"
                }`}
              >
                <p className="text-xs font-bold">{t.id}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Card 5: Specialized Interests Selection (col-span-6) */}
        <div className="md:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 hover:border-blue-300 hover:shadow-xs transition duration-200">
          <span className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Select Adventure Focus Moodboards (Multiple)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {INTERESTS_LIST.map((item) => {
              const selected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`flex items-center gap-3.5 p-3.5 text-left rounded-2xl border transition-all cursor-pointer ${
                    selected
                      ? "border-blue-500 bg-blue-50/55 text-blue-900 shadow-xxs"
                      : "border-slate-200/95 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <span className="text-lg bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xxs leading-none">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.id}</p>
                    <p className="text-[10px] text-slate-500 leading-snug">{item.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Card 6: Seasonal Cadence (col-span-2) */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition duration-200">
          <div className="space-y-1">
            <label htmlFor="select-timing" className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Seasonal Candace
            </label>
            <p className="text-[10px] text-slate-450 leading-relaxed">We will auto-calibrate weather & activities.</p>
          </div>
          <select
            id="select-timing"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-xl text-xs font-bold outline-hidden text-slate-800 cursor-pointer mt-3"
          >
            {TRAVEL_TIMINGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid Card 7: Custom requests (col-span-4) */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition duration-200">
          <div className="space-y-1">
            <label htmlFor="input-requests" className="block text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              Bespoke Directives & Constraints
            </label>
            <p className="text-[10px] text-slate-450 leading-relaxed">Mention special diets, botanical preferences, accessibility limitations, etc.</p>
          </div>
          <input
            id="input-requests"
            type="text"
            placeholder="e.g., 'Vegetarian food, love organic architecture, design museum, no long climbs'"
            value={extraRequests}
            onChange={(e) => setExtraRequests(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-xl text-xs font-bold outline-hidden text-slate-900 mt-3"
          />
        </div>

        {/* Submit container Card (col-span-6) */}
        <div className="md:col-span-6 flex flex-col items-center">
          {planError && (
            <div className="w-full p-4.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5 text-rose-800 mb-4 animate-slide-up">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-extrabold">Curator Advisory</p>
                <p className="mt-0.5 text-rose-700 leading-normal font-medium">{planError}</p>
                {planError.includes("GEMINI_API_KEY") && (
                  <p className="mt-2 text-[10px] text-rose-600 bg-white/70 p-2.5 rounded-lg border border-rose-100">
                    <strong>Developer Insight:</strong> Head to top-right Settings inside AI Studio UI, find **Secrets**, insert your <code>GEMINI_API_KEY</code>, then refresh or restart!
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            id="submit-curator-btn"
            type="submit"
            disabled={!destination.trim()}
            className="w-full py-4.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Curate My Custom Bento Trip</span>
          </button>
        </div>
      </form>
    </div>
  );
}
