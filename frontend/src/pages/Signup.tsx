import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Lock, ShieldCheck } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { playClick, playSuccess, playError } = useSoundEffects();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playClick();

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
      playError();
    } else {
      toast.success("Initiation complete. Check your email.");
      playSuccess();
    }
    setLoading(false);
  };

  return (
    <Layout title="Initiation" subtitle="Auth_Terminal" icon={ShieldCheck}>
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="font-body text-sm italic text-foreground/60">
            Register your biometric signals with the Gilded Scribe.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              <input
                type="email"
                placeholder="Email_Hash"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-primary/5 border border-primary/20 rounded-sm py-3 pl-10 pr-4 text-xs font-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              <input
                type="password"
                placeholder="Access_Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-primary/5 border border-primary/20 rounded-sm py-3 pl-10 pr-4 text-xs font-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-accent/20 border border-accent/40 text-accent font-tech text-[11px] tracking-widest uppercase hover:bg-accent/30 transition-all group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign_Up_Scribe <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <Link
            to="/login"
            className="text-[10px] font-mono text-primary/40 hover:text-primary uppercase tracking-widest transition-colors"
          >
            // Switch to Login_Link
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
