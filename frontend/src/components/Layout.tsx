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
    <div className="relative min-h-screen emerald-gradient-bg flex flex-col items-center p-4 overflow-x-hidden">
      <MysticalBackground />
      <FloatingParticles />

      {/* Header / Navigation */}
      <header className="w-full max-w-6xl flex justify-between items-center z-20 py-6 mb-8">
        <Link
          to="/"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="group flex items-center gap-2 text-primary/60 hover:text-primary transition-all duration-300"
        >
          <div className="p-2 rounded-full border border-primary/10 bg-primary/5 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          <span className="font-tech text-[10px] tracking-[0.2em] uppercase">
            Return_to_Core
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="font-mono text-[9px] text-accent/60 uppercase tracking-widest">
            System_Active: Protocol_4.2
          </span>
        </div>
      </header>

      <main className="w-full max-w-4xl relative z-10 animate-fade-in flex-1">
        {/* Page Title Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/40" />
            {Icon && <Icon className="w-8 h-8 text-primary gold-text-glow" />}
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.3em] text-primary gold-text-glow uppercase mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="font-tech text-[11px] text-accent tracking-[0.4em] uppercase opacity-80">
              [ {subtitle} ]
            </p>
          )}
        </div>

        {/* Content Area */}
        <div className="relative p-8 border border-primary/10 bg-slate-950/40 backdrop-blur-2xl rounded-sm overflow-hidden">
          <div className="tech-bracket-tl w-6 h-6 border-accent/40" />
          <div className="tech-bracket-br w-6 h-6 border-accent/40" />

          <div className="relative z-10 w-full min-h-[400px]">{children}</div>

          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none digital-grid" />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-20 pb-10 flex flex-col items-center gap-4 pointer-events-none opacity-40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary" />
          <span className="font-heading text-[11px] tracking-[0.4em] uppercase text-primary font-bold">
            Gilded Scribe
          </span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-primary" />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
