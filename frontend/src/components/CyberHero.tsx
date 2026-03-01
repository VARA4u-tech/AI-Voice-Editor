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
    <div className="w-full max-w-4xl flex flex-col items-center mb-10 animate-fade-in relative pt-4">
      {/* Decorative Outer Hexagon HUD */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-accent stroke-current fill-none"
        >
          <path
            d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {/* Main Logo Area */}
      <div className="relative mb-12 group">
        <div className="absolute -inset-10 bg-accent/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <img
          src="/LOGO.png"
          alt="AI Voice Editor Logo"
          className="w-72 sm:w-[480px] h-auto drop-shadow-[0_0_45px_hsl(var(--gold)/0.45)] relative z-10 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="tech-bracket-tl -top-2 -left-2 w-6 h-6 border-accent/40" />
        <div className="tech-bracket-br -bottom-2 -right-2 w-6 h-6 border-accent/40" />
      </div>

      {/* Primary Titles */}
      <div className="text-center space-y-3 mb-8 px-4 relative">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl tracking-[0.3em] text-primary gold-text-glow uppercase">
          AI Voice Editor
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-accent/40" />
          <p className="font-tech text-[10px] sm:text-xs text-accent tracking-[0.4em] uppercase opacity-80">
            [ Protocol_V4.Scribe ]
          </p>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-accent/40" />
        </div>

        {fileName && paragraphsCount && (
          <div className="flex flex-col items-center mt-3 scale-90 sm:scale-100">
            <div className="px-3 py-1 bg-accent/5 border border-accent/10 rounded-sm">
              <span className="font-mono text-[9px] text-accent/60 uppercase tracking-tighter">
                Restored: {fileName} // {paragraphsCount} Blocks Found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Columns: Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl px-6">
        <div
          onMouseEnter={() => playHover()}
          className="p-4 border border-primary/10 bg-primary/5 backdrop-blur-md relative group hover:border-accent/40 transition-all duration-500 overflow-hidden"
        >
          <div className="tech-bracket-tl w-2 h-2" />
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-2">
            Neural_Synthesis
          </h3>
          <p className="font-body text-sm text-foreground/60 leading-relaxed">
            Advanced voice recognition algorithms translate natural speech into
            precise document manipulations.
          </p>
          <div className="mt-3 font-mono text-[9px] text-accent/40 uppercase tracking-tighter">
            Latency: 0.12ms
          </div>
        </div>

        <div
          onMouseEnter={() => playHover()}
          className="p-4 border border-primary/10 bg-primary/5 backdrop-blur-md relative group hover:border-accent/40 transition-all duration-500 overflow-hidden"
        >
          <div className="tech-bracket-tl w-2 h-2" />
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-2">
            Secure_Encryption
          </h3>
          <p className="font-body text-sm text-foreground/60 leading-relaxed">
            Local-first processing ensures your document data never leaves the
            secure boundaries of your terminal.
          </p>
          <div className="mt-3 font-mono text-[9px] text-accent/40 uppercase tracking-tighter">
            Status: Protected
          </div>
        </div>

        <div
          onMouseEnter={() => playHover()}
          className="p-4 border border-primary/10 bg-primary/5 backdrop-blur-md relative group hover:border-accent/40 transition-all duration-500 overflow-hidden"
        >
          <div className="tech-bracket-tl w-2 h-2" />
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-tech text-[10px] text-primary/80 tracking-widest uppercase mb-2">
            Logic_Alchemy
          </h3>
          <p className="font-body text-sm text-foreground/60 leading-relaxed">
            Context-aware AI understands intent, allowing for complex multi-step
            edits with simple voice phrases.
          </p>
          <div className="mt-3 font-mono text-[9px] text-accent/40 uppercase tracking-tighter">
            Core: AGI_MIMIC
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="mt-10 flex items-center justify-between w-full max-w-sm px-4">
        <div className="flex flex-col items-center">
          <span className="font-mono text-[8px] text-primary/30 uppercase">
            Uptime
          </span>
          <span className="font-mono text-[10px] text-accent">99.98%</span>
        </div>
        <div className="h-8 w-[1px] bg-primary/10" />
        <div className="flex flex-col items-center">
          <span className="font-mono text-[8px] text-primary/30 uppercase">
            Version
          </span>
          <span className="font-mono text-[10px] text-accent">SCRIBE_4.2</span>
        </div>
        <div className="h-8 w-[1px] bg-primary/10" />
        <div className="flex flex-col items-center">
          <span className="font-mono text-[8px] text-primary/30 uppercase">
            Integrity
          </span>
          <span className="font-mono text-[10px] text-accent">VERIFIED</span>
        </div>
      </div>
    </div>
  );
};

export default CyberHero;
