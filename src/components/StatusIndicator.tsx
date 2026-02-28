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
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full transition-all duration-500 ${
          status === "idle"
            ? "bg-muted-foreground"
            : status === "listening"
            ? "bg-primary animate-pulse"
            : "bg-gold-light animate-pulse"
        }`}
      />
      <span className="font-heading text-xs tracking-[0.25em] uppercase text-muted-foreground">
        {statusLabels[status]}
      </span>
    </div>
  );
};

export default StatusIndicator;
