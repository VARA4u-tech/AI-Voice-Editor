import React from "react";

interface MysticalHeroProps {
  isListening?: boolean;
}

const MysticalHero = ({ isListening }: MysticalHeroProps) => {
  return (
    <div
      className={`relative mx-auto flex w-full max-w-xl flex-col items-center justify-center py-12 transition-all duration-700 ${
        isListening ? "scale-105 opacity-100" : "scale-100 opacity-95"
      }`}
    >
      {/* SVG Container wrapping the design */}
      <svg
        viewBox="0 0 300 350"
        className={`w-full transition-all duration-700 ${
          isListening
            ? "drop-shadow-[0_0_50px_rgba(191,149,63,0.6)]"
            : "drop-shadow-[0_0_25px_rgba(191,149,63,0.35)]"
        }`}
      >
        <defs>
          {/* Multi-stop gold foil gradient matching the reference image */}
          <linearGradient
            id="gold-foil-svg"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#aa771c" />
            <stop offset="15%" stopColor="#bf953f" />
            <stop offset="32%" stopColor="#f5e6a0" />
            <stop offset="50%" stopColor="#b38728" />
            <stop offset="68%" stopColor="#f8f0b0" />
            <stop offset="85%" stopColor="#bf953f" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
          {/* Radial gold for filled circles */}
          <radialGradient id="gold-radial" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f8f0b0" />
            <stop offset="45%" stopColor="#c8922a" />
            <stop offset="100%" stopColor="#7a5213" />
          </radialGradient>
          {/* Subtle glow filter */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="gold-svg-fill" stroke="none">
          {/* Main Top Crescent */}
          <path d="M 150 40 A 35 35 0 1 0 185 75 A 30 30 0 1 1 150 40 Z" />

          {/* Left Moth/Butterfly */}
          {/* Wing 1 */}
          <path
            d="M 90 90 Q 120 85 130 95 Q 115 110 90 90 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="2"
          />
          {/* Wing 2 */}
          <path
            d="M 90 90 Q 75 105 85 120 Q 105 110 90 90 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="2"
          />
          <path
            d="M 100 95 L 115 90 M 90 100 L 95 110"
            className="gold-svg-stroke"
            strokeWidth="1"
            fill="none"
          />
          {/* Right Moth/Butterfly */}
          {/* Wing 1 */}
          <path
            d="M 210 90 Q 180 85 170 95 Q 185 110 210 90 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="2"
          />
          {/* Wing 2 */}
          <path
            d="M 210 90 Q 225 105 215 120 Q 195 110 210 90 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="2"
          />
          <path
            d="M 200 95 L 185 90 M 210 100 L 205 110"
            className="gold-svg-stroke"
            strokeWidth="1"
            fill="none"
          />

          {/* Magical Hand */}
          <path
            d="M 125 240 
               C 120 180 120 150 125 140 
               C 130 130 135 130 140 145 
               C 142 165 145 150 145 135 
               C 145 120 155 120 155 135
               C 155 155 160 140 160 135
               C 160 125 170 125 170 140
               C 170 170 175 160 175 150
               C 175 140 185 145 180 160
               C 175 190 180 200 175 240
               Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Moon Phases in the Hand */}
          {/* Phase 1 (Top full moon) */}
          <circle cx="150" cy="180" r="6" />
          {/* Phase 2 (Waning gibbous) */}
          <path d="M 150 195 A 6 6 0 1 0 150 207 A 3 6 0 1 1 150 195 Z" />
          {/* Phase 3 (Crescent) */}
          <path d="M 150 215 A 6 6 0 1 1 150 227 A 3 6 0 1 0 150 215 Z" />

          {/* Lower Branches - Left */}
          <path
            d="M 115 240 Q 90 200 75 155"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="3"
          />
          {/* Leaves Left Branch */}
          <path
            d="M 105 220 Q 80 225 70 210 Q 95 200 105 220 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="1.5"
          />
          <path
            d="M 95 190 Q 60 195 55 175 Q 80 165 95 190 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="1.5"
          />
          <path
            d="M 85 165 Q 50 160 45 140 Q 70 135 85 165 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="1.5"
          />

          {/* Lower Branches - Right */}
          <path
            d="M 185 240 Q 210 200 225 155"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="3"
          />
          {/* Leaves Right Branch */}
          <path
            d="M 195 220 Q 220 225 230 210 Q 205 200 195 220 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="1.5"
          />
          <path
            d="M 205 190 Q 240 195 245 175 Q 220 165 205 190 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="1.5"
          />
          <path
            d="M 215 165 Q 250 160 255 140 Q 230 135 215 165 Z"
            fill="none"
            className="gold-svg-stroke"
            strokeWidth="1.5"
          />

          {/* Classic Four-Point Stars */}
          <path d="M 105 45 L 110 55 L 120 60 L 110 65 L 105 75 L 100 65 L 90 60 L 100 55 Z" />
          <path d="M 195 45 L 198 51 L 204 54 L 198 57 L 195 63 L 192 57 L 186 54 L 192 51 Z" />
          <path d="M 70 110 L 73 115 L 78 118 L 73 121 L 70 126 L 67 121 L 62 118 L 67 115 Z" />
          <path d="M 230 110 L 233 115 L 238 118 L 233 121 L 230 126 L 227 121 L 222 118 L 227 115 Z" />
          <path d="M 80 70 L 82 74 L 86 76 L 82 78 L 80 82 L 78 78 L 74 76 L 78 74 Z" />
          <path d="M 170 120 L 172 124 L 176 126 L 172 128 L 170 132 L 168 128 L 164 126 L 168 124 Z" />

          {/* Small Sparkles / Dots */}
          <circle cx="130" cy="50" r="2" />
          <circle cx="165" cy="55" r="3" />
          <circle cx="110" cy="110" r="1.5" />
          <circle cx="185" cy="100" r="1.5" />
          <circle cx="215" cy="70" r="2" />
          <circle cx="95" cy="140" r="2" />
          <circle cx="220" cy="145" r="1.5" />

          {/* Small Cross Stars */}
          <path d="M 125 125 L 127 127 L 130 128 L 127 129 L 125 131 L 123 129 L 120 128 L 123 127 Z" />
          <path d="M 200 135 L 202 137 L 205 138 L 202 139 L 200 141 L 198 139 L 195 138 L 198 137 Z" />
          <path d="M 175 60 L 177 62 L 180 63 L 177 64 L 175 66 L 173 64 L 170 63 L 173 62 Z" />
          <path d="M 160 250 L 163 253 L 168 255 L 163 257 L 160 260 L 157 257 L 152 255 L 157 253 Z" />
        </g>
      </svg>

      {/* ALL I SEE Text — wide tracked gold foil stamp — Significantly Boosted Visibility */}
      <h1
        className="mystical-gold-text z-10 mt-8 select-none drop-shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all duration-700 hover:scale-110"
        style={{
          fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
          letterSpacing: "0.5em",
          fontWeight: 600,
          paddingLeft: "0.5em",
          opacity: 1,
        }}
      >
        ALL I SEE
      </h1>
    </div>
  );
};

export default MysticalHero;
