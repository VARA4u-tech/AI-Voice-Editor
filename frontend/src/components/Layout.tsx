import React, { ReactNode } from "react";
import MysticalBackground from "../components/MysticalBackground";
import FloatingParticles from "../components/FloatingParticles";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useSoundEffects } from "../hooks/useSoundEffects";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
}

const Layout = ({ children, title, subtitle, icon: Icon }: LayoutProps) => {
  const { playHover, playClick } = useSoundEffects();

  return (
    <div className="relative min-h-screen emerald-gradient-bg flex flex-col items-center px-3 sm:px-4 pb-8 overflow-x-hidden">
      <MysticalBackground />
      <FloatingParticles />

      {/* ── Header / Navigation ── */}
      <header className="w-full max-w-6xl flex flex-wrap items-center justify-between z-20 py-4 sm:py-6 mb-4 sm:mb-8 gap-2">
        <Link
          to="/"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="group flex items-center gap-2 text-primary/60 hover:text-primary transition-all duration-300 min-w-0"
        >
          <div className="shrink-0 p-2 rounded-full border border-primary/10 bg-primary/5 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          <span className="font-tech text-[10px] tracking-[0.15em] uppercase truncate">
            Return_to_Core
          </span>
        </Link>

        <div className="flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="font-mono text-[8px] sm:text-[9px] text-accent/60 uppercase tracking-widest whitespace-nowrap">
            System_Active: Protocol_4.2
          </span>
        </div>
      </header>

      <main className="w-full max-w-4xl relative z-10 animate-fade-in flex-1">
        {/* ── Page Title ── */}
        <div className="mb-6 sm:mb-10 text-center px-2">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-primary/40" />
            {Icon && (
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary gold-text-glow" />
            )}
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <h1 className="font-heading text-xl sm:text-3xl md:text-4xl tracking-[0.15em] sm:tracking-[0.3em] text-primary gold-text-glow uppercase mb-2 sm:mb-3 break-words">
            {title}
          </h1>
          {subtitle && (
            <p className="font-tech text-[10px] sm:text-[11px] text-accent tracking-[0.25em] sm:tracking-[0.4em] uppercase opacity-80">
              [ {subtitle} ]
            </p>
          )}
        </div>

        {/* ── Content Area ── */}
        <div className="relative p-4 sm:p-6 md:p-8 border border-primary/10 bg-slate-950/40 backdrop-blur-xl rounded-sm overflow-hidden">
          {/* Corner brackets — hidden on very small screens to reduce clutter */}
          <div className="hidden sm:block tech-bracket-tl w-5 h-5 border-accent/40" />
          <div className="hidden sm:block tech-bracket-br w-5 h-5 border-accent/40" />

          <div className="relative z-10 w-full">{children}</div>

          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none digital-grid" />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full mt-8 sm:mt-16 pb-6 flex flex-col items-center gap-3 pointer-events-none opacity-40">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-primary" />
          <span className="font-heading text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-primary font-bold">
            Gilded Scribe
          </span>
          <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-primary" />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
