import Layout from "@/components/Layout";
import {
  HelpCircle,
  GraduationCap,
  Mic,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";

const IntelHub = () => {
  return (
    <Layout
      title="Intel Hub"
      subtitle="Student_Resource_Center"
      icon={GraduationCap}
    >
      <div className="space-y-12 animate-fade-in px-2">
        {/* Intro */}
        <section className="text-center space-y-4">
          <h3 className="font-heading text-xl text-primary tracking-[0.3em] uppercase gold-text-glow">
            The Student Scribe Manual
          </h3>
          <p className="font-body text-base text-foreground/80 leading-relaxed max-w-3xl mx-auto italic">
            Maximize your academic productivity. Scribe is engineered
            specifically for students to bridge the gap between spoken thought
            and structured academic documents.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Start for Students */}
          <section className="p-6 border border-primary/10 bg-primary/5 rounded-sm relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="tech-bracket-tl w-2 h-2" />
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary/80 tracking-widest uppercase mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              Academic_Quickstart
            </h4>
            <ul className="space-y-4 font-mono text-[11px] text-primary/70">
              <li className="flex gap-3">
                <span className="text-accent font-bold">01.</span>
                <span>
                  Inject your lecture notes or assignment drafts (PDF/TXT).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">02.</span>
                <span>
                  Activate the Neural Link (Mic) to dictate structure.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">03.</span>
                <span>
                  Use commands like "Summarize" or "Format as Bibliography".
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">04.</span>
                <span>Seal your version and export to high-quality PDF.</span>
              </li>
            </ul>
          </section>

          {/* Core Command Protocols */}
          <section className="p-6 border border-primary/10 bg-primary/5 rounded-sm relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="tech-bracket-tl w-2 h-2" />
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary/80 tracking-widest uppercase mb-6">
              <BookOpen className="w-4 h-4 text-accent" />
              Power_Commands
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-2 border-l-2 border-accent/30 bg-accent/5">
                <div className="font-tech text-[10px] text-accent font-bold uppercase tracking-widest">
                  Formalize
                </div>
                <div className="font-mono text-[9px] text-primary/60">
                  Converts casual dictation into academic tone.
                </div>
              </div>
              <div className="p-2 border-l-2 border-primary/30 bg-primary/5">
                <div className="font-tech text-[10px] text-primary font-bold uppercase tracking-widest">
                  Connective
                </div>
                <div className="font-mono text-[9px] text-primary/60">
                  Adds academic bridge phrases between points.
                </div>
              </div>
              <div className="p-2 border-l-2 border-accent/30 bg-accent/5">
                <div className="font-tech text-[10px] text-accent font-bold uppercase tracking-widest">
                  Highlight
                </div>
                <div className="font-mono text-[9px] text-primary/60">
                  Flags key concepts for later study.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Use Cases */}
        <section className="space-y-6">
          <h4 className="font-tech text-xs text-primary tracking-[0.3em] uppercase text-center font-bold">
            Optimal_Study_Flows
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Mic className="w-6 h-6 text-accent mx-auto mb-3" />
              <h5 className="font-tech text-[10px] text-primary uppercase mb-2">
                Essay Drafting
              </h5>
              <p className="font-body text-[11px] text-foreground/60 leading-relaxed italic">
                Speak your thesis out loud and let Scribe structure the
                evidence.
              </p>
            </div>
            <div className="text-center p-4">
              <FileText className="w-6 h-6 text-accent mx-auto mb-3" />
              <h5 className="font-tech text-[10px] text-primary uppercase mb-2">
                Lecture Synthesis
              </h5>
              <p className="font-body text-[11px] text-foreground/60 leading-relaxed italic">
                Inject messy raw notes and use "Formalize" to create study
                guides.
              </p>
            </div>
            <div className="text-center p-4">
              <HelpCircle className="w-6 h-6 text-accent mx-auto mb-3" />
              <h5 className="font-tech text-[10px] text-primary uppercase mb-2">
                Exam Prep
              </h5>
              <p className="font-body text-[11px] text-foreground/60 leading-relaxed italic">
                Summarize long textbook chapters through voice interaction.
              </p>
            </div>
          </div>
        </section>

        {/* Support Link */}
        <section className="text-center py-6 border-t border-primary/10">
          <p className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            Need advanced support? Transmit signal to{" "}
            <span className="text-accent underline cursor-pointer">
              mdxxvi.core
            </span>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default IntelHub;
