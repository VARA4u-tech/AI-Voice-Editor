import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-24 h-24 rounded-full border-2 border-primary
        bg-transparent flex items-center justify-center
        transition-all duration-500 cursor-pointer
        gold-glow-hover
        ${isListening ? "mic-pulse gold-glow" : ""}
      `}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <MicOff className="w-8 h-8 text-primary" />
      ) : (
        <Mic className="w-8 h-8 text-primary" />
      )}

      {isListening && (
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
      )}
    </button>
  );
};

export default MicButton;
