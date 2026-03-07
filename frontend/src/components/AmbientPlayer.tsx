import React, { useState, useRef } from "react";
import { Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";

const SOUNDSCAPES = [
  {
    label: "🌧 Rain",
    src: "https://assets.mixkit.co/active_storage/sfx/2437/2437-preview.mp3",
  },
  {
    label: "🌊 Ocean",
    src: "https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3",
  },
  {
    label: "🔥 Hearth",
    src: "https://assets.mixkit.co/active_storage/sfx/2425/2425-preview.mp3",
  },
  {
    label: "🌿 Forest",
    src: "https://assets.mixkit.co/active_storage/sfx/2499/2499-preview.mp3",
  },
] as const;

const AmbientPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scapeIdx, setScapeIdx] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentScape = SOUNDSCAPES[scapeIdx];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const selectScape = (idx: number) => {
    setScapeIdx(idx);
    setShowPicker(false);
    // Restart playback on new source after render
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 80);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      {/* Soundscape picker */}
      {showPicker && (
        <div className="mb-1 flex animate-fade-in flex-col gap-1">
          {SOUNDSCAPES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => selectScape(i)}
              className={`border px-3 py-1.5 text-left font-heading text-[10px] uppercase tracking-widest transition-all duration-200 ${
                i === scapeIdx
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-primary/20 bg-background/40 text-primary/50 hover:border-primary/40 hover:text-primary/80"
              } backdrop-blur-md`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Main toggle button */}
        <button
          onClick={togglePlay}
          className={`group rounded-full border border-primary/20 bg-background/40 p-3 text-primary shadow-xl backdrop-blur-md transition-all duration-300 ${
            isPlaying
              ? "border-primary/50 shadow-[0_0_15px_hsl(var(--gold)/0.15)]"
              : "hover:bg-primary/10"
          }`}
          title={
            isPlaying
              ? `Mute · ${currentScape.label}`
              : `Play Ambience · ${currentScape.label}`
          }
        >
          {isPlaying ? (
            <Volume2 className="h-5 w-5 transition-transform group-hover:scale-110" />
          ) : (
            <VolumeX className="h-5 w-5 transition-transform group-hover:scale-110" />
          )}
        </button>

        {/* Picker toggle */}
        <button
          onClick={() => setShowPicker((p) => !p)}
          className="rounded-full border border-primary/15 bg-background/30 p-2 text-primary/50 backdrop-blur-md transition-all duration-200 hover:border-primary/30 hover:text-primary/80"
          title="Choose soundscape"
        >
          {showPicker ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Label */}
        {isPlaying && (
          <span className="animate-fade-in whitespace-nowrap font-body text-xs italic text-primary/50">
            {currentScape.label} · Focus Active
          </span>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop src={currentScape.src} />
    </div>
  );
};

export default AmbientPlayer;
