import React, { useState, useRef } from "react";
import { Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";

const SOUNDSCAPES = [
  {
    label: "🌧 Rain",
    src: "https://actions.google.com/sounds/v1/water/rain_on_roof.ogg",
  },
  {
    label: "🌊 Ocean",
    src: "https://actions.google.com/sounds/v1/water/ocean_waves.ogg",
  },
  {
    label: "🔥 Hearth",
    src: "https://actions.google.com/sounds/v1/ambiences/fireplace.ogg",
  },
  {
    label: "🌿 Forest",
    src: "https://actions.google.com/sounds/v1/ambiences/forest_with_cuckoo_bird.ogg",
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
        <div className="mb-1 flex flex-col gap-1 animate-fade-in">
          {SOUNDSCAPES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => selectScape(i)}
              className={`px-3 py-1.5 text-left font-heading text-[10px] tracking-widest uppercase border transition-all duration-200 ${
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
          className={`p-3 rounded-full border border-primary/20 bg-background/40 backdrop-blur-md text-primary transition-all duration-300 shadow-xl group ${
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
            <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Picker toggle */}
        <button
          onClick={() => setShowPicker((p) => !p)}
          className="p-2 rounded-full border border-primary/15 bg-background/30 backdrop-blur-md text-primary/50 hover:text-primary/80 hover:border-primary/30 transition-all duration-200"
          title="Choose soundscape"
        >
          {showPicker ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Label */}
        {isPlaying && (
          <span className="font-body text-xs italic text-primary/50 animate-fade-in whitespace-nowrap">
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
