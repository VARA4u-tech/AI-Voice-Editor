import { useEffect, useRef } from "react";

interface GoldWaveformProps {
  isActive: boolean;
}

const GoldWaveform = ({ isActive }: GoldWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 60;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (isActive) {
        timeRef.current += 0.04;
      }

      const barCount = 32;
      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount - 1);
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);

        let barHeight: number;
        if (isActive) {
          const wave1 = Math.sin(timeRef.current * 3 + i * 0.3) * 0.5 + 0.5;
          const wave2 = Math.sin(timeRef.current * 2 + i * 0.5) * 0.3 + 0.5;
          const wave3 = Math.sin(timeRef.current * 5 + i * 0.15) * 0.2 + 0.5;
          barHeight = (wave1 * wave2 + wave3) * 20 + 3;
        } else {
          barHeight = 2;
        }

        const gradient = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
        const alpha = isActive ? 0.9 : 0.2;
        gradient.addColorStop(0, `hsla(43, 56%, 62%, ${alpha * 0.3})`);
        gradient.addColorStop(0.5, `hsla(43, 56%, 52%, ${alpha})`);
        gradient.addColorStop(1, `hsla(43, 56%, 62%, ${alpha * 0.3})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight, barWidth, barHeight * 2, 1.5);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isActive]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        isActive ? "opacity-100" : "opacity-30"
      }`}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default GoldWaveform;
