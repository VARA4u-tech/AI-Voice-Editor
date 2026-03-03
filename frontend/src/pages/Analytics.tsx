import Layout from "@/components/Layout";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Activity,
  Clock,
  Layers,
  Trophy,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface ActivityRow {
  command_type: string;
  is_success: boolean;
  document_name: string;
  created_at: string;
}

const Analytics = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scribe_activity")
      .select("command_type, is_success, document_name, created_at")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) setActivity(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchAnalytics();
    else setLoading(false);
  }, [user, fetchAnalytics]);

  const stats = useMemo(() => {
    const total = activity.length;
    const successful = activity.filter((a) => a.is_success).length;
    const docs = new Set(activity.map((a) => a.document_name)).size;
    const days = new Set(
      activity.map((a) => new Date(a.created_at).toLocaleDateString()),
    ).size;
    return {
      totalCommands: total,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      activeDocuments: docs,
      uniqueDays: days,
    };
  }, [activity]);

  // Command Leaderboard
  const leaderboard = useMemo(() => {
    const counts: Record<string, number> = {};
    activity.forEach((a) => {
      const key = a.command_type || "unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([type, count], i) => ({ rank: i + 1, type, count }));
  }, [activity]);

  const maxCount = leaderboard[0]?.count || 1;

  const MEDAL_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];

  return (
    <Layout title="Analytics" subtitle="Transmission_Metrics" icon={BarChart3}>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Commands",
                value: stats.totalCommands,
                icon: Activity,
              },
              {
                label: "Success Rate",
                value: `${stats.successRate}%`,
                icon: TrendingUp,
              },
              {
                label: "Active Docs",
                value: stats.activeDocuments,
                icon: Layers,
              },
              { label: "Ritual Days", value: stats.uniqueDays, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="p-4 border border-primary/10 bg-primary/5 rounded-sm hover:border-accent/30 transition-all group"
              >
                <Icon className="w-4 h-4 text-accent/60 mb-2 group-hover:text-accent transition-colors" />
                <div className="font-heading text-xl sm:text-2xl text-primary mb-1">
                  {value}
                </div>
                <div className="font-mono text-[9px] text-primary/40 uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Success Rate Bar */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase">
              <Activity className="w-4 h-4 text-accent" />
              Processing_Velocity
            </h3>
            <div className="space-y-3">
              {[
                { label: "Neural Success Rate", value: stats.successRate },
                { label: "Protocol Compliance", value: 99 },
                { label: "Signal Stability", value: 92 },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-primary/60">
                    <span>{s.label}</span>
                    <span className="text-accent">{s.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${s.value}%`,
                        backgroundImage:
                          "linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--tech-blue)) 100%)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Command Leaderboard */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase">
              <Trophy className="w-4 h-4 text-accent" />
              Command_Leaderboard
            </h3>

            {leaderboard.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-primary/10 rounded-sm">
                <p className="font-mono text-[10px] text-primary/30 uppercase tracking-widest">
                  // No commands logged yet. Start speaking! //
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map(({ rank, type, count }) => (
                  <div
                    key={type}
                    className="group flex items-center gap-4 p-3 border border-primary/10 bg-primary/5 rounded-sm hover:border-accent/30 transition-all"
                  >
                    {/* Rank */}
                    <div
                      className={`w-6 text-center font-tech text-sm shrink-0 ${MEDAL_COLORS[rank - 1] || "text-primary/40"}`}
                    >
                      {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                    </div>

                    {/* Command Type */}
                    <div className="flex-1 min-w-0">
                      <div className="font-tech text-[10px] text-primary uppercase tracking-widest truncate">
                        {type}
                      </div>
                      {/* Bar */}
                      <div className="mt-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent/60 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.round((count / maxCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Count */}
                    <div className="shrink-0 text-right">
                      <span className="font-mono text-xs text-accent">
                        {count}
                      </span>
                      <div className="font-tech text-[8px] text-primary/30 uppercase">
                        uses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Biometric Sync */}
          <section>
            <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase mb-4">
              <Layers className="w-4 h-4 text-accent" />
              Biometric_Sync
            </h3>
            <div className="flex flex-wrap justify-around gap-4 bg-primary/5 p-4 rounded-sm border border-primary/10">
              {[
                { label: "Auth_Link", value: user ? "Established" : "Severed" },
                { label: "DB_Sync", value: "Stable" },
                { label: "AI_Core", value: "Online" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-[10px] font-mono text-primary/40 uppercase mb-1">
                    {label}
                  </div>
                  <div className="text-xs font-tech text-accent">{value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;
