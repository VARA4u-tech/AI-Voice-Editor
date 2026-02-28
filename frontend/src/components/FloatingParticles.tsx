import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: string;
  top: string;
  delay: string;
  size: number;
  duration: string;
  type: "star" | "dot" | "sparkle";
  opacity: number;
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      size: 0.6 + Math.random() * 2.2,
      duration: `${5 + Math.random() * 8}s`,
      type: (["star", "dot", "sparkle"] as const)[
        Math.floor(Math.random() * 3)
      ],
      opacity: 0.15 + Math.random() * 0.45,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute float-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        >
          {p.type === "star" ? (
            /* Four-point gold star matching the reference image */
            <svg
              width={p.size * 8}
              height={p.size * 8}
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M6 0 L6.6 5.4 L12 6 L6.6 6.6 L6 12 L5.4 6.6 L0 6 L5.4 5.4 Z"
                fill="url(#star-gold)"
                filter="url(#star-glow)"
              />
              <defs>
                <linearGradient
                  id="star-gold"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f5e6a0" />
                  <stop offset="50%" stopColor="#bf953f" />
                  <stop offset="100%" stopColor="#aa771c" />
                </linearGradient>
                <filter id="star-glow">
                  <feGaussianBlur stdDeviation="0.8" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          ) : p.type === "sparkle" ? (
            /* Tiny + sparkle */
            <svg
              width={p.size * 5}
              height={p.size * 5}
              viewBox="0 0 8 8"
              fill="none"
            >
              <path
                d="M4 0 L4.3 3.7 L8 4 L4.3 4.3 L4 8 L3.7 4.3 L0 4 L3.7 3.7 Z"
                fill="#f0d878"
              />
            </svg>
          ) : (
            /* Soft dot */
            <div
              style={{
                width: p.size * 3,
                height: p.size * 3,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #f5e6a0 0%, #bf953f 60%, transparent 100%)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;
