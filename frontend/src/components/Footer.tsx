import React from "react";
import {
  Github,
  Twitter,
  Instagram,
  ShieldCheck,
  Cpu,
  History,
  Settings,
  HelpCircle,
  ExternalLink,
  LinkedinIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Footer = () => {
  const { playHover, playClick } = useSoundEffects();

  return (
    <footer className="relative mt-12 w-full animate-fade-in overflow-hidden border-t border-primary/10 bg-slate-950/60 pb-10 backdrop-blur-xl">
      <div className="digital-grid pointer-events-none absolute inset-0 opacity-[0.02]" />

      <div className="mx-auto max-w-5xl px-6 pt-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand section */}
          <div className="col-span-1 flex flex-col items-start gap-5 md:col-span-1">
            <Link
              to="/"
              onClick={() => playClick()}
              className="group flex cursor-pointer flex-col items-start gap-4"
            >
              <img
                src="/LOGO.png"
                alt="AI Voice Editor Logo"
                className="h-auto w-48 drop-shadow-[0_0_20px_hsl(var(--gold)/0.3)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_hsl(var(--gold)/0.5)]"
              />
              <div className="flex items-center gap-3">
                <span className="gold-text-glow font-heading text-2xl font-bold uppercase tracking-[0.3em] text-primary transition-all group-hover:tracking-[0.4em]">
                  Scribe
                </span>
              </div>
            </Link>
            <p className="mt-2 font-body text-xs font-medium leading-relaxed text-foreground/80">
              Advanced Neural Processing for elite document synthesis and vocal
              command modulation.
            </p>
            <div className="mt-2 flex gap-4">
              <a
                href="https://github.com/VARA4u-tech"
                className="rounded-sm border border-primary/10 p-2 text-primary/70 transition-all hover:border-accent/30 hover:text-accent"
                onMouseEnter={() => playHover()}
                title="GitHub Archive"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/d_v_p6/"
                className="rounded-sm border border-primary/10 p-2 text-primary/70 transition-all hover:border-accent/30 hover:text-accent"
                onMouseEnter={() => playHover()}
                title="Neural Stream"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/durga-vara-prasad-pappuri-1797701b6"
                className="rounded-sm border border-primary/10 p-2 text-primary/70 transition-all hover:border-accent/30 hover:text-accent"
                onMouseEnter={() => playHover()}
                title="Neural Stream"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div className="col-span-1">
            <h4 className="font-tech mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Core_Archives
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", to: "/", icon: Cpu },
                { label: "History_Logs", to: "/history", icon: History },
                { label: "System_Config", to: "/settings", icon: Settings },
                { label: "Intel_Hub", to: "/intel", icon: HelpCircle },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    onClick={() => playClick()}
                    onMouseEnter={() => playHover()}
                    className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-primary/70 transition-all hover:text-primary"
                  >
                    <link.icon className="h-3.5 w-3.5 transition-all group-hover:scale-110 group-hover:text-accent" />
                    <span className="transition-transform group-hover:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol info */}
          <div className="col-span-1">
            <h4 className="font-tech mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              System_Integrity
            </h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 rounded-sm border border-primary/10 bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-primary/70">
                    Status:
                  </span>
                  <span className="flex animate-pulse items-center gap-1 font-mono text-[9px] uppercase tracking-tighter text-emerald-400">
                    <ShieldCheck className="h-2.5 w-2.5" /> SECURE_CORE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-primary/70">
                    Latency:
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-accent">
                    0.12 MS
                  </span>
                </div>
                <div className="my-1 h-[1px] w-full bg-primary/10" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-primary/70">
                    Ver:
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-primary/90">
                    V4.2.0-Scribe
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Support */}
          <div className="col-span-1">
            <h4 className="font-tech mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Neural_Support
            </h4>
            <button
              className="font-tech group mb-4 flex w-full items-center justify-center gap-2 rounded-sm border border-primary/20 bg-primary/5 p-3 text-[9px] uppercase tracking-widest text-primary/80 transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
              onMouseEnter={() => playHover()}
            >
              Report Issue{" "}
              <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.5px]" />
            </button>
            <p className="font-body text-[10px] italic leading-relaxed text-foreground/60">
              * Ritual assistance available through the encrypted channel
              mdxxvi.core
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-primary/10 pt-6 text-center sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="font-tech mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-accent">
              Built and Engineered with Love by VARA
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
              © 2026 - 2027 AI VOICE EDITOR ARCHIVE
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-primary/50">
              All Transmissions Decrypted // Locally Processed
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="font-tech text-[9px] uppercase tracking-widest text-primary/60 transition-colors hover:text-primary"
            >
              Privacy_Seal
            </Link>
            <Link
              to="/terms"
              className="font-tech text-[9px] uppercase tracking-widest text-primary/60 transition-colors hover:text-primary"
            >
              Terms_of_Sync
            </Link>
            <Link
              to="/logs"
              className="font-tech text-[9px] uppercase tracking-widest text-primary/60 transition-colors hover:text-primary"
            >
              Root_Log
            </Link>
          </div>
        </div>
      </div>

      {/* HUD Accent Brackets */}
      <div className="tech-bracket-bl pointer-events-none absolute bottom-4 left-4 opacity-20" />
      <div className="tech-bracket-br pointer-events-none absolute bottom-4 right-4 opacity-20" />
    </footer>
  );
};

export default Footer;
