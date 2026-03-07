import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Lock, ShieldCheck, User } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { playClick, playSuccess, playError } = useSoundEffects();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only alphabets and spaces
    if (val === "" || /^[a-zA-Z\s]+$/.test(val)) {
      setFullName(val);
    }
  };

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

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const strength = getPasswordStrength();
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const showMismatch = password && confirmPassword && !passwordsMatch;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Validation Protocols ──
    if (password.length < 6) {
      toast.error("Access_Key must be at least 6 characters.");
      playError();
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Access_Key mismatch. Verify neural signals.");
      playError();
      return;
    }

    setLoading(true);
    playClick();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

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
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              <input
                type="text"
                placeholder="Identity_Name"
                value={fullName}
                onChange={handleFullNameChange}
                required
                className="w-full bg-primary/5 border border-primary/20 rounded-sm py-3 pl-10 pr-4 text-xs font-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
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
            <div className="relative group/pass">
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${strength === 100 ? "text-emerald-400" : strength > 0 ? "text-accent" : "text-primary/40"}`}
              />
              <input
                type="password"
                placeholder="Access_Key (Min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full bg-primary/5 border rounded-sm py-3 pl-10 pr-4 text-xs font-mono text-primary placeholder:text-primary/20 focus:outline-none transition-all ${strength === 100 ? "border-emerald-500/40 focus:border-emerald-500/60" : strength > 0 ? "border-accent/40 focus:border-accent/60" : "border-primary/20 focus:border-accent/40"}`}
              />
              {/* Strength Meter Bar */}
              <div
                className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${strength}%` }}
              />
            </div>

            <div className="relative group/confirm">
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${passwordsMatch ? "text-emerald-400" : showMismatch ? "text-red-400 animate-pulse" : "text-primary/40"}`}
              />
              <input
                type="password"
                placeholder="Confirm_Access_Key"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full bg-primary/5 border rounded-sm py-3 pl-10 pr-4 text-xs font-mono text-primary placeholder:text-primary/20 focus:outline-none transition-all ${passwordsMatch ? "border-emerald-500/40 focus:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : showMismatch ? "border-red-500/40 focus:border-red-500/60 animate-shake" : "border-primary/20 focus:border-accent/40"}`}
              />
              {showMismatch && (
                <div className="absolute -bottom-5 left-0 w-full text-center">
                  <span className="text-[8px] font-tech text-red-500 uppercase tracking-widest animate-pulse">
                    Neural_Signal_Mismatch
                  </span>
                </div>
              )}
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
            Sync_Google_Sign_Up
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
