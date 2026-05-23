import { FormEvent, RefObject } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface BentoConciergeTabProps {
  activeTripName: string;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  isSendingMessage: boolean;
  chatEndRef: RefObject<HTMLDivElement | null>;
}

export default function BentoConciergeTab({
  activeTripName,
  messages,
  inputText,
  setInputText,
  handleSendMessage,
  isSendingMessage,
  chatEndRef
}: BentoConciergeTabProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-[24px] overflow-hidden shadow-xs h-[550px] flex flex-col animate-fade-in">
      
      {/* Concierge top status banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" /> Ask Aksha Companion Desk
            </h4>
            <p className="text-[10px] text-slate-500 font-medium font-serif italic">Seeded with "{activeTripName}" facts</p>
          </div>
        </div>
      </div>

      {/* Message scroll Stack */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-xs shadow-xs"
                  : "bg-slate-100 text-slate-800 rounded-tl-xs"
              }`}
            >
              <div className="prose prose-xs max-w-none prose-slate">
                {msg.content.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className={pIdx > 0 ? "mt-2.5" : ""}>
                    {para.split("**").map((chunk, cIdx) => {
                      if (cIdx % 2 === 1) {
                        return <strong key={cIdx} className="font-extrabold text-[#2563eb]">{chunk}</strong>;
                      }
                      return chunk;
                    })}
                  </p>
                ))}
              </div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 font-mono uppercase font-bold tracking-widest">{msg.timestamp}</span>
          </div>
        ))}

        {isSendingMessage && (
          <div className="mr-auto items-start max-w-[85%] flex flex-col">
            <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-3.5 text-xs italic flex items-center gap-2 rounded-tl-xxs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="font-semibold font-serif">Aksha is calibrating local recommendations...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Keyboard box */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50/50 flex gap-2">
        <input
          type="text"
          placeholder="Ask Aksha for local phrases, dining adjustments, walk pathways..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-semibold outline-hidden placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSendingMessage}
          className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl transition cursor-pointer flex items-center justify-center font-bold"
        >
          <Send className="w-4 h-4 text-amber-400" />
        </button>
      </form>

    </div>
  );
}
