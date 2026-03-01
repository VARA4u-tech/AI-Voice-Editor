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
        <div className="flex flex-col items-center justify-center p-8 border border-accent/20 bg-accent/5 rounded-sm relative overflow-hidden">
          <div className="absolute top-2 right-2 animate-spin-slow opacity-20">
            <Shield className="w-24 h-24 text-accent" />
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center mb-6 shadow-[0_0_20px_hsl(var(--accent)/0.3)]">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-heading text-lg text-primary tracking-[0.2em] uppercase mb-2">
            Core Integrity: Level 1
          </h3>
          <p className="font-mono text-[10px] text-accent tracking-widest uppercase">
            Encryption_Status: UNBREAKABLE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protocols.map((protocol, i) => (
            <div
              key={i}
              className="p-6 border border-primary/10 bg-primary/5 rounded-sm group hover:border-accent/40 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-tech text-[11px] text-primary tracking-widest uppercase">
                  {protocol.title}
                </h4>
                <span className="flex items-center gap-1.5 text-[9px] font-mono text-accent">
                  <CheckCircle className="w-3 h-3" /> {protocol.status}
                </span>
              </div>
              <p className="font-body text-sm text-foreground/70 leading-relaxed font-medium">
                {protocol.desc}
              </p>
            </div>
          ))}

          <div className="p-6 border border-dashed border-primary/20 bg-transparent rounded-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:border-accent/40 transition-all">
            <RefreshCcw className="w-6 h-6 text-primary/40 group-hover:text-accent group-hover:rotate-180 transition-all duration-700 mb-3" />
            <span className="font-tech text-[10px] text-primary/60 tracking-widest uppercase">
              Rotate_Encryption_Keys
            </span>
          </div>
        </div>

        <div className="pt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-sm flex items-start gap-4">
          <Eye className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h5 className="font-tech text-[10px] text-destructive tracking-widest uppercase mb-1">
              Privacy_Notice
            </h5>
            <p className="font-body text-xs text-destructive/80 italic font-medium">
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
