import React from "react";

const MysticalBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Ambient glowing deep-sea/emerald orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[140px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]" />

      {/* Modern Tech Elements */}
      <div className="absolute inset-0 digital-grid opacity-20" />
      <div className="scanline" />

      {/* Modern Tech Nodes Background */}
      <div className="absolute inset-0 opacity-40 digital-nodes-bg mix-blend-screen" />

      {/* Sweeping ethereal glow */}
      <div className="absolute inset-x-0 top-1/4 h-1/2 bg-primary/5 blur-[100px] rounded-[100%] animate-[pulse_15s_ease-in-out_infinite_alternate] mix-blend-screen opacity-50" />

      {/* Central Neural Audio Core / Voice Matrix */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] sm:w-[100vw] max-w-[900px] aspect-square opacity-[0.15] animate-[spin_300s_linear_infinite]">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-primary stroke-current fill-none"
        >
          {/* Outer tech boundaries */}
          <circle
            cx="250"
            cy="250"
            r="245"
            strokeWidth="0.5"
            strokeDasharray="10 5"
            className="text-primary/20"
          />
          <circle
            cx="250"
            cy="250"
            r="235"
            strokeWidth="1"
            className="text-primary/40"
          />

          {/* Rotating Data Rings */}
          <g className="animate-[spin_120s_linear_infinite]">
            <path
              d="M250,50 A200,200 0 0,1 450,250"
              strokeWidth="2"
              stroke="hsl(var(--accent))"
            />
            <path
              d="M250,450 A200,200 0 0,1 50,250"
              strokeWidth="2"
              stroke="hsl(var(--accent))"
            />
          </g>

          {/* HUD Brackets */}
          <path
            d="M150,150 L150,130 L170,130 M330,130 L350,130 L350,150 M350,350 L350,370 L330,370 M170,370 L150,370 L150,350"
            strokeWidth="1.5"
            className="text-accent"
          />

          {/* Central Wave Core */}
          <g className="animate-pulse">
            <circle
              cx="250"
              cy="250"
              r="80"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="text-primary/30"
            />
            <circle
              cx="250"
              cy="250"
              r="60"
              strokeWidth="1"
              className="text-primary/50"
            />

            {/* Inner dynamic segments */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="250"
                y1="210"
                x2="250"
                y2="190"
                transform={`rotate(${i * 30} 250 250)`}
                strokeWidth="2"
                className="text-accent/60"
              />
            ))}
          </g>

          {/* Floating Data Nodes within core */}
          <circle
            cx="250"
            cy="250"
            r="10"
            fill="currentColor"
            className="text-accent animate-pulse"
          />
        </svg>
      </div>

      {/* Secondary Counter-rotating HUD Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] sm:w-[80vw] max-w-[700px] aspect-square opacity-[0.1] animate-[spin_180s_reverse_linear_infinite]">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-accent stroke-current fill-none"
        >
          <circle
            cx="250"
            cy="250"
            r="248"
            strokeWidth="0.5"
            strokeDasharray="20 40"
          />
          <path
            d="M100,250 L400,250 M250,100 L250,400"
            strokeWidth="0.2"
            className="opacity-30"
          />
        </svg>
      </div>
    </div>
  );
};

export default MysticalBackground;
