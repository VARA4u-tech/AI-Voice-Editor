interface StatusIndicatorProps {
  status: "idle" | "listening" | "processing";
}

const statusLabels = {
  idle: "Ready",
  listening: "Listening...",
  processing: "Processing...",
};

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 px-3 py-1 border border-primary/20 bg-background/40 backdrop-blur-sm relative">
        <div className="tech-bracket-tl w-1.5 h-1.5" />
        <div className="tech-bracket-br w-1.5 h-1.5" />

        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
            status === "idle"
              ? "bg-muted-foreground"
              : status === "listening"
                ? "bg-accent animate-pulse"
                : "bg-primary animate-pulse"
          }`}
        />
        <span className="font-mono text-[10px] sm:text-[11px] tracking-widest font-bold uppercase text-primary/90">
          <span className="opacity-50 mr-2">SYS_STATUS:</span>
          {statusLabels[status]}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
