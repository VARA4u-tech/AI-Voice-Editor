import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn, Mail, Lock, ShieldCheck } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { user, signOut } = useAuth();
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

  const handleGoogleAuth = async () => {
    playClick();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
      playError();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playClick();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      playError();
    } else {
      toast.success("Welcome back, Scribe.");
      playSuccess();
      navigate("/");
    }
    setLoading(false);
  };

  if (user) {
    return (
      <Layout title="Neural_Link" subtitle="Auth_Terminal" icon={ShieldCheck}>
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="p-8 border border-accent/20 bg-accent/5 rounded-sm">
            <h3 className="font-tech text-xs text-accent uppercase tracking-widest mb-2">
              Neural_Link_Active
            </h3>
            <p className="font-mono text-[10px] text-primary/60 mb-6">
              You are already connected as {user.email}
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 bg-primary/10 border border-primary/20 text-primary font-tech text-[10px] tracking-widest uppercase hover:bg-primary/20 transition-all"
              >
                Return_to_Core
              </button>
              <button
                onClick={() => signOut()}
                className="w-full py-3 border border-red-500/20 text-red-500/60 font-tech text-[10px] tracking-widest uppercase hover:bg-red-500/10 transition-all"
              >
                Sever_Neural_Link
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Neural_Link" subtitle="Auth_Terminal" icon={ShieldCheck}>
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="font-body text-sm italic text-foreground/60">
            Establish a secure connection to your archives.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
                Establish_Connection <LogIn className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-accent/10" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-tech">
              <span className="bg-background px-4 text-primary/40">
                Alternative_Auth_Protocols
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 text-white/80 font-tech text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Sync_Google_Login
          </button>
        </form>

        <div className="pt-4 text-center">
          <Link
            to="/signup"
            className="text-[10px] font-mono text-primary/40 hover:text-primary uppercase tracking-widest transition-colors"
          >
            // Switch to Sign_Up_Protocol
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
