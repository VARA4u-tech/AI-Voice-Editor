import { Mic, MicOff } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  const { playHover } = useSoundEffects();

  return (
    <div className="group relative p-8">
      {/* Outer Hexagon HUD — subtle rotation */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${isListening ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full fill-none stroke-current text-primary/10"
        >
          <path
            d="M50 5 L93.3 30 L93.3 70 L50 95 L6.7 70 L6.7 30 Z"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            strokeWidth="0.2"
            strokeDasharray="1 4"
          />
        </svg>
      </div>

      {/* Rotating Tech Rings */}
      <div
        className={`absolute inset-4 rounded-full border border-dashed border-accent/20 transition-all duration-700 ${isListening ? "animate-[spin_8s_linear_infinite] border-accent/40 opacity-100" : "opacity-40"}`}
      />
      <div
        className={`absolute inset-2 rounded-full border border-dotted border-primary/20 transition-all duration-700 ${isListening ? "animate-[spin_12s_linear_infinite_reverse] border-primary/40 opacity-100" : "opacity-30"}`}
      />

      <button
        onClick={onClick}
        onMouseEnter={() => playHover()}
        className={`relative z-10 flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ${
          isListening
            ? "border-2 border-accent bg-accent/10 shadow-[0_0_40px_rgba(34,211,238,0.3)]"
            : "border border-primary/30 bg-slate-900 hover:border-primary hover:shadow-[0_0_30px_rgba(191,149,63,0.2)]"
        } `}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {/* Internal Glow */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${isListening ? "opacity-100" : "opacity-0"}`}
        >
          <div className="bg-radial-gradient absolute inset-0 from-accent/20 to-transparent" />
        </div>

        {/* Status Line */}
        <div
          className={`font-tech absolute top-4 text-[8px] uppercase tracking-[0.3em] transition-all duration-500 ${isListening ? "translate-y-0 text-accent opacity-100" : "-translate-y-2 text-primary/40 opacity-0"}`}
        >
          Signal_Locked
        </div>

        {/* Icon Container */}
        <div className="relative transition-transform duration-500 group-hover:scale-110">
          {isListening ? (
            <MicOff className="h-12 w-12 text-accent drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          ) : (
            <Mic className="h-12 w-12 text-primary drop-shadow-[0_0_8px_rgba(191,149,63,0.4)]" />
          )}
        </div>

        {/* Bottom Label */}
        <div
          className={`absolute bottom-5 font-mono text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${isListening ? "text-accent/80" : "text-primary/40"}`}
        >
          {isListening ? "Recording" : "Ready"}
        </div>

        {/* Scanning Line Animation */}
        {isListening && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div className="h-1/2 w-full animate-[scan_2s_linear_infinite] bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
          </div>
        )}
      </button>

      {/* Pulse rings for active state */}
      {isListening && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-2 border-accent/30" />
          <div className="absolute inset-[-10px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-accent/10" />
        </div>
      )}

      {/* Static HUD brackets */}
      <div className="absolute right-0 top-0 h-4 w-4 rounded-tr-sm border-r-2 border-t-2 border-primary/20 transition-colors group-hover:border-accent/40" />
      <div className="absolute bottom-0 left-0 h-4 w-4 rounded-bl-sm border-b-2 border-l-2 border-primary/20 transition-colors group-hover:border-accent/40" />
    </div>
  );
};

export default MicButton;
