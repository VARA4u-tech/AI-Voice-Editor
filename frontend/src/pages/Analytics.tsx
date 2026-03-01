import Layout from "@/components/Layout";
import { BarChart3, TrendingUp, Cpu, Activity, Clock } from "lucide-react";

const Analytics = () => {
  return (
    <Layout title="Analytics" subtitle="Transmission_Metrics" icon={BarChart3}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <Activity className="w-4 h-4 text-accent" />
              Processing_Velocity
            </h3>
            <div className="space-y-4">
              {[
                { label: "Neural Latency", value: "0.12ms", percent: 85 },
                { label: "Speech Accuracy", value: "98.4%", percent: 98 },
                { label: "Token Efficiency", value: "92.1%", percent: 92 },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-primary/60">
                    <span>{stat.label}</span>
                    <span className="text-accent">{stat.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent animate-[shimmer_2s_infinite]"
                      style={{
                        width: `${stat.percent}%`,
                        backgroundImage:
                          "linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--tech-blue)) 100%)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-8">
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <Clock className="w-4 h-4 text-accent" />
              Session_Time
            </h3>
            <div className="p-4 border border-primary/10 bg-primary/5 rounded-sm">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-[9px] text-primary/40 uppercase">
                  Total_Active_Ritual
                </span>
                <span className="font-heading text-2xl text-primary gold-text-glow">
                  02:45:12
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              Lexical_Growth
            </h3>
            <div className="h-48 border border-primary/10 bg-black/40 relative rounded-sm flex items-end p-4 gap-2">
              {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary/20 to-accent animate-in slide-in-from-bottom duration-1000"
                  style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }}
                />
              ))}
              <div className="absolute inset-0 grid grid-rows-4 opacity-10 pointer-events-none">
                <div className="border-b border-primary/20" />
                <div className="border-b border-primary/20" />
                <div className="border-b border-primary/20" />
              </div>
            </div>
            <p className="mt-4 text-xs font-body italic text-foreground/70">
              Visualizing the semantic complexity of the current document stream
              over time.
            </p>
          </section>

          <section className="pt-4">
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <Cpu className="w-4 h-4 text-accent" />
              Hardware_Status
            </h3>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                  C_Core
                </div>
                <div className="text-xs font-tech text-accent">Active</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                  M_Node
                </div>
                <div className="text-xs font-tech text-accent">Stable</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                  V_Link
                </div>
                <div className="text-xs font-tech text-accent">9ms</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
