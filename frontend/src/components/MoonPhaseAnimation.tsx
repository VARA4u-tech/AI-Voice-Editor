import { useEffect, useState } from "react";

const moonPhases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

const MoonPhaseAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setPhase((p) => (p + 1) % moonPhases.length);
        setOpacity(1);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2 flex items-center justify-center gap-2">
      {/* Left stars */}
      <span
        className="select-none text-xs"
        style={{
          color: "#bf953f",
          opacity: 0.5,
          filter: "drop-shadow(0 0 4px rgba(191,149,63,0.6))",
          animationName: "starTwinkle",
          animationDuration: "2.3s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: "0s",
        }}
      >
        ✦
      </span>
      <span
        className="-mt-3 select-none text-[9px]"
        style={{
          color: "#bf953f",
          opacity: 0.35,
          animationName: "starTwinkle",
          animationDuration: "3.1s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: "0.8s",
        }}
      >
        ✧
      </span>

      {/* Moon glyph */}
      <span
        className="select-none text-4xl leading-none transition-all duration-500"
        style={{
          opacity,
          filter: `
            sepia(1) saturate(3) hue-rotate(5deg) brightness(1.1)
            drop-shadow(0 0 10px rgba(191,149,63,0.6))
            drop-shadow(0 2px 6px rgba(120,80,0,0.4))
          `,
          color: "#bf953f",
        }}
      >
        {moonPhases[phase]}
      </span>

      {/* Right stars */}
      <span
        className="-mt-3 select-none text-[9px]"
        style={{
          color: "#bf953f",
          opacity: 0.35,
          animationName: "starTwinkle",
          animationDuration: "2.8s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: "1.2s",
        }}
      >
        ✧
      </span>
      <span
        className="select-none text-xs"
        style={{
          color: "#bf953f",
          opacity: 0.5,
          filter: "drop-shadow(0 0 4px rgba(191,149,63,0.6))",
          animationName: "starTwinkle",
          animationDuration: "3.4s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: "0.4s",
        }}
      >
        ✦
      </span>
    </div>
  );
};

export default MoonPhaseAnimation;
