import Layout from "@/components/Layout";
import { Settings, Volume2, Mic, Palette, Bell, Save } from "lucide-react";

const SystemSettings = () => {
  return (
    <Layout title="Settings" subtitle="Control_Panel" icon={Settings}>
      <div className="space-y-10">
        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Volume2 className="w-4 h-4 text-accent" />
            Audio_Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-primary/40 uppercase">
                System Volume
              </label>
              <div className="relative h-2 w-full bg-primary/10 rounded-full">
                <div className="absolute top-0 left-0 h-full w-[65%] bg-accent rounded-full shadow-[0_0_10px_hsl(var(--accent)/0.5)]" />
                <div className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-accent rounded-full cursor-pointer" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-primary/40 uppercase">
                Ambience Saturation
              </label>
              <div className="relative h-2 w-full bg-primary/10 rounded-full">
                <div className="absolute top-0 left-0 h-full w-[40%] bg-primary rounded-full shadow-[0_0_10px_hsl(var(--gold)/0.5)]" />
                <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Mic className="w-4 h-4 text-accent" />
            Voice_Engine_Options
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "High Sensitivity Mode",
                value: true,
                desc: "Increase detection range for whispered commands.",
              },
              {
                label: "Continuous Synthesis",
                value: false,
                desc: "AI will attempt to summarize document changes in real-time.",
              },
              {
                label: "Auto-Scroll on Focus",
                value: true,
                desc: "Automatically center the document on the paragraph being edited.",
              },
            ].map((option, i) => (
              <div
                key={i}
                className="flex justify-between items-start gap-8 p-4 border border-primary/5 bg-primary/5 rounded-sm"
              >
                <div>
                  <h4 className="font-tech text-[10px] text-primary tracking-widest uppercase mb-1">
                    {option.label}
                  </h4>
                  <p className="font-body text-[13px] text-foreground/60 italic">
                    {option.desc}
                  </p>
                </div>
                <div
                  className={`shrink-0 w-10 h-5 rounded-full relative transition-colors cursor-pointer ${option.value ? "bg-accent/40" : "bg-primary/5 border border-primary/20"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full transition-all ${option.value ? "right-1 bg-accent" : "left-1 bg-primary/40"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Palette className="w-4 h-4 text-accent" />
            Aesthetic_Manifestation
          </h3>
          <div className="flex gap-4">
            <div
              className="w-10 h-10 rounded-sm border-2 border-accent bg-background cursor-pointer"
              title="Emerald Protocol"
            />
            <div
              className="w-10 h-10 rounded-sm border border-primary/20 bg-slate-900 cursor-pointer"
              title="Obsidian Core"
            />
            <div
              className="w-10 h-10 rounded-sm border border-primary/20 bg-blue-950 cursor-pointer"
              title="Deep Azure"
            />
          </div>
        </section>

        <div className="pt-8 flex justify-end">
          <button className="flex items-center gap-2 px-8 py-3 bg-accent/20 border border-accent/40 text-accent font-tech text-[11px] tracking-widest uppercase hover:bg-accent/30 transition-all group">
            <Save className="w-4 h-4" />
            Commit_Changes
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SystemSettings;
