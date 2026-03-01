import { Mic, MicOff } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  const { playHover } = useSoundEffects();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => playHover()}
      className={`
        relative w-28 h-28 rounded-full
        flex items-center justify-center
        transition-all duration-700 cursor-pointer group
        ${isListening ? "scale-105" : "hover:scale-105"}
      `}
      style={{
        background: isListening
          ? "radial-gradient(circle at center, hsla(180, 100%, 50%, 0.15) 0%, rgba(4, 10, 20, 0.8) 70%)"
          : "radial-gradient(circle at center, rgba(191,149,63,0.05) 0%, rgba(4, 10, 20, 0.6) 80%)",
        border: `1px solid hsla(var(--${isListening ? "accent" : "primary"}), ${isListening ? "0.6" : "0.2"})`,
        boxShadow: isListening
          ? "0 0 40px hsla(180, 100%, 50%, 0.2), inset 0 0 20px hsla(180, 100%, 50%, 0.1)"
          : "0 0 20px rgba(0,0,0,0.5)",
      }}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      <div
        className={`absolute inset-0 rounded-full border border-primary/10 ${isListening ? "animate-[spin_4s_linear_infinite]" : ""}`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-accent/40 blur-[1px]" />
      </div>

      {/* Inner tech ring */}
      <span
        className={`absolute inset-3 rounded-full transition-all duration-500 ${isListening ? "border-accent/30" : "border-primary/10"}`}
        style={{ borderStyle: "dashed", borderWidth: "1px" }}
      />

      {/* Icon */}
      {isListening ? (
        <MicOff
          className="w-10 h-10 transition-all duration-500"
          style={{
            color: "hsl(var(--accent))",
            filter: "drop-shadow(0 0 8px hsl(var(--accent)))",
          }}
        />
      ) : (
        <Mic
          className="w-10 h-10 transition-all duration-500 group-hover:text-primary"
          style={{
            color: "hsl(var(--primary) / 0.6)",
            filter: "drop-shadow(0 0 4px rgba(191,149,63,0.2))",
          }}
        />
      )}

      {/* Pulse rings */}
      {isListening && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-[-4px] rounded-full border border-accent/20 animate-ping" />
          <div className="absolute inset-[-12px] rounded-full border border-accent/10 animate-[ping_2s_linear_infinite]" />
        </div>
      )}
    </button>
  );
};

export default MicButton;
