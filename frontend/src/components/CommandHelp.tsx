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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[85vw] sm:w-[500px] z-[100] animate-fade-in shadow-2xl">
          {/* Tech-style card */}
          <div
            className="border border-primary/30 relative overflow-hidden backdrop-blur-xl"
            style={{
              background: "rgba(4, 10, 20, 0.95)",
            }}
          >
            <div className="tech-bracket-tl" />
            <div className="tech-bracket-tr" />
            <div className="tech-bracket-bl" />
            <div className="tech-bracket-br" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-primary/10 bg-primary/5">
              <p className="font-tech text-[9px] tracking-[0.4em] uppercase text-accent">
                [ Command Protocols: Voice_Core ]
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary/30 hover:text-primary/70 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Command list */}
            <div className="max-h-[45vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar">
              <ul className="p-4 space-y-4">
                {commands.map((cmd, i) => (
                  <li
                    key={i}
                    className="group/item border-l-2 border-primary/10 hover:border-accent/40 pl-3 transition-colors"
                  >
                    <p className="font-mono text-[11px] sm:text-[12px] text-foreground/70 leading-snug font-medium mb-1 uppercase tracking-tight">
                      {cmd.description}
                    </p>
                    <p className="font-mono text-[11px] sm:text-[12px] text-primary group-hover/item:text-accent transition-colors">
                      <span className="opacity-40 font-tech text-[8px] tracking-[0.2em] mr-2">
                        EXEC_CMD:
                      </span>
                      "{cmd.example}"
                    </p>
                  </li>
                ))}

                {/* Undo always shown at bottom */}
                <li className="pt-3 border-t border-primary/20 space-y-1 mt-2 border-l-2 border-destructive/20 pl-3">
                  <p className="font-mono text-[11px] sm:text-[12px] text-foreground/70 leading-snug font-medium uppercase tracking-tight">
                    Reverse last operation
                  </p>
                  <p className="font-mono text-[11px] sm:text-[12px] text-destructive/80">
                    <span className="opacity-40 font-tech text-[8px] tracking-[0.2em] mr-2">
                      EXEC_REV:
                    </span>
                    "undo"
                  </p>
                </li>
              </ul>
            </div>

            {/* Footer tip */}
            <div className="px-4 pb-3 border-t border-primary/10 pt-2 bg-primary/5">
              <p className="font-mono text-[9px] tracking-wider text-primary/40 text-center uppercase">
                Hotkey: [space] or [ctrl+m] to engage mic
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandHelp;
