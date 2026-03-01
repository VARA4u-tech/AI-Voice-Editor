import Layout from "@/components/Layout";
import { Info, Code, Cpu, Globe, Mail, Github } from "lucide-react";

const SystemInfo = () => {
  return (
    <Layout title="System Info" subtitle="Protocol_Metadata" icon={Info}>
      <div className="space-y-12">
        <section className="text-center space-y-4">
          <h3 className="font-heading text-xl text-primary tracking-[0.3em] uppercase gold-text-glow">
            Gilded Voice Scribe
          </h3>
          <p className="font-body text-base text-foreground/80 leading-relaxed max-w-2xl mx-auto italic">
            A high-fidelity neural interface for document mutation through the
            medium of human speech. Combining ancient typographic aesthetics
            with future-forward voice recognition protocols.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="space-y-6">
            <h4 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
              <Cpu className="w-4 h-4 text-accent" />
              Core_Stack
            </h4>
            <div className="space-y-4 font-mono text-[11px] text-primary/70">
              <div className="flex justify-between p-2 border-l-2 border-accent/40 bg-accent/5">
                <span>NEURAL_ENGINE</span>
                <span className="text-accent">Web Speech API</span>
              </div>
              <div className="flex justify-between p-2 border-l-2 border-primary/40 bg-primary/5">
                <span>LOGIC_FRAMEWORK</span>
                <span className="text-primary">React 18.3 + Vite</span>
              </div>
              <div className="flex justify-between p-2 border-l-2 border-accent/40 bg-accent/5">
                <span>AESTHETIC_ENGINE</span>
                <span className="text-accent">Tailwind CSS + Lucide</span>
              </div>
              <div className="flex justify-between p-2 border-l-2 border-primary/40 bg-primary/5">
                <span>DATA_DENSITY</span>
                <span className="text-primary">PDF.js Logic</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h4 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
              <Code className="w-4 h-4 text-accent" />
              Developer_Transmission
            </h4>
            <div className="space-y-6">
              <p className="font-body text-sm text-foreground/70 italic leading-relaxed">
                Designed and engineered for the Gilded Scribe ritual. All
                systems verified stable under Protocol 4.2.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="p-3 border border-primary/20 bg-primary/5 rounded-full hover:border-accent hover:text-accent transition-all group"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 border border-primary/20 bg-primary/5 rounded-full hover:border-accent hover:text-accent transition-all group"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 border border-primary/20 bg-primary/5 rounded-full hover:border-accent hover:text-accent transition-all group"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>
        </div>

        <section className="pt-8 border-t border-primary/10">
          <div className="flex flex-col items-center gap-2 opacity-30">
            <span className="font-tech text-[9px] tracking-[0.5em] uppercase">
              Built_with_Intention
            </span>
            <span className="font-mono text-[8px] tracking-widest">
              BUILD_ID: SCRIBE_2026_MAR_01
            </span>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SystemInfo;
