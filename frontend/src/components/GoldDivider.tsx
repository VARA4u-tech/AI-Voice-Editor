const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative mx-auto my-8 flex w-full max-w-xs items-center justify-center ${className}`}
  >
    {/* Left wing */}
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#bf953f]/40 to-[#bf953f]/70" />
    {/* Centre ornament */}
    <span
      className="mx-3 select-none text-[10px] leading-none text-[#bf953f]/80"
      style={{ filter: "drop-shadow(0 0 4px rgba(191,149,63,0.5))" }}
    >
      ✦
    </span>
    {/* Right wing */}
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#bf953f]/40 to-[#bf953f]/70" />
  </div>
);

export default GoldDivider;
