import { FileText } from "lucide-react";

interface PreviewAreaProps {
  hasFile: boolean;
  transcript: string;
}

const PreviewArea = ({ hasFile, transcript }: PreviewAreaProps) => {
  return (
    <div className="w-full max-w-lg border border-primary/20 bg-secondary/30 min-h-[200px] p-6 transition-all duration-300">
      {!hasFile && !transcript ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] gap-4 text-muted-foreground">
          <FileText className="w-10 h-10 text-primary/30" />
          <p className="font-body text-lg italic text-primary/40">
            Your document preview will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {hasFile && (
            <div className="flex items-center gap-2 text-primary/70 text-sm font-heading tracking-widest uppercase">
              <FileText className="w-4 h-4" />
              Document Loaded
            </div>
          )}
          {transcript && (
            <div className="space-y-2">
              <p className="text-primary/50 text-xs font-heading tracking-widest uppercase">
                Voice Command
              </p>
              <p className="font-body text-lg text-foreground leading-relaxed">
                "{transcript}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
