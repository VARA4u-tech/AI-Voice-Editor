import Layout from "@/components/Layout";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Activity,
  Clock,
  Layers,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCommands: 0,
    successRate: 0,
    activeDocuments: 0,
    uniqueDays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);

    // Total Commands & Success Rate
    const { data: activity, error } = await supabase
      .from("scribe_activity")
      .select("*")
      .eq("user_id", user?.id);

    if (!error && activity) {
      const total = activity.length;
      const successful = activity.filter((a) => a.is_success).length;
      const docs = new Set(activity.map((a) => a.document_name)).size;
      const days = new Set(
        activity.map((a) => new Date(a.created_at).toLocaleDateString()),
      ).size;

      setStats({
        totalCommands: total,
        successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
        activeDocuments: docs,
        uniqueDays: days,
      });
    }
    setLoading(false);
  };

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
                {
                  label: "Neural Success Rate",
                  value: `${stats.successRate}%`,
                  percent: stats.successRate,
                },
                { label: "Protocol Compliance", value: "99.1%", percent: 99 },
                { label: "Signal Stability", value: "92.1%", percent: 92 },
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
              Manifestation_Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-primary/10 bg-primary/5 rounded-sm">
                <span className="block font-mono text-[9px] text-primary/40 uppercase mb-1">
                  Total_Commands
                </span>
                <span className="font-heading text-xl text-primary">
                  {stats.totalCommands}
                </span>
              </div>
              <div className="p-4 border border-primary/10 bg-primary/5 rounded-sm">
                <span className="block font-mono text-[9px] text-primary/40 uppercase mb-1">
                  Active_Docs
                </span>
                <span className="font-heading text-xl text-primary">
                  {stats.activeDocuments}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              Neural_Activity_History
            </h3>
            <div className="h-48 border border-primary/10 bg-black/40 relative rounded-sm flex items-end p-4 gap-2">
              {/* Mock Bar Chart for Visuals */}
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
          </section>

          <section className="pt-4">
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <Layers className="w-4 h-4 text-accent" />
              Biometric_Sync
            </h3>
            <div className="flex justify-around bg-primary/5 p-4 rounded-sm border border-primary/10">
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                  Ritual_Days
                </div>
                <div className="text-xs font-tech text-accent">
                  {stats.uniqueDays}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                  Auth_Link
                </div>
                <div className="text-xs font-tech text-accent">
                  {user ? "Established" : "Severed"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                  Cloud_Sync
                </div>
                <div className="text-xs font-tech text-accent">Stable</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
