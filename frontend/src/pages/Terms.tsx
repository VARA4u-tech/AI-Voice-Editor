import Layout from "@/components/Layout";
import {
  FileText,
  CheckCircle2,
  AlertOctagon,
  Scale,
  Globe,
  Terminal,
} from "lucide-react";

const Terms = () => {
  return (
    <Layout
      title="Terms of Sync"
      subtitle="Standard_Usage_Protocol"
      icon={Scale}
    >
      <div className="space-y-12 animate-fade-in px-2 max-w-4xl mx-auto">
        {/* Intro */}
        <section className="text-center space-y-4">
          <h3 className="font-tech text-xl text-primary tracking-[0.3em] uppercase gold-text-glow font-bold">
            The Scribe Service Accord
          </h3>
          <p className="font-body text-base text-foreground/80 leading-relaxed italic">
            By syncing your student profile with the Scribe neural network, you
            agree to maintain the integrity of the academic collective. Our
            tools are for assistance, not automation.
          </p>
        </section>

        {/* Core items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary tracking-widest uppercase mb-4 font-bold border-b border-primary/10 pb-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />{" "}
              Permitted_Operations
            </h4>
            <div className="font-mono text-[11px] text-primary/70 space-y-6">
              <div className="p-3 border-l-2 border-accent/20 bg-accent/5">
                <p>• Editing and refining original student coursework.</p>
              </div>
              <div className="p-3 border-l-2 border-accent/20 bg-accent/5">
                <p>• Formatting research papers for academic submission.</p>
              </div>
              <div className="p-3 border-l-2 border-accent/20 bg-accent/5">
                <p>• Summarizing personal lecture notes and study guides.</p>
              </div>
              <div className="p-3 border-l-2 border-accent/20 bg-accent/5">
                <p>• Utilizing voice commands for hands-free study sessions.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary tracking-widest uppercase mb-4 font-bold border-b border-primary/10 pb-2">
              <AlertOctagon className="w-4 h-4 text-accent" /> Restricted_Logic
            </h4>
            <div className="font-mono text-[11px] text-primary/70 space-y-6">
              <div className="p-3 border-l-2 border-primary/20 bg-primary/5">
                <p>• Reverse engineering the Scribe neural protocols.</p>
              </div>
              <div className="p-3 border-l-2 border-primary/20 bg-primary/5">
                <p>• Automating high-volume academic dishonesty.</p>
              </div>
              <div className="p-3 border-l-2 border-primary/20 bg-primary/5">
                <p>• Unauthorized extraction of other users' metadata.</p>
              </div>
              <div className="p-3 border-l-2 border-primary/20 bg-primary/5">
                <p>• Injecting malicious payloads into the document engine.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Global Compliance */}
        <section className="p-6 border border-primary/10 bg-primary/5 rounded-sm flex flex-col items-center gap-6">
          <div className="flex items-center gap-12 sm:gap-24 opacity-40">
            <Globe className="w-8 h-8 text-primary" />
            <Terminal className="w-8 h-8 text-accent" />
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center space-y-3">
            <h4 className="font-tech text-xs text-primary/80 tracking-[0.4em] uppercase font-bold">
              Global_Sync_Protocol
            </h4>
            <p className="font-body text-[11px] text-foreground/50 leading-relaxed italic max-w-2xl mx-auto">
              Scribe operates under the laws of MDXXVI. Any misuse for harmful
              academic fraud will result in an immediate and irreversible neural
              link termination. Always prioritize original scholarship.
            </p>
          </div>
        </section>

        {/* Footer info */}
        <section className="text-center py-6 border-t border-primary/10">
          <p className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            Last Updated //{" "}
            <span className="text-accent underline cursor-pointer">
              MDXXVI_MAR_03
            </span>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Terms;
