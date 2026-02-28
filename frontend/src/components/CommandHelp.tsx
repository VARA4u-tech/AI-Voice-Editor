import { getAvailableCommands } from "@/lib/voiceCommands";
import { Info, X } from "lucide-react";
import { useState } from "react";

const CommandHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const commands = getAvailableCommands();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-primary/80 hover:text-primary transition-colors cursor-pointer group"
        aria-label={isOpen ? "Close voice commands" : "Show voice commands"}
      >
        <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="font-heading text-[11px] sm:text-xs tracking-[0.2em] font-bold uppercase gold-text-glow">
          Voice Commands
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[85vw] sm:w-[450px] z-[100] animate-fade-in shadow-2xl">
          {/* Parchment-style card */}
          <div
            className="border border-primary/25 shadow-[0_0_30px_rgba(191,149,63,0.1)]"
            style={{
              background:
                "linear-gradient(160deg, rgba(0,50,47,0.97) 0%, rgba(0,38,36,0.98) 100%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-primary/10">
              <p className="font-heading text-[10px] tracking-[0.3em] uppercase text-primary/60">
                ✦ Available Incantations
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary/30 hover:text-primary/70 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Command list */}
            <div className="max-h-[45vh] sm:max-h-[60vh] overflow-y-auto">
              <ul className="p-4 space-y-4">
                {commands.map((cmd, i) => (
                  <li key={i} className="space-y-1">
                    <p className="font-body text-[12px] sm:text-[13px] text-foreground/80 leading-snug font-medium">
                      {cmd.description}
                    </p>
                    <p className="font-body text-[11px] sm:text-[12px] italic text-primary/70 tracking-wide gold-text-glow">
                      <span className="text-primary/50 not-italic font-heading text-[9px] tracking-widest uppercase mr-1.5">
                        say:
                      </span>
                      "{cmd.example}"
                    </p>
                  </li>
                ))}

                {/* Undo always shown at bottom */}
                <li className="pt-3 border-t border-primary/20 space-y-1 mt-2">
                  <p className="font-body text-[12px] sm:text-[13px] text-foreground/80 leading-snug font-medium">
                    Undo the last change
                  </p>
                  <p className="font-body text-[11px] sm:text-[12px] italic text-primary/70 gold-text-glow">
                    <span className="text-primary/50 not-italic font-heading text-[9px] tracking-widest uppercase mr-1.5">
                      say:
                    </span>
                    "undo"
                  </p>
                </li>
              </ul>
            </div>

            {/* Footer tip */}
            <div className="px-4 pb-3 border-t border-primary/10 pt-2">
              <p className="font-body text-[10px] italic text-primary/30 text-center">
                Press Space or Ctrl+M to toggle the mic
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div
            className="w-3 h-3 mx-auto -mt-1.5 rotate-45 border-r border-b border-primary/25"
            style={{ background: "rgba(0,38,36,0.98)" }}
          />
        </div>
      )}
    </div>
  );
};

export default CommandHelp;
