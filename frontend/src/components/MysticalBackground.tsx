import React from "react";

const MysticalBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Ambient glowing deep-sea/emerald orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#004d4d]/30 rounded-full blur-[140px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]" />

      {/* Golden mystical starfield */}
      <div className="absolute inset-0 opacity-40 mystical-stars-bg mix-blend-screen" />

      {/* Sweeping ethereal glow */}
      <div className="absolute inset-x-0 top-1/4 h-1/2 bg-primary/5 blur-[100px] rounded-[100%] animate-[pulse_15s_ease-in-out_infinite_alternate] mix-blend-screen opacity-50" />

      {/* Huge Alchemy Core / Sacred Geometry center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] sm:w-[100vw] max-w-[900px] aspect-square opacity-[0.25] animate-[spin_240s_linear_infinite]">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-primary stroke-current fill-none"
        >
          {/* Outer rings */}
          <circle cx="250" cy="250" r="240" strokeWidth="1" />
          <circle
            cx="250"
            cy="250"
            r="230"
            strokeWidth="2"
            strokeDasharray="3 16"
          />

          {/* Hexagram base */}
          <polygon points="250,20 450,380 50,380" strokeWidth="1.5" />
          <polygon points="250,480 50,120 450,120" strokeWidth="1.5" />

          {/* Inner focus rings */}
          <circle cx="250" cy="250" r="130" strokeWidth="1" />
          <circle
            cx="250"
            cy="250"
            r="120"
            strokeWidth="0.5"
            strokeDasharray="5 5"
          />

          {/* Geometric squares */}
          <rect
            x="158"
            y="158"
            width="184"
            height="184"
            strokeWidth="1"
            transform="rotate(45 250 250)"
          />
          <rect
            x="140"
            y="140"
            width="220"
            height="220"
            strokeWidth="0.5"
            strokeDasharray="10 10"
            transform="rotate(15 250 250)"
          />

          {/* Core symbol tracking */}
          <circle
            cx="250"
            cy="250"
            r="50"
            strokeWidth="0.5"
            strokeDasharray="2 4"
          />
          <circle cx="250" cy="250" r="45" strokeWidth="1" />
        </svg>
      </div>

      {/* Counter-rotating inner ring representation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] sm:w-[80vw] max-w-[700px] aspect-square opacity-[0.15] animate-[spin_180s_reverse_linear_infinite]">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-primary stroke-current fill-none"
        >
          <circle
            cx="250"
            cy="250"
            r="240"
            strokeWidth="0.5"
            strokeDasharray="10 20"
          />
          <polygon points="250,20 480,250 250,480 20,250" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default MysticalBackground;
