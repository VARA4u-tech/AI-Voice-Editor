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
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Side decorative stars */}
      <span className="text-primary/40 text-xs">✦</span>
      <span className="text-primary/30 text-[10px] -mt-3">✧</span>

      <span
        className="text-3xl transition-all duration-500 drop-shadow-[0_0_8px_hsl(var(--gold)/0.4)]"
        style={{ opacity, filter: `brightness(1.3)` }}
      >
        {moonPhases[phase]}
      </span>

      <span className="text-primary/30 text-[10px] -mt-3">✧</span>
      <span className="text-primary/40 text-xs">✦</span>
    </div>
  );
};

export default MoonPhaseAnimation;
