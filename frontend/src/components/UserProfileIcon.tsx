import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Shield, ChevronRight, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const UserProfileIcon = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { playClick, playHover } = useSoundEffects();

  if (!user) return null;

  const handleAction = (path: string) => {
    playClick();
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    playClick();
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="fixed top-6 left-6 z-[60] animate-fade-in group">
      {/* The main unique floating icon */}
      <button
        onClick={() => {
          playClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => playHover()}
        className={`relative w-12 h-12 flex items-center justify-center transition-all duration-500 rounded-full border-2 
          ${isOpen ? "border-accent bg-accent/10 shadow-[0_0_25px_rgba(255,215,0,0.3)] rotate-90" : "border-primary/20 bg-slate-950/80 hover:border-accent/50 hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]"}
          backdrop-blur-xl group-hover:scale-110 active:scale-95`}
      >
        {/* Decorative rotating runes/elements around inner icon */}
        <div className="absolute inset-0 rounded-full border border-dashed border-accent/20 animate-[spin_8s_linear_infinite] pointer-events-none" />
        <div className="absolute -inset-1 rounded-full border border-primary/5 animate-[spin_12s_linear_infinite_reverse] pointer-events-none" />

        {/* Inner symbol - Mystical User/Shield combo */}
        <div className="relative">
          <User
            className={`w-5 h-5 transition-all duration-300 ${isOpen ? "text-accent scale-110" : "text-primary/60"}`}
          />
          <Shield className="absolute -top-1 -right-1 w-2.5 h-2.5 text-accent animate-pulse" />
        </div>

        {/* Dynamic bracket accents */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/40 rounded-tr-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/40 rounded-bl-sm transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-14 left-0 w-64 bg-slate-950/90 backdrop-blur-2xl border border-primary/20 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-left rounded-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-primary/10">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                <span className="text-accent font-tech text-sm uppercase">
                  {user.email?.charAt(0) || "S"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-tech text-[10px] text-accent/60 uppercase tracking-widest mb-0.5">
                  Neural_Entity
                </p>
                <p className="font-mono text-[11px] text-primary/80 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleAction("/analytics")}
                onMouseEnter={() => playHover()}
                className="w-full flex items-center justify-between p-2.5 hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all group/item rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent/40 group-hover/item:bg-accent rounded-full transition-colors" />
                  <span className="font-tech text-[11px] text-primary/70 uppercase tracking-widest group-hover/item:text-primary transition-colors">
                    User Dashboard
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-primary/30 group-hover/item:text-accent group-hover/item:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => handleAction("/history")}
                onMouseEnter={() => playHover()}
                className="w-full flex items-center justify-between p-2.5 hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all group/item rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary/20 group-hover/item:bg-accent rounded-full transition-colors" />
                  <span className="font-tech text-[11px] text-primary/70 uppercase tracking-widest group-hover/item:text-primary transition-colors">
                    Ritual History
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-primary/30 group-hover/item:text-accent group-hover/item:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => handleAction("/settings")}
                onMouseEnter={() => playHover()}
                className="w-full flex items-center justify-between p-2.5 hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all group/item rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary/20 group-hover/item:bg-accent rounded-full transition-colors" />
                  <span className="font-tech text-[11px] text-primary/70 uppercase tracking-widest group-hover/item:text-primary transition-colors">
                    Neural Settings
                  </span>
                </div>
                <Settings className="w-3 h-3 text-primary/30 group-hover/item:text-accent transition-all" />
              </button>

              <div className="my-2 border-t border-primary/10 pt-2" />

              <button
                onClick={handleLogout}
                onMouseEnter={() => playHover()}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-red-500/60 transition-all group/item rounded-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="font-tech text-[11px] uppercase tracking-widest">
                  Sever_Connection
                </span>
              </button>
            </div>

            <div className="mt-4 pt-2 border-t border-primary/5">
              <div className="flex justify-between items-center text-[8px] font-mono text-primary/30 uppercase tracking-[0.2em]">
                <span>Neural_Sync: STABLE</span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileIcon;
