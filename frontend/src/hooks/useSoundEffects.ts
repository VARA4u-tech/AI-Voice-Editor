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

export const useSoundEffects = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

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

  return {
    playClick,
    playSuccess,
    playError,
    playHover,
    playStart,
    playStop,
    playTransition,
  };
};
