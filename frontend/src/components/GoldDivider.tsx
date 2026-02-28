const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative w-full max-w-xs mx-auto my-8 flex items-center justify-center ${className}`}
  >
    {/* Left wing */}
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#bf953f]/40 to-[#bf953f]/70" />
    {/* Centre ornament */}
    <span
      className="mx-3 text-[#bf953f]/80 text-[10px] leading-none select-none"
      style={{ filter: "drop-shadow(0 0 4px rgba(191,149,63,0.5))" }}
    >
      ✦
    </span>
    {/* Right wing */}
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#bf953f]/40 to-[#bf953f]/70" />
  </div>
);

export default GoldDivider;
