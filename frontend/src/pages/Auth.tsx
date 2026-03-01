import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn, UserPlus, Mail, Lock, ShieldCheck } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user, signOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { playClick, playSuccess, playError } = useSoundEffects();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isLogin) {
      // Small delay to show a welcome toast or similar
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, isLogin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playClick();

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
      playError();
    } else {
      toast.success(
        isLogin
          ? "Welcome back, Scribe."
          : "Initiation complete. Check your email.",
      );
      playSuccess();
      if (isLogin) navigate("/");
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
    <Layout
      title={isLogin ? "Neural_Link" : "Initiation"}
      subtitle="Auth_Terminal"
      icon={ShieldCheck}
    >
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="font-body text-sm italic text-foreground/60">
            {isLogin
              ? "Establish a secure connection to your archives."
              : "Register your biometric signals with the Gilded Scribe."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
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
            ) : isLogin ? (
              <>
                Establish_Link <LogIn className="w-4 h-4" />
              </>
            ) : (
              <>
                Initialize_Scribe <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-mono text-primary/40 hover:text-primary uppercase tracking-widest transition-colors"
          >
            {isLogin
              ? "// Switch to Initiation_Protocol"
              : "// Switch to Neural_Link"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
