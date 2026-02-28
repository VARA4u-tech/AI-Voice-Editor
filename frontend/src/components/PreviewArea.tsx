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
      className="w-full max-w-4xl border border-primary/30 bg-background/85 backdrop-blur-xl min-h-[400px] max-h-[600px] 2xl:max-h-[800px] overflow-y-auto p-4 sm:p-8 md:p-12 transition-all duration-500 relative rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
    >
      {/* Command feedback toast */}
      {commandFeedback && (
        <div
          className={`mb-4 px-4 py-2 text-sm font-body border animate-fade-in ${
            commandSuccess
              ? "border-primary/40 text-primary bg-primary/5"
              : "border-destructive/40 text-destructive/80 bg-destructive/5"
          }`}
        >
          {commandFeedback}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="font-body text-lg italic text-primary/60">
            Parsing document...
          </p>
        </div>
      ) : paragraphs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[350px] gap-6 p-4 sm:p-8 relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-0 rounded-lg" />

          <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/30 gold-glow">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl text-primary tracking-widest mb-3 uppercase gold-text-glow">
              Awaken the Scribe
            </h3>
            <p className="font-body text-base sm:text-lg text-foreground/80 mb-8 leading-relaxed px-4">
              Upload a document to begin. Your words will materialize here,
              ready to be shaped and refined solely by the power of your voice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-2">
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-md bg-secondary/60 border border-primary/10 hover:border-primary/30 transition-colors text-left group">
                <Mic className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm text-primary tracking-wider uppercase mb-1">
                    Voice Control
                  </h4>
                  <p className="font-body text-[13px] sm:text-sm text-foreground/60 italic leading-snug">
                    Say "Delete paragraph 2" or "Find student"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-md bg-secondary/60 border border-primary/10 hover:border-primary/30 transition-colors text-left group">
                <Wand2 className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:-rotate-12 transition-transform" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm text-primary tracking-wider uppercase mb-1">
                    Style Alchemist
                  </h4>
                  <p className="font-body text-[13px] sm:text-sm text-foreground/60 italic leading-snug">
                    Say "Rewrite paragraph 1 to be professional"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-md bg-secondary/60 border border-primary/10 hover:border-primary/30 transition-colors text-left group">
                <Languages className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm text-primary tracking-wider uppercase mb-1">
                    Mystic Translation
                  </h4>
                  <p className="font-body text-[13px] sm:text-sm text-foreground/60 italic leading-snug">
                    Say "Translate paragraph 3 to Telugu"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-md bg-secondary/60 border border-primary/10 hover:border-primary/30 transition-colors text-left group">
                <Eye className="w-5 h-5 text-primary mt-1 shrink-0 group-hover:text-primary/70 transition-colors" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm text-primary tracking-wider uppercase mb-1">
                    Deep Focus
                  </h4>
                  <p className="font-body text-[13px] sm:text-sm text-foreground/60 italic leading-snug">
                    Say "Enter focus mode"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1 relative z-10">
          {pageCount && (
            <div className="flex items-center gap-2 text-primary/70 text-xs font-heading tracking-widest uppercase mb-3 drop-shadow-sm">
              <FileText className="w-4 h-4" />
              {pageCount} page{pageCount > 1 ? "s" : ""} · {paragraphs.length}{" "}
              paragraph{paragraphs.length > 1 ? "s" : ""}
            </div>
          )}
          {paragraphs.map((para, i) => (
            <div
              key={i}
              ref={(el) => (paraRefs.current[i] = el)}
              className={`group flex gap-3 py-2 border-b border-primary/10 last:border-0 transition-all duration-700 ${
                lastEditedIndices.includes(i)
                  ? "ink-flow rounded-md px-2 -mx-2 mb-1"
                  : ""
              }`}
            >
              <span className="text-primary/50 text-xs font-heading mt-1 shrink-0 w-5 text-right drop-shadow-sm">
                {i + 1}
              </span>
              <p className="font-body text-base text-foreground/90 leading-relaxed transition-colors duration-200 group-hover:text-foreground drop-shadow-sm">
                {para}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
