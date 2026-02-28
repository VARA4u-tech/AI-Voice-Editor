import { FileText, Loader2 } from "lucide-react";

interface PreviewAreaProps {
  paragraphs: string[];
  isLoading?: boolean;
  pageCount?: number;
  commandFeedback?: string | null;
  commandSuccess?: boolean;
}

const PreviewArea = ({ paragraphs, isLoading, pageCount, commandFeedback, commandSuccess }: PreviewAreaProps) => {
  return (
    <div className="w-full max-w-lg border border-primary/20 bg-secondary/30 min-h-[200px] max-h-[400px] overflow-y-auto p-6 transition-all duration-500">
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
          <p className="font-body text-lg italic text-primary/60">Parsing document...</p>
        </div>
      ) : paragraphs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] gap-4 text-muted-foreground">
          <FileText className="w-10 h-10 text-primary/30" />
          <p className="font-body text-lg italic text-primary/40">
            Your document preview will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {pageCount && (
            <div className="flex items-center gap-2 text-primary/50 text-xs font-heading tracking-widest uppercase mb-3">
              <FileText className="w-3 h-3" />
              {pageCount} page{pageCount > 1 ? "s" : ""} · {paragraphs.length} paragraph{paragraphs.length > 1 ? "s" : ""}
            </div>
          )}
          {paragraphs.map((para, i) => (
            <div key={i} className="group flex gap-3 py-2 border-b border-primary/5 last:border-0">
              <span className="text-primary/30 text-xs font-heading mt-1 shrink-0 w-5 text-right">
                {i + 1}
              </span>
              <p className="font-body text-base text-foreground/85 leading-relaxed transition-colors duration-200 group-hover:text-foreground">
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
