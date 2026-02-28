import { getAvailableCommands } from "@/lib/voiceCommands";
import { Info } from "lucide-react";
import { useState } from "react";

const CommandHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const commands = getAvailableCommands();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-primary/40 hover:text-primary/70 transition-colors cursor-pointer"
      >
        <Info className="w-3.5 h-3.5" />
        <span className="font-heading text-[10px] tracking-[0.2em] uppercase">Voice Commands</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-card border border-primary/20 p-4 z-20 animate-fade-in shadow-lg shadow-background/50">
          <p className="font-heading text-xs tracking-widest uppercase text-primary/60 mb-3">
            Available Commands
          </p>
          <ul className="space-y-2">
            {commands.map((cmd, i) => (
              <li key={i} className="font-body text-sm text-foreground/70 flex items-start gap-2">
                <span className="text-primary/40 mt-0.5">✦</span>
                {cmd}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommandHelp;
