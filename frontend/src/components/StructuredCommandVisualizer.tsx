import React from "react";
import { Terminal } from "lucide-react";

interface StructuredCommandVisualizerProps {
  isVisible: boolean;
  action: string;
  target?: string;
  replacement?: string;
  rawText: string;
}

const StructuredCommandVisualizer = ({
  isVisible,
  action,
  target,
  replacement,
  rawText,
}: StructuredCommandVisualizerProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 animate-scale-in px-4">
      <div className="border border-primary/30 bg-background/90 p-4 shadow-[0_0_30px_rgba(191,149,63,0.2)] backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2 border-b border-primary/10 pb-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-heading text-[10px] uppercase tracking-widest text-primary/60">
            NLP Processing (Step 5)
          </span>
        </div>

        <div className="space-y-1 font-mono text-[11px]">
          <div className="mb-2 italic text-secondary-foreground">
            " {rawText} "
          </div>
          <div className="text-primary/80">
            <span className="text-primary">Action:</span> "{action}"
          </div>
          {target && (
            <div className="text-primary/80">
              <span className="text-primary">Target:</span> "{target}"
            </div>
          )}
          {replacement && (
            <div className="text-primary/80">
              <span className="text-primary">Replacement:</span> "{replacement}"
            </div>
          )}
        </div>

        {/* Animated scanning line */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] animate-[scan_2s_linear_infinite] bg-primary" />
      </div>
    </div>
  );
};

export default StructuredCommandVisualizer;
