import React, { useState, useEffect } from "react";
import {
  Mic,
  FileText,
  Wand2,
  Download,
  Search,
  Save,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Trophy,
  Timer,
} from "lucide-react";

const ONBOARDING_KEY = "gilded-scribe-onboarded-v2";

interface Step {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  commands: string[];
  tip: string;
  color: string;
}

const STEPS: Step[] = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Welcome to the Neural Scribe",
    subtitle: "AI Voice Editor — Your voice-powered document ritual",
    commands: [],
    tip: "This short guide will show you how to master the system. You can dismiss it anytime.",
    color: "from-amber-500/20 to-transparent",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Upload Your Document",
    subtitle: "Inject a PDF or TXT scroll into the system",
    commands: [
      "Click Upload_Scroll in the toolbar",
      "Supports text-based PDFs & plain text files",
      "Scanned PDFs require OCR pre-processing",
    ],
    tip: "Once uploaded, your document is auto-saved locally so you can resume later.",
    color: "from-blue-500/20 to-transparent",
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Activate Voice Control",
    subtitle: "Speak naturally — the Oracle listens",
    commands: [
      '"Delete segment 3"',
      '"Replace segment 5 with Hello World"',
      '"Summarise the document"',
      '"Translate segment 2 to Telugu"',
    ],
    tip: "Press SPACE or Ctrl+M as a keyboard shortcut to toggle the microphone.",
    color: "from-green-500/20 to-transparent",
  },
  {
    icon: <Wand2 className="w-8 h-8" />,
    title: "AI-Powered Commands",
    subtitle: "The Gilded Scribe understands complex instructions",
    commands: [
      '"Fix grammar mistakes in segment 1"',
      '"Make segment 4 shorter and simpler"',
      '"Add a conclusion paragraph"',
      '"Elevate the tone of segment 2"',
    ],
    tip: "Commands are processed by an AI model — be patient on the free tier (rate limits apply).",
    color: "from-purple-500/20 to-transparent",
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Search & Navigate",
    subtitle: "Find any word instantly across the document",
    commands: [
      "Use the Search_Archive bar in the document panel",
      "Type to highlight all matching paragraphs",
      "Press Enter to jump to the next match",
    ],
    tip: "The live word count, sentence count, and reading time are displayed at the top of the panel.",
    color: "from-cyan-500/20 to-transparent",
  },
  {
    icon: <Save className="w-8 h-8" />,
    title: "Save & Export",
    subtitle: "Archive your work or download a formatted PDF",
    commands: [
      "Save_Version — seals the current state to the cloud archive",
      "Export_Out — downloads a branded PDF instantly",
      "Auto_Title — let AI name your document",
    ],
    tip: "Visit the History page to restore any previously saved version.",
    color: "from-rose-500/20 to-transparent",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Track Your Progress",
    subtitle: "Analytics, Leaderboards & Session History",
    commands: [
      "Analytics — See your command leaderboard & success rate",
      "History — Browse all sessions and restore documents",
      "Session Timer — Tracks time spent on each document",
    ],
    tip: "Log in to sync everything with the cloud. Your rituals await.",
    color: "from-yellow-500/20 to-transparent",
  },
];

interface OnboardingTutorialProps {
  forceShow?: boolean;
  onClose?: () => void;
}

const OnboardingTutorial = ({
  forceShow = false,
  onClose,
}: OnboardingTutorialProps) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen || forceShow) setVisible(true);
  }, [forceShow]);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
    onClose?.();
  };

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 180);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-background border border-primary/30 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Corner brackets */}
        <div className="tech-bracket-tl" />
        <div className="tech-bracket-tr" />
        <div className="tech-bracket-bl" />
        <div className="tech-bracket-br" />

        {/* Gradient accent top */}
        <div
          className={`absolute top-0 left-0 w-full h-40 bg-gradient-to-b ${current.color} pointer-events-none opacity-60`}
        />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 p-2 text-primary/40 hover:text-primary transition-colors z-10"
          title="Skip Tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step content */}
        <div
          className={`p-8 pt-10 transition-all duration-150 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
        >
          {/* Icon + Step counter */}
          <div className="flex items-start justify-between mb-8">
            <div className="p-4 border border-accent/40 bg-accent/10 text-accent shadow-[0_0_20px_rgba(255,215,0,0.1)]">
              {current.icon}
            </div>
            <div className="flex gap-2 items-center mt-3">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === step
                      ? "w-8 bg-accent shadow-[0_0_10px_rgba(255,215,0,0.4)]"
                      : "w-2.5 bg-primary/20 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h2 className="font-heading text-2xl sm:text-3xl text-primary tracking-tight mb-2 leading-tight">
            {current.title}
          </h2>
          <p className="font-mono text-xs sm:text-sm text-accent/90 uppercase tracking-[0.25em] mb-8 font-medium">
            {current.subtitle}
          </p>

          {/* Command Examples */}
          {current.commands.length > 0 && (
            <ul className="space-y-3 mb-8">
              {current.commands.map((cmd, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 px-5 py-3.5 bg-primary/5 border border-primary/10 rounded-sm hover:border-primary/30 transition-colors"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-accent/60 font-mono text-xs mt-0.5 shrink-0">
                    ❯
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {cmd}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Tip */}
          <div className="px-5 py-4 border-l-3 border-accent/60 bg-accent/5 mb-10 ring-1 ring-inset ring-accent/5">
            <p className="font-body text-sm text-foreground/80 italic leading-relaxed">
              <span className="not-italic mr-2">💡</span>
              {current.tip}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-auto">
            <button
              onClick={() => (isFirst ? dismiss() : goTo(step - 1))}
              className="flex items-center gap-2.5 font-tech text-xs uppercase tracking-widest text-primary/50 hover:text-primary transition-all hover:translate-x-[-2px]"
            >
              {isFirst ? (
                <span className="opacity-80">Skip Tutorial</span>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </>
              )}
            </button>

            <button
              onClick={() => (isLast ? dismiss() : goTo(step + 1))}
              className="flex items-center gap-2.5 px-8 py-3.5 font-tech text-xs uppercase tracking-widest bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 hover:border-accent hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all active:scale-95"
            >
              {isLast ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" /> Begin Ritual
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
export { ONBOARDING_KEY };
