import React from "react";
import {
  Github,
  Twitter,
  ShieldCheck,
  Cpu,
  History,
  Settings,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Footer = () => {
  const { playHover, playClick } = useSoundEffects();

  return (
    <footer className="w-full mt-12 pb-10 relative overflow-hidden border-t border-primary/10 bg-slate-950/60 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none digital-grid" />

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start gap-5">
            <Link
              to="/"
              onClick={() => playClick()}
              className="flex flex-col items-start gap-4 group cursor-pointer"
            >
              <img
                src="/LOGO.png"
                alt="AI Voice Editor Logo"
                className="w-48 h-auto drop-shadow-[0_0_20px_hsl(var(--gold)/0.3)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_hsl(var(--gold)/0.5)]"
              />
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl tracking-[0.3em] text-primary gold-text-glow font-bold uppercase transition-all group-hover:tracking-[0.4em]">
                  Scribe
                </span>
              </div>
            </Link>
            <p className="font-body text-xs text-foreground/80 leading-relaxed font-medium mt-2">
              Advanced Neural Processing for elite document synthesis and vocal
              command modulation.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                className="p-2 text-primary/70 hover:text-accent border border-primary/10 hover:border-accent/30 rounded-sm transition-all"
                onMouseEnter={() => playHover()}
                title="GitHub Archive"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 text-primary/70 hover:text-accent border border-primary/10 hover:border-accent/30 rounded-sm transition-all"
                onMouseEnter={() => playHover()}
                title="Neural Stream"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div className="col-span-1">
            <h4 className="font-tech text-[10px] text-accent tracking-[0.3em] uppercase mb-6 font-bold">
              Core_Archives
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", to: "/", icon: Cpu },
                { label: "History_Logs", to: "/history", icon: History },
                { label: "System_Config", to: "/settings", icon: Settings },
                { label: "Intel_Hub", to: "#", icon: HelpCircle },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    onClick={() => playClick()}
                    onMouseEnter={() => playHover()}
                    className="group flex items-center gap-3 text-primary/70 hover:text-primary transition-all text-xs font-mono tracking-widest uppercase"
                  >
                    <link.icon className="w-3.5 h-3.5 group-hover:text-accent group-hover:scale-110 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol info */}
          <div className="col-span-1">
            <h4 className="font-tech text-[10px] text-accent tracking-[0.3em] uppercase mb-6 font-bold">
              System_Integrity
            </h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 p-3 border border-primary/10 bg-primary/5 rounded-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-primary/70 uppercase tracking-tighter">
                    Status:
                  </span>
                  <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-tighter animate-pulse flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> SECURE_CORE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-primary/70 uppercase tracking-tighter">
                    Latency:
                  </span>
                  <span className="font-mono text-[9px] text-accent uppercase tracking-tighter">
                    0.12 MS
                  </span>
                </div>
                <div className="h-[1px] w-full bg-primary/10 my-1" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-primary/70 uppercase tracking-tighter">
                    Ver:
                  </span>
                  <span className="font-mono text-[9px] text-primary/90 uppercase tracking-tighter">
                    V4.2.0-Scribe
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Support */}
          <div className="col-span-1">
            <h4 className="font-tech text-[10px] text-accent tracking-[0.3em] uppercase mb-6 font-bold">
              Neural_Support
            </h4>
            <button
              className="w-full flex items-center justify-center gap-2 group p-3 border border-primary/20 bg-primary/5 hover:border-accent hover:bg-accent/5 transition-all rounded-sm text-primary/80 hover:text-accent font-tech text-[9px] tracking-widest uppercase mb-4"
              onMouseEnter={() => playHover()}
            >
              Report Issue{" "}
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:translate-y-[-0.5px] transition-transform" />
            </button>
            <p className="font-body text-[10px] text-foreground/60 leading-relaxed italic">
              * Ritual assistance available through the encrypted channel
              mdxxvi.core
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="font-tech text-[9px] text-accent tracking-[0.3em] uppercase mb-1 font-bold">
              Built and Engineered with Love by VARA
            </p>
            <p className="font-mono text-[10px] text-primary/70 uppercase tracking-[0.2em]">
              © MDXXVI - MMXXVI AI VOICE EDITOR ARCHIVE
            </p>
            <p className="font-mono text-[8px] text-primary/50 uppercase tracking-[0.3em]">
              All Transmissions Decrypted // Locally Processed
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-tech text-[9px] tracking-widest text-primary/60 hover:text-primary transition-colors uppercase"
            >
              Privacy_Seal
            </a>
            <a
              href="#"
              className="font-tech text-[9px] tracking-widest text-primary/60 hover:text-primary transition-colors uppercase"
            >
              Terms_of_Sync
            </a>
            <a
              href="#"
              className="font-tech text-[9px] tracking-widest text-primary/60 hover:text-primary transition-colors uppercase"
            >
              Root_Log
            </a>
          </div>
        </div>
      </div>

      {/* HUD Accent Brackets */}
      <div className="absolute bottom-4 left-4 tech-bracket-bl opacity-20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 tech-bracket-br opacity-20 pointer-events-none" />
    </footer>
  );
};

export default Footer;
