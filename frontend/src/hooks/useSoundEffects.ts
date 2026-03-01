import { useCallback, useRef } from "react";

const SOUNDS = {
  CLICK: "https://actions.google.com/sounds/v1/ui/digital_button_click.ogg",
  SUCCESS: "https://actions.google.com/sounds/v1/ui/notification.ogg",
  ERROR: "https://actions.google.com/sounds/v1/ui/error.ogg",
  HOVER: "https://actions.google.com/sounds/v1/ui/soft_button_hover.ogg",
  START: "https://actions.google.com/sounds/v1/ui/start_sound.ogg",
  STOP: "https://actions.google.com/sounds/v1/ui/power_down.ogg",
  TRANSITION:
    "https://actions.google.com/sounds/v1/ui/transition_musical_sound.ogg",
} as const;

export const useSoundEffects = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const playSound = useCallback((url: string, volume = 0.4) => {
    if (!audioRefs.current[url]) {
      audioRefs.current[url] = new Audio(url);
    }
    const audio = audioRefs.current[url];
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore errors if browser blocks autoplay
    });
  }, []);

  const playClick = useCallback(
    () => playSound(SOUNDS.CLICK, 0.3),
    [playSound],
  );
  const playSuccess = useCallback(
    () => playSound(SOUNDS.SUCCESS, 0.4),
    [playSound],
  );
  const playError = useCallback(
    () => playSound(SOUNDS.ERROR, 0.4),
    [playSound],
  );
  const playHover = useCallback(
    () => playSound(SOUNDS.HOVER, 0.15),
    [playSound],
  );
  const playStart = useCallback(
    () => playSound(SOUNDS.START, 0.4),
    [playSound],
  );
  const playStop = useCallback(() => playSound(SOUNDS.STOP, 0.4), [playSound]);
  const playTransition = useCallback(
    () => playSound(SOUNDS.TRANSITION, 0.4),
    [playSound],
  );

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
