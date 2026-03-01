import { FileText, Loader2, Mic, Wand2, Languages, Eye } from "lucide-react";
import { useEffect, useRef } from "react";

interface PreviewAreaProps {
  paragraphs: string[];
  isLoading?: boolean;
  pageCount?: number;
  commandFeedback?: string | null;
  commandSuccess?: boolean;
  lastEditedIndices?: number[];
}

const PreviewArea = ({
  paragraphs,
  isLoading,
  pageCount,
  commandFeedback,
  commandSuccess,
  lastEditedIndices = [],
}: PreviewAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (lastEditedIndices.length > 0) {
      const firstActive = paraRefs.current[lastEditedIndices[0]];
      if (firstActive && scrollRef.current) {
        firstActive.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [lastEditedIndices]);

  return (
    <div
      ref={scrollRef}
      className="w-full max-w-4xl border border-primary/30 bg-background/90 backdrop-blur-2xl min-h-[400px] max-h-[600px] 2xl:max-h-[800px] overflow-y-auto p-4 sm:p-8 md:p-10 transition-all duration-500 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] custom-scrollbar"
    >
      <div className="tech-bracket-tl" />
      <div className="tech-bracket-tr" />
      <div className="tech-bracket-bl" />
      <div className="tech-bracket-br" />

      {/* Command feedback toast */}
      {commandFeedback && (
        <div
          className={`mb-6 px-4 py-3 text-xs font-mono border animate-fade-in relative overflow-hidden ${
            commandSuccess
              ? "border-accent/40 text-accent bg-accent/5"
              : "border-destructive/40 text-destructive/80 bg-destructive/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="opacity-50">
              [{commandSuccess ? "SUCCESS" : "ERROR"}]
            </span>
            {commandFeedback}
          </div>
          <div
            className="absolute bottom-0 left-0 h-[1px] bg-accent/50 animate-[shimmer_2s_infinite]"
            style={{ width: "100%" }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse" />
          </div>
          <p className="font-tech text-xs tracking-[0.4em] uppercase text-accent animate-pulse">
            Analyzing Data Stream...
          </p>
        </div>
      ) : paragraphs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[450px] gap-6 p-4 sm:p-8 relative">
          <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg">
            <div className="w-20 h-20 rounded-sm bg-primary/5 flex items-center justify-center mb-6 border border-primary/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FileText className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
              <div className="tech-bracket-tl w-2 h-2" />
              <div className="tech-bracket-br w-2 h-2" />
            </div>
            <h3 className="font-tech text-lg sm:text-xl text-primary tracking-[0.3em] mb-4 uppercase">
              Interface Standby
            </h3>
            <p className="font-body text-base sm:text-lg text-foreground/70 mb-10 leading-relaxed px-4">
              Awaiting document injection. Once initialized, your vocal commands
              will modulate the content in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-2">
              <div className="flex items-start gap-3 p-4 border border-primary/10 bg-primary/5 hover:border-accent/40 transition-all text-left group relative">
                <div className="tech-bracket-tl w-1 h-1" />
                <Mic className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:text-accent group-hover:scale-110 transition-all" />
                <div>
                  <h4 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-1">
                    Vocal Synthesis
                  </h4>
                  <p className="font-mono text-[11px] text-foreground/50 leading-snug">
                    "Delete segment 4"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-primary/10 bg-primary/5 hover:border-accent/40 transition-all text-left group relative">
                <div className="tech-bracket-tl w-1 h-1" />
                <Wand2 className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:text-accent group-hover:-rotate-12 transition-all" />
                <div>
                  <h4 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-1">
                    Neural Rewrite
                  </h4>
                  <p className="font-mono text-[11px] text-foreground/50 leading-snug">
                    "Elevate tone for segment 1"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-primary/10 bg-primary/5 hover:border-accent/40 transition-all text-left group relative">
                <div className="tech-bracket-tl w-1 h-1" />
                <Languages className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:text-accent transition-all" />
                <div>
                  <h4 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-1">
                    Cipher Lingua
                  </h4>
                  <p className="font-mono text-[11px] text-foreground/50 leading-snug">
                    "Translate segment 3 to Hindi"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-primary/10 bg-primary/5 hover:border-accent/40 transition-all text-left group relative">
                <div className="tech-bracket-tl w-1 h-1" />
                <Eye className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:text-accent transition-all" />
                <div>
                  <h4 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-1">
                    Sensory Focus
                  </h4>
                  <p className="font-mono text-[11px] text-foreground/50 leading-snug">
                    "Activate Focus Mode"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1 relative z-10">
          <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-tech text-[8px] text-primary/40 tracking-[0.2em] mb-1">
                  DOCUMENT_ID
                </span>
                <span className="font-mono text-[11px] text-primary tracking-tight">
                  VCORE_{Math.random().toString(36).substring(7).toUpperCase()}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-primary/10" />
              <div className="flex flex-col">
                <span className="font-tech text-[8px] text-primary/40 tracking-[0.2em] mb-1">
                  SEGMENTS
                </span>
                <span className="font-mono text-[11px] text-primary tracking-tight">
                  {paragraphs.length}
                </span>
              </div>
            </div>
            {pageCount && (
              <div className="px-3 py-1 border border-accent/20 bg-accent/5 rounded-sm">
                <span className="font-tech text-[9px] text-accent tracking-[0.2em]">
                  {pageCount} PG_UNITS
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <div
                key={i}
                ref={(el) => (paraRefs.current[i] = el)}
                className={`group flex gap-4 py-3 px-2 border-l-2 border-transparent hover:border-primary/20 transition-all duration-300 ${
                  lastEditedIndices.includes(i)
                    ? "bg-accent/5 border-l-accent/50 rounded-r-lg"
                    : ""
                }`}
              >
                <span className="text-primary/30 font-mono text-[10px] mt-1 shrink-0 w-8 tabular-nums">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <p className="font-body text-base text-foreground/90 leading-relaxed transition-colors duration-200 group-hover:text-foreground">
                  {para}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
