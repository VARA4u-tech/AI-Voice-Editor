import { Link } from "react-router-dom";
import {
  X,
  Bot,
  MessageSquare,
  BarChart3,
  BrainCircuit,
  Settings,
  Shield,
  History,
  Info,
  Activity,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";

interface ScribeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  scribeLog: Array<{
    title?: string;
    content: string;
    type: "summary" | "stats" | "info" | "error";
    timestamp: Date;
  }>;
  paragraphs: string[];
}

const ScribeSidebar = ({
  isOpen,
  onClose,
  scribeLog,
  paragraphs,
}: ScribeSidebarProps) => {
  // Real-time Insights Calculation
  const allText = paragraphs.join(" ");
  const wordCount = allText.trim() ? allText.trim().split(/\s+/).length : 0;
  const avgWordLength = wordCount > 0 ? allText.length / wordCount : 0;

  // AI Analytics Mapping
  const scholarlyWeight = Math.min(100, Math.max(0, (avgWordLength - 4) * 20));
  const focusIntensity =
    wordCount > 0 ? Math.min(100, (wordCount / 500) * 100) : 0;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modern High-Tech Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-slate-950/90 backdrop-blur-2xl border-l border-primary/20 z-[60] transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex overflow-hidden shadow-[-40px_0_80px_rgba(0,0,0,0.8)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative Left Edge Bar */}
        <div className="w-1.5 h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent absolute left-0 top-0 opacity-50" />

        {/* Vertical Icon Rail */}
        <div className="w-16 h-full border-r border-primary/10 flex flex-col items-center py-8 gap-8 bg-black/40 flex-shrink-0">
          <Link to="/">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group cursor-pointer hover:bg-accent/20 transition-all">
              <BrainCircuit className="w-5 h-5 text-accent animate-pulse" />
            </div>
          </Link>
          <div className="flex flex-col gap-6 text-primary/40">
            <Link to="/analytics" title="Analytics">
              <BarChart3 className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            </Link>
            <Link to="/history" title="History">
              <History className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            </Link>
            <Link to="/security" title="Security">
              <Shield className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            </Link>
            <div className="mt-auto mb-4 flex flex-col gap-6">
              <Link to="/settings" title="Settings">
                <Settings className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
              </Link>
              <Link to="/info" title="System Info">
                <Info className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Header */}
          <div className="p-8 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl tracking-[0.2em] text-primary uppercase font-bold gold-text-glow">
                Neural Center
              </h2>
              <p className="text-[9px] font-mono text-accent/60 uppercase tracking-widest mt-1">
                // System_Active: Protocol_4.2
              </p>
            </div>
            <button
              onClick={onClose}
              className="group p-2 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/10"
            >
              <X className="w-5 h-5 text-primary/40 group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          {/* Scrolling Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1.5 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <span className="block text-[8px] font-mono text-primary/40 uppercase tracking-tighter mb-1">
                  Complexity
                </span>
                <span className="text-lg font-bold text-primary gold-text-glow">
                  {avgWordLength > 6
                    ? "High"
                    : avgWordLength > 5
                      ? "Med"
                      : "Low"}
                </span>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1.5 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="block text-[8px] font-mono text-primary/40 uppercase tracking-tighter mb-1">
                  Volume
                </span>
                <span className="text-lg font-bold text-primary gold-text-glow">
                  {wordCount}{" "}
                  <span className="text-[10px] opacity-40 font-normal italic">
                    words
                  </span>
                </span>
              </div>
            </div>

            {/* Progress Gauges */}
            <div className="space-y-6 py-4 border-y border-primary/10">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-tech tracking-[0.2em] text-primary/60 uppercase">
                    Lexical_Density
                  </span>
                  <span className="text-[10px] font-mono text-accent">
                    {Math.round(scholarlyWeight)}%
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/40 via-primary to-accent transition-all duration-1000 ease-out shadow-[0_0_8px_hsl(var(--gold)/0.5)]"
                    style={{ width: `${scholarlyWeight}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-tech tracking-[0.2em] text-primary/60 uppercase">
                    Stream_Saturation
                  </span>
                  <span className="text-[10px] font-mono text-accent">
                    {Math.round(focusIntensity)}%
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/40 via-primary to-accent transition-all duration-1000 ease-out shadow-[0_0_8px_hsl(var(--gold)/0.5)]"
                    style={{ width: `${focusIntensity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-tech tracking-[0.3em] text-primary/40 uppercase mb-4">
                Transmission_Log
              </h3>
              {scribeLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-20">
                  <Bot className="w-10 h-10 text-primary" />
                  <p className="font-body text-xs italic">
                    AI buffer empty. Awaiting document processing signals...
                  </p>
                </div>
              ) : (
                scribeLog.map((log, i) => (
                  <div
                    key={i}
                    className="group p-4 bg-white/2 border border-white/5 hover:border-primary/20 transition-all relative rounded-sm"
                  >
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/20 group-hover:bg-accent transition-colors" />
                    <div className="flex items-center gap-2 mb-2">
                      {log.type === "summary" ? (
                        <MessageSquare className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <BarChart3 className="w-3.5 h-3.5 text-primary" />
                      )}
                      <span className="text-[10px] font-tech tracking-[0.1em] text-primary/80 uppercase">
                        {log.title || "Core_Report"}
                      </span>
                      <span className="ml-auto text-[8px] font-mono opacity-30">
                        {log.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[12px] font-body text-foreground/70 leading-relaxed italic">
                      {log.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="p-8 pt-4 opacity-20 pointer-events-none">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-4" />
            <div className="text-[8px] font-mono text-center tracking-[0.5em] uppercase">
              // End_Of_Line //
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScribeSidebar;
