import { useLenis } from "@/hooks/useLenis";

/**
 * SmoothScroll
 * Drop this anywhere above your page content (e.g. inside BrowserRouter).
 * Enables buttery-smooth scroll on ALL devices:
 *   • Desktop  — via mouse wheel interception
 *   • Mobile   — via smoothTouch / syncTouch (touch event interception)
 *   • Tablet   — same as mobile
 * Renders nothing — purely side-effect driven.
 */
export default function SmoothScroll() {
  useLenis({
    duration: 1.2,
    smoothWheel: true,
    // ── Touch / Mobile / Tablet ───────────────────────────────────────
    smoothTouch: true,      // Lenis v1 — intercept touch events
    syncTouch: true,        // Lenis v2 — sync touch inertia to easing
    syncTouchLerp: 0.075,   // Slower lerp = longer, silkier deceleration
    touchMultiplier: 2,     // Amplify touch delta for responsiveness
    // ─────────────────────────────────────────────────────────────────
  });

  return null;
}
