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
        relative w-24 h-24 rounded-full
        flex items-center justify-center
        transition-all duration-500 cursor-pointer
        ${isListening ? "mic-pulse gold-glow" : "gold-glow-hover"}
      `}
      style={{
        background: isListening
          ? "radial-gradient(circle at 40% 35%, rgba(191,149,63,0.15) 0%, rgba(0,50,47,0.6) 70%)"
          : "radial-gradient(circle at 40% 35%, rgba(191,149,63,0.07) 0%, rgba(0,40,38,0.5) 80%)",
        border: `1.5px solid rgba(191,149,63,${isListening ? "0.7" : "0.4"})`,
        boxShadow: isListening
          ? "0 0 0 0 rgba(191,149,63,0.3), inset 0 0 20px rgba(191,149,63,0.1)"
          : "inset 0 0 15px rgba(0,0,0,0.2)",
      }}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {/* Inner ring */}
      <span
        className="absolute inset-2 rounded-full pointer-events-none"
        style={{
          border: `1px solid rgba(191,149,63,${isListening ? "0.3" : "0.15"})`,
        }}
      />

      {/* Icon */}
      {isListening ? (
        <MicOff
          className="w-9 h-9 transition-all duration-300"
          style={{
            color: "#f5e6a0",
            filter: "drop-shadow(0 0 6px rgba(191,149,63,0.8))",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      ) : (
        <Mic
          className="w-9 h-9 transition-all duration-300"
          style={{
            color: "#bf953f",
            filter: "drop-shadow(0 0 4px rgba(191,149,63,0.4))",
          }}
        />
      )}

      {/* Listening ripples */}
      {isListening && (
        <>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(191,149,63,0.4)",
              animation: "ping 2s linear infinite",
            }}
          />
          <div
            className="absolute -inset-4 rounded-full"
            style={{
              border: "1px solid rgba(191,149,63,0.18)",
              animation: "ping 3s linear infinite",
            }}
          />
        </>
      )}
    </button>
  );
};

export default MicButton;
