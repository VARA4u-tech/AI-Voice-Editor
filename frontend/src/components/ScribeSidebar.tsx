import React from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Sparkles,
  X,
  MessageSquare,
  BrainCircuit,
} from "lucide-react";

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

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-background/85 backdrop-blur-3xl border-l border-primary/30 z-50 transform transition-transform duration-500 ease-in-out shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-primary/20 flex-shrink-0 bg-primary/5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary animate-pulse drop-shadow-[0_0_8px_hsl(var(--gold)/0.5)]" />
          <h2 className="font-heading text-base sm:text-lg tracking-widest text-primary uppercase font-bold gold-text-glow">
            AI Insights
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-primary/80" />
        </button>
      </div>

      {/* Document Focus Summary */}
      <div className="p-6 border-b border-primary/20 bg-black/20 flex-shrink-0">
        <h3 className="font-heading text-[11px] font-bold tracking-[0.3em] uppercase text-primary/70 mb-5 text-center drop-shadow-sm">
          Document Analytics
        </h3>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-heading font-bold uppercase tracking-widest text-primary/60">
              <span>Vocabulary Level</span>
              <span className="text-primary italic font-normal tracking-wide gold-text-glow">
                {avgWordLength > 6
                  ? "Advanced"
                  : avgWordLength > 5
                    ? "Standard"
                    : "Simple"}
              </span>
            </div>
            <div className="h-1.5 bg-primary/10 w-full rounded-full overflow-hidden border border-primary/20">
              <div
                className="h-full bg-primary/80 rounded-full transition-all duration-1000 shadow-[0_0_12px_hsl(var(--gold)/0.8)]"
                style={{ width: `${scholarlyWeight}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-heading font-bold uppercase tracking-widest text-primary/60">
              <span>Document Length</span>
              <span className="text-primary italic font-normal tracking-wide gold-text-glow">
                {wordCount < 100
                  ? "Brief"
                  : wordCount < 500
                    ? "Moderate"
                    : "Extensive"}
              </span>
            </div>
            <div className="h-1.5 bg-primary/10 w-full rounded-full overflow-hidden border border-primary/20">
              <div
                className="h-full bg-primary/60 rounded-full transition-all duration-1000 shadow-[0_0_12px_hsl(var(--gold)/0.5)]"
                style={{ width: `${focusIntensity}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] font-body italic text-primary/60 text-center pt-2">
            Analyzed {wordCount} words across {paragraphs.length} paragraphs
          </p>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {scribeLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Bot className="w-12 h-12 text-primary drop-shadow-lg" />
            <p className="font-body text-sm italic text-foreground/80 max-w-[200px]">
              "Ask the AI to summarize or get stats for your document..."
            </p>
          </div>
        ) : (
          scribeLog.map((log, i) => (
            <div
              key={i}
              className="p-4 border border-primary/20 bg-primary/5 space-y-2 animate-fade-in"
            >
              <div className="flex items-center gap-2 text-primary/80">
                {log.type === "summary" ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                <span className="font-heading text-xs uppercase tracking-wider">
                  {log.title || "Entry"}
                </span>
                <span className="ml-auto text-[10px] opacity-40">
                  {log.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="font-body text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {log.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Bottom Reflection Decorative */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
};

export default ScribeSidebar;
