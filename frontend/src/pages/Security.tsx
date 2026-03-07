import Layout from "@/components/Layout";
import { Shield, Lock, Eye, CheckCircle, RefreshCcw } from "lucide-react";

const Security = () => {
  const protocols = [
    {
      title: "Quantum Encryption",
      status: "Active",
      desc: "Military-grade 256-bit AES encryption applied to all transient document nodes.",
    },
    {
      title: "Volatile Memory Wipe",
      status: "Enabled",
      desc: "Session data is purged from local hardware upon ritual termination.",
    },
    {
      title: "Neural Guard",
      status: "Active",
      desc: "Voice patterns are processed locally; biometric signatures never traverse the network.",
    },
  ];

  return (
    <Layout title="Security" subtitle="Armor_Protocols" icon={Shield}>
      <div className="space-y-10">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-sm border border-accent/20 bg-accent/5 p-8">
          <div className="animate-spin-slow absolute right-2 top-2 opacity-20">
            <Shield className="h-24 w-24 text-accent" />
          </div>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent shadow-[0_0_20px_hsl(var(--accent)/0.3)]">
            <Lock className="h-8 w-8 text-accent" />
          </div>
          <h3 className="mb-2 font-heading text-lg uppercase tracking-[0.2em] text-primary">
            Core Integrity: Level 1
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Encryption_Status: UNBREAKABLE
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {protocols.map((protocol, i) => (
            <div
              key={i}
              className="group rounded-sm border border-primary/10 bg-primary/5 p-6 transition-all duration-300 hover:border-accent/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-tech text-[11px] uppercase tracking-widest text-primary">
                  {protocol.title}
                </h4>
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-accent">
                  <CheckCircle className="h-3 w-3" /> {protocol.status}
                </span>
              </div>
              <p className="font-body text-sm font-medium leading-relaxed text-foreground/70">
                {protocol.desc}
              </p>
            </div>
          ))}

          <div className="group flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-primary/20 bg-transparent p-6 text-center transition-all hover:border-accent/40">
            <RefreshCcw className="mb-3 h-6 w-6 text-primary/40 transition-all duration-700 group-hover:rotate-180 group-hover:text-accent" />
            <span className="font-tech text-[10px] uppercase tracking-widest text-primary/60">
              Rotate_Encryption_Keys
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-sm border border-destructive/20 bg-destructive/5 p-4 pt-4">
          <Eye className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <h5 className="font-tech mb-1 text-[10px] uppercase tracking-widest text-destructive">
              Privacy_Notice
            </h5>
            <p className="font-body text-xs font-medium italic text-destructive/80">
              Your document content is processed entirely within your browser's
              secure context. No sensitive data is transmitted to central neural
              nodes.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Security;
