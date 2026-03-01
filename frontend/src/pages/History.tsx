import Layout from "@/components/Layout";
import {
  History,
  Search,
  FileText,
  Calendar,
  Trash2,
  Mic,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ActivityLog {
  id: string;
  document_name: string;
  command_type: string;
  transcript: string;
  created_at: string;
  is_success: boolean;
}

interface UserDocument {
  id: string;
  file_hash: string;
  updated_at: string;
  content: string[];
}

const SessionHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"documents" | "activity">("documents");

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, view]);

  const fetchData = async () => {
    setLoading(true);
    if (view === "documents") {
      const { data, error } = await supabase
        .from("user_documents")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) toast.error("Failed to fetch scrolls.");
      else setDocuments(data || []);
    } else {
      const { data, error } = await supabase
        .from("scribe_activity")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) toast.error("Failed to decrypt logs.");
      else setLogs(data || []);
    }
    setLoading(false);
  };

  const handleRestore = (doc: UserDocument) => {
    // We'll use localStorage to pass the data back to the Index page for now
    // or we could use a global state manager (Context/Redux)
    localStorage.setItem(
      "gilded-scribe-session",
      JSON.stringify({
        fileName: doc.file_hash,
        paragraphs: doc.content,
        pageCount: 0, // We don't store pageCount per doc yet
      }),
    );
    toast.success("Ritual Restored. Redirecting to Core...");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <Layout title="History" subtitle="Ritual_Logs" icon={History}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* View Toggle */}
          <div className="flex bg-primary/5 p-1 rounded-sm border border-primary/20">
            <button
              onClick={() => setView("documents")}
              className={`px-4 py-2 text-[10px] font-tech uppercase tracking-widest transition-all ${view === "documents" ? "bg-accent/20 text-accent" : "text-primary/40 hover:text-primary"}`}
            >
              Active_Scrolls
            </button>
            <button
              onClick={() => setView("activity")}
              className={`px-4 py-2 text-[10px] font-tech uppercase tracking-widest transition-all ${view === "activity" ? "bg-accent/20 text-accent" : "text-primary/40 hover:text-primary"}`}
            >
              Neural_Logs
            </button>
          </div>

          {/* Search Header */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              type="text"
              placeholder="Search_Archives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary/5 border border-primary/20 rounded-sm py-2 pl-10 pr-4 text-[11px] font-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : view === "documents" ? (
            documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group p-5 border border-primary/10 bg-primary/5 rounded-sm hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-accent" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-primary/60" />
                      <div>
                        <h4 className="font-heading text-sm text-primary uppercase">
                          {doc.file_hash}
                        </h4>
                        <div className="flex gap-4 text-[10px] font-mono text-primary/40">
                          <span>
                            {new Date(doc.updated_at).toLocaleDateString()}
                          </span>
                          <span>{doc.content.length} Paragraphs</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(doc)}
                      className="p-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all rounded-sm flex items-center gap-2 text-[10px] font-tech uppercase tracking-widest"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-primary/10 rounded-sm">
                <p className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
                  // No scrolls indexed //
                </p>
              </div>
            )
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="group p-4 border border-primary/10 bg-primary/5 rounded-sm relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <Mic className="w-4 h-4 text-accent/60 mt-1" />
                  <div>
                    <h4 className="text-[11px] font-tech text-primary uppercase tracking-widest">
                      {log.command_type}
                    </h4>
                    <p className="text-xs font-body text-foreground/70 italic my-1">
                      "{log.transcript}"
                    </p>
                    <span className="text-[9px] font-mono text-primary/30">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-primary/10 rounded-sm">
              <p className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">
                // Neural logs empty //
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SessionHistory;
