import { Mic, MicOff } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  const { playHover } = useSoundEffects();

  return (
    <div className="relative group p-8">
      {/* Outer Hexagon HUD — subtle rotation */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${isListening ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-primary/10 stroke-current fill-none"
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
        className={`absolute inset-4 border border-accent/20 rounded-full border-dashed transition-all duration-700 ${isListening ? "animate-[spin_8s_linear_infinite] opacity-100 border-accent/40" : "opacity-40"}`}
      />
      <div
        className={`absolute inset-2 border border-primary/20 rounded-full border-dotted transition-all duration-700 ${isListening ? "animate-[spin_12s_linear_infinite_reverse] opacity-100 border-primary/40" : "opacity-30"}`}
      />

      <button
        onClick={onClick}
        onMouseEnter={() => playHover()}
        className={`
          relative w-32 h-32 rounded-full
          flex flex-col items-center justify-center
          transition-all duration-500 cursor-pointer z-10
          overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]
          ${
            isListening
              ? "bg-accent/10 border-2 border-accent shadow-[0_0_40px_rgba(34,211,238,0.3)]"
              : "bg-slate-900 border border-primary/30 hover:border-primary hover:shadow-[0_0_30px_rgba(191,149,63,0.2)]"
          }
        `}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {/* Internal Glow */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${isListening ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-radial-gradient from-accent/20 to-transparent" />
        </div>

        {/* Status Line */}
        <div
          className={`absolute top-4 font-tech text-[8px] tracking-[0.3em] uppercase transition-all duration-500 ${isListening ? "text-accent opacity-100 translate-y-0" : "text-primary/40 opacity-0 -translate-y-2"}`}
        >
          Signal_Locked
        </div>

        {/* Icon Container */}
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          {isListening ? (
            <MicOff className="w-12 h-12 text-accent drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          ) : (
            <Mic className="w-12 h-12 text-primary drop-shadow-[0_0_8px_rgba(191,149,63,0.4)]" />
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
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-[scan_2s_linear_infinite]" />
          </div>
        )}
      </button>

      {/* Pulse rings for active state */}
      {isListening && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute inset-[-10px] rounded-full border border-accent/10 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
      )}

      {/* Static HUD brackets */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/20 rounded-tr-sm group-hover:border-accent/40 transition-colors" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/20 rounded-bl-sm group-hover:border-accent/40 transition-colors" />
    </div>
  );
};

export default MicButton;
