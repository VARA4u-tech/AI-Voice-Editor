import Layout from "@/components/Layout";
import {
  ShieldCheck,
  EyeOff,
  Lock,
  Database,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

const Privacy = () => {
  return (
    <Layout
      title="Privacy Seal"
      subtitle="Data_Sanctity_Encryption"
      icon={ShieldCheck}
    >
      <div className="space-y-12 animate-fade-in px-2 max-w-4xl mx-auto">
        {/* Intro */}
        <section className="text-center space-y-4">
          <h3 className="font-tech text-xl text-primary tracking-[0.3em] uppercase gold-text-glow font-bold">
            The Scribe Digital Seal
          </h3>
          <p className="font-body text-base text-foreground/80 leading-relaxed italic">
            Student work is sacred. Scribe is built on the principle of
            local-first processing and secure ephemeral sessions. Your
            intellectual property stays yours.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature highlights */}
          <div className="p-5 border border-primary/20 bg-primary/5 rounded-sm text-center">
            <EyeOff className="w-6 h-6 text-accent mx-auto mb-3" />
            <h5 className="font-tech text-[10px] text-primary uppercase mb-2">
              Zero Observation
            </h5>
            <p className="font-body text-[11px] text-foreground/60 leading-relaxed italic">
              AI processing occurs in isolated sessions. We never train models
              on your specific student papers.
            </p>
          </div>
          <div className="p-5 border border-primary/20 bg-primary/5 rounded-sm text-center">
            <Lock className="w-6 h-6 text-accent mx-auto mb-3" />
            <h5 className="font-tech text-[10px] text-primary uppercase mb-2">
              End-to-End Encryption
            </h5>
            <p className="font-body text-[11px] text-foreground/60 leading-relaxed italic">
              Syncing is optional. All data is locally encrypted before transit
              to our cloud vault.
            </p>
          </div>
          <div className="p-5 border border-primary/20 bg-primary/5 rounded-sm text-center">
            <Database className="w-6 h-6 text-accent mx-auto mb-3" />
            <h5 className="font-tech text-[10px] text-primary uppercase mb-2">
              Local Retention
            </h5>
            <p className="font-body text-[11px] text-foreground/60 leading-relaxed italic">
              Most processing stays in your browser. We only store metadata to
              keep yours history active.
            </p>
          </div>
        </div>

        {/* Detailed items */}
        <section className="space-y-8">
          <div className="p-6 border-l-2 border-accent/30 bg-accent/5">
            <h4 className="flex items-center gap-3 font-tech text-xs text-accent tracking-widest uppercase mb-4 font-bold">
              <UserCheck className="w-4 h-4" /> User_Rights_Protocol
            </h4>
            <div className="font-mono text-[11px] text-primary/70 space-y-4">
              <p>
                •{" "}
                <span className="text-accent underline cursor-pointer">
                  Purge Session
                </span>
                : Instantly delete all local and cloud data associated with the
                current document.
              </p>
              <p>
                •{" "}
                <span className="text-accent underline cursor-pointer">
                  Audit Logs
                </span>
                : View every external call Scribe makes to ensure transparency.
              </p>
              <p>
                •{" "}
                <span className="text-accent underline cursor-pointer">
                  Data Portability
                </span>
                : Download your entire interaction history in a single JSON
                archive.
              </p>
            </div>
          </div>

          <div className="p-6 border-l-2 border-primary/30 bg-primary/5">
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary tracking-widest uppercase mb-4 font-bold">
              <AlertTriangle className="w-4 h-4" /> Academic_Safe_Harbor
            </h4>
            <p className="font-body text-sm text-foreground/70 italic leading-relaxed">
              We respect institutional academic integrity policies. Scribe is an
              editing and refining tool—it is built to augment your own original
              thinking, not replace it. Always cross-reference with your
              university's AI usage guidelines.
            </p>
          </div>
        </section>

        {/* Support Link */}
        <section className="text-center py-6 border-t border-primary/10">
          <p className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
            Detailed legal text availabe in the{" "}
            <span className="text-accent underline cursor-pointer">
              Encrypted_Archive_V4
            </span>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Privacy;
