import Layout from "@/components/Layout";
import {
  Terminal,
  Activity,
  Cpu,
  Database,
  Network,
  ShieldAlert,
  Wifi,
  Globe,
  HardDrive,
} from "lucide-react";

const RootLog = () => {
  return (
    <Layout
      title="Root Log"
      subtitle="Deep_System_Transmission"
      icon={Terminal}
    >
      <div className="space-y-12 animate-fade-in px-2 max-w-5xl mx-auto">
        {/* Intro */}
        <section className="text-center space-y-4">
          <h3 className="font-tech text-xl text-primary tracking-[0.3em] uppercase gold-text-glow font-bold">
            The Scribe Signal Audit
          </h3>
          <p className="font-body text-base text-foreground/80 leading-relaxed italic max-w-3xl mx-auto">
            A comprehensive diagnostic overview of the current Scribe session.
            All neural pathways are monitored for sub-millisecond precision.
          </p>
        </section>

        {/* Diagnostic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hardware & CPU */}
          <section className="p-6 border border-primary/10 bg-slate-950/60 backdrop-blur-md rounded-sm relative overflow-hidden group">
            <div className="tech-bracket-tl w-2 h-2 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary/80 tracking-widest uppercase mb-6 font-bold">
              <Cpu className="w-4 h-4 text-accent" />
              Processing_Unit
            </h4>
            <div className="space-y-4 font-mono text-[11px] text-primary/60">
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span>Core Engine</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span>V6 Scribe Node</span>
                <span className="text-accent">CONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span>Neural Usage</span>
                <span className="text-primary">12.4% AVAIL</span>
              </div>
            </div>
          </section>

          {/* Database & Storage */}
          <section className="p-6 border border-primary/10 bg-slate-950/60 backdrop-blur-md rounded-sm relative overflow-hidden group">
            <div className="tech-bracket-tl w-2 h-2 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary/80 tracking-widest uppercase mb-6 font-bold">
              <Database className="w-4 h-4 text-accent" />
              Scribe_Vault
            </h4>
            <div className="space-y-4 font-mono text-[11px] text-primary/60">
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span>Local Buffer</span>
                <span className="text-emerald-400">OPTIMIZED</span>
              </div>
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span>Session DB</span>
                <span className="text-accent">STABLE</span>
              </div>
              <div className="flex justify-between">
                <span>Disk Index</span>
                <span className="text-primary">VERIFIED</span>
              </div>
            </div>
          </section>

          {/* Network & Safety */}
          <section className="p-6 border border-primary/10 bg-slate-950/60 backdrop-blur-md rounded-sm relative overflow-hidden group">
            <div className="tech-bracket-tl w-2 h-2 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h4 className="flex items-center gap-3 font-tech text-xs text-primary/80 tracking-widest uppercase mb-6 font-bold">
              <Network className="w-4 h-4 text-accent" />
              Neural_Transit
            </h4>
            <div className="space-y-4 font-mono text-[11px] text-primary/60">
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span>Sync Latency</span>
                <span className="text-emerald-400">0.12 MS</span>
              </div>
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span>Secure Tunnel</span>
                <span className="text-accent">ENCRYPTED</span>
              </div>
              <div className="flex justify-between">
                <span>Packet Status</span>
                <span className="text-primary">HEALTHY</span>
              </div>
            </div>
          </section>
        </div>

        {/* Live Simulation Feed */}
        <section className="space-y-6">
          <div className="p-6 border border-primary/10 bg-slate-950/80 rounded-sm font-mono text-[10px] text-primary/40 space-y-3 relative overflow-hidden h-64 shadow-inner">
            {/* Tech Brackets */}
            <div className="absolute top-4 right-4 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-accent/40" />
            </div>
            <div className="space-y-1">
              <p className="flex gap-4">
                <span className="text-accent/60">[19:52:06]</span>
                <span className="text-emerald-400">SIGNAL_INJECT</span>
                <span>// PDF_DOCUMENT_V4_LOADED // MD5: B64X...</span>
              </p>
              <p className="flex gap-4">
                <span className="text-accent/60">[19:52:12]</span>
                <span className="text-primary">NEURAL_INIT</span>
                <span>// WEBSPEECHAPI_SYNC // BROWSER_MOD_4.2</span>
              </p>
              <p className="flex gap-4">
                <span className="text-accent/60">[19:52:18]</span>
                <span className="text-emerald-400">TRANS_LOGIC</span>
                <span>// VOICE_COMMAND "Formalize" RECEIVED //</span>
              </p>
              <p className="flex gap-4">
                <span className="text-accent/60">[19:52:24]</span>
                <span className="text-blue-400">DATA_SYNC</span>
                <span>// LOCAL_STORAGE_SNAPSHOT_SEALED //</span>
              </p>
              <p className="flex gap-4">
                <span className="text-accent/60">[19:52:30]</span>
                <span className="text-accent">SYSTEM_PULSE</span>
                <span>// ALL_PATHWAYS_VERIFIED // 99.98% UPTIME</span>
              </p>
              <p className="animate-pulse flex gap-4">
                <span className="text-accent/60">[19:52:36]</span>
                <span className="text-primary">STANDBY_INTERFACE</span>
                <span>// AWAITING_STUDENT_INTERACTION_V4 //</span>
              </p>
              <p className="flex gap-4 opacity-50">
                <span className="text-accent/60">[19:52:42]</span>
                <span className="text-emerald-400">SIGNAL_STATUS</span>
                <span>// PROTOCOL 4.2 ELITE // CRYPTO_STABLE //</span>
              </p>
            </div>
            {/* Scan animation overlay */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/20 animate-[scan_3s_infinite]" />
          </div>
        </section>

        {/* Global Stats bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 h-24 items-center opacity-70">
          <div className="flex flex-col items-center gap-2">
            <Wifi className="w-5 h-5 text-accent" />
            <span className="font-tech text-[9px] uppercase tracking-widest">
              WIFI_LINK_STABLE
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <span className="font-tech text-[9px] uppercase tracking-widest">
              REGION_V4_GLOBAL
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HardDrive className="w-5 h-5 text-accent" />
            <span className="font-tech text-[9px] uppercase tracking-widest">
              DISK_QUOTA_HEALTY
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-tech text-[9px] uppercase tracking-widest">
              HEARTBEAT_ACTIVE_SCRIBE
            </span>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default RootLog;
