import React from "react";
import { Shield, Zap, Cpu, Sparkles } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface CyberHeroProps {
  fileName?: string;
  paragraphsCount?: number;
}

const CyberHero = ({ fileName, paragraphsCount }: CyberHeroProps) => {
  const { playHover } = useSoundEffects();

  return (
    <div className="w-full max-w-5xl flex flex-col items-center mb-10 animate-fade-in relative pt-6 sm:pt-10">
      {/* Decorative Outer Hexagon HUD — contained to logo area */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none opacity-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-accent stroke-current fill-none"
        >
          <path
            d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Main Logo Area */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-16 bg-accent/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <img
          src="/LOGO.png"
          alt="AI Voice Editor Logo"
          className="w-56 sm:w-[320px] md:w-[400px] h-auto drop-shadow-[0_0_60px_hsl(var(--gold)/0.6)] relative z-10 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="tech-bracket-tl -top-4 -left-4 w-10 h-10 border-accent/40" />
        <div className="tech-bracket-br -bottom-4 -right-4 w-10 h-10 border-accent/40" />
        <div className="tech-bracket-tr -top-4 -right-4 w-4 h-4 border-accent/20" />
        <div className="tech-bracket-bl -bottom-4 -left-4 w-4 h-4 border-accent/20" />
      </div>

      {/* Primary Titles */}
      <div className="text-center space-y-4 mb-12 px-6 relative">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-[0.35em] text-primary gold-text-glow uppercase leading-tight">
          AI Voice Editor
        </h1>
        <div className="flex items-center justify-center gap-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-accent/60" />
          <p className="font-tech text-xs sm:text-sm md:text-base text-accent tracking-[0.5em] uppercase font-bold text-glow">
            [ Protocol_V4.Scribe_Elite ]
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-accent/60" />
        </div>

        {fileName && paragraphsCount && (
          <div className="flex flex-col items-center mt-5 scale-100">
            <div className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.1)]">
              <span className="font-mono text-xs text-accent uppercase tracking-tight font-medium">
                Restored: {fileName} // {paragraphsCount} Blocks Found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Columns: Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-6">
        <div
          onMouseEnter={() => playHover()}
          className="p-6 border border-primary/20 bg-slate-950/60 backdrop-blur-2xl relative group hover:border-accent/50 transition-all duration-500 overflow-hidden rounded-sm"
        >
          <div className="tech-bracket-tl w-3 h-3" />
          <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-tech text-xs text-primary tracking-widest uppercase mb-3 font-semibold">
            Neural_Synthesis
          </h3>
          <p className="font-body text-base text-foreground leading-relaxed font-medium">
            Advanced voice recognition algorithms translate natural speech into
            precise document manipulations with sub-millisecond precision.
          </p>
          <div className="mt-4 font-mono text-[10px] text-accent/80 uppercase tracking-tighter">
            Latency: 0.12ms // ACTIVE
          </div>
        </div>

        <div
          onMouseEnter={() => playHover()}
          className="p-6 border border-primary/20 bg-slate-950/60 backdrop-blur-2xl relative group hover:border-accent/50 transition-all duration-500 overflow-hidden rounded-sm"
        >
          <div className="tech-bracket-tl w-3 h-3" />
          <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-tech text-xs text-primary tracking-widest uppercase mb-3 font-semibold">
            Secure_Encryption
          </h3>
          <p className="font-body text-base text-foreground leading-relaxed font-medium">
            Local-first processing ensures your document data never leaves the
            secure boundaries of your local terminal environment.
          </p>
          <div className="mt-4 font-mono text-[10px] text-accent/80 uppercase tracking-tighter">
            Status: Protected // RSA-4096
          </div>
        </div>

        <div
          onMouseEnter={() => playHover()}
          className="p-6 border border-primary/20 bg-slate-950/60 backdrop-blur-2xl relative group hover:border-accent/50 transition-all duration-500 overflow-hidden rounded-sm"
        >
          <div className="tech-bracket-tl w-3 h-3" />
          <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-tech text-xs text-primary tracking-widest uppercase mb-3 font-semibold">
            Logic_Alchemy
          </h3>
          <p className="font-body text-base text-foreground leading-relaxed font-medium">
            Context-aware AI understands intent, allowing for complex multi-step
            edits with simple natural language voice phrases.
          </p>
          <div className="mt-4 font-mono text-[10px] text-accent/80 uppercase tracking-tighter">
            Core: AGI_MIMIC // V4.2L
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="mt-10 flex items-center justify-between w-full max-w-md px-6 bg-primary/5 py-4 border-x border-primary/10">
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            Uptime
          </span>
          <span className="font-mono text-sm text-accent font-bold">
            99.98%
          </span>
        </div>
        <div className="h-10 w-[1px] bg-primary/20" />
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            Version
          </span>
          <span className="font-mono text-sm text-accent font-bold">
            SCRIBE_4.2
          </span>
        </div>
        <div className="h-10 w-[1px] bg-primary/20" />
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            Integrity
          </span>
          <span className="font-mono text-sm text-accent font-bold">
            VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};

export default CyberHero;
