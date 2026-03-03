import { useCallback, useRef } from "react";

/**
 * useSoundEffects — 100% Web Audio API synthesised sounds.
 * No external CDN URLs, no CORS issues, no "no supported source" errors.
 * All sounds are generated programmatically and play instantly.
 */

// ─── Synth helpers ────────────────────────────────────────────────────────────

function getCtx(
  ref: React.MutableRefObject<AudioContext | null>,
): AudioContext | null {
  if (!ref.current) {
    try {
      ref.current = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ref.current.state === "suspended") ref.current.resume();
  return ref.current;
}

function getSystemVolume(): number {
  try {
    const saved = localStorage.getItem("scribe_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.volume === "number") {
        return parsed.volume / 100;
      }
    }
  } catch (e) {
    // Fail silently
  }
  return 0.7; // Default 70% if not found
}

/** Distinct "click" — snappy triangle blip */
function synthClick(ctx: AudioContext, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.6 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.07);
}

/** Ascending 2-tone chime — bright success */
function synthSuccess(ctx: AudioContext, vol: number) {
  [
    [700, 0],
    [1050, 0.12],
  ].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0.8 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

/** Descending hard buzz — error */
function synthError(ctx: AudioContext, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(250, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.7 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.28);
}

/** Clear high tick — hover */
function synthHover(ctx: AudioContext, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 1800;
  gain.gain.setValueAtTime(0.25 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

/** Rising digital sweep — start listening */
function synthStart(ctx: AudioContext, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.6 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.22);
}

/** Falling digital sweep — stop listening */
function synthStop(ctx: AudioContext, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.55 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

/** Page-turn whoosh — transition / navigation */
function synthTransition(ctx: AudioContext, vol: number) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

/** Snappy typewriter key tick — bandpass noise burst */
function synthTypewriterTick(ctx: AudioContext, vol: number) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3500;
  filter.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5 * vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSoundEffects = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTypeSoundRef = useRef<number>(0);

  const ctx = useCallback(() => getCtx(audioCtxRef), []);

  const playClick = useCallback(() => {
    const c = ctx();
    if (c) synthClick(c, getSystemVolume());
  }, [ctx]);
  const playSuccess = useCallback(() => {
    const c = ctx();
    if (c) synthSuccess(c, getSystemVolume());
  }, [ctx]);
  const playError = useCallback(() => {
    const c = ctx();
    if (c) synthError(c, getSystemVolume());
  }, [ctx]);
  const playHover = useCallback(() => {
    const c = ctx();
    if (c) synthHover(c, getSystemVolume());
  }, [ctx]);
  const playStart = useCallback(() => {
    const c = ctx();
    if (c) synthStart(c, getSystemVolume());
  }, [ctx]);
  const playStop = useCallback(() => {
    const c = ctx();
    if (c) synthStop(c, getSystemVolume());
  }, [ctx]);
  const playTransition = useCallback(() => {
    const c = ctx();
    if (c) synthTransition(c, getSystemVolume());
  }, [ctx]);

  const playTypewriterTick = useCallback(() => {
    const now = performance.now();
    if (now - lastTypeSoundRef.current < 80) return;
    lastTypeSoundRef.current = now;
    const c = ctx();
    if (c) synthTypewriterTick(c, getSystemVolume());
  }, [ctx]);

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
