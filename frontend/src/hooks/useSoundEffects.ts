import { useCallback, useRef } from "react";

const SOUNDS = {
  CLICK: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  SUCCESS: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  ERROR: "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3",
  HOVER: "https://assets.mixkit.co/active_storage/sfx/2565/2565-preview.mp3",
  START: "https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3",
  STOP: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
  TRANSITION:
    "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
} as const;

/**
 * Synthesise a soft typewriter click using the Web Audio API.
 * Returns null if AudioContext is not available.
 */
function createTypewriterClick(ctx: AudioContext, volume = 0.08) {
  const bufferSize = ctx.sampleRate * 0.04; // 40ms noise burst
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Bandpass filter to make it sound like a keypress (not whitenoise)
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3200;
  filter.Q.value = 0.5;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start();
}

export const useSoundEffects = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Throttle typewriter: fire at most every 80ms
  const lastTypeSoundRef = useRef<number>(0);

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((url: string, volume = 0.6) => {
    if (!audioRefs.current[url]) {
      audioRefs.current[url] = new Audio(url);
    }
    const audio = audioRefs.current[url];
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(
        "Sound playback failed (User interaction might be required):",
        err,
      );
    });
  }, []);

  const playClick = useCallback(() => {}, []);
  const playSuccess = useCallback(
    () => playSound(SOUNDS.SUCCESS, 0.4),
    [playSound],
  );
  const playError = useCallback(() => {}, []);
  const playHover = useCallback(() => {}, []);
  const playStart = useCallback(
    () => playSound(SOUNDS.START, 0.4),
    [playSound],
  );
  const playStop = useCallback(() => playSound(SOUNDS.STOP, 0.4), [playSound]);
  const playTransition = useCallback(() => {}, []);

  /**
   * playTypewriterTick — call this whenever new interim transcript text arrives.
   * Throttled to 80ms so rapid words don't flood the audio thread.
   */
  const playTypewriterTick = useCallback(() => {
    const now = performance.now();
    if (now - lastTypeSoundRef.current < 80) return;
    lastTypeSoundRef.current = now;

    const ctx = getAudioCtx();
    if (!ctx) return;
    createTypewriterClick(ctx, 0.1);
  }, [getAudioCtx]);

  return {
    playClick,
    playSuccess,
    playError,
    playHover,
    playStart,
    playStop,
    playTransition,
    playTypewriterTick,
  };
};
