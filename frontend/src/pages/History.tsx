import Layout from "@/components/Layout";
import { History, Search, FileText, Calendar, Trash2 } from "lucide-react";

const SessionHistory = () => {
  const pastSessions = [
    {
      title: "Project_Phoenix_Brief.pdf",
      date: "2026-02-28",
      size: "1.2MB",
      status: "Transmuted",
    },
    {
      title: "Neuro_Net_Manifesto.txt",
      date: "2026-02-27",
      size: "45KB",
      status: "Archived",
    },
    {
      title: "Quantum_Logic_Draft.pdf",
      date: "2026-02-25",
      size: "3.8MB",
      status: "Transmuted",
    },
  ];

  return (
    <Layout title="History" subtitle="Ritual_Logs" icon={History}>
      <div className="space-y-8">
        {/* Search Header */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
          <input
            type="text"
            placeholder="Search_Encrypted_Archives..."
            className="w-full bg-primary/5 border border-primary/20 rounded-sm py-3 pl-10 pr-4 text-xs font-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {pastSessions.map((session, i) => (
            <div
              key={i}
              className="group p-5 border border-primary/10 bg-primary/5 rounded-sm hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-accent transition-colors" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-sm">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm text-primary tracking-wider uppercase mb-1">
                      {session.title}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-primary/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {session.date}
                      </span>
                      <span>Size: {session.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto md:ml-0">
                  <span className="px-2 py-1 border border-accent/20 bg-accent/5 rounded-sm text-[9px] font-tech text-accent uppercase tracking-widest">
                    {session.status}
                  </span>
                  <button className="p-2 text-primary/40 hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <p className="font-body text-xs italic text-foreground/40 font-medium">
            End of decrypted signal. Older logs are stored in cold storage.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SessionHistory;
