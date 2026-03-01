import { useState, useEffect, useRef } from "react";

/**
 * useSessionTimer — starts when `isActive` becomes true,
 * resets whenever `resetKey` changes (e.g. new document loaded).
 */
export function useSessionTimer(isActive: boolean, resetKey?: string) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset whenever a new document is loaded
  useEffect(() => {
    setSeconds(0);
  }, [resetKey]);

  // Tick while active
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const formatted = `${hh}:${mm}:${ss}`;
  const totalMinutes = Math.floor(seconds / 60);

  return { formatted, seconds, totalMinutes };
}
